/**
 * One-off migration: sets the `section` field on existing flexiblePage
 * documents so the Studio desk structure can group them correctly.
 *
 * Run once after deploying the `section` field on flexiblePage:
 *   npx tsx sanity/migrate-flexible-section.ts
 *
 * Requires SANITY_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID and
 * NEXT_PUBLIC_SANITY_DATASET in .env.local.
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function sectionFor(pageId: string | null): "padling" | "klubb" {
  if (!pageId) return "klubb";
  return pageId.startsWith("padling") || pageId.startsWith("hms-hav") || pageId.startsWith("hms-elv")
    ? "padling"
    : "klubb";
}

async function main() {
  const docs: { _id: string; pageId: string | null }[] = await client.fetch(
    '*[_type == "flexiblePage"]{ _id, pageId }'
  );

  if (docs.length === 0) {
    console.log("Ingen flexiblePage-dokumenter funnet.");
    return;
  }

  const missingPageId = docs.filter((d) => !d.pageId);
  if (missingPageId.length > 0) {
    console.warn(
      `Advarsel: ${missingPageId.length} dokument(er) mangler pageId og settes til "klubb": ${missingPageId.map((d) => d._id).join(", ")}`
    );
  }

  const tx = client.transaction();
  for (const doc of docs) {
    const section = sectionFor(doc.pageId);
    tx.patch(doc._id, { set: { section } });
  }
  await tx.commit();

  const counts = docs.reduce(
    (acc, d) => {
      acc[sectionFor(d.pageId)]++;
      return acc;
    },
    { padling: 0, klubb: 0 }
  );
  console.log(`Oppdaterte ${docs.length} dokumenter: ${counts.padling} padling, ${counts.klubb} klubb.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
