/**
 * Generates seed-content.ndjson for import via:
 *   npx sanity dataset import sanity/seed-content.ndjson --dataset production --missing
 *
 * Use --missing to add only new documents without touching existing Studio content.
 * Use --replace only when intentionally overwriting (e.g. structural schema changes).
 *
 * To export the current content lake as a snapshot:
 *   npx sanity dataset export production sanity/export.ndjson --no-drafts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import hmsContent from "./hms-content.json" assert { type: "json" };
import padlingExtra from "./content/padling-extra.json" assert { type: "json" };
import havSubPages from "./content/hav-sub-pages.json" assert { type: "json" };
import elvSubPages from "./content/elv-sub-pages.json" assert { type: "json" };
import flattvannSubPages from "./content/flattvann-sub-pages.json" assert { type: "json" };
import juniorSubPages from "./content/junior-sub-pages.json" assert { type: "json" };
import klubbenExtra from "./content/klubben-extra.json" assert { type: "json" };
import disciplineContent from "./content/discipline-content.json" assert { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let _seq = 0;
function key() { return `k${++_seq}`; }

function block(text: string, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [] as unknown[],
    children: [{ _type: "span", _key: key(), text, marks: [] as string[] }],
  };
}

function h2(text: string) { return block(text, "h2"); }
function heading(text: string) { return block(text, "h3"); }

function linkBlock(text: string, style = "normal") {
  // Parse [label](url) spans within text into Portable Text spans with link marks
  const markDefs: { _key: string; _type: string; href: string }[] = [];
  const children: { _type: string; _key: string; text: string; marks: string[] }[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      children.push({ _type: "span", _key: key(), text: text.slice(last, m.index), marks: [] });
    }
    const mk = key();
    markDefs.push({ _key: mk, _type: "link", href: m[2] });
    children.push({ _type: "span", _key: key(), text: m[1], marks: [mk] });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    children.push({ _type: "span", _key: key(), text: text.slice(last), marks: [] });
  }
  if (children.length === 0) children.push({ _type: "span", _key: key(), text: "", marks: [] });
  return { _type: "block", _key: key(), style, markDefs, children };
}

function lines(arr: string[]) {
  return arr.map(l => l.startsWith("### ") ? heading(l.slice(4)) : linkBlock(l));
}


const docs: object[] = [];

// siteSettings
docs.push({
  _id: "siteSettings", _type: "siteSettings",
  // heroSlides legges inn i Studio (bilder må lastes opp) — se sanity/seed-hero-slides.ts
  footerText: { no: "Trondhjems Kajakklubb — padle med oss" },
  instagram: "https://www.instagram.com/trondhjemskajakklubb",
  facebook: "https://www.facebook.com/groups/trondhjemskajakklubb",
  visitingAddress: "Nedre Ila 12\n7018 Trondheim",
  postalAddress: "Trondhjems Kajakklubb\nNedre Ila 12\n7018 Trondheim",
  phone: "476 44 224", orgNr: "990 255 105",
  partners: [
    { _type: "object", _key: key(), name: "Vertical Playground", description: { no: "Klatresenter og friluftsutstyr i Trondheim" } },
    { _type: "object", _key: key(), name: "Padlespesialisten", description: { no: "Spesialist på padleutstyr" } },
  ],
});

// persons
const persons = [
  { _id: "person-leder", _type: "person", name: "Leder TKK", role: { no: "Leder" }, group: "board", sortOrder: 1, phone: "476 44 224", email: "leder@tkk.no" },
  { _id: "person-nestleder", _type: "person", name: "Nestleder TKK", role: { no: "Nestleder" }, group: "board", sortOrder: 2, phone: "", email: "nestleder@tkk.no" },
  { _id: "person-kasserer", _type: "person", name: "Monica Engan Døhl", role: { no: "Kasserer" }, group: "board", sortOrder: 3, phone: "990 06 484", email: "kasserer@tkk.no" },
  { _id: "person-isabelle", _type: "person", name: "Isabelle Sande", role: { no: "Politiattestansvarlig" }, group: "board", sortOrder: 4, phone: "902 99 808", email: "politiattest@tkk.no" },
  { _id: "person-frode", _type: "person", name: "Frode Vassenden", role: { no: "Gruppesjef Havpadling" }, group: "leaders", sortOrder: 1, phone: "414 10 163", email: "hav@tkk.no" },
  { _id: "person-oyvind", _type: "person", name: "Øyvind Inge Bakksjø", role: { no: "Gruppesjef Elvepadling" }, group: "leaders", sortOrder: 2, phone: "922 83 522", email: "elv@tkk.no" },
  { _id: "person-fernando", _type: "person", name: "Fernando J Perez-Fernandez", role: { no: "Gruppesjef Flattvann" }, group: "leaders", sortOrder: 3, phone: "454 12 494", email: "flattvann@tkk.no" },
  { _id: "person-torleif", _type: "person", name: "Torleif Holm", role: { no: "Gruppesjef Surfski" }, group: "leaders", sortOrder: 4, phone: "977 53 020", email: "surfski@tkk.no" },
  { _id: "person-sofie", _type: "person", name: "Sofie Gradmann", role: { no: "Gruppesjef Kajakkpolo" }, group: "leaders", sortOrder: 5, phone: "968 04 684", email: "polo@tkk.no" },
  { _id: "person-anders", _type: "person", name: "Anders Foldvik", role: { no: "Gruppesjef Junior" }, group: "leaders", sortOrder: 6, phone: "402 03 036", email: "junior@tkk.no" },
  { _id: "person-havard", _type: "person", name: "Håvard Dahlen", role: { no: "Sosialkoordinator" }, group: "others", sortOrder: 1, phone: "970 79 822", email: "sosial@tkk.no" },
];
docs.push(...persons);

// discipline pages - generated from discipline-content.json
for (const d of disciplineContent) {
  docs.push({
    _id: `disciplinePage-${d.discipline}`,
    _type: "disciplinePage",
    discipline: d.discipline,
    title: { no: d.titleNo },
    tagline: { no: d.taglineNo },
    intro: { no: d.introNo },
    body: { no: lines(d.bodyNo) },
    subPageLinks: d.subPageLinks.map(l => ({
      _type: "object",
      _key: key(),
      title: { no: l.titleNo },
      href: l.href,
    })),
  });
}

// flexible pages - HMS (generated from hms-content.json)
for (const page of hmsContent) {
  const bodyNo = page.sections.flatMap((s: { titleNo: string; bodyNo: string[] }) => [h2(s.titleNo), ...lines(s.bodyNo)]);
  docs.push({
    _id: `flexiblePage-${page.id}`,
    _type: "flexiblePage",
    pageId: page.id,
    title: { no: page.titleNo },
    intro: { no: page.introNo },
    body: { no: bodyNo },
  });
}

docs.push({
  _id: "flexiblePage-hms-mitt-varsel", _type: "flexiblePage", pageId: "hms-mitt-varsel",
  title: { no: "Mitt varsel" },
  intro: { no: "Si fra når du opplever noe som er et brudd på vårt reglement, etiske leveregler og retningslinjer. Vi ønsker det skal være lav terskel for å si fra!" },
  body: {
    no: [
      h2("Hva kan varsles?"),
      block("Du kan varsle om hendelser du selv har opplevd, vært vitne til eller hørt om: overgrep, vold, underslag av penger, trakassering, mobbing, juksing i konkurranser, rasistiske utrop, diskriminerende oppførsel."),
      h2("Slik varsler du"),
      block("Varsling skjer via Norges Idrettsforbunds varslingsportal. Du kan også ta kontakt direkte med styret i TKK dersom du har spørsmål om fremgangsmåten."),
      block("Varsle via Idrettsforbundet: https://www.idrettsforbundet.no/tema/varsling/"),
    ],
  },
});

docs.push({
  _id: "flexiblePage-hms-hendelsesrapporter", _type: "flexiblePage", pageId: "hms-hendelsesrapporter",
  title: { no: "Hendelsesrapporter" },
  intro: { no: "Styret ønsker rapport om alle padlerelaterte hendelser, inkludert ulykker, nestenulykker og andre hendelser klubben kan lære av." },
  body: {
    no: [
      h2("Slik rapporterer du"),
      block("Bruk rapporteringsskjemaet under. Rapporten sendes direkte til styret og behandles på neste styremøte. Ved alvorlige ulykker skal leder kontaktes direkte."),
      block("RAPPORTER HENDELSE HER: https://forms.gle/xHHAakYQFtJ5Hzay9"),
      h2("Tidligere rapporterte hendelser"),
      block("Velt på fellestur til Knarrlaget — april 2024"),
    ],
  },
});

docs.push({
  _id: "flexiblePage-hms-politiattest", _type: "flexiblePage", pageId: "hms-politiattest",
  title: { no: "Politiattest" },
  intro: { no: "Politiattest kreves for trenere, instruktører og ledere som skal ha direkte kontakt med mindreårige (under 18 år) eller mennesker med utviklingshemming." },
  body: {
    no: [
      h2("Hvem må levere?"),
      block("Trenere, instruktører og lagledere som skal ha direkte kontakt med mindreårige (personer under 18 år), eller mennesker med utviklingshemming, vil alltid være omfattet. Attesten må fornyes hvert tredje år ved ny rolle."),
      h2("Fremgangsmåte"),
      block("1. Ta kontakt med politiattestansvarlig i TKK med opplysninger om din rolle."),
      block("2. Ansvarlig bekrefter formålet digitalt og sender instruksjoner for søknad via Min idrett."),
      block("3. Attesten fremvises for ansvarlig — digitalt via Digipost er akseptert."),
      block("Politiattestansvarlig: Isabelle Sande, 902 99 808"),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-administrasjon", _type: "flexiblePage", pageId: "klubben-administrasjon",
  title: { no: "Administrasjon" },
  intro: { no: "Her finner du styrende dokumenter, protokoller fra årsmøter og styremøter, og annen administrativ informasjon om klubben." },
  body: {
    no: [
      h2("Årsmøter"), block("Årsmøtet holdes hvert år i første kvartal. Her legges fremtidsplanen, budsjettet vedtas, og styret velges. Protokoller er tilgjengelige på forespørsel."),
      h2("Styremøter"), block("Styret møtes jevnlig gjennom hele året for å lede klubbens daglige drift, økonomi og HMS."),
      h2("Vedtekter"), block("TKKs vedtekter er det styrende dokumentet for klubbens virksomhet. Stiftet 27. april 1932. Ta kontakt med styret for innsyn i dokumenter."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-klubbhus", _type: "flexiblePage", pageId: "klubben-klubbhus",
  title: { no: "Klubbhus og eiendom" },
  intro: { no: "TKK har to baser langs Trondhjemsfjorden med tilgang til vann, utstyrslager og sosiale fasiliteter." },
  body: {
    no: [
      h2("Skansen — hjemmebasen"), block("Klubbhuset på Skansen ble åpnet 26. juni 1953. Her finner du utlånskajakkene, lageret og de sosiale arenaene. Adresse: Nedre Ila 12, 7018 Trondheim."),
      h2("Østmarkneset"), block("Østmarkneset ved Ladekaia er TKKs andre base med kajakkutstyr til utlån og en fantastisk beliggenhet rett ved vannet."),
      h2("Boplassleie"), block("Priser 2026: Skansen kr 750, Østmarkneset kr 600. Det er for øyeblikket venteliste."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-sosialgruppe", _type: "flexiblePage", pageId: "klubben-sosialgruppe",
  title: { no: "Sosialgruppen" },
  intro: { no: "Sosialgruppen jobber for trivsel og fellesskap gjennom arrangementer og spontane aktiviteter gjennom hele året." },
  body: {
    no: [
      h2("Faste tradisjoner"), block("1. mai: AVPLASK. Første søndag i advent: Adventpadling. Høst: Krabbe-kvelder. Før jul: Lutefiskmiddag."),
      h2("Kontakt"), block("Oppdateringer publiseres i klubbens Facebook-gruppe. Sosialkoordinator: Håvard Dahlen, 970 79 822."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-stotteordninger", _type: "flexiblePage", pageId: "klubben-stotteordninger",
  title: { no: "Støtteordninger" },
  intro: { no: "TKK har to vedtatte støtteordninger for medlemmer." },
  body: {
    no: [
      h2("Utdanningsstøtte"), block("Støtte til relevante kurs eller utdanning innen padling og sikkerhet. Søknad sendes til styret med beskrivelse av kurs, kostnad og relevans."),
      h2("Støtte til konkurransepadling for unge"), block("TKK støtter unge padlere (under 25 år) som ønsker å delta i konkurranser nasjonalt eller internasjonalt."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-kjoregodtgjorelse", _type: "flexiblePage", pageId: "klubben-kjoregodtgjorelse",
  title: { no: "Kjøregodtgjørelse" },
  intro: { no: "TKK refunderer kjøregodtgjørelse og visse utgifter for frivillige og tillitsvalgte som utfører oppdrag for klubben." },
  body: {
    no: [
      h2("Kjøregodtgjørelse"), block("Satsen følger Statens reiseregulativ. Kjøringen må godkjennes på forhånd. Skjema fås på klubbhuset eller ved å kontakte kasserer."),
      h2("Andre utgifter"), block("Kvittering leveres til kasserer innen 30 dager. Kasserer: Monica Engan Døhl, 990 06 484."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-medlemskap", _type: "flexiblePage", pageId: "medlemskap",
  title: { no: "Medlemskap" },
  intro: { no: "Meld deg inn via Min Idrett, betal medlemskontingenten og aksepter klubbens vedtekter. Du er da medlem!" },
  body: {
    no: [
      h2("Priser 2026"), block("Voksen: kr 800"), block("Ungdom (19–25 år): kr 400"), block("Barn (–18 år): kr 50"), block("Boplassleie Skansen: kr 750"), block("Boplassleie Østmarkneset: kr 600"),
      h2("Dette er inkludert"), block("Gratis lån av kajakk og utstyr til klubbaktiviteter"), block("Tilgang til alle turer og aktiviteter"), block("Vinterbassengtrening i Pirbadet"), block("Aktivt sosialt miljø"), block("Rabatter hos samarbeidspartnere"),
      h2("Krav til kvalifikasjoner"), block("NPF grunnkurs (16 timer, vått kort) kreves for sjø, elv og surfski. Flattvann, polo og junior kan starte uten kurs."),
      h2("Etter innmelding"), block("Send bilde av vått kort til godkjenning og registrer deg i Padleboken."),
    ],
  },
});

// recurringEvents
const recurringEvents = [
  { _id: "recurringEvent-sondagspadling", _type: "recurringEvent", title: { no: "Søndagspadling" }, dayOfWeek: "sunday", time: "12:00", discipline: "hav", location: "Skansen", sortOrder: 1, description: { no: "Fast søndagstur åpen for alle havpadlere med gyldig våttkort. Treffes på Skansen kl. 12:00." } },
  { _id: "recurringEvent-tirsdagspadling", _type: "recurringEvent", title: { no: "Padletrening / lavterskeltur" }, dayOfWeek: "tuesday", time: "18:00", discipline: "hav", location: "Skansen", sortOrder: 2, description: { no: "Tirsdagspadling er spesielt organisert for nybegynnere. Én aktivitetsleder per fem deltakere." } },
  { _id: "recurringEvent-rull-tull", _type: "recurringEvent", title: { no: "Rull & Tull" }, dayOfWeek: "friday", time: "18:00", discipline: "hav", location: "Skansen", sortOrder: 3, description: { no: "Rullekurs og uformell padling på fredager. Bra for å øve på eskimorulle og bli kjent med andre padlere." } },
];
docs.push(...recurringEvents);

// flexible pages - sub-pages from all content JSON files
const allSubPageContent = [
  ...havSubPages,
  ...elvSubPages,
  ...flattvannSubPages,
  ...juniorSubPages,
  ...klubbenExtra,
];
for (const page of allSubPageContent) {
  const bodyNo = page.sections.flatMap((s: { titleNo: string; bodyNo: string[] }) => [h2(s.titleNo), ...lines(s.bodyNo)]);
  docs.push({
    _id: `flexiblePage-${page.id}`,
    _type: "flexiblePage",
    pageId: page.id,
    title: { no: page.titleNo },
    intro: { no: page.introNo },
    body: { no: bodyNo },
  });
}

// flexible pages - padling extra (kurs, kom-i-gang, turledelse-hav)
for (const page of padlingExtra) {
  const bodyNo = page.sections.flatMap((s: { titleNo: string; bodyNo: string[] }) => [h2(s.titleNo), ...lines(s.bodyNo)]);
  docs.push({
    _id: `flexiblePage-${page.id}`,
    _type: "flexiblePage",
    pageId: page.id,
    title: { no: page.titleNo },
    intro: { no: page.introNo },
    body: { no: bodyNo },
  });
}

// Write NDJSON file
const outputPath = path.resolve(__dirname, "seed-content.ndjson");
const ndjson = docs.map(d => JSON.stringify(d)).join("\n");
fs.writeFileSync(outputPath, ndjson, "utf-8");

console.log(`Genererte ${docs.length} dokumenter → ${outputPath}`);
console.log("\nImporter (kun nye dokumenter — påvirker ikke eksisterende Studio-innhold):");
console.log("  npx sanity dataset import sanity/seed-content.ndjson --dataset production --missing");
console.log("\nBruk --replace kun hvis du bevisst vil overskrive innhold fra Studio:")
console.log("  npx sanity dataset import sanity/seed-content.ndjson --dataset production --replace");
