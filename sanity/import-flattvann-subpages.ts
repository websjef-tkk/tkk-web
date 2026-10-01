/**
 * Importerer undersider for Flattvann-grenen som finnes på den gamle/live
 * siden (tkk.no/padling/flattvann/...) men som aldri ble overført til Sanity,
 * og legger til bilder (med manuelt skrevne alt-tekster) på "Vingårer"-siden
 * som manglet dem.
 *
 * Opprettes/oppdateres som KLADDER (drafts.*) for gjennomgang i Studio før
 * publisering.
 *
 * Bilder er lastet ned på forhånd (se IMAGE_DIR) og alt-tekster er skrevet
 * for hvert bilde i alt-text.json — begge delene er et tolkningssteg gjort
 * av et menneske/Claude, ikke noe dette scriptet gjetter på selv.
 *
 * Run: npx tsx sanity/import-flattvann-subpages.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import path from "path";

config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const SCRATCH =
  "/tmp/claude-1000/-home-chris-Utvikling-TKK-Web/9eb3fe8a-0f3e-40f1-9af3-a69b0e043dd8/scratchpad";
const IMAGE_DIR = path.join(SCRATCH, "images");
const ALT_TEXT: Record<string, string> = JSON.parse(
  readFileSync(path.join(SCRATCH, "alt-text.json"), "utf-8")
);

// Gammelt filnavn (slik det står i <img src> på tkk.no) -> lokalt forhåndsnedlastet filnavn.
const IMAGE_MAP: Record<string, string> = {
  "Screenshot_20260809_110819134.jpg": "trening_1_Screenshot_20260809_110819134.jpg",
  "photo_5420427488845829506_y.jpg": "trening_2_photo_5420427488845829506_y.jpg",
  "photo_5906609939847777660_y.jpg": "trening_3_photo_5906609939847777660_y.jpg",

  "IMG_8986.jpg": "idrett_1_IMG_8986.jpg",
  "Screenshot_20260827_143039782.jpg": "idrett_2_Screenshot_20260827_143039782.jpg",
  "Screenshot_20260901_101349211.jpg": "idrett_3_Screenshot_20260901_101349211.jpg",
  "Screenshot_20260813_083214458.jpg": "idrett_4_Screenshot_20260813_083214458.jpg",
  "IMG_20260813_084528_932.jpg": "idrett_5_IMG_20260813_084528_932.jpg",

  "photo_5942695645179660131_w.jpg": "lek_1_photo_5942695645179660131_w.jpg",
  "photo_5837165043131730753_w.jpg": "lek_2_photo_5837165043131730753_w.jpg",

  "718075898_10227915413071316_2841508892806902580_n.jpg": "introkurs_1_718075898.jpg",
  "287852712_1232928174146562_7445423350954447099_n.jpg": "introkurs_2_287852712.jpg",
};

let _seq = 0;
const key = () => `flat${++_seq}`;

function span(text: string, markKey?: string) {
  return { _type: "span" as const, _key: key(), text, marks: markKey ? [markKey] : [] };
}

function textBlock(text: string, style: "normal" | "h2" | "h3" = "normal") {
  return { _type: "block" as const, _key: key(), style, markDefs: [], children: [span(text)] };
}

function linkBlock(text: string, href: string) {
  const markKey = key();
  return {
    _type: "block" as const,
    _key: key(),
    style: "normal" as const,
    markDefs: [{ _key: markKey, _type: "link", linkType: "url", href }],
    children: [span(text, markKey)],
  };
}

async function uploadLocalImage(basename: string) {
  const filePath = path.join(IMAGE_DIR, basename);
  const buffer = readFileSync(filePath);
  const alt = ALT_TEXT[basename];
  if (!alt) throw new Error(`Mangler alt-tekst for ${basename}`);
  const asset = await client.assets.upload("image", buffer, { filename: basename });
  return { asset, alt };
}

async function imageBlockFromLocal(localFile: string) {
  const { asset, alt } = await uploadLocalImage(localFile);
  return {
    _type: "image" as const,
    _key: key(),
    asset: { _type: "reference" as const, _ref: asset._id },
    alt,
  };
}

async function imageBlock(oldSrcBasename: string) {
  const localFile = IMAGE_MAP[oldSrcBasename];
  if (!localFile) throw new Error(`Ingen lokal fil mappet for ${oldSrcBasename}`);
  return imageBlockFromLocal(localFile);
}

async function heroField(localHeroFile: string) {
  const { asset, alt } = await uploadLocalImage(localHeroFile);
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
    alt,
  };
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return await res.text();
}

function basenameOf(src: string): string {
  return src.split("/").pop()?.split("?")[0] ?? src;
}

/**
 * Går gjennom direkte barn av .article-body i dokumentrekkefølge og bygger
 * Portable Text-blokker, med bilder satt inn der de faktisk står i artikkelen.
 * Formatering (fet/kursiv) flates ut til ren tekst, i tråd med hvordan de
 * tidligere (nå slettede) importscriptene gjorde det. Ekte lenker (<a href>)
 * bevares som lenke-annotasjon.
 */
