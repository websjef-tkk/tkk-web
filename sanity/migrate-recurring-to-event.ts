/**
 * One-off migration: converts existing `recurringEvent` documents into
 * `event` documents with `isRecurring: true`, then deletes the originals.
 * Idempotent — skips documents already migrated.
 *
 * Run: npx tsx sanity/migrate-recurring-to-event.ts
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

interface OldRecurringEvent {
  _id: string;
  title: { no: string; en?: string };
  dayOfWeek: string;
  time?: string;
  discipline?: string;
  location?: string;
  description?: { no?: string; en?: string };
  sortOrder?: number;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const oldDocs: OldRecurringEvent[] = await client.fetch('*[_type == "recurringEvent"]');

  if (oldDocs.length === 0) {
    console.log("Ingen recurringEvent-dokumenter å migrere.");
    return;
  }

  const tx = client.transaction();
  for (const old of oldDocs) {
    const newId = `event-from-recurring-${old._id}`;
    tx.createIfNotExists({
      _id: newId,
      _type: "event",
      title: old.title,
      slug: { _type: "slug", current: slugify(old.title.no) },
      description: old.description,
      isRecurring: true,
      dayOfWeek: old.dayOfWeek,
      time: old.time,
      location: old.location,
      discipline: old.discipline,
      category: "tur",
      sortOrder: old.sortOrder,
    });
    tx.delete(old._id);
  }
  await tx.commit();
  console.log(`Migrerte ${oldDocs.length} recurringEvent-dokumenter til event.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
