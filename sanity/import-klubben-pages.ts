/**
 * Imports/updates flexiblePage documents for the "klubben" pages that were
 * missing or incomplete on the new site, scraped verbatim from the old
 * Joomla site (www.tkk.no).
 *
 * Run: npx tsx sanity/import-klubben-pages.ts
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

let _seq = 0;
const key = () => `k${++_seq}`;

function textBlock(text: string, style: "normal" | "h3" = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function linkBlock(label: string, href: string) {
  const markKey = key();
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _key: markKey, _type: "link", href }],
    children: [{ _type: "span", _key: key(), text: label, marks: [markKey] }],
  };
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return await res.text();
}

function extractFromSelector(html: string, selector: string) {
  const dom = new JSDOM(html);
  const el = dom.window.document.querySelector(selector);
  if (!el) return [];
  const blocks: unknown[] = [];
  const nodes = Array.from(el.querySelectorAll("p, h2, h3, li")) as Element[];
  for (const node of nodes) {
    // Skip <li> that are inside another <li> we've already processed at a shallower level —
    // querySelectorAll already returns all li in document order regardless of nesting, which is fine
    // for flattening into a linear list of paragraphs.
    const tag = node.tagName.toLowerCase();
    const text = node.textContent?.replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (tag === "h2" || tag === "h3") {
      blocks.push(textBlock(text, "h3"));
    } else if (tag === "li") {
      blocks.push(textBlock(`• ${text}`));
    } else {
      blocks.push(textBlock(text));
    }
  }
  return blocks;
}

async function main() {
  // 1. klubben-sosialgruppe — overview text shown inline on the old category page
  {
    const html = await fetchHtml("https://www.tkk.no/klubben/sosialgruppe");
    const blocks = extractFromSelector(html, ".item-intro");
    await client.createIfNotExists({ _id: "flexiblePage-klubben-sosialgruppe", _type: "flexiblePage", pageId: "klubben-sosialgruppe", section: "klubb" });
    await client.patch("flexiblePage-klubben-sosialgruppe").set({
      title: { no: "Sosialgruppen" },
      section: "klubb",
      body: { no: blocks },
    }).commit();
    console.log(`klubben-sosialgruppe: ${blocks.length} blokker`);
  }

  // 2. klubben-vedtektene — re-import full bylaws text (old content was too thin)
  {
    const html = await fetchHtml("https://www.tkk.no/vedtektene");
    const blocks = extractFromSelector(html, '[itemprop="articleBody"]');
    await client.patch("flexiblePage-klubben-vedtektene").set({
      title: { no: "Vedtektene" },
      section: "klubb",
      body: { no: blocks },
    }).commit();
    console.log(`klubben-vedtektene: ${blocks.length} blokker`);
  }

  // 3. klubben-organisasjonsplanen — new page
  {
    const html = await fetchHtml("https://www.tkk.no/klubben?view=article&id=24:organisasjonsplanen");
    const blocks = extractFromSelector(html, '[itemprop="articleBody"]');
    await client.createIfNotExists({ _id: "flexiblePage-klubben-organisasjonsplanen", _type: "flexiblePage", pageId: "klubben-organisasjonsplanen", section: "klubb" });
    await client.patch("flexiblePage-klubben-organisasjonsplanen").set({
      title: { no: "Organisasjonsplanen" },
      section: "klubb",
      body: { no: blocks },
    }).commit();
    console.log(`klubben-organisasjonsplanen: ${blocks.length} blokker`);
  }

  // 4. klubben-skjemaer — new page (links to xlsx files kept as old-site absolute URLs for now)
  {
    const html = await fetchHtml("https://www.tkk.no/klubben?view=article&id=38:skjemaer");
    const blocks = extractFromSelector(html, '[itemprop="articleBody"]');
    await client.createIfNotExists({ _id: "flexiblePage-klubben-skjemaer", _type: "flexiblePage", pageId: "klubben-skjemaer", section: "klubb" });
    await client.patch("flexiblePage-klubben-skjemaer").set({
      title: { no: "Skjemaer" },
      section: "klubb",
      intro: { no: "Skjemaer for refusjon av utgifter, reiseregning og timelister. Send utfylt skjema og kvitteringer til trondhjemskajakklubb@ebilag.com." },
      body: {
        no: [
          ...blocks,
          linkBlock("Skjema for refusjon", "https://www.tkk.no/images/Skjemaer/Skjema%20for%20refusjon.xlsx"),
          linkBlock("Skjema for reiseregning", "https://www.tkk.no/images/Skjemaer/Skjema%20for%20reiseregning.xlsx"),
          linkBlock("Skjema for timelister", "https://www.tkk.no/images/Skjemaer/Timeliste%20TKK.xlsx"),
        ],
      },
    }).commit();
    console.log(`klubben-skjemaer: ${blocks.length} blokker (+ 3 fil-lenker)`);
  }

  // 5. klubben-huskalender — new page, just a Google Calendar embed link (no article text on old site)
  {
    await client.createIfNotExists({ _id: "flexiblePage-klubben-huskalender", _type: "flexiblePage", pageId: "klubben-huskalender", section: "klubb" });
    await client.patch("flexiblePage-klubben-huskalender").set({
      title: { no: "Huskalender" },
      section: "klubb",
      intro: { no: "Klubbens huskalender (Google-kalender) viser viktige datoer og frister gjennom året." },
      body: {
        no: [
          linkBlock("Åpne huskalenderen", "https://calendar.google.com/calendar/embed?src=ntq7foc54r7stfocc0rai2peok%40group.calendar.google.com&ctz=Europe%2FOslo"),
        ],
      },
    }).commit();
    console.log("klubben-huskalender: lenke til Google-kalender satt");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
