/**
 * Innfører sidehierarkiet på eksisterende fleksible sider: setter "Ligger
 * under" (parent) på alle sider ut fra adressen, etter først å ha flyttet
 * sidene som lå feil (gren-HMS inn under hver gren m.m., se MOVES).
 *
 * Nettstedet var ikke lansert da dette ble kjørt, så adressene endres uten
 * viderekobling (previousSlugs røres ikke).
 *
 * Tørrkjøring er standard og skriver ingenting:
 *   npx tsx sanity/migrate-page-parents.ts
 * Skriv endringene:
 *   npx tsx sanity/migrate-page-parents.ts --write
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env" });

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Gammel adresse → ny adresse. Gjelder også alt som ligger under den gamle.
const MOVES: [from: string, to: string][] = [
  ["hms/hav", "padling/hav/hms"],
  ["hms/elv", "padling/elv/hms"],
  ["hms/pirbadet", "padling/pirbadet/hms"],
  ["havkajakk-lan-leie", "padling/hav/havkajakk-lan-leie"],
  ["padling/flattvann/surfski", "padling/surfski/om-surfski"],
];

// Sider som mangler i dag, men trengs som forelder for eksisterende sider.
const NEW_PAGES = [
  {
    _id: "flexiblePage-padling-elv-hms",
    _type: "flexiblePage",
    slug: { _type: "slug", current: "padling/elv/hms" },
    section: "padling",
    disciplines: ["elv"],
    title: { no: "HMS Elvepadling" },
  },
];

type Page = { _id: string; slug?: string; title?: string; parent?: string };

function moved(slug: string): string {
  for (const [from, to] of MOVES) {
    if (slug === from) return to;
    if (slug.startsWith(`${from}/`)) return to + slug.slice(from.length);
  }
  return slug;
}

/** Lenker skrevet inn som tekst (ikke referanser) som peker på en adresse som flyttes. */
function hardcodedLinks(value: unknown, path: string[], hits: string[]) {
  if (typeof value === "string") {
    const field = path[path.length - 1];
    const target = value.replace(/^https?:\/\/[^/]+/, "").replace(/^\//, "");
    if ((field === "href" || field === "customPath") && moved(target) !== target) {
      hits.push(`${path.join(".")} = ${value}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => hardcodedLinks(v, [...path, String(i)], hits));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) hardcodedLinks(v, [...path, k], hits);
  }
}

async function main() {
  const [pages, disciplinePages, everything] = await Promise.all([
    client.fetch<Page[]>(
      `*[_type == "flexiblePage"]{ _id, "slug": slug.current, "title": title.no, "parent": parent._ref } | order(slug asc)`
    ),
    client.fetch<{ _id: string; discipline: string }[]>(
      `*[_type == "disciplinePage" && !(_id in path("drafts.**"))]{ _id, discipline }`
    ),
    client.fetch<{ _id: string }[]>(`*[!(_type match "sanity.*") && !(_type match "system.*")]`),
  ]);

  const hits: string[] = [];
  for (const doc of everything) hardcodedLinks(doc, [doc._id], hits);
  if (hits.length > 0) {
    console.error("Disse lenkene er skrevet inn som tekst og må rettes først:\n  " + hits.join("\n  "));
    process.exit(1);
  }

  // Publisert ID for hver adresse etter flytting. Bare publiserte dokumenter kan være forelder.
  const idByPath = new Map<string, string>();
  for (const d of disciplinePages) idByPath.set(`padling/${d.discipline}`, d._id);
  for (const p of NEW_PAGES) idByPath.set(p.slug.current, p._id);
  for (const p of pages) {
    if (p.slug && !p._id.startsWith("drafts.")) idByPath.set(moved(p.slug), p._id);
  }

  const tx = client.transaction();
  for (const p of NEW_PAGES) {
    const parentId = idByPath.get(p.slug.current.replace(/\/[^/]+$/, ""));
    if (pages.some((existing) => existing._id === p._id)) continue;
    console.log(`NY     ${p.slug.current}  «${p.title.no}»`);
    tx.createIfNotExists({ ...p, parent: { _type: "reference", _ref: parentId } });
  }

  const withoutParent: string[] = [];
  let movedCount = 0;
  for (const p of pages) {
    if (!p.slug) continue;
    const slug = moved(p.slug);
    const parentId = slug.includes("/") ? idByPath.get(slug.replace(/\/[^/]+$/, "")) : undefined;
    const draft = p._id.startsWith("drafts.") ? " (kladd)" : "";

    if (slug !== p.slug) {
      movedCount++;
      console.log(`FLYTT  ${p.slug} → ${slug}${draft}`);
    }
    if (!parentId) withoutParent.push(`${slug}${draft}`);
    if (slug === p.slug && parentId === (p.parent ?? undefined)) continue;

    const patch = client.patch(p._id).set({ "slug.current": slug });
    tx.patch(parentId ? patch.set({ parent: { _type: "reference", _ref: parentId } }) : patch.unset(["parent"]));
  }

  console.log(`\n${pages.length} sider, ${movedCount} med ny adresse.`);
  console.log(`Uten «Ligger under» (toppnivå):\n  ${withoutParent.join("\n  ")}`);

  if (!WRITE) {
    console.log("\nTørrkjøring, ingenting er skrevet. Kjør med --write for å lagre.");
    return;
  }
  const result = await tx.commit();
  console.log(`\nLagret. ${result.results.length} dokumenter endret.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
