/**
 * Creates mockup `event` drafts based on real, current activities found on
 * the tkk.no homepage ("Turer" and "Arrangement og Kurs" sections), each
 * linking to its real isonen.no event page. Demonstrates what the future
 * automated NIF Activity API sync (see src/lib/isonen.ts) would produce,
 * pending real API access.
 *
 * Run: npx tsx sanity/import-isonen-mockups.ts
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

interface MockActivity {
  externalId: string;
  title: string;
  date: string;
  endDate?: string;
  category: "tur" | "kurs" | "sosial";
  discipline: string;
  registerUrl: string;
}

const activities: MockActivity[] = [
  {
    externalId: "cmofjv9hx01scec0123jww7j7",
    title: "Lavterskel telttur Lysøysundet",
    date: "2026-06-26",
    endDate: "2026-06-28",
    category: "tur",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmofjv9hx01scec0123jww7j7",
  },
  {
    externalId: "cmnz05ms901m6e201743snbhq",
    title: "Sommertur Bohuslän",
    date: "2026-07-25",
    endDate: "2026-08-01",
    category: "tur",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmnz05ms901m6e201743snbhq/",
  },
  {
    externalId: "cmevqoz3207wvc001xaaulu5f",
    title: "Sommertur Kragerø",
    date: "2026-07-26",
    endDate: "2026-08-02",
    category: "tur",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmevqoz3207wvc001xaaulu5f/",
  },
  {
    externalId: "cmqhsp90q00n0dp01k1c5kmmx",
    title: "Froan",
    date: "2026-08-20",
    endDate: "2026-08-23",
    category: "tur",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmqhsp90q00n0dp01k1c5kmmx",
  },
  {
    externalId: "cmp6zjzuj02c6ab01ycjdiucd",
    title: "Kråkvåg / Storfosna",
    date: "2026-08-28",
    endDate: "2026-08-30",
    category: "tur",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmp6zjzuj02c6ab01ycjdiucd/",
  },
  {
    externalId: "cmpvjd9wx01jd6x01pvxm1m32",
    title: "Aktivitetsledertur til Buholmråsa",
    date: "2026-10-13",
    endDate: "2026-10-15",
    category: "tur",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmpvjd9wx01jd6x01pvxm1m32/",
  },
  {
    externalId: "cmoyv3nof01n29e01c3qx5pw2",
    title: "Introkurs flattvannspadling for barn og unge",
    date: "2026-06-28T11:00:00",
    category: "kurs",
    discipline: "flattvann",
    registerUrl: "https://isonen.no/event/cmoyv3nof01n29e01c3qx5pw2/",
  },
  {
    externalId: "cmi4wb2qq00txab01kb2rt9li",
    title: "Grunnkurs Hav - pulje 3",
    date: "2026-08-17",
    endDate: "2026-08-26",
    category: "kurs",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmi4wb2qq00txab01kb2rt9li/",
  },
  {
    externalId: "cmi4x0x1h00z2df01lq3y0lh2",
    title: "Grunnkurs Hav - pulje 4",
    date: "2026-08-29",
    endDate: "2026-08-30",
    category: "kurs",
    discipline: "hav",
    registerUrl: "https://isonen.no/event/cmi4x0x1h00z2df01lq3y0lh2/",
  },
  {
    externalId: "cmpr1wwfc00xc6x01funbla01",
    title: "Krabbefest",
    date: "2026-09-26T18:30:00",
    category: "sosial",
    discipline: "alle",
    registerUrl: "https://isonen.no/event/cmpr1wwfc00xc6x01funbla01/",
  },
  {
    externalId: "cmpr3qsom000b8p01nn2i3yt0",
    title: "Julebord",
    date: "2026-11-14T18:30:00",
    category: "sosial",
    discipline: "alle",
    registerUrl: "https://isonen.no/event/cmpr3qsom000b8p01nn2i3yt0/",
  },
];

async function main() {
  for (const a of activities) {
    const id = `drafts.event-isonen-${a.externalId}`;
    await client.createOrReplace({
      _id: id,
      _type: "event",
      title: { no: a.title },
      slug: { _type: "slug", current: `isonen-${a.externalId}` },
      isRecurring: false,
      date: a.date,
      endDate: a.endDate,
      category: a.category,
      discipline: a.discipline,
      registerUrl: a.registerUrl,
      externalSource: "isonen",
      externalId: a.externalId,
      cancelled: false,
    });
    console.log(`Lagret som kladd: ${id}`);
  }
  console.log(`\n${activities.length} mockup-aktiviteter opprettet.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
