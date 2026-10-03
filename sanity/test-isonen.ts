/**
 * Lesetest mot NIF Activity API (iSonen) — skriver ingenting til Sanity.
 *
 * Kjører samme fetchIsonenEvents() som synk-ruten bruker, og viser hva som
 * ville blitt importert.
 *
 *   npx tsx sanity/test-isonen.ts [startdato yyyy-mm-dd]
 */
import "dotenv/config";
import { fetchIsonenEvents, isonenStartDate } from "../src/lib/isonen";

async function main() {
  const startDate = process.argv[2] ?? isonenStartDate();
  const events = await fetchIsonenEvents(startDate);
  console.log(`${events.length} aktiviteter fra og med ${startDate}\n`);
  for (const e of events) {
    console.log(
      [
        `${e.externalId}  ${e.cancelled ? "[AVLYST] " : ""}${e.title}`,
        `  ${e.category}  ${e.date} → ${e.endDate ?? "-"}  📍 ${e.location ?? "-"}`,
        `  ${e.registerUrl}${e.imageUrl ? "  (har bilde)" : ""}`,
      ].join("\n")
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
