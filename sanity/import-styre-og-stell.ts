/**
 * Overfører "Årsmøter" og "Styremøteprotokoller" fra den gamle Joomla-siden
 * (tkk.no) til én ny fleksibel side: /om-klubben/styre-og-stell.
 *
 * - PDF-er som allerede ligger på den gamle siden lastes ned og lastes opp
 *   som Sanity file-assets.
 * - Sakspapirer/protokoller som kun er delt via Google Drive forblir
 *   eksterne lenker (vi har ikke en egen kopi av disse).
 * - Styremøteprotokoller som på den gamle siden bare var en nyhetsartikkel
 *   (ingen original PDF) rendres til PDF fra strukturert innhold, se
 *   migration-data/styremoter-articles.ts og generate-protocol-pdf.ts.
 *
 * Skriver direkte til det publiserte dokumentet (ingen kladd), og legger en
 * subPageLink på /om-klubben, som avklart med redaktøren.
 *
 * Run: npx tsx sanity/import-styre-og-stell.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { generateProtocolPdf } from "./generate-protocol-pdf";
import { styremoterArticles, type ProtocolArticle } from "./migration-data/styremoter-articles";

config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const OLD_SITE = "https://tkk.no";
const MAX_PDF_BYTES = 20 * 1024 * 1024;

let _seq = 0;
const key = () => `sos${++_seq}`;

function textBlock(text: string, style: "normal" | "h2" | "h3" = "normal"): object {
  return {
    _type: "block" as const,
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
  };
}

/** Én blokk med flere lenke-spenn, separert av ren tekst (f.eks. " · "). */
function linksBlock(parts: Array<{ text: string; linkDef?: object } | { text: string }>): object {
  const markDefs: object[] = [];
  const children = parts.map((part) => {
    if ("linkDef" in part && part.linkDef) {
      const markKey = key();
      markDefs.push({ _key: markKey, _type: "link", ...part.linkDef });
      return { _type: "span" as const, _key: key(), text: part.text, marks: [markKey] };
    }
    return { _type: "span" as const, _key: key(), text: part.text, marks: [] };
  });
  return { _type: "block" as const, _key: key(), style: "normal", markDefs, children };
}

function subPageLink(title: string, href: string) {
  return { _key: key(), _type: "object", title: { no: title }, href };
}

