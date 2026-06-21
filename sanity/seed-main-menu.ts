/**
 * One-off seed: creates the `mainMenu` singleton document mirroring the
 * previously hardcoded menu structure in Nav.tsx, so the visible menu is
 * unchanged at cutover.
 *
 * Run:
 *   npx tsx sanity/seed-main-menu.ts
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

const label = (no: string, en: string) => ({ no, en });

const customLink = (path: string) => ({ linkType: "custom" as const, customPath: path });
const disciplineLink = (discipline: string) => ({
  linkType: "discipline" as const,
  disciplinePage: { _type: "reference", _ref: `disciplinePage-${discipline}` },
});
const flexibleLink = (pageId: string) => ({
  linkType: "flexible" as const,
  flexiblePage: { _type: "reference", _ref: `flexiblePage-${pageId}` },
});

const disciplines: [string, string, string][] = [
  ["hav", "Havpadling", "Sea Kayaking"],
  ["elv", "Elvepadling", "River Kayaking"],
  ["flattvann", "Flattvann", "Flat Water"],
  ["surfski", "Surfski", "Surfski"],
  ["polo", "Kajakkpolo", "Kayak Polo"],
  ["junior", "Junior", "Junior"],
  ["pirbadet", "Pirbadet", "Pirbadet"],
];

const items = [
  { _key: key(), label: label("Hjem", "Home"), itemType: "link", link: customLink("/") },
  {
    _key: key(),
    label: label("Padling", "Paddling"),
    itemType: "dropdown",
    children: disciplines.map(([d, no, en]) => ({
      _key: key(),
      label: label(no, en),
      link: disciplineLink(d),
    })),
  },
  { _key: key(), label: label("Aktiviteter", "Events"), itemType: "link", link: customLink("/aktiviteter") },
  {
    _key: key(),
    label: label("Medlemskap", "Membership"),
    itemType: "dropdown",
    children: [
      { _key: key(), label: label("Bli medlem", "Join us"), link: flexibleLink("medlemskap") },
      { _key: key(), label: label("Kom i gang", "Getting started"), link: flexibleLink("kom-i-gang") },
    ],
  },
  {
    _key: key(),
    label: label("HMS", "H&S"),
    itemType: "dropdown",
    children: [
      { _key: key(), label: label("HMS-plan", "H&S Plan"), link: flexibleLink("hms") },
      { _key: key(), label: label("Internkontroll", "Internal Control"), link: flexibleLink("hms-generelt") },
      { _key: key(), label: label("Mitt varsel", "Report a concern"), link: flexibleLink("hms-mitt-varsel") },
      { _key: key(), label: label("Hendelsesrapporter", "Incident reports"), link: flexibleLink("hms-hendelsesrapporter") },
      { _key: key(), label: label("Politiattest", "Background check"), link: flexibleLink("hms-politiattest") },
    ],
  },
  {
    _key: key(),
    label: label("Klubben", "The club"),
    itemType: "dropdown",
    children: [
      { _key: key(), label: label("Om klubben", "About the club"), link: customLink("/om-klubben") },
      { _key: key(), label: label("Administrasjon", "Administration"), link: flexibleLink("klubben-administrasjon") },
      { _key: key(), label: label("Klubbhus og eiendom", "Club house"), link: flexibleLink("klubben-klubbhus") },
      // NB: flexiblePage "klubben-sosialgruppe" finnes ikke i production (ruten 404er allerede i dag) — bruker custom path for å speile nåværende (ødelagte) oppførsel.
      { _key: key(), label: label("Sosialgruppen", "Social group"), link: customLink("/om-klubben/sosialgruppe") },
      { _key: key(), label: label("Sosialgruppa", "Social group"), link: flexibleLink("klubben-sosialgruppe-sosialgruppa") },
      { _key: key(), label: label("Utmerkelser", "Awards"), link: flexibleLink("klubben-sosialgruppe-utmerkelser") },
      { _key: key(), label: label("Støtteordninger", "Support schemes"), link: flexibleLink("klubben-stotteordninger") },
      { _key: key(), label: label("Kjøregodtgjørelse", "Mileage allowance"), link: flexibleLink("klubben-kjoregodtgjorelse") },
      { _key: key(), label: label("Vedtektene", "Bylaws"), link: flexibleLink("klubben-vedtektene") },
      { _key: key(), label: label("Kontakt", "Contact"), link: customLink("/kontakt") },
    ],
  },
];

async function main() {
  await client.createOrReplace({
    _id: "mainMenu",
    _type: "mainMenu",
    items,
  });
  console.log(`mainMenu opprettet/oppdatert med ${items.length} toppnivå-elementer.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
