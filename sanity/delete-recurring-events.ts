/**
 * Engangsskript: sletter de gamle gjentakende aktivitetene (isRecurring == true)
 * etter at faste og enkeltstående aktiviteter ble slått sammen. De faste øktene
 * ligger nå som egne aktiviteter i iSonen og importeres derfra.
 *
 * Sletter både publisert versjon og eventuell kladd. Uten --confirm vises bare
 * hva som ville blitt slettet.
 *
 * Run: npx tsx sanity/delete-recurring-events.ts [--confirm]
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  perspective: "raw",
});

async function main() {
  const docs = await client.fetch<{ _id: string; title?: string; refs: number }[]>(
    `*[_type == "event" && isRecurring == true]{ _id, "title": title.no, "refs": count(*[references(^._id)]) }`
  );
  if (docs.length === 0) {
    console.log("Ingen gjentakende aktiviteter å slette.");
    return;
  }
  for (const d of docs) console.log(`${d._id}  ${d.title}${d.refs ? `  (refereres fra ${d.refs} dokument)` : ""}`);

  if (!process.argv.includes("--confirm")) {
    console.log(`\n${docs.length} dokumenter ville blitt slettet. Kjør med --confirm for å slette.`);
    return;
  }
  const tx = client.transaction();
  for (const d of docs) tx.delete(d._id);
  await tx.commit();
  console.log(`\nSlettet ${docs.length} dokumenter.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