async function uploadPdfFromUrl(path: string, label: string) {
  const url = `${OLD_SITE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Kunne ikke laste ned ${label}: ${url} (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength > MAX_PDF_BYTES) {
    console.warn(`  ⚠ ${label}: ${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB — over 20 MB-grensen!`);
  }
  const filename = decodeURIComponent(path.split("/").pop() ?? `${label}.pdf`);
  const asset = await client.assets.upload("file", buffer, { filename, contentType: "application/pdf" });
  console.log(`  ✓ Lastet opp (ned fra gammel side): ${label} → ${asset._id} (${(buffer.byteLength / 1024).toFixed(0)} kB)`);
  return asset._id;
}

async function uploadGeneratedPdf(article: ProtocolArticle) {
  const buffer = await generateProtocolPdf(article);
  if (buffer.byteLength > MAX_PDF_BYTES) {
    console.warn(`  ⚠ Generert PDF for ${article.dateDisplay}: over 20 MB-grensen!`);
  }
  const filename = `Styremoteprotokoll ${article.dateDisplay}.pdf`;
  const asset = await client.assets.upload("file", buffer, { filename, contentType: "application/pdf" });
  console.log(`  ✓ Generert fra artikkel: Styremøteprotokoll ${article.dateDisplay} → ${asset._id}`);
  return asset._id;
}

function pdfLinkDef(assetId: string) {
  return { linkType: "pdf", pdfFile: { _type: "file", asset: { _type: "reference", _ref: assetId } } };
}

function urlLinkDef(href: string) {
  return { linkType: "url", href };
}

// ---------------------------------------------------------------------------
// Årsmøter: år → { sakspapirer, protokoll }, hver enten en opplastet PDF-sti
// (på den gamle siden) eller en ekstern (Google Drive) lenke.
// ---------------------------------------------------------------------------
type ArsmoteSource = { kind: "pdf"; path: string } | { kind: "url"; href: string };
type ArsmoteYear = { year: number; sakspapirer: ArsmoteSource; protokoll: ArsmoteSource };

const arsmoter: ArsmoteYear[] = [
  {
    year: 2026,
    sakspapirer: { kind: "url", href: "https://drive.google.com/file/d/1fv-PjRGEoSYwhNt-Q5tlLn9soAbEtEgy/view?usp=sharing" },
    protokoll: { kind: "pdf", path: "/images/Klubben/Drift/Arsmote%202026/Referat%20Arsmote%20Trondhjems%20kajakklubb%202026%20signert.pdf" },
  },
  {
    year: 2025,
    sakspapirer: { kind: "pdf", path: "/images/Klubben/Drift/Arsmote%202025/Sakspapirer%20Arsmote%202025.pdf" },
    protokoll: { kind: "pdf", path: "/images/Klubben/Drift/Arsmote%202025/Referat%20fra%20arsmote%202025%20Trondhjems%20Kajakklubb%20signert.pdf" },
  },
  {
    year: 2024,
    sakspapirer: { kind: "pdf", path: "/images/Klubben/Drift/Arsmote%202024/Sakspapirer%20Arsmote%202024.pdf" },
    protokoll: { kind: "pdf", path: "/images/Klubben/Drift/Arsmote%202024/Protokoll%20fra%20arsmote%202024%20Trondhjems%20Kajakklubb%201.pdf" },
  },
  {
    year: 2023,
    sakspapirer: { kind: "url", href: "https://drive.google.com/file/d/1nQEdpaug2LIAW6KQ_XiiOAIsGbJqQoVD/view?usp=sharing" },
    protokoll: { kind: "url", href: "https://drive.google.com/file/d/1ZdBVH0_Lwee5ZaTIWXvWIQxkbTos11EC/view?usp=sharing" },
  },
];

// ---------------------------------------------------------------------------
// Styremøteprotokoller: datert liste, enten en PDF-sti på den gamle siden,
// eller "generate" som peker på en artikkel i migration-data.
// ---------------------------------------------------------------------------
type StyremoteEntry = { dateISO: string; dateDisplay: string; source: { kind: "pdf"; path: string } | { kind: "generate" } };

const styremoter: StyremoteEntry[] = [
  { dateISO: "2025-12-16", dateDisplay: "16.12.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20desember%202025%201.pdf" } },
  { dateISO: "2025-11-04", dateDisplay: "04.11.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2004.11.2025.pdf" } },
  { dateISO: "2025-09-30", dateDisplay: "30.09.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2030.09.2025.pdf" } },
  { dateISO: "2025-08-26", dateDisplay: "26.08.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2026.08.2025.pdf" } },
  { dateISO: "2025-06-26", dateDisplay: "26.06.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20august%202025%201.pdf" } },
  { dateISO: "2025-06-17", dateDisplay: "17.06.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Motereferat%20Styremote%20juni%202025.pdf" } },
  { dateISO: "2025-05-20", dateDisplay: "20.05.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Motereferat%20Styremote%20mai%202025.pdf" } },
  { dateISO: "2025-04-22", dateDisplay: "22.04.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20april%202025.pdf" } },
  { dateISO: "2025-03-20", dateDisplay: "20.03.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Motereferat%20Styremote%20mars%202025%201.pdf" } },
  { dateISO: "2025-03-10", dateDisplay: "10.03.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Motereferat%20Styremote%20mars%202025.pdf" } },
  { dateISO: "2025-02-11", dateDisplay: "11.02.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20februar%202025.pdf" } },
  { dateISO: "2025-01-14", dateDisplay: "14.01.2025", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2014.01.2025.pdf" } },

  { dateISO: "2024-12-10", dateDisplay: "10.12.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2010.12.2024.pdf" } },
  { dateISO: "2024-10-22", dateDisplay: "22.10.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2022.10.2024.pdf" } },
  { dateISO: "2024-09-24", dateDisplay: "24.09.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2024.09.2024.pdf" } },
  { dateISO: "2024-08-29", dateDisplay: "29.08.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2029.08.2024.pdf" } },
  { dateISO: "2024-05-14", dateDisplay: "14.05.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20mai%202024%202.pdf" } },
  { dateISO: "2024-04-23", dateDisplay: "23.04.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20april%202024.pdf" } },
  { dateISO: "2024-03-12", dateDisplay: "12.03.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20mars%202024.pdf" } },
  { dateISO: "2024-02-13", dateDisplay: "13.02.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20februar%202024.pdf" } },
  { dateISO: "2024-01-16", dateDisplay: "16.01.2024", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremoteprotokoll%2016.01.2024.pdf" } },

  { dateISO: "2023-12-12", dateDisplay: "12.12.2023", source: { kind: "generate" } },
  { dateISO: "2023-11-16", dateDisplay: "16.11.2023", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20november%202023.pdf" } },
  { dateISO: "2023-10-17", dateDisplay: "17.10.2023", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20oktober%202023.pdf" } },
  { dateISO: "2023-09-26", dateDisplay: "26.09.2023", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20september%202023.pdf" } },
  { dateISO: "2023-08-22", dateDisplay: "22.08.2023", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20august%202023.pdf" } },
  { dateISO: "2023-06-13", dateDisplay: "13.06.2023", source: { kind: "generate" } },
  { dateISO: "2023-05-10", dateDisplay: "10.05.2023", source: { kind: "pdf", path: "/images/Klubben/Drift/Styremoterprotokoller/Styremote%20mai%202023.pdf" } },
  { dateISO: "2023-04-11", dateDisplay: "11.04.2023", source: { kind: "generate" } },
  { dateISO: "2023-03-14", dateDisplay: "14.03.2023", source: { kind: "generate" } },
  { dateISO: "2023-02-28", dateDisplay: "28.02.2023", source: { kind: "generate" } },
  { dateISO: "2023-01-26", dateDisplay: "26.01.2023", source: { kind: "generate" } },

  { dateISO: "2022-12-15", dateDisplay: "15.12.2022", source: { kind: "generate" } },
  { dateISO: "2022-11-17", dateDisplay: "17.11.2022", source: { kind: "generate" } },
  { dateISO: "2022-10-06", dateDisplay: "06.10.2022", source: { kind: "generate" } },
  { dateISO: "2022-08-18", dateDisplay: "18.08.2022", source: { kind: "generate" } },
  { dateISO: "2022-06-16", dateDisplay: "16.06.2022", source: { kind: "generate" } },
  { dateISO: "2022-05-03", dateDisplay: "03.05.2022", source: { kind: "generate" } },
  { dateISO: "2022-03-22", dateDisplay: "22.03.2022", source: { kind: "generate" } },
  { dateISO: "2022-02-14", dateDisplay: "14.02.2022", source: { kind: "generate" } },
  { dateISO: "2022-01-18", dateDisplay: "18.01.2022", source: { kind: "generate" } },
];

async function buildArsmoterBlocks(): Promise<object[]> {
  const blocks: object[] = [textBlock("Årsmøter", "h2")];
  for (const { year, sakspapirer, protokoll } of arsmoter) {
    blocks.push(textBlock(`Årsmøte ${year}`, "h3"));
    const sakspapirerDef = sakspapirer.kind === "pdf" ? pdfLinkDef(await uploadPdfFromUrl(sakspapirer.path, `Sakspapirer ${year}`)) : urlLinkDef(sakspapirer.href);
    const protokollDef = protokoll.kind === "pdf" ? pdfLinkDef(await uploadPdfFromUrl(protokoll.path, `Signert protokoll ${year}`)) : urlLinkDef(protokoll.href);
    blocks.push(
      linksBlock([
        { text: "Sakspapirer", linkDef: sakspapirerDef },
        { text: " · " },
        { text: "Signert protokoll", linkDef: protokollDef },
      ]),
    );
  }
  return blocks;
}

async function buildStyremoterBlocks(): Promise<object[]> {
  const blocks: object[] = [textBlock("Styremøteprotokoller", "h2")];
  const articlesByDate = new Map(styremoterArticles.map((a) => [a.dateISO, a]));
  let currentYear: number | null = null;

  for (const entry of styremoter) {
    const year = Number(entry.dateISO.slice(0, 4));
    if (year !== currentYear) {
      blocks.push(textBlock(String(year), "h3"));
      currentYear = year;
    }

    let assetId: string;
    if (entry.source.kind === "pdf") {
      assetId = await uploadPdfFromUrl(entry.source.path, `Styremøteprotokoll ${entry.dateDisplay}`);
    } else {
      const article = articlesByDate.get(entry.dateISO);
      if (!article) throw new Error(`Fant ikke artikkelinnhold for ${entry.dateDisplay}`);
      assetId = await uploadGeneratedPdf(article);
    }
    blocks.push(linksBlock([{ text: `Styremøteprotokoll ${entry.dateDisplay}`, linkDef: pdfLinkDef(assetId) }]));
  }
  return blocks;
}

async function createStyreOgStellPage() {
  console.log("Laster ned/genererer og laster opp PDF-er for Årsmøter...");
  const arsmoterBlocks = await buildArsmoterBlocks();
  console.log("Laster ned/genererer og laster opp PDF-er for Styremøteprotokoller...");
  const styremoterBlocks = await buildStyremoterBlocks();

  const id = "flexiblePage-om-klubben-styre-og-stell";
  await client.createOrReplace({
    _id: id,
    _type: "flexiblePage",
    slug: { _type: "slug", current: "om-klubben/styre-og-stell" },
    section: "klubb",
    title: { no: "Årsmøter og styremøteprotokoller" },
    intro: {
      no: "Sakspapirer og signerte protokoller fra årsmøtene, samt protokoller fra styremøtene.",
    },
    body: { no: [...arsmoterBlocks, ...styremoterBlocks] },
  });
  console.log(`\nOpprettet/oppdatert og publisert: ${id}`);
}

async function linkFromOmKlubben() {
  const id = "flexiblePage-om-klubben";
  const published = await client.getDocument(id);
  if (!published) throw new Error(`Fant ikke ${id}`);
  const existing: { href?: string }[] = (published.subPageLinks as { href?: string }[]) ?? [];
  if (existing.some((l) => l.href === "/om-klubben/styre-og-stell")) {
    console.log("Lenke til Årsmøter og styremøteprotokoller finnes allerede på /om-klubben, hopper over.");
    return;
  }
  await client
    .patch(id)
    .set({ subPageLinks: [...existing, subPageLink("Årsmøter og styremøteprotokoller", "/om-klubben/styre-og-stell")] })
    .commit();
  console.log("Lagt til lenke på /om-klubben sin subPageLinks.");
}

async function main() {
  await createStyreOgStellPage();
  await linkFromOmKlubben();
  console.log("\nFerdig.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
