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
  heroTitle: { no: "Padleglede i Trondheim", en: "The Joy of Paddling in Trondheim" },
  heroSubtitle: { no: "Trondhjems Kajakklubb — et aktivt fellesskap for alle nivåer siden 1932", en: "Trondhjems Kajakklubb — an active community for all levels since 1932" },
  footerText: { no: "Trondhjems Kajakklubb — padle med oss", en: "Trondhjems Kajakklubb — paddle with us" },
  instagram: "https://www.instagram.com/trondhjemskajakklubb",
  facebook: "https://www.facebook.com/groups/trondhjemskajakklubb",
  visitingAddress: "Nedre Ila 12\n7018 Trondheim",
  postalAddress: "Trondhjems Kajakklubb\nNedre Ila 12\n7018 Trondheim",
  phone: "476 44 224", orgNr: "990 255 105",
  partners: [
    { _type: "object", _key: key(), name: "Vertical Playground", url: "https://vpg.no", description: { no: "Klatresenter og friluftsutstyr i Trondheim", en: "Climbing centre and outdoor gear in Trondheim" } },
    { _type: "object", _key: key(), name: "Padlespesialisten", url: "https://www.padlespesialisten.no", description: { no: "Spesialist på padleutstyr", en: "Specialist in paddling equipment" } },
  ],
});

// navLabels
docs.push({
  _id: "navLabels", _type: "navLabels",
  home: { no: "Hjem", en: "Home" },
  activities: { no: "Aktiviteter", en: "Events" },
  disciplines: { no: "Padling", en: "Paddling" },
  seaKayaking: { no: "Havpadling", en: "Sea Kayaking" },
  riverKayaking: { no: "Elvepadling", en: "River Kayaking" },
  flatwater: { no: "Flattvann", en: "Flat Water" },
  surfski: { no: "Surfski", en: "Surfski" },
  polo: { no: "Kajakkpolo", en: "Kayak Polo" },
  junior: { no: "Junior", en: "Junior" },
  hms: { no: "HMS", en: "H&S" },
  hmsGeneral: { no: "Internkontroll", en: "Internal Control" },
  hmsSea: { no: "HMS Havpadling", en: "H&S Sea Kayaking" },
  hmsRiver: { no: "HMS Elvepadling", en: "H&S River Kayaking" },
  hmsAlert: { no: "Mitt varsel", en: "Report a concern" },
  hmsIncidents: { no: "Hendelsesrapporter", en: "Incident reports" },
  hmsCriminalRecord: { no: "Politiattest", en: "Background check" },
  club: { no: "Klubben", en: "The club" },
  clubAdmin: { no: "Administrasjon", en: "Administration" },
  clubhouse: { no: "Klubbhus og eiendom", en: "Club house" },
  socialGroup: { no: "Sosialgruppen", en: "Social group" },
  grants: { no: "Støtteordninger", en: "Support schemes" },
  reimbursement: { no: "Refusjon", en: "Refunds" },
  blog: { no: "Blogg", en: "Blog" },
  membership: { no: "Medlemskap", en: "Membership" },
  contact: { no: "Kontakt", en: "Contact" },
  login: { no: "Logg inn", en: "Log in" },
  profile: { no: "Min profil", en: "My profile" },
  logout: { no: "Logg ut", en: "Log out" },
  register: { no: "Registrer", en: "Register" },
});

