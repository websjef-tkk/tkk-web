/**
 * Batch-updates existing flexiblePage/disciplinePage documents with fuller
 * content scraped verbatim from the old tkk.no site, closing the word-count
 * gaps identified in the content audit.
 *
 * Run: npx tsx sanity/update-content-batch.ts [--only=id1,id2]
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

function textBlock(text: string, style: "normal" | "h2" | "h3" = "normal") {
  return { _type: "block", _key: key(), style, markDefs: [], children: [{ _type: "span", _key: key(), text, marks: [] }] };
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return await res.text();
}

function decodeEmails(doc: Document) {
  for (const el of Array.from(doc.querySelectorAll("joomla-hidden-mail"))) {
    const first = el.getAttribute("first");
    const last = el.getAttribute("last");
    if (first && last) {
      try {
        const email = Buffer.from(first, "base64").toString("utf-8") + "@" + Buffer.from(last, "base64").toString("utf-8");
        el.textContent = email;
      } catch {
        /* ignore malformed */
      }
    }
  }
}

function extractBlocks(html: string): unknown[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  let root: Element | null = doc.querySelector('[itemprop="articleBody"]');
  if (!root || !root.textContent?.trim()) {
    root = doc.querySelector(".item-intro");
  }
  if (!root) return [];

  decodeEmails(doc);
  for (const toc of Array.from(root.querySelectorAll(".toc"))) toc.remove();

  const blocks: unknown[] = [];
  for (const node of Array.from(root.querySelectorAll("p, h2, h3, li")) as Element[]) {
    if (node.closest("table")) continue;
    const tag = node.tagName.toLowerCase();
    const text = node.textContent?.replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (tag === "h2") blocks.push(textBlock(text, "h2"));
    else if (tag === "h3") blocks.push(textBlock(text, "h3"));
    else if (tag === "li") blocks.push(textBlock(`• ${text}`));
    else blocks.push(textBlock(text));
  }
  return blocks;
}

interface Target {
  id: string;
  docId: string;
  urls: string[];
  titleNo?: string;
}

const targets: Target[] = [
  // Hav
  { id: "discipline-hav", docId: "disciplinePage-hav", urls: ["https://www.tkk.no/padling/hav"] },
  { id: "padling-turledelse-hav", docId: "flexiblePage-padling-turledelse-hav", urls: ["https://www.tkk.no/padling/hav/turledelse-hav"] },
  { id: "padling-hav-reolplasser", docId: "flexiblePage-padling-hav-reolplasser", urls: ["https://www.tkk.no/padling/hav/reolplasser"] },
  { id: "padling-hav-sondagstur", docId: "flexiblePage-padling-hav-sondagstur", urls: ["https://www.tkk.no/padling/hav/sondagstur"] },
  { id: "padling-hav-padlekart", docId: "flexiblePage-padling-hav-padlekart", urls: ["https://www.tkk.no/padling/hav/padlekart-midt-norge"] },
  { id: "padling-hav-fyrmestergrad", docId: "flexiblePage-padling-hav-fyrmestergrad", urls: ["https://www.tkk.no/padling/hav/fyrmestergrad"] },

  // Elv / Flattvann / Surfski / Junior
  { id: "discipline-elv", docId: "disciplinePage-elv", urls: ["https://www.tkk.no/padling/elv"] },
  { id: "padling-elv-kajakk-lan", docId: "flexiblePage-padling-elv-kajakk-lan", urls: ["https://www.tkk.no/padling/elv/elvekajakk-lan-og-leie"] },
  { id: "discipline-surfski", docId: "disciplinePage-surfski", urls: ["https://www.tkk.no/padling/surfski"] },
  { id: "padling-flattvann-flattvann-surfski", docId: "flexiblePage-padling-flattvann-flattvann-surfski", urls: ["https://www.tkk.no/padling/flattvann/flattvann-surfski"] },
  { id: "padling-flattvann-surfski", docId: "flexiblePage-padling-flattvann-surfski", urls: ["https://www.tkk.no/padling/flattvann/surfski", "https://www.tkk.no/padling/surfski/surfski"] },
  { id: "padling-flattvann-vingarer", docId: "flexiblePage-padling-flattvann-vingarer", urls: ["https://www.tkk.no/padling/flattvann/vingarer"] },
  { id: "discipline-junior", docId: "disciplinePage-junior", urls: ["https://www.tkk.no/padling/junior"] },
  { id: "padling-junior-velkommen", docId: "flexiblePage-padling-junior-velkommen", urls: ["https://www.tkk.no/padling/junior/velkommen-til-tkk-junior"] },
  { id: "padling-junior-utstyr", docId: "flexiblePage-padling-junior-utstyr", urls: ["https://www.tkk.no/padling/junior/juniorutstyr"] },

  // Kurs / HMS
  { id: "padling-kurs", docId: "flexiblePage-padling-kurs", urls: ["https://www.tkk.no/padling/kurs"] },
  { id: "hms", docId: "flexiblePage-hms", urls: ["https://www.tkk.no/padling/hms"] },
  { id: "hms-mitt-varsel", docId: "flexiblePage-hms-mitt-varsel", urls: ["https://www.tkk.no/klubben/mitt-varsel"] },
  { id: "hms-politiattest", docId: "flexiblePage-hms-politiattest", urls: ["https://www.tkk.no/klubben/politiattest"] },
  { id: "hms-hendelsesrapporter", docId: "flexiblePage-hms-hendelsesrapporter", urls: ["https://www.tkk.no/klubben/hendelsesrapporter"] },

  // Resten av Klubben
  { id: "klubben-administrasjon", docId: "flexiblePage-klubben-administrasjon", urls: ["https://www.tkk.no/klubben/styre-og-stell"] },
  { id: "klubben-kjoregodtgjorelse", docId: "flexiblePage-klubben-kjoregodtgjorelse", urls: ["https://www.tkk.no/klubben/kjoregodtgjorelse"] },
  { id: "medlemskap", docId: "flexiblePage-medlemskap", urls: ["https://www.tkk.no/medlemskap"] },
  { id: "kom-i-gang", docId: "flexiblePage-kom-i-gang", urls: ["https://www.tkk.no/kom-i-gang"] },
  { id: "klubben-sosialgruppe-utmerkelser", docId: "flexiblePage-klubben-sosialgruppe-utmerkelser", urls: ["https://www.tkk.no/klubben/sosialgruppe/utmerkelser"] },
];

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.replace("--only=", "").split(",") : null;
  const list = only ? targets.filter((t) => only.includes(t.id)) : targets;

  for (const target of list) {
    try {
      let blocks: unknown[] = [];
      for (const url of target.urls) {
        const html = await fetchHtml(url);
        blocks = blocks.concat(extractBlocks(html));
      }
      if (blocks.length === 0) {
        console.warn(`${target.id}: ingen innhold funnet, hopper over`);
        continue;
      }
      const isDiscipline = target.docId.startsWith("disciplinePage-");
      await client.patch(target.docId).set({ body: { no: blocks } }).commit({ autoGenerateArrayKeys: false });
      console.log(`${target.id} (${isDiscipline ? "disciplinePage" : "flexiblePage"}): ${blocks.length} blokker`);
    } catch (e) {
      console.error(`${target.id}: FEIL —`, (e as Error).message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