async function parseArticleBody(html: string): Promise<unknown[]> {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const articleEl = doc.querySelector('[itemprop="articleBody"]');
  if (!articleEl) throw new Error("Fant ikke [itemprop=articleBody]");

  const blocks: unknown[] = [];

  for (const child of Array.from(articleEl.children)) {
    const tag = child.tagName.toLowerCase();

    if (tag === "h1" || tag === "h2") {
      const text = child.textContent?.trim();
      if (text) blocks.push(textBlock(text, "h2"));
      continue;
    }
    if (tag === "h3") {
      const text = child.textContent?.trim();
      if (text) blocks.push(textBlock(text, "h3"));
      continue;
    }
    if (tag === "ul") {
      for (const li of Array.from(child.querySelectorAll("li"))) {
        const text = li.textContent?.trim();
        if (text) blocks.push(textBlock(`• ${text}`));
      }
      continue;
    }
    if (tag === "div" || tag === "hr") {
      // Separator-divs (<hr>) og tomme wrappere — ingen innhold å ta med.
      continue;
    }
    if (tag === "p") {
      const imgs = Array.from(child.querySelectorAll("img"));
      if (imgs.length > 0) {
        for (const img of imgs) {
          const src = img.getAttribute("src");
          if (src) blocks.push(await imageBlock(basenameOf(src)));
        }
        // Noen <p> har bilde + litt tekst; fang opp eventuell gjenværende tekst.
        const textOutsideImg = child.textContent?.trim();
        if (textOutsideImg) blocks.push(textBlock(textOutsideImg));
        continue;
      }

      // Rendyrket lenke-avsnitt (f.eks. "Se Stavsjøen på Google Maps").
      const onlyLink = child.querySelectorAll("a").length === 1 && child.textContent?.trim() === child.querySelector("a")?.textContent?.trim();
      if (onlyLink) {
        const a = child.querySelector("a")!;
        const href = a.getAttribute("href");
        const text = a.textContent?.trim();
        if (href && text) {
          blocks.push(linkBlock(text, href));
          continue;
        }
      }

      // Vanlig avsnitt. <br> markerer separate linjer i originalen (f.eks.
      // praktisk-info-bokser) — del dem i egne blokker for lesbarhet.
      const htmlInner = child.innerHTML.replace(/<br\s*\/?>/gi, "\n");
      const tmp = doc.createElement("div");
      tmp.innerHTML = htmlInner;
      const lines = (tmp.textContent ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) blocks.push(textBlock(line));
      continue;
    }
  }

  return blocks;
}

interface NewPage {
  id: string;
  slug: string;
  title: string;
  url: string;
  heroLocalFile: string;
}

const NEW_PAGES: NewPage[] = [
  {
    id: "flexiblePage-padling-flattvann-trening",
    slug: "padling/flattvann/trening",
    title: "Bli med på TRENING!",
    url: "https://tkk.no/padling/flattvann/trening",
    heroLocalFile: "trening_hero_IMG_20260805_181333.jpg",
  },
  {
    id: "flexiblePage-padling-flattvann-som-idrett",
    slug: "padling/flattvann/flattvann-som-idrett",
    title: "Flattvann som IDRETT",
    url: "https://tkk.no/padling/flattvann/flattvann-som-idrett",
    heroLocalFile: "idrett_hero_Screenshot_20260827_142937878.jpg",
  },
  {
    id: "flexiblePage-padling-flattvann-fra-lek-til-konkurranse",
    slug: "padling/flattvann/fra-lek-til-konkurranse",
    title: "Fra lek til konkurranse",
    url: "https://tkk.no/padling/flattvann/fra-lek-til-konkurranse",
    heroLocalFile: "lek_hero_FB_IMG_1787554460998.jpg",
  },
  {
    id: "flexiblePage-padling-flattvann-introkurs",
    slug: "padling/flattvann/introkurs-i-flattvannspadling",
    title: "Introkurs i flattvannspadling",
    url: "https://tkk.no/padling/flattvann/introkurs-i-flattvannspadling",
    heroLocalFile: "introkurs_hero_720137902.jpg",
  },
];

