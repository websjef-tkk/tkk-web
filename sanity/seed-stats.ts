/**
 * One-off seed: sets the `stats` array on siteSettings to mirror the
 * previously hardcoded jumbo stats so the homepage looks unchanged.
 *
 * Run: npx tsx sanity/seed-stats.ts
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

let _seq = 0;
const key = () => `k${++_seq}`;

const stats = [
  { _key: key(), label: { no: "~500 medlemmer", en: "~500 members" } },
  { _key: key(), label: { no: "To baser", en: "Two bases" } },
  { _key: key(), label: { no: "Utstyr inkludert", en: "Equipment included" } },
  { _key: key(), label: { no: "Seks disipliner", en: "Six disciplines" } },
];

async function main() {
  await client.patch("siteSettings").set({ stats }).commit({ autoGenerateArrayKeys: false });
  console.log(`Satte ${stats.length} stats-punkter på siteSettings.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