// persons
const persons = [
  { _id: "person-leder", _type: "person", name: "Leder TKK", role: { no: "Leder", en: "Chairperson" }, group: "board", sortOrder: 1, phone: "476 44 224", email: "leder@tkk.no" },
  { _id: "person-nestleder", _type: "person", name: "Nestleder TKK", role: { no: "Nestleder", en: "Deputy chair" }, group: "board", sortOrder: 2, phone: "", email: "nestleder@tkk.no" },
  { _id: "person-kasserer", _type: "person", name: "Monica Engan Døhl", role: { no: "Kasserer", en: "Treasurer" }, group: "board", sortOrder: 3, phone: "990 06 484", email: "kasserer@tkk.no" },
  { _id: "person-isabelle", _type: "person", name: "Isabelle Sande", role: { no: "Politiattestansvarlig", en: "Criminal record coordinator" }, group: "board", sortOrder: 4, phone: "902 99 808", email: "politiattest@tkk.no" },
  { _id: "person-frode", _type: "person", name: "Frode Vassenden", role: { no: "Gruppesjef Havpadling", en: "Sea Kayaking Group Leader" }, group: "leaders", sortOrder: 1, phone: "414 10 163", email: "hav@tkk.no" },
  { _id: "person-oyvind", _type: "person", name: "Øyvind Inge Bakksjø", role: { no: "Gruppesjef Elvepadling", en: "River Kayaking Group Leader" }, group: "leaders", sortOrder: 2, phone: "922 83 522", email: "elv@tkk.no" },
  { _id: "person-fernando", _type: "person", name: "Fernando J Perez-Fernandez", role: { no: "Gruppesjef Flattvann", en: "Flat Water Group Leader" }, group: "leaders", sortOrder: 3, phone: "454 12 494", email: "flattvann@tkk.no" },
  { _id: "person-torleif", _type: "person", name: "Torleif Holm", role: { no: "Gruppesjef Surfski", en: "Surfski Group Leader" }, group: "leaders", sortOrder: 4, phone: "977 53 020", email: "surfski@tkk.no" },
  { _id: "person-sofie", _type: "person", name: "Sofie Gradmann", role: { no: "Gruppesjef Kajakkpolo", en: "Kayak Polo Group Leader" }, group: "leaders", sortOrder: 5, phone: "968 04 684", email: "polo@tkk.no" },
  { _id: "person-anders", _type: "person", name: "Anders Foldvik", role: { no: "Gruppesjef Junior", en: "Junior Group Leader" }, group: "leaders", sortOrder: 6, phone: "402 03 036", email: "junior@tkk.no" },
  { _id: "person-havard", _type: "person", name: "Håvard Dahlen", role: { no: "Sosialkoordinator", en: "Social coordinator" }, group: "others", sortOrder: 1, phone: "970 79 822", email: "sosial@tkk.no" },
];
docs.push(...persons);