async function createNewPages() {
  for (const page of NEW_PAGES) {
    console.log(`\nHenter ${page.url} ...`);
    const html = await fetchHtml(page.url);
    const body = await parseArticleBody(html);
    const hero = await heroField(page.heroLocalFile);

    const draftId = `drafts.${page.id}`;
    await client.createOrReplace({
      _id: draftId,
      _type: "flexiblePage",
      slug: { _type: "slug", current: page.slug },
      section: "padling",
      disciplines: ["flattvann"],
      title: { no: page.title },
      heroImage: hero,
      body: { no: body },
    });
    console.log(`  Lagret som kladd: ${draftId} (${body.length} blokker, hovedbilde satt)`);
  }
}

const VINGARER_ID = "flexiblePage-padling-flattvann-vingarer";
// Nøkkel til tekstblokken bildet skal settes inn RETT ETTER, og hvilket lokalt bildefilnavn som hører til.
const VINGARER_IMAGES: { afterKey: string; localFile: string }[] = [
  { afterKey: "knubnzyc", localFile: "vingarer_1_braca-children.png" }, // etter Braca Children-beskrivelsen
  { afterKey: "fuh1rmxp", localFile: "vingarer_2_braca-max.png" }, // etter Braca IV Max-beskrivelsen
  { afterKey: "chnoxjx8", localFile: "vingarer_3_zj-wo.png" }, // etter ZJ W0-beskrivelsen
  { afterKey: "ji5ry6yf", localFile: "vingarer_4_think-powerwing.png" }, // etter Think Powerwing-beskrivelsen (siste blokk)
];

function stripSystemFields(doc: Record<string, unknown>) {
  const clone: Record<string, unknown> = { ...doc };
  delete clone._rev;
  delete clone._createdAt;
  delete clone._updatedAt;
  // Migration-script-only helper: the stripped clone still has `_id`/`_type`
  // from the source doc at runtime, but TS can't track that through `delete`.
  return clone as { _id: string; _type: string } & Record<string, unknown>;
}

async function patchVingarer() {
  console.log(`\nOppdaterer ${VINGARER_ID} med åre-bilder ...`);
  const published = await client.getDocument(VINGARER_ID);
  if (!published) throw new Error(`Fant ikke ${VINGARER_ID}`);
  const body: { _key: string }[] = (published.body as { no: { _key: string }[] }).no;

  let newBody = [...body];
  for (const { afterKey, localFile } of VINGARER_IMAGES) {
    const idx = newBody.findIndex((b) => b._key === afterKey);
    if (idx === -1) throw new Error(`Fant ikke blokk med key ${afterKey} i ${VINGARER_ID}`);
    const img = await imageBlockFromLocal(localFile);
    newBody = [...newBody.slice(0, idx + 1), img, ...newBody.slice(idx + 1)];
  }

  const draftId = `drafts.${VINGARER_ID}`;
  await client.createIfNotExists({ ...stripSystemFields(published), _id: draftId });
  await client.patch(draftId).set({ "body.no": newBody }).commit();
  console.log(`  Lagret som kladd: ${draftId} (${VINGARER_IMAGES.length} bilder lagt til)`);
}

const DISCIPLINE_PAGE_ID = "disciplinePage-flattvann";

async function patchSubPageLinks() {
  console.log(`\nOppdaterer subPageLinks på ${DISCIPLINE_PAGE_ID} ...`);
  const published = await client.getDocument(DISCIPLINE_PAGE_ID);
  if (!published) throw new Error(`Fant ikke ${DISCIPLINE_PAGE_ID}`);
  const existing: unknown[] = (published.subPageLinks as unknown[]) ?? [];

  const newLinks = NEW_PAGES.map((page) => ({
    _key: key(),
    _type: "object",
    title: { no: page.title },
    href: `/${page.slug}`,
  }));

  const draftId = `drafts.${DISCIPLINE_PAGE_ID}`;
  await client.createIfNotExists({ ...stripSystemFields(published), _id: draftId });
  await client.patch(draftId).set({ subPageLinks: [...existing, ...newLinks] }).commit();
  console.log(`  Lagret som kladd: ${draftId} (${newLinks.length} nye undersider lagt til)`);
}

async function main() {
  await createNewPages();
  await patchVingarer();
  await patchSubPageLinks();
  console.log("\nFerdig. Gå til Sanity Studio og se gjennom kladdene før publisering.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
