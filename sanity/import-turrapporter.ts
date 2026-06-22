/**
 * Imports the 9 old trip reports ("turrapporter") from tkk.no as draft
 * blogPost documents (category "turrapport"), preserving original text
 * verbatim and uploading embedded images as Sanity assets.
 *
 * Created as DRAFTS (_id prefixed "drafts.") for editorial review before
 * publishing — content is auto-converted from old HTML and should be
 * proofread.
 *
 * Run: npx tsx sanity/import-turrapporter.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { JSDOM } from "jsdom";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

interface ReportMeta {
  url: string;
  slug: string;
  year: number;
}

const reports: ReportMeta[] = [
  { url: "https://www.tkk.no/padling/hav/turrapporter/referat-fra-froanturen-20-22-august-2021", slug: "froanturen-2021", year: 2021 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/referat-fra-sommerturen-2021", slug: "sommerturen-2021", year: 2021 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/rapport-etter-kortreist-overnattingstur-til-nabokommunen", slug: "kortreist-overnattingstur-nabokommunen", year: 2021 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/turrapport-femunden-2020", slug: "femunden-2020", year: 2020 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/tur-rapport-for-sommerturen-til-hitra-2020", slug: "sommerturen-hitra-2020", year: 2020 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/sommertur-til-heroy-og-donna-2019", slug: "heroy-donna-2019", year: 2019 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/froan-tur", slug: "froan-tur", year: 2019 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/turrapport-sommertur-helgeland-2018", slug: "sommertur-helgeland-2018", year: 2018 },
  { url: "https://www.tkk.no/padling/hav/turrapporter/referat-tkk-sommertur-til-lofoten-2017", slug: "sommertur-lofoten-2017", year: 2017 },

  // Turrapporter som ikke var kategorisert som "turrapport" på gammel side
  { url: "https://tkk.no/turrapport-fra-arets-sommertur-til-bohuslaen", slug: "sommertur-bohuslaen", year: 2024 },
  { url: "https://tkk.no/turrapport-fra-nybegynnertur-til-knarrlagsundet", slug: "nybegynnertur-knarrlagsundet", year: 2024 },
  { url: "https://tkk.no/kortreist-enveis-langtur-fra-skansen-til-orkanger-4", slug: "skansen-orkanger-langtur", year: 2024 },
  { url: "https://tkk.no/referat-fra-midtsommartur-til-sula-fyr", slug: "midtsommartur-sula-fyr", year: 2024 },
  { url: "https://tkk.no/turrapport-fra-nybegynnertur-til-lysoysundet", slug: "nybegynnertur-lysoysundet", year: 2024 },
  { url: "https://tkk.no/tur-rapport-fra-17-mai-tur-til-lysoysund-16-20-mai-2024", slug: "17-mai-tur-lysoysund-2024", year: 2024 },
  { url: "https://tkk.no/turrapport-vartur-for-smaskalapadlere-til-hitra-26-28-april", slug: "vartur-smaskalapadlere-hitra", year: 2024 },
  { url: "https://tkk.no/turrapport-nybegynnertur-til-knarrlagsund-1-3-september-2023", slug: "nybegynnertur-knarrlagsund-2023", year: 2023 },
  { url: "https://tkk.no/turrapport-skansen-orkanger-240826", slug: "skansen-orkanger-240826", year: 2024 },
  { url: "https://tkk.no/turrapport-skansen-orkanger-240825", slug: "skansen-orkanger-240825", year: 2024 },
  { url: "https://tkk.no/turrapport-fra-lysoysund", slug: "turrapport-lysoysund", year: 2024 },
  { url: "https://tkk.no/den-forste-jentetur-i-tkk", slug: "forste-jentetur", year: 2024 },
];

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return await res.text();
}

function absoluteUrl(src: string, base: string): string {
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

async function uploadImage(url: string): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = url.split("/").pop()?.split("?")[0] ?? "image.jpg";
    const asset = await client.assets.upload("image", buffer, { filename });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (e) {
    console.warn(`  Bilde-opplasting feilet for ${url}:`, (e as Error).message);
    return null;
  }
}

let _seq = 0;
const key = () => `k${++_seq}`;

function textBlock(text: string, style: "normal" | "h2" | "h3" = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

async function parseArticleBody(html: string, pageUrl: string) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const articleEl = doc.querySelector('[itemprop="articleBody"]');
  if (!articleEl) return { blocks: [], title: "" };

  const titleEl = doc.querySelector('meta[name="title"]');
  const title = titleEl?.getAttribute("content") ?? "";

  const blocks: unknown[] = [];

  // Old-style pages use <p>, newer pages use plain <div> wrappers for paragraphs.
  // Treat both as "leaf" containers: skip a node if it has its own nested
  // div/p/h2/h3 children (those will be visited separately), so we don't
  // double-count wrapper divs.
  const candidates = Array.from(articleEl.querySelectorAll("p, div, h2, h3")) as Element[];
  for (const child of candidates) {
    const tag = child.tagName.toLowerCase();
    if (child.querySelector(":scope > div, :scope > p, :scope > h2, :scope > h3")) continue;

    if (tag === "h2" || tag === "h3") {
      const text = child.textContent?.trim();
      if (text) blocks.push(textBlock(text, tag as "h2" | "h3"));
      continue;
    }

    // tag is "p" or "div" — treat as a paragraph; pull out any image, then any text.
    const img = child.querySelector("img");
    if (img) {
      const src = absoluteUrl(img.getAttribute("src") ?? "", pageUrl);
      const uploaded = await uploadImage(src);
      if (uploaded) blocks.push({ ...uploaded, _key: key() });
    }
    const text = child.textContent?.trim() ?? "";
    if (text) blocks.push(textBlock(text));
  }

  return { blocks, title };
}

async function main() {
  const only = process.argv.slice(2);
  const list = only.length > 0 ? reports.filter((r) => only.includes(r.slug)) : reports;
  for (const report of list) {
    console.log(`Henter ${report.url}...`);
    const html = await fetchHtml(report.url);
    const { blocks, title } = await parseArticleBody(html, report.url);

    if (blocks.length === 0) {
      console.warn(`  Ingen innhold funnet for ${report.slug}, hopper over.`);
      continue;
    }

    const id = `drafts.tripreport-${report.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "blogPost",
      title: { no: title || report.slug },
      slug: { _type: "slug", current: report.slug },
      summary: { no: "[Importert fra gammel side — skriv et sammendrag før publisering]" },
      body: { no: blocks },
      category: "turrapport",
      publishedAt: `${report.year}-08-01`,
    });
    console.log(`  Lagret som kladd: ${id} (${blocks.length} blokker)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