// discipline pages - generated from discipline-content.json
for (const d of disciplineContent) {
  docs.push({
    _id: `disciplinePage-${d.discipline}`,
    _type: "disciplinePage",
    discipline: d.discipline,
    title: { no: d.titleNo, en: d.titleEn },
    tagline: { no: d.taglineNo, en: d.taglineEn },
    intro: { no: d.introNo, en: d.introEn },
    body: { no: lines(d.bodyNo), en: lines(d.bodyEn) },
    subPageLinks: d.subPageLinks.map(l => ({
      _type: "object",
      _key: key(),
      title: { no: l.titleNo, en: l.titleEn },
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
    title: { no: page.titleNo, en: page.titleNo },
    intro: { no: page.introNo, en: page.introNo },
    body: { no: bodyNo, en: bodyNo },
  });
}

docs.push({
  _id: "flexiblePage-hms-mitt-varsel", _type: "flexiblePage", pageId: "hms-mitt-varsel",
  title: { no: "Mitt varsel", en: "Report a concern" },
  intro: { no: "Si fra når du opplever noe som er et brudd på vårt reglement, etiske leveregler og retningslinjer. Vi ønsker det skal være lav terskel for å si fra!", en: "Speak up when you experience something that violates our regulations, ethical guidelines and policies. We want the threshold for reporting to be low!" },
  body: {
    no: [
      h2("Hva kan varsles?"),
      block("Du kan varsle om hendelser du selv har opplevd, vært vitne til eller hørt om: overgrep, vold, underslag av penger, trakassering, mobbing, juksing i konkurranser, rasistiske utrop, diskriminerende oppførsel."),
      h2("Slik varsler du"),
      block("Varsling skjer via Norges Idrettsforbunds varslingsportal. Du kan også ta kontakt direkte med styret i TKK dersom du har spørsmål om fremgangsmåten."),
      block("Varsle via Idrettsforbundet: https://www.idrettsforbundet.no/tema/varsling/"),
    ],
    en: [
      h2("What can be reported?"),
      block("You can report incidents you have experienced, witnessed or heard about: abuse, violence, embezzlement, harassment, bullying, cheating in competitions, racist remarks, discriminatory behaviour."),
      h2("How to report"),
      block("Reporting is done via the Norwegian Sports Federation's whistleblowing portal. You can also contact the TKK board directly if you have questions about the procedure."),
      block("Report via the Sports Federation: https://www.idrettsforbundet.no/tema/varsling/"),
    ],
  },
});

docs.push({
  _id: "flexiblePage-hms-hendelsesrapporter", _type: "flexiblePage", pageId: "hms-hendelsesrapporter",
  title: { no: "Hendelsesrapporter", en: "Incident reports" },
  intro: { no: "Styret ønsker rapport om alle padlerelaterte hendelser, inkludert ulykker, nestenulykker og andre hendelser klubben kan lære av.", en: "The board welcomes reports about all paddling-related incidents, including accidents, near-misses and other events from which the club can learn." },
  body: {
    no: [
      h2("Slik rapporterer du"),
      block("Bruk rapporteringsskjemaet under. Rapporten sendes direkte til styret og behandles på neste styremøte. Ved alvorlige ulykker skal leder kontaktes direkte."),
      block("RAPPORTER HENDELSE HER: https://forms.gle/xHHAakYQFtJ5Hzay9"),
      h2("Tidligere rapporterte hendelser"),
      block("Velt på fellestur til Knarrlaget — april 2024"),
    ],
    en: [
      h2("How to report"),
      block("Use the reporting form below. The report is sent directly to the board and handled at the next board meeting. In the event of serious accidents, the club leader must be contacted directly."),
      block("REPORT AN INCIDENT HERE: https://forms.gle/xHHAakYQFtJ5Hzay9"),
      h2("Previously reported incidents"),
      block("Capsize on group tour to Knarrlaget — April 2024"),
    ],
  },
});

docs.push({
  _id: "flexiblePage-hms-politiattest", _type: "flexiblePage", pageId: "hms-politiattest",
  title: { no: "Politiattest", en: "Background check certificate" },
  intro: { no: "Politiattest kreves for trenere, instruktører og ledere som skal ha direkte kontakt med mindreårige (under 18 år) eller mennesker med utviklingshemming.", en: "A background check certificate (politiattest) is required for coaches, instructors and leaders who will have direct contact with minors (under 18) or people with developmental disabilities." },
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
    en: [
      h2("Who must submit?"),
      block("Coaches, instructors and team leaders who will have direct contact with minors (persons under 18) or people with developmental disabilities are always covered. The certificate must be renewed every three years when taking on a new role."),
      h2("Procedure"),
      block("1. Contact TKK's background check coordinator with details of your role."),
      block("2. The coordinator confirms the purpose digitally and sends instructions for application via Min idrett."),
      block("3. The certificate is shown to the coordinator — digital presentation via Digipost is accepted."),
      block("Background check coordinator: Isabelle Sande, 902 99 808"),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-administrasjon", _type: "flexiblePage", pageId: "klubben-administrasjon",
  title: { no: "Administrasjon", en: "Administration" },
  intro: { no: "Her finner du styrende dokumenter, protokoller fra årsmøter og styremøter, og annen administrativ informasjon om klubben.", en: "Here you will find governing documents, minutes from annual meetings and board meetings, and other administrative information." },
  body: {
    no: [
      h2("Årsmøter"), block("Årsmøtet holdes hvert år i første kvartal. Her legges fremtidsplanen, budsjettet vedtas, og styret velges. Protokoller er tilgjengelige på forespørsel."),
      h2("Styremøter"), block("Styret møtes jevnlig gjennom hele året for å lede klubbens daglige drift, økonomi og HMS."),
      h2("Vedtekter"), block("TKKs vedtekter er det styrende dokumentet for klubbens virksomhet. Stiftet 27. april 1932. Ta kontakt med styret for innsyn i dokumenter."),
    ],
    en: [
      h2("Annual general meetings"), block("The annual general meeting is held every year in the first quarter. Here the future plan is laid out, the budget approved, and the board elected. Minutes are available on request."),
      h2("Board meetings"), block("The board meets regularly throughout the year to manage the club's day-to-day operations, finances and H&S."),
      h2("Bylaws"), block("TKK's bylaws are the governing document for the club. Founded 27 April 1932. Contact the board for access to documents."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-klubbhus", _type: "flexiblePage", pageId: "klubben-klubbhus",
  title: { no: "Klubbhus og eiendom", en: "Club house and facilities" },
  intro: { no: "TKK har to baser langs Trondhjemsfjorden med tilgang til vann, utstyrslager og sosiale fasiliteter.", en: "TKK has two bases along the Trondheim fjord with access to water, equipment storage and social facilities." },
  body: {
    no: [
      h2("Skansen — hjemmebasen"), block("Klubbhuset på Skansen ble åpnet 26. juni 1953. Her finner du utlånskajakkene, lageret og de sosiale arenaene. Adresse: Nedre Ila 12, 7018 Trondheim."),
      h2("Østmarkneset"), block("Østmarkneset ved Ladekaia er TKKs andre base med kajakkutstyr til utlån og en fantastisk beliggenhet rett ved vannet."),
      h2("Boplassleie"), block("Priser 2026: Skansen kr 750, Østmarkneset kr 600. Det er for øyeblikket venteliste."),
    ],
    en: [
      h2("Skansen — home base"), block("The clubhouse at Skansen was opened on 26 June 1953. Here you will find the rental kayaks, storage and social areas. Address: Nedre Ila 12, 7018 Trondheim."),
      h2("Østmarkneset"), block("Østmarkneset near Ladekaia is TKK's second base with kayak equipment for loan and a fantastic location right by the water."),
      h2("Storage rental"), block("2026 prices: Skansen NOK 750, Østmarkneset NOK 600. There is currently a waiting list."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-sosialgruppe", _type: "flexiblePage", pageId: "klubben-sosialgruppe",
  title: { no: "Sosialgruppen", en: "Social group" },
  intro: { no: "Sosialgruppen jobber for trivsel og fellesskap gjennom arrangementer og spontane aktiviteter gjennom hele året.", en: "The social group works to promote wellbeing and community through events and spontaneous activities throughout the year." },
  body: {
    no: [
      h2("Faste tradisjoner"), block("1. mai: AVPLASK. Første søndag i advent: Adventpadling. Høst: Krabbe-kvelder. Før jul: Lutefiskmiddag."),
      h2("Kontakt"), block("Oppdateringer publiseres i klubbens Facebook-gruppe. Sosialkoordinator: Håvard Dahlen, 970 79 822."),
    ],
    en: [
      h2("Regular traditions"), block("1 May: AVPLASK. First Sunday of Advent: Advent paddling. Autumn: Crab evenings. Before Christmas: Lutefisk dinner."),
      h2("Contact"), block("Updates are published in the club's Facebook group. Social coordinator: Håvard Dahlen, 970 79 822."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-stotteordninger", _type: "flexiblePage", pageId: "klubben-stotteordninger",
  title: { no: "Støtteordninger", en: "Support schemes" },
  intro: { no: "TKK har to vedtatte støtteordninger for medlemmer.", en: "TKK has two adopted support schemes for members." },
  body: {
    no: [
      h2("Utdanningsstøtte"), block("Støtte til relevante kurs eller utdanning innen padling og sikkerhet. Søknad sendes til styret med beskrivelse av kurs, kostnad og relevans."),
      h2("Støtte til konkurransepadling for unge"), block("TKK støtter unge padlere (under 25 år) som ønsker å delta i konkurranser nasjonalt eller internasjonalt."),
    ],
    en: [
      h2("Education support"), block("Support for relevant courses or training in paddling and safety. Applications are sent to the board with a description of the course, cost and relevance."),
      h2("Support for competitive paddling"), block("TKK supports young paddlers (under 25) who wish to compete nationally or internationally."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-klubben-kjoregodtgjorelse", _type: "flexiblePage", pageId: "klubben-kjoregodtgjorelse",
  title: { no: "Kjøregodtgjørelse", en: "Mileage allowance" },
  intro: { no: "TKK refunderer kjøregodtgjørelse og visse utgifter for frivillige og tillitsvalgte som utfører oppdrag for klubben.", en: "TKK reimburses mileage allowance and certain expenses for volunteers who carry out assignments for the club." },
  body: {
    no: [
      h2("Kjøregodtgjørelse"), block("Satsen følger Statens reiseregulativ. Kjøringen må godkjennes på forhånd. Skjema fås på klubbhuset eller ved å kontakte kasserer."),
      h2("Andre utgifter"), block("Kvittering leveres til kasserer innen 30 dager. Kasserer: Monica Engan Døhl, 990 06 484."),
    ],
    en: [
      h2("Mileage allowance"), block("The rate follows the Government's travel regulations. Driving must be approved in advance. Forms are available at the clubhouse or from the treasurer."),
      h2("Other expenses"), block("Receipts must be submitted to the treasurer within 30 days. Treasurer: Monica Engan Døhl, 990 06 484."),
    ],
  },
});

docs.push({
  _id: "flexiblePage-medlemskap", _type: "flexiblePage", pageId: "medlemskap",
  title: { no: "Medlemskap", en: "Membership" },
  intro: { no: "Meld deg inn via Min Idrett, betal medlemskontingenten og aksepter klubbens vedtekter. Du er da medlem!", en: "Register via Min Idrett, pay the membership fee and accept the club's bylaws. You are then a member!" },
  body: {
    no: [
      h2("Priser 2026"), block("Voksen: kr 800"), block("Ungdom (19–25 år): kr 400"), block("Barn (–18 år): kr 50"), block("Boplassleie Skansen: kr 750"), block("Boplassleie Østmarkneset: kr 600"),
      h2("Dette er inkludert"), block("Gratis lån av kajakk og utstyr til klubbaktiviteter"), block("Tilgang til alle turer og aktiviteter"), block("Vinterbassengtrening i Pirbadet"), block("Aktivt sosialt miljø"), block("Rabatter hos samarbeidspartnere"),
      h2("Krav til kvalifikasjoner"), block("NPF grunnkurs (16 timer, vått kort) kreves for sjø, elv og surfski. Flattvann, polo og junior kan starte uten kurs."),
      h2("Etter innmelding"), block("Send bilde av vått kort til godkjenning og registrer deg i Padleboken."),
    ],
    en: [
      h2("2026 Prices"), block("Adult: NOK 800"), block("Youth (19–25 years): NOK 400"), block("Children (under 18): NOK 50"), block("Storage Skansen: NOK 750"), block("Storage Østmarkneset: NOK 600"),
      h2("What's included"), block("Free loan of kayak and equipment for club activities"), block("Access to all tours and activities"), block("Winter pool training at Pirbadet"), block("Active social community"), block("Discounts from partner businesses"),
      h2("Qualification requirements"), block("An NPF basic course (16 hours, wet card) is required for sea, river and surfski. Flat water, polo and junior can start without a course."),
      h2("After joining"), block("Submit a photo of your wet card for approval and register in Padleboken."),
    ],
  },
});

// recurringEvents
const recurringEvents = [
  { _id: "recurringEvent-sondagspadling", _type: "recurringEvent", title: { no: "Søndagspadling", en: "Sunday paddling" }, dayOfWeek: "sunday", time: "12:00", discipline: "hav", location: "Skansen", sortOrder: 1, description: { no: "Fast søndagstur åpen for alle havpadlere med gyldig våttkort. Treffes på Skansen kl. 12:00.", en: "Regular Sunday tour open to all sea kayakers with a valid wet card. Meet at Skansen at 12:00." } },
  { _id: "recurringEvent-tirsdagspadling", _type: "recurringEvent", title: { no: "Padletrening / lavterskeltur", en: "Paddling training / easy tour" }, dayOfWeek: "tuesday", time: "18:00", discipline: "hav", location: "Skansen", sortOrder: 2, description: { no: "Tirsdagspadling er spesielt organisert for nybegynnere. Én aktivitetsleder per fem deltakere.", en: "Tuesday paddling is specially organised for beginners. One activity leader per five participants." } },
  { _id: "recurringEvent-rull-tull", _type: "recurringEvent", title: { no: "Rull & Tull", en: "Roll & Fun" }, dayOfWeek: "friday", time: "18:00", discipline: "hav", location: "Skansen", sortOrder: 3, description: { no: "Rullekurs og uformell padling på fredager. Bra for å øve på eskimorulle og bli kjent med andre padlere.", en: "Roll training and informal paddling on Fridays. Great for practising Eskimo roll and meeting other paddlers." } },
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
    title: { no: page.titleNo, en: page.titleNo },
    intro: { no: page.introNo, en: page.introNo },
    body: { no: bodyNo, en: bodyNo },
  });
}

// flexible pages - padling extra (kurs, kom-i-gang, turledelse-hav)
for (const page of padlingExtra) {
  const bodyNo = page.sections.flatMap((s: { titleNo: string; bodyNo: string[] }) => [h2(s.titleNo), ...lines(s.bodyNo)]);
  docs.push({
    _id: `flexiblePage-${page.id}`,
    _type: "flexiblePage",
    pageId: page.id,
    title: { no: page.titleNo, en: page.titleNo },
    intro: { no: page.introNo, en: page.introNo },
    body: { no: bodyNo, en: bodyNo },
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
