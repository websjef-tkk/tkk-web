/**
 * Oppretter de faste merkelappene for bilder (se schemas/objects/imageTags.ts)
 * og setter merkelapper på bilder som allerede er i bruk, ut fra dokumentene
 * de brukes i: gren, kategori og seksjon. Bilder som alt har merkelapp, og
 * bilder som ikke er i bruk noe sted, røres ikke.
 *
 * Uten --write er dette en tørrkjøring som bare skriver ut hva som ville skjedd.
 *
 * Run: npx tsx sanity/seed-image-tags.ts [--write]
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { DISCIPLINES } from "./schemas/objects/disciplines";
import { EVENT_CATEGORIES } from "./schemas/objects/eventCategories";
import { IMAGE_TAGS } from "./schemas/objects/imageTags";

config({ path: ".env" });

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const FALLBACK_TAG = "Klubb";

type Usage = {
  _type: string;
  slug?: string;
  section?: string;
  category?: string;
  discipline?: string;
  disciplines?: string[];
};

type Asset = { _id: string; originalFilename?: string; tagCount: number; usedBy: Usage[] };

const disciplineTag = (value: string) => DISCIPLINES.find((d) => d.value === value)?.short;

function tagsForUsage(doc: Usage): string[] {
  const tags = [...(doc.disciplines ?? []), doc.discipline ?? ""].map(disciplineTag);
  if (doc._type === "event") tags.push(EVENT_CATEGORIES.find((c) => c.value === doc.category)?.title);
  if (doc._type === "blogPost") {
    if (doc.category === "tur" || doc.category === "turrapport") tags.push("Tur");
    if (doc.category === "sosial") tags.push("Sosialt");
    if (doc.category === "klubb" || doc.category === "info") tags.push("Klubb");
  }
  if (doc._type === "flexiblePage") {
    if (doc.slug?.split("/").includes("hms")) tags.push("HMS");
    else if (doc.section === "klubb") tags.push("Klubb");
  }
  if (doc._type === "siteSettings" || doc._type === "person") tags.push("Klubb");
  return tags.filter((t): t is string => Boolean(t));
}

async function main() {
  console.log(WRITE ? "SKRIVER til datasettet\n" : "TØRRKJØRING (bruk --write for å lagre)\n");

  const existing = await client.fetch<{ _id: string; name: string }[]>(
    `*[_type == "media.tag"]{ _id, "name": name.current }`
  );
  const tagIds = new Map(existing.map((t) => [t.name, t._id]));
  for (const name of IMAGE_TAGS) {
    if (tagIds.has(name)) continue;
    console.log(`NY MERKELAPP  ${name}`);
    if (WRITE) {
      const created = await client.create({ _type: "media.tag", name: { _type: "slug", current: name } });
      tagIds.set(name, created._id);
    }
  }

  const assets = await client.fetch<Asset[]>(
    `*[_type == "sanity.imageAsset"]{
      _id,
      originalFilename,
      "tagCount": count(opt.media.tags),
      "usedBy": *[references(^._id)]{ _type, "slug": slug.current, section, category, discipline, disciplines }
    } | order(originalFilename asc)`
  );

  let tagged = 0;
  for (const asset of assets) {
    if (asset.tagCount > 0 || asset.usedBy.length === 0) continue;
    const derived = [...new Set(asset.usedBy.flatMap(tagsForUsage))];
    const tags = derived.length ? derived : [FALLBACK_TAG];
    const usedBy = [...new Set(asset.usedBy.map((d) => (d.slug ? `${d._type}:${d.slug}` : d._type)))].join(", ");
    console.log(
      `${derived.length ? "MERK " : "ANTATT"}  ${asset.originalFilename ?? asset._id}  →  ${tags.join(", ")}   (${usedBy})`
    );
    tagged++;
    if (!WRITE) continue;
    await client
      .patch(asset._id)
      .setIfMissing({ opt: {} })
      .setIfMissing({ "opt.media": {} })
      .set({
        "opt.media.tags": tags.map((name) => ({
          _type: "reference",
          _ref: tagIds.get(name)!,
          _weak: true,
        })),
      })
      .commit();
  }

  const unused = assets.filter((a) => a.usedBy.length === 0 && !a.tagCount).length;
  console.log(`\n${tagged} bilder ${WRITE ? "fikk" : "ville fått"} merkelapp. ${unused} ubrukte bilder er ikke rørt.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
