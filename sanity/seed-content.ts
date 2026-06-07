/**
 * Seed script: populates Sanity with initial content from i18n messages.
 * Run: npm run seed:sanity
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// --- helpers ---

let _seq = 0;
function key() {
  return `k${++_seq}`;
}

function block(text: string, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [] as unknown[],
    children: [{ _type: "span", _key: key(), text, marks: [] as string[] }],
  };
}

function heading(text: string) {
  return block(text, "h3");
}

function section(
  titleNo: string,
  titleEn: string,
  bodyNo: ReturnType<typeof block>[],
  bodyEn: ReturnType<typeof block>[]
) {
  return {
    _type: "object",
    _key: key(),
    title: { no: titleNo, en: titleEn },
    body: { no: bodyNo, en: bodyEn },
  };
}

// --- documents ---

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  heroTitle: {
    no: "Padleglede i Trondheim",
    en: "The Joy of Paddling in Trondheim",
  },
  heroSubtitle: {
    no: "Trondhjems Kajakklubb — et aktivt fellesskap for alle nivåer siden 1932",
    en: "Trondhjems Kajakklubb — an active community for all levels since 1932",
  },
  footerText: {
    no: "Trondhjems Kajakklubb — padle med oss",
    en: "Trondhjems Kajakklubb — paddle with us",
  },
  instagram: "https://www.instagram.com/trondhjemskajakklubb",
  facebook: "https://www.facebook.com/groups/trondhjemskajakklubb",
  visitingAddress: "Nedre Ila 12\n7018 Trondheim",
  postalAddress: "Trondhjems Kajakklubb\nNedre Ila 12\n7018 Trondheim",
  phone: "476 44 224",
  orgNr: "990 255 105",
};

const navLabels = {
  _id: "navLabels",
  _type: "navLabels",
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
};

// --- persons ---

const persons = [
  // Board (styre)
  {
    _id: "person-leder",
    _type: "person",
    name: "Leder TKK",
    role: { no: "Leder", en: "Chairperson" },
    group: "board",
    sortOrder: 1,
    phone: "476 44 224",
    email: "leder@tkk.no",
  },
  {
    _id: "person-nestleder",
    _type: "person",
    name: "Nestleder TKK",
    role: { no: "Nestleder", en: "Deputy chair" },
    group: "board",
    sortOrder: 2,
    phone: "",
    email: "nestleder@tkk.no",
  },
  {
    _id: "person-kasserer",
    _type: "person",
    name: "Monica Engan Døhl",
    role: { no: "Kasserer", en: "Treasurer" },
    group: "board",
    sortOrder: 3,
    phone: "990 06 484",
    email: "kasserer@tkk.no",
  },
  {
    _id: "person-isabelle",
    _type: "person",
    name: "Isabelle Sande",
    role: { no: "Politiattestansvarlig", en: "Criminal record coordinator" },
    group: "board",
    sortOrder: 4,
    phone: "902 99 808",
    email: "politiattest@tkk.no",
  },
  // Group leaders (gruppeledere)
  {
    _id: "person-frode",
    _type: "person",
    name: "Frode Vassenden",
    role: { no: "Gruppesjef Havpadling", en: "Sea Kayaking Group Leader" },
    group: "leaders",
    sortOrder: 1,
    phone: "414 10 163",
    email: "hav@tkk.no",
  },
  {
    _id: "person-oyvind",
    _type: "person",
    name: "Øyvind Inge Bakksjø",
    role: { no: "Gruppesjef Elvepadling", en: "River Kayaking Group Leader" },
    group: "leaders",
    sortOrder: 2,
    phone: "922 83 522",
    email: "elv@tkk.no",
  },
  {
    _id: "person-fernando",
    _type: "person",
    name: "Fernando J Perez-Fernandez",
    role: { no: "Gruppesjef Flattvann", en: "Flat Water Group Leader" },
    group: "leaders",
    sortOrder: 3,
    phone: "454 12 494",
    email: "flattvann@tkk.no",
  },
  {
    _id: "person-torleif",
    _type: "person",
    name: "Torleif Holm",
    role: { no: "Gruppesjef Surfski", en: "Surfski Group Leader" },
    group: "leaders",
    sortOrder: 4,
    phone: "977 53 020",
    email: "surfski@tkk.no",
  },
  {
    _id: "person-sofie",
    _type: "person",
    name: "Sofie Gradmann",
    role: { no: "Gruppesjef Kajakkpolo", en: "Kayak Polo Group Leader" },
    group: "leaders",
    sortOrder: 5,
    phone: "968 04 684",
    email: "polo@tkk.no",
  },
  {
    _id: "person-anders",
    _type: "person",
    name: "Anders Foldvik",
    role: { no: "Gruppesjef Junior", en: "Junior Group Leader" },
    group: "leaders",
    sortOrder: 6,
    phone: "402 03 036",
    email: "junior@tkk.no",
  },
  // Others
  {
    _id: "person-havard",
    _type: "person",
    name: "Håvard Dahlen",
    role: { no: "Sosialkoordinator", en: "Social coordinator" },
    group: "others",
    sortOrder: 1,
    phone: "970 79 822",
    email: "sosial@tkk.no",
  },
];

// --- discipline pages ---

const disciplinePages = [
  {
    _id: "disciplinePage-hav",
    _type: "disciplinePage",
    discipline: "hav",
    title: { no: "Havpadling", en: "Sea Kayaking" },
    tagline: {
      no: "~450 medlemmer, ukentlige turer og store sommerexpedisjoner",
      en: "~450 members, weekly tours and major summer expeditions",
    },
    intro: {
      no: "I havgruppa er trivsel og eventyrlyst i fokus. Med ~450 medlemmer tilbyr vi noe for alle — fra rolig søndagstur til ukes lange ekspedisjoner langs norskekysten.",
      en: "In the sea kayaking group, enjoyment and adventure are the focus. With ~450 members we offer something for everyone — from a relaxed Sunday tour to week-long expeditions along the Norwegian coast.",
    },
    body: {
      no: [
        heading("Lokal padling i Trondhjemsfjorden"),
        block("Vi registrerer rundt 3 000 padleturer i året fra to baser. Skansen er hjemmebasen med det historiske klubbhuset, utlånskajakkene og et godt sosialt miljø. Østmarkneset ved Ladekaia tilbyr padling i vakre omgivelser rett ved en populær restaurant. Begge stedene har utstyr til utlån for medlemmer."),
        heading("Faste turer hele sesongen"),
        block("Tirsdagspadling kl. 18:00 er åpen for nybegynnere og de som vil prøve havpadling for første gang. Søndagsturen kl. 12:00 er en tradisjon med matpause og sosialt samvær — passer for alle nivåer. Begge turene organiseres av frivillige og er inkludert i medlemskapet."),
        heading("Ekspedisjoner og sommeropplevelser"),
        block("Hvert år arrangerer vi ambisiøse sommerturer til destinasjoner som Lofoten, Kragerø, Helgeland og Bohuslän i Sverige. I 2022 gjennomførte vi tolv turer og en padlefestival. Turene varierer i lengde og vanskelighetsgrad slik at det alltid er noe for deg — enten du vil ha din første flerdag tur eller vil ta deg frem i krevende farvann."),
        heading("Utstyr og utrustning"),
        block("Som medlem kan du låne kajakk, padle, skjørt, flytevest og annet nødvendig utstyr til alle klubbaktiviteter uten ekstra kostnad. Det finnes kajakker for alle størrelser og ferdigheter. Det er også mulig å leie boplass for egen kajakk på Skansen eller Østmarkneset (venteliste)."),
        heading("Sikkerhet og kompetanse"),
        block("NPF grunnkurs (16 timer, vått kort) er påkrevd for å delta på turer og låne utstyr. Kurset gir deg grunnleggende ferdigheter i padleteknikk, kenterredning og sikkerhet på sjøen. TKK arrangerer egne kurs og teknikk kurs gjennom sesongen."),
      ],
      en: [
        heading("Local paddling in the Trondheim fjord"),
        block("We log around 3,000 paddle trips per year from two bases. Skansen is home base with the historic clubhouse, rental kayaks and a great social atmosphere. Østmarkneset near Ladekaia offers paddling in beautiful surroundings next to a popular restaurant. Both locations have equipment for members to borrow."),
        heading("Regular tours throughout the season"),
        block("Tuesday paddling at 18:00 is open to beginners and those trying sea kayaking for the first time. The Sunday tour at 12:00 is a tradition with a food break and social gathering — suitable for all levels. Both tours are organized by volunteers and included in your membership."),
        heading("Expeditions and summer adventures"),
        block("Every year we arrange ambitious summer trips to destinations like Lofoten, Kragerø, Helgeland and Bohuslän in Sweden. In 2022 we completed twelve trips and a paddling festival. Trips vary in length and difficulty so there is always something for you."),
        heading("Equipment"),
        block("As a member you can borrow a kayak, paddle, skirt, life jacket and other necessary equipment for all club activities at no extra cost. Kayaks are available for all sizes and skill levels. It is also possible to rent a storage space for your own kayak at Skansen or Østmarkneset (waiting list)."),
        heading("Safety and qualifications"),
        block("An NPF basic course (16 hours, wet card) is required to join tours and borrow equipment. The course gives you foundational skills in paddling technique, capsize rescue and safety at sea. TKK runs its own courses throughout the season."),
      ],
    },
  },
  {
    _id: "disciplinePage-elv",
    _type: "disciplinePage",
    discipline: "elv",
    title: { no: "Elvepadling", en: "River Kayaking" },
    tagline: {
      no: "Trening på Nidelva og turer til Sjoa, Trysil og Oppdal for alle nivåer",
      en: "Training on Nidelva and trips to Sjoa, Trysil and Oppdal for all levels",
    },
    intro: {
      no: "Elvepadling i TKK handler om spenning, naturopplevelser og godt kameratskap. Fra de rolige strykene på Nidelva til de pulserende rapidene i Sjoa — her er det noe for enhver smak og ferdighet.",
      en: "River kayaking in TKK is about excitement, nature experiences and great camaraderie. From the gentle rapids of Nidelva to the pulsating whitewater of Sjoa — there is something for every taste and skill level.",
    },
    body: {
      no: [
        heading("Nidelva — hjemmebanen vår"),
        block("Nidelva renner gjennom hjertet av Trondheim og er vår naturlige treningsbane. Elva byr på fine strekninger for nybegynnere, og vi holder ukentlige padleøkter her gjennom hele sesongen. Det er få byer i Norge som kan by på elvepaddling midt i sentrum."),
        heading("Turer for alle nivåer"),
        block("Vi arrangerer planlagte og spontane turer til noen av Norges beste elver: Sjoa med sine klassiske rapids, Trysil med variert vanskelighetsgrad, rolige strekninger ved Oppdal og mer avansert padling nordover mot Nordland. Turene er åpne for alle erfaringsnivåer."),
        heading("Vintertrening i Pirbadet"),
        block("Når elva fryser, flytter vi treningen innendørs til Pirbadet. Her jobber vi med teknikk, eskimorulle og balanse i trygge og varme omgivelser. Pirbadet-treningene er et sosialt høydepunkt i sesongen og et perfekt sted å lære seg rulle fra bunnen av."),
        heading("Slalomkajakk"),
        block("TKK har egne slalomkajakker og holder regelmessige slalomøkter. Slalom er en fin måte å bygge teknisk presisjonspadling på og gir deg et godt grunnlag for å takle krevende vann."),
        heading("Utstyr til utlån"),
        block("Vi låner ut elvekajakkene og alt nødvendig sikkerhetsutstyr — hjelm, flytevest og skjørt — til trening og tur for alle medlemmer. Grunnkurs i elvepadling er påkrevd for å låne utstyr og delta på turer."),
      ],
      en: [
        heading("Nidelva — our home river"),
        block("Nidelva runs through the heart of Trondheim and is our natural training ground. The river offers good stretches for beginners, and we hold weekly paddling sessions here throughout the season. Few cities in Norway offer river paddling right in the city centre."),
        heading("Tours for all levels"),
        block("We arrange planned and spontaneous trips to some of Norway's best rivers: Sjoa with its classic rapids, Trysil with varied difficulty levels, gentle stretches near Oppdal and more advanced paddling towards Nordland. Tours are open to all experience levels."),
        heading("Winter training at Pirbadet"),
        block("When the river freezes, we move training indoors to Pirbadet. Here we work on technique, Eskimo roll and balance in a safe and warm environment. Pirbadet sessions are a social highlight of the season."),
        heading("Slalom kayaking"),
        block("TKK has its own slalom kayaks and runs regular slalom sessions. Slalom is a great way to develop precise technical paddling skills."),
        heading("Equipment for loan"),
        block("We loan out river kayaks and all necessary safety equipment — helmet, life jacket and skirt — for training and tours. A basic river kayaking course is required to borrow equipment and join tours."),
      ],
    },
  },
  {
    _id: "disciplinePage-flattvann",
    _type: "disciplinePage",
    discipline: "flattvann",
    title: { no: "Flattvann", en: "Flat Water" },
    tagline: {
      no: "Onsdagstrening på Jonsvannet — konkurransepaddling for fartselskere",
      en: "Wednesday training on Jonsvannet — competitive paddling for speed enthusiasts",
    },
    intro: {
      no: "Flattvannsgruppa er en gjenoppliving av en stolt konkurransetradisjon i TKK — etter over 40 år i dvale er konkurransepadlingen tilbake. For deg som liker fart, teknikk og å presse egne grenser.",
      en: "The flat water group is a revival of a proud competitive tradition in TKK — after more than 40 years of dormancy, competitive paddling is back. For those who love speed, technique and pushing their limits.",
    },
    body: {
      no: [
        heading("Onsdagstrening på Jonsvannet"),
        block("Gjennom sommerhalvåret samles vi på Jonsvannet hver onsdag kl. 18:00 for strukturert trening. Jonsvannet er et stille og vakkert treningsvann utenfor Trondheim og gir perfekte forhold for fartstrening og teknikk."),
        heading("Hva er flattvannspaddling?"),
        block("Flattvannspaddling handler om å bevege seg raskt og effektivt på stille vann i spesialkonstruerte kajakkskrog designet for minimal vannmotstand. Disiplinen finnes i olympisk idrett og er en av de teknisk mest krevende grenene innen padling. Hos TKK er terskelen lav — vi tar imot alle som er nysgjerrige uansett erfaring."),
        heading("Spesialiserte skrog"),
        block("Flattvann- og surfski-kajakkene er radikalt annerledes enn havkajakkene du kanskje er vant til. Smale, lange og lynraske — men krever balanse og teknikk. Klubben har egne flattvannsbåter til utlån for trening."),
      ],
      en: [
        heading("Wednesday training at Jonsvannet"),
        block("During summer, we gather at Jonsvannet every Wednesday at 18:00 for structured training. Jonsvannet is a calm and beautiful training lake outside Trondheim, offering perfect conditions for speed training and technique."),
        heading("What is flat water paddling?"),
        block("Flat water paddling is about moving quickly and efficiently on calm water in specially designed kayak hulls built for minimal water resistance. The discipline is part of the Olympic programme and is one of the most technically demanding branches of paddling. At TKK the threshold is low — we welcome everyone regardless of experience."),
        heading("Specialised hulls"),
        block("Flat water and surfski kayaks are radically different from the sea kayaks you may be used to. Narrow, long and lightning fast — but they require balance and technique. The club has its own flat water boats available for training."),
      ],
    },
  },
  {
    _id: "disciplinePage-surfski",
    _type: "disciplinePage",
    discipline: "surfski",
    title: { no: "Surfski", en: "Surfski" },
    tagline: {
      no: "Åpent cockpit, bølgeridning og høy fart. Etablert 2023 med egne instruktører",
      en: "Open cockpit, wave riding and high speed. Established 2023 with dedicated instructors",
    },
    intro: {
      no: "Surfski er den perfekte kombinasjonen av havkayakkens rekkevidde og flattvannens fart — med den ekstra dimensjonen av bølgeridning. Etablert i TKK i juni 2023, og gruppa vokser raskt.",
      en: "Surfski is the perfect combination of the sea kayak's range and flat water speed — with the added dimension of wave riding. Established in TKK in June 2023, and the group is growing fast.",
    },
    body: {
      no: [
        heading("Hva er surfski?"),
        block("En surfski er en lang, smal og åpen kajakk opprinnelig utviklet i Sør-Afrika for havpadling i bølger. Det åpne cockpitet gjør det trygt å kantre og komme seg opp igjen, og den selvtømmende konstruksjonen betyr at det ikke samler seg vann. Vekt på 10–15 kg for komposittmodeller gjør dem lette å transportere og manøvrere."),
        heading("Fart og bølger"),
        block("Surfski er designet for å utnytte vind og bølger — teknikken kalles 'downwinding' og handler om å surfe fra topp til topp på bølger og la naturkreftene hjelpe deg fremover. Det er en unik og euforisk opplevelse som kombinerer kondisjons- og teknikkkrav på en særegen måte."),
        heading("Kurs og trening"),
        block("TKK har tre godkjente surfski-instruktører og egne klubbsurfskier til utlån for godkjente medlemmer. Kurs kjøres fra mai til september med begrenset antall plasser — meld deg på tidlig. Grunnopplæring etter NPF sitt system er obligatorisk før du får låne utstyr alene."),
        heading("Kom i gang"),
        block("Nybegynnere bør starte på bredere og mer stabile modeller. Etter hvert som teknikk og balanse utvikles, kan du gå over til smalere og raskere skrog. Det viktigste er å ikke gi opp etter de første kantringene — det hører med! Ta kontakt med gruppeleder Torleif for mer info."),
      ],
      en: [
        heading("What is surfski?"),
        block("A surfski is a long, narrow and open kayak originally developed in South Africa for sea paddling in waves. The open cockpit makes it safe to capsize and remount, and the self-draining design means water does not accumulate. Weighing 10–15 kg for composite models, they are easy to transport and manoeuvre."),
        heading("Speed and waves"),
        block("Surfski is designed to harness wind and waves — the technique is called 'downwinding' and is about surfing from crest to crest and letting nature's forces propel you forward. It is a unique and exhilarating experience that combines fitness and technique in a unique way."),
        heading("Courses and training"),
        block("TKK has three certified surfski instructors and club surfskis available for qualified members. Courses run from May to September with limited places — register early. Basic training following the NPF system is mandatory before borrowing equipment alone."),
        heading("Getting started"),
        block("Beginners should start on wider, more stable models. As technique and balance develop, you can move to narrower and faster hulls. The most important thing is not to give up after the first capsizes — they are part of the journey! Contact group leader Torleif for more info."),
      ],
    },
  },
  {
    _id: "disciplinePage-polo",
    _type: "disciplinePage",
    discipline: "polo",
    title: { no: "Kajakkpolo", en: "Kayak Polo" },
    tagline: {
      no: "Lagspill med kajakk og ball. Gull i NM 2016. Aktivt siden 2010",
      en: "Team sport with kayak and ball. National gold medal 2016. Active since 2010",
    },
    intro: {
      no: "Kajakkpolo er en lagidrett der to lag forsøker å score mål ved å kaste en ball i motstanderens hengekurv — fra kajakk. Det er intenst, taktisk og utrolig morsomt. TKK har hatt et aktivt poloteam siden 2010 og tok NM-gull i 2016.",
      en: "Kayak polo is a team sport where two teams try to score goals by throwing a ball into the opponent's suspended basket — from a kayak. It is intense, tactical and incredibly fun. TKK has had an active polo team since 2010 and won the national championship in 2016.",
    },
    body: {
      no: [
        heading("Hva er kajakkpolo?"),
        block("Kajakkpolo spilles på et avgrenset vannareal med to lag på fem spillere. Ballene kastes med hender eller flates — men du må alltid sitte i kajakken. Sporten krever en kombinasjon av padleteknikk, koordinasjon, lagtaktikk og rask beslutningstaking. Det er ingen andre idretter ganske som den."),
        heading("Trening gjennom hele året"),
        block("Om sommeren trener vi utendørs på Kyvannet, et lite og fint vann like utenfor Trondheim. Om vinteren flytter vi til Pirbadet for innendørstrening. Treningene er åpne for alle interesserte — ingen kajakk-erfaring kreves for å prøve! Vi har utstyr til nybegynnere."),
        heading("Kamper og turneringer"),
        block("TKK deltar i norske og internasjonale turneringer. Høydepunktet er det norske mesterskapet (NM) der TKK har hevdet seg i toppen. Å representere klubben i konkurranse er en stolthet for alle polospillere i TKK."),
        heading("Bli med på laget"),
        block("Er du nysgjerrig? Kom på trening — ingen erfaring kreves. Vi har kajakkene og utstyret klart. Ta kontakt via Facebook-gruppa 'Kajakkpolo i Trondheim' eller ring gruppelederen."),
      ],
      en: [
        heading("What is kayak polo?"),
        block("Kayak polo is played on a bounded water area with two teams of five players. The ball is thrown with hands or paddles — but you must always stay in the kayak. The sport requires a combination of paddling technique, coordination, team tactics and quick decision-making. There is no other sport quite like it."),
        heading("Year-round training"),
        block("In summer we train outdoors at Kyvannet, a small and beautiful lake just outside Trondheim. In winter we move to Pirbadet for indoor training. Sessions are open to all — no kayaking experience required to try! We have equipment for beginners."),
        heading("Matches and tournaments"),
        block("TKK participates in Norwegian and international tournaments. The highlight is the Norwegian championship where TKK has competed at the top. Representing the club in competition is a source of pride for all polo players in TKK."),
        heading("Join the team"),
        block("Curious? Come to training — no experience required. We have kayaks and equipment ready. Contact us via the Facebook group 'Kajakkpolo i Trondheim' or call the group leader."),
      ],
    },
  },
  {
    _id: "disciplinePage-junior",
    _type: "disciplinePage",
    discipline: "junior",
    title: { no: "Junior", en: "Junior" },
    tagline: {
      no: "For barn og unge 11–16 år. Trening hele året på vann og i Pirbadet",
      en: "For children and youth aged 11–16. Training year-round on water and in Pirbadet",
    },
    intro: {
      no: "Juniorprogrammet er et av TKKs mest populære tilbud. For barn og unge mellom 11 og 16 år tilbyr vi et trygt og aktivt miljø der padling, lek og naturopplevelser går hånd i hånd.",
      en: "The junior programme is one of TKK's most popular offerings. For children and young people aged 11 to 16 we offer a safe and active environment where paddling, play and nature experiences go hand in hand.",
    },
    body: {
      no: [
        heading("Et program for unge padlere"),
        block("Vi tror på å la unge mennesker oppleve naturen fra et unikt perspektiv — fra kajakk. Juniorprogrammet legger vekt på trygghet, mestring og fellesskap. Alle instruktørene har politiattest og erfaring med å jobbe med barn og unge."),
        heading("Sommer: mai til september"),
        block("Tirsdagstrening på Skansen, Kyvannet og Nidelva. Fokuset er på elvepaddling med gradvis progresjon — fra stille vann til enkle strykpartier. Vi tilpasser alltid treningen til deltakernes nivå og modighet. Flattvannstilbud finnes for de som ønsker det."),
        heading("Vinter: oktober til april"),
        block("Lørdagstrening i Pirbadet. Her jobber vi med grunnleggende teknikk, balanse og eskimorulle i basseng. Pirbadet-treningene er alltid populære og et fint sted å bli kjent med andre unge padlere i et trygt miljø."),
        heading("Turer og kurs for familier"),
        block("Vi arrangerer turer og kurs spesielt tilpasset barn, ungdom og familier gjennom hele sesongen. Turene er utformet slik at de passer for familier med ulike erfaringsnivåer, og er en flott måte å introdusere padling til hele familien på."),
        heading("Pris og påmelding"),
        block("Barnekontingent: kun kr 50 per år. Kontakt juniorlederen for påmelding og spørsmål."),
      ],
      en: [
        heading("A programme for young paddlers"),
        block("We believe in letting young people experience nature from a unique perspective — from a kayak. The junior programme emphasises safety, mastery and community. All instructors hold criminal record certificates and have experience working with children and young people."),
        heading("Summer: May to September"),
        block("Tuesday training at Skansen, Kyvannet and Nidelva. The focus is on river paddling with gradual progression — from calm water to easy rapids. We always adapt training to participants' level and confidence."),
        heading("Winter: October to April"),
        block("Saturday training at Pirbadet. Here we work on basic technique, balance and Eskimo roll in the pool. Pirbadet sessions are always popular and a great place to meet other young paddlers in a safe environment."),
        heading("Trips and courses for families"),
        block("We arrange trips and courses specifically adapted for children, youth and families throughout the season. Trips are designed to suit families with varying experience levels — a great way to introduce paddling to the whole family."),
        heading("Price and registration"),
        block("Junior membership: only NOK 50 per year. Contact the junior group leader for registration and questions."),
      ],
    },
  },
];

// --- flexible pages ---

const flexiblePages = [
  // HMS overview
  {
    _id: "flexiblePage-hms",
    _type: "flexiblePage",
    pageId: "hms",
    title: { no: "HMS", en: "H&S" },
    intro: {
      no: "Trondhjems Kajakklubb (TKK) er et idrettslag med ca. 500 medlemmer. Klubben har som mål å unngå hendelser som fører til skade på folk, miljø og utstyr.",
      en: "Trondhjems Kajakklubb (TKK) is a sports club with approximately 500 members. The club aims to prevent incidents that lead to injury to people, the environment and equipment.",
    },
    sections: [
      section(
        "Organisering og ansvar ved ledelse av aktivitet",
        "Organisation and responsibilities when leading activities",
        [block("Klubbens leder har det overordnede ansvaret for at alle sikkerhetsoppgaver er ivaretatt og fordelt. Alle padleaktiviteter krever en ansvarlig leder med tilstrekkelig kompetanse, vurdert etter Norges Padleforbunds våttkortstigen. Det kreves skriftlig risikoanalyse før aktiviteter.")],
        [block("The club's leader has overall responsibility for ensuring all safety tasks are assigned and fulfilled. All paddling activities require a responsible leader with sufficient competence, assessed according to the Norwegian Paddling Federation's wet card ladder. A written risk assessment is required before activities.")]
      ),
      section(
        "Retningslinjer for aktivitetsledere med barn",
        "Guidelines for activity leaders working with children",
        [block("Trenere, instruktører og aktivitetsledere som overnatter med barn skal ikke dele rom med et barn alene. Det skal alltid være minimum to voksne til stede på overnattingsturer med mindreårige. Foresatte skal kjenne til hvem som har ansvar for deres barn. Digital kommunikasjon skal skje via åpne klubbkanaler.")],
        [block("Coaches, instructors and activity leaders who overnight with children must not share a room alone with a child. There must always be a minimum of two adults present on overnight trips with minors. Parents must know who is responsible for their child. Digital communication must take place via open club channels.")]
      ),
      section(
        "Avviksrapportering",
        "Incident reporting",
        [block("Å trekke lærdom av ulykker og hendelser er en meget viktig del av HMS-arbeidet og det skal være lav terskel for å rapportere. Alle avvik skal rapporteres og behandles av styret. Ved alvorlige ulykker skal lederen varsles umiddelbart.")],
        [block("Learning from accidents and incidents is a very important part of health and safety work and the threshold for reporting should be low. All deviations must be reported and handled by the board. In the event of serious accidents the leader must be notified immediately.")]
      ),
      section(
        "Sporløs ferdsel og naturvern",
        "Leave no trace and nature conservation",
        [block("Det er en forventning til at klubbens medlemmer har forståelse for at enkelte padleaktiviteter kan påvirke miljøet negativt. Allemannsretten gir oss rettigheter vi bør sette pris på, men med medfølgende plikter. Særlig oppmerksomhet kreves i hekkesesongen.")],
        [block("Club members are expected to understand that certain paddling activities can negatively affect the environment. The right of public access gives us rights we should appreciate, but with accompanying duties. Particular attention is required during the nesting season.")]
      ),
      section(
        "Klubbutstyr",
        "Club equipment",
        [block("Klubbens utstyr som brukes i organiserte aktiviteter og lånes av medlemmer til egen aktivitet, skal jevnlig kontrolleres og vedlikeholdes av grensjefer. Skadet utstyr skal merkes og tas ut av bruk umiddelbart. Førstehjelpsutstyr vedlikeholdes av hussjef (kontrolleres to ganger årlig). VHF-radio kreves for turledere.")],
        [block("Club equipment used in organised activities and loaned to members for personal activities must be regularly inspected and maintained by group leaders. Damaged equipment must be labelled and taken out of use immediately. First aid equipment is maintained by the house manager (inspected twice yearly). VHF radio is required for tour leaders.")]
      ),
      section(
        "Beredskapsplan",
        "Emergency plan",
        [block("Ring 112/113 eller bruk VHF kanal 16 ved nødsituasjoner. Automatisk posisjonsrapportering anbefales. Klubbens ledelse skal varsles når situasjonen er under kontroll. Beredskapsplanen beskriver tiltakene som skal iverksettes for å redusere konsekvensene etter en hendelse.")],
        [block("Call 112/113 or use VHF channel 16 in emergencies. Automatic position reporting is recommended. Club leadership must be notified when the situation is under control. The emergency plan describes the measures to be implemented to reduce the consequences of an incident.")]
      ),
      section(
        "Politiattest",
        "Criminal record certificate",
        [block("Politiattest kreves for alle som er 16 år eller eldre og som skal arbeide med mindreårige eller sårbare personer i klubben. Se egen side for fremgangsmåte.")],
        [block("A criminal record certificate is required for everyone aged 16 or over who will work with minors or vulnerable persons in the club. See the dedicated page for the procedure.")]
      ),
      section(
        "Revisjon av HMS-planen",
        "Revision of the H&S plan",
        [block("HMS-planen revideres årlig på første styremøte etter årsmøtet.")],
        [block("The H&S plan is revised annually at the first board meeting after the annual general meeting.")]
      ),
    ],
  },
  // HMS Generelt
  {
    _id: "flexiblePage-hms-generelt",
    _type: "flexiblePage",
    pageId: "hms-generelt",
    title: { no: "Internkontroll", en: "Internal Control" },
    intro: {
      no: "Internkontrollsystemet sikrer at klubbens HMS-arbeid er systematisk, dokumentert og kontinuerlig forbedret.",
      en: "The internal control system ensures that the club's health and safety work is systematic, documented and continuously improved.",
    },
    sections: [
      section(
        "Internkontroll i TKK",
        "Internal control in TKK",
        [
          block("TKK følger kravene i Internkontrollforskriften. Internkontrollen omfatter alle organiserte aktiviteter og bruk av klubbens anlegg og utstyr. Ansvaret for internkontroll ligger hos styret, men alle tillitsvalgte og aktivitetsledere har et medansvar for at HMS-arbeidet fungerer i praksis."),
          block("Internkontrollen innebærer blant annet: kartlegging og vurdering av risikoforhold, skriftlige prosedyrer for risikoutsatte aktiviteter, opplæring av aktivitetsledere, systematisk registrering og oppfølging av avvik og hendelser, og jevnlig revisjon av HMS-planen."),
        ],
        [
          block("TKK follows the requirements of the Internal Control Regulations. The internal control covers all organised activities and use of the club's facilities and equipment. Responsibility for internal control lies with the board, but all elected officials and activity leaders share responsibility for ensuring the H&S work functions in practice."),
          block("Internal control includes: mapping and assessment of risk factors, written procedures for high-risk activities, training of activity leaders, systematic registration and follow-up of deviations and incidents, and regular revision of the H&S plan."),
        ]
      ),
    ],
  },
  // HMS Hav
  {
    _id: "flexiblePage-hms-hav",
    _type: "flexiblePage",
    pageId: "hms-hav",
    title: { no: "HMS Havpadling", en: "H&S Sea Kayaking" },
    intro: {
      no: "Retningslinjer og risikoanalyse for organisert havpadling i regi av Trondhjems Kajakklubb.",
      en: "Guidelines and risk assessment for organised sea kayaking under Trondhjems Kajakklubb.",
    },
    sections: [
      section(
        "Kompetansekrav",
        "Competency requirements",
        [block("Alle deltakere på fellespadling hav må ha godkjent padlekompetanse — Grunnkurs Hav eller tilsvarende (vått kort). Turledere vurderer kompetansenivå og kan avvise deltakere som ikke oppfyller kravene.")],
        [block("All participants in group sea paddling must have approved paddling competence — Basic Sea Course or equivalent (wet card). Tour leaders assess competence levels and may turn away participants who do not meet requirements.")]
      ),
      section(
        "Kollektivt ansvar",
        "Collective responsibility",
        [block("Alle har et kollektivt ansvar for gruppens sikkerhet. Ingen skal padle alene, og gruppen skal holdes samlet. Søndagsturer starter kl. 12:00 fra Skansen med planlagte ruter mot bl.a. Munkholmen.")],
        [block("Everyone has a collective responsibility for the group's safety. No one should paddle alone, and the group must be kept together. Sunday tours start at 12:00 from Skansen with planned routes to destinations including Munkholmen.")]
      ),
      section(
        "Båttrafikk og ferdsel",
        "Boat traffic and navigation",
        [block("Kryssing av hurtigbåtleia (20–37 knop) skal skje samlet som gruppe ved Ravnkloutløpet. Turledere skal overvåke båttrafikken kontinuerlig og varsle gruppen om fartøyer i nærheten.")],
        [block("Crossing the express boat lane (20–37 knots) must be done as a group at Ravnkloutløpet. Tour leaders must continuously monitor boat traffic and warn the group about nearby vessels.")]
      ),
      section(
        "Risikoanalyse",
        "Risk assessment",
        [block("Fire primære risikoer er identifisert: fysisk skade, drukning, hypotermi og medisinske tilstander. Forebyggende tiltak: godkjent padlekompetanse, vanntette klær, utstyrt kajakk med skjørt, værovervåking og bevissthet om båttrafikk.")],
        [block("Four primary risks have been identified: physical injury, drowning, hypothermia and medical conditions. Preventive measures: approved paddling competence, waterproof clothing, equipped kayak with skirt, weather monitoring and awareness of boat traffic.")]
      ),
      section(
        "Beredskap",
        "Emergency response",
        [block("Ved hendelse: gi førstehjelp og kontakt nødetatene (113 medisinsk, 112 politi). Hendelsen skal rapporteres til klubbens ledelse. Bruk VHF kanal 16 for maritim nødkommunikasjon.")],
        [block("In the event of an incident: provide first aid and contact emergency services (113 medical, 112 police). The incident must be reported to club leadership. Use VHF channel 16 for maritime emergency communication.")]
      ),
    ],
  },
  // HMS Elv
  {
    _id: "flexiblePage-hms-elv",
    _type: "flexiblePage",
    pageId: "hms-elv",
    title: { no: "HMS Elvepadling", en: "H&S River Kayaking" },
    intro: {
      no: "Retningslinjer og risikoanalyse for organisert elvepadling på Nidelven og andre elver.",
      en: "Guidelines and risk assessment for organised river kayaking on the Nidelva and other rivers.",
    },
    sections: [
      section(
        "Klubbpadling på Nidelven",
        "Club paddling on the Nidelva",
        [block("Nidelven er TKKs primære elvepadlingarena. Ukentlige treningsøkter holdes langs elva gjennom sesongen. Alle deltakere må ha minimum grunnkompetanse i elvepadling. Turledere er ansvarlige for risikovurdering før og under padlingen.")],
        [block("Nidelva is TKK's primary river paddling arena. Weekly training sessions are held along the river throughout the season. All participants must have minimum basic river paddling competence. Tour leaders are responsible for risk assessment before and during paddling.")]
      ),
      section(
        "Risikoanalyse Nidelven",
        "Risk assessment Nidelva",
        [block("Primære risikoer i elvepadling: innfanging i strøm, stryk og hindringer, hypotermi og drukning. Krav: hjelm og flytevest er obligatorisk. Alle kajakker skal ha for- og akterspyling. Gruppen skal aldri spre seg slik at kontroll mistes.")],
        [block("Primary risks in river paddling: entrapment in current, rapids and obstacles, hypothermia and drowning. Requirements: helmet and life jacket are mandatory. All kayaks must have bow and stern buoyancy. The group must never spread out so that control is lost.")]
      ),
      section(
        "Spontane turer med TKK-utstyr",
        "Spontaneous trips with TKK equipment",
        [block("For spontane turer med lånt TKK-utstyr: turlederen er ansvarlig for at alle deltakere har tilstrekkelig kompetanse og at utstyret er i orden. Turen registreres i Padleboken. Ved tvil om kompetanse eller forhold, avbryt turen.")],
        [block("For spontaneous trips with borrowed TKK equipment: the tour leader is responsible for ensuring all participants have sufficient competence and that the equipment is in order. The trip is registered in Padleboken. When in doubt about competence or conditions, cancel the trip.")]
      ),
    ],
  },
  // HMS Mitt varsel
  {
    _id: "flexiblePage-hms-mitt-varsel",
    _type: "flexiblePage",
    pageId: "hms-mitt-varsel",
    title: { no: "Mitt varsel", en: "Report a concern" },
    intro: {
      no: "Si fra når du opplever noe som er et brudd på vårt reglement, etiske leveregler og retningslinjer. Vi ønsker det skal være lav terskel for å si fra!",
      en: "Speak up when you experience something that violates our rules, ethical guidelines and policies. We want the threshold for reporting to be low!",
    },
    sections: [
      section(
        "Hva kan varsles?",
        "What can be reported?",
        [block("Du kan varsle om hendelser du selv har opplevd, vært vitne til eller hørt om: overgrep, vold, underslag av penger, trakassering, mobbing, juksing i konkurranser, rasistiske utrop, diskriminerende oppførsel.")],
        [block("You can report incidents you have experienced yourself, witnessed or heard about: abuse, violence, embezzlement of funds, harassment, bullying, cheating in competitions, racist remarks, discriminatory behaviour.")]
      ),
      section(
        "Slik varsler du",
        "How to report",
        [block("Varsling skjer via Norges Idrettsforbunds varslingsportal: idrettsforbundet.no/tema/varsling. Du kan også ta kontakt direkte med styret i TKK dersom du har spørsmål om fremgangsmåten.")],
        [block("Reporting is done via the Norwegian Confederation of Sports' reporting portal: idrettsforbundet.no/tema/varsling. You can also contact the TKK board directly if you have questions about the procedure.")]
      ),
    ],
  },
  // HMS Hendelsesrapporter
  {
    _id: "flexiblePage-hms-hendelsesrapporter",
    _type: "flexiblePage",
    pageId: "hms-hendelsesrapporter",
    title: { no: "Hendelsesrapporter", en: "Incident reports" },
    intro: {
      no: "Styret ønsker rapport om alle padlerelaterte hendelser, inkludert ulykker, nestenulykker og andre hendelser klubben kan lære av.",
      en: "The board requests reports on all paddling-related incidents, including accidents, near-misses and other events the club can learn from.",
    },
    sections: [
      section(
        "Slik rapporterer du",
        "How to report",
        [block("Bruk rapporteringsskjemaet via lenken nedenfor. Rapporten sendes direkte til styret og behandles på neste styremøte. Ved alvorlige ulykker skal leder kontaktes direkte.")],
        [block("Use the reporting form via the link below. The report is sent directly to the board and processed at the next board meeting. For serious accidents the leader must be contacted directly.")]
      ),
      section(
        "Rapporteringsskjema",
        "Reporting form",
        [block("Rapporter hendelse: https://forms.gle/xHHAakYQFtJ5Hzay9")],
        [block("Report an incident: https://forms.gle/xHHAakYQFtJ5Hzay9")]
      ),
      section(
        "Tidligere rapporterte hendelser",
        "Previously reported incidents",
        [block("Velt på fellestur til Knarrlaget — april 2024.")],
        [block("Capsize on group trip to Knarrlaget — April 2024.")]
      ),
    ],
  },
  // HMS Politiattest
  {
    _id: "flexiblePage-hms-politiattest",
    _type: "flexiblePage",
    pageId: "hms-politiattest",
    title: { no: "Politiattest", en: "Background check" },
    intro: {
      no: "Politiattest kreves for trenere, instruktører og ledere som skal ha direkte kontakt med mindreårige (under 18 år) eller mennesker med utviklingshemming.",
      en: "A criminal record certificate is required for coaches, instructors and leaders who will have direct contact with minors (under 18) or people with intellectual disabilities.",
    },
    sections: [
      section(
        "Hvem må levere?",
        "Who must submit?",
        [block("Trenere, instruktører og lagledere som skal ha direkte kontakt med mindreårige (personer under 18 år), eller mennesker med utviklingshemming, vil alltid være omfattet. Attesten må fornyes hvert tredje år ved ny rolle.")],
        [block("Coaches, instructors and team leaders who will have direct contact with minors (persons under 18) or people with intellectual disabilities are always covered. The certificate must be renewed every three years upon a new role.")]
      ),
      section(
        "Fremgangsmåte",
        "Procedure",
        [
          block("1. Ta kontakt med politiattestansvarlig i TKK med opplysninger om din rolle."),
          block("2. Ansvarlig bekrefter formålet digitalt og sender instruksjoner for søknad via Min idrett."),
          block("3. Attesten fremvises for ansvarlig — digitalt via Digipost er akseptert."),
          block("Politiattestansvarlig: Isabelle Sande, tlf. 902 99 808"),
        ],
        [
          block("1. Contact the criminal record certificate coordinator in TKK with information about your role."),
          block("2. The coordinator digitally confirms the purpose and sends instructions for applying via Min idrett."),
          block("3. The certificate is presented to the coordinator — digitally via Digipost is accepted."),
          block("Criminal record coordinator: Isabelle Sande, tel. 902 99 808"),
        ]
      ),
    ],
  },
  // Klubben Administrasjon
  {
    _id: "flexiblePage-klubben-administrasjon",
    _type: "flexiblePage",
    pageId: "klubben-administrasjon",
    title: { no: "Administrasjon", en: "Administration" },
    intro: {
      no: "Her finner du styrende dokumenter, protokoller fra årsmøter og styremøter, og annen administrativ informasjon om klubben.",
      en: "Here you will find governing documents, minutes from annual meetings and board meetings, and other administrative information about the club.",
    },
    sections: [
      section(
        "Årsmøter",
        "Annual general meetings",
        [block("Årsmøtet er klubbens høyeste organ og holdes hvert år i første kvartal. Her legges fremtidsplanen, budsjettet vedtas, og styret velges. Protokoller fra de siste års årsmøter er tilgjengelige på forespørsel — kontakt styret.")],
        [block("The annual general meeting is the club's highest authority and is held every year in the first quarter. Here the future plan is laid out, the budget is approved, and the board is elected. Minutes from recent annual meetings are available on request — contact the board.")]
      ),
      section(
        "Styremøter",
        "Board meetings",
        [block("Styret møtes jevnlig gjennom hele året for å lede klubbens daglige drift, økonomi og HMS. Protokoller fra styremøtene arkiveres og er tilgjengelige for medlemmer på forespørsel.")],
        [block("The board meets regularly throughout the year to manage the club's day-to-day operations, finances and H&S. Minutes from board meetings are archived and available to members on request.")]
      ),
      section(
        "Vedtekter og forretningsorden",
        "Bylaws and rules of procedure",
        [block("TKKs vedtekter er det styrende dokumentet for klubbens virksomhet. Forretningsplanen for 2026–2028 ble vedtatt på årsmøtet 2026 og legger føringene for strategi, bevaring og budsjett i perioden."), block("Stiftet 27. april 1932. Ta kontakt med styret for innsyn i dokumenter.")],
        [block("TKK's bylaws are the governing document for the club's activities. The business plan for 2026–2028 was adopted at the 2026 annual general meeting and sets the direction for strategy, conservation and budget for the period."), block("Founded 27 April 1932. Contact the board for access to documents.")]
      ),
    ],
  },
  // Klubben Klubbhus
  {
    _id: "flexiblePage-klubben-klubbhus",
    _type: "flexiblePage",
    pageId: "klubben-klubbhus",
    title: { no: "Klubbhus og eiendom", en: "Club house and facilities" },
    intro: {
      no: "TKK har to baser langs Trondhjemsfjorden med tilgang til vann, utstyrslager og sosiale fasiliteter.",
      en: "TKK has two bases along the Trondheim fjord with access to water, equipment storage and social facilities.",
    },
    sections: [
      section(
        "Skansen — hjemmebasen",
        "Skansen — home base",
        [block("Klubbhuset på Skansen ble åpnet 26. juni 1953 og er hjemstedet for Trondhjems Kajakklubb. Her finner du utlånskajakkene, lageret og de sosiale arenaene. Adressen er Nedre Ila 12, 7018 Trondheim.")],
        [block("The clubhouse at Skansen was opened on 26 June 1953 and is home to Trondhjems Kajakklubb. Here you will find the rental kayaks, storage and social areas. The address is Nedre Ila 12, 7018 Trondheim.")]
      ),
      section(
        "Østmarkneset",
        "Østmarkneset",
        [block("Østmarkneset ved Ladekaia er TKKs andre base med kajakkutstyr til utlån og en fantastisk beliggenhet rett ved vannet og en populær restaurant.")],
        [block("Østmarkneset near Ladekaia is TKK's second base with kayak equipment for loan and a fantastic location right by the water next to a popular restaurant.")]
      ),
      section(
        "Boplassleie",
        "Storage rental",
        [block("Medlemmer kan leie boplass for egen kajakk på begge baser. Priser for 2026: Skansen kr 750, Østmarkneset kr 600. Det er for øyeblikket venteliste.")],
        [block("Members can rent a storage space for their own kayak at both bases. 2026 prices: Skansen NOK 750, Østmarkneset NOK 600. There is currently a waiting list.")]
      ),
    ],
  },
  // Klubben Sosialgruppe
  {
    _id: "flexiblePage-klubben-sosialgruppe",
    _type: "flexiblePage",
    pageId: "klubben-sosialgruppe",
    title: { no: "Sosialgruppen", en: "Social group" },
    intro: {
      no: "Sosialgruppen jobber for trivsel og fellesskap blant klubbens medlemmer gjennom arrangementer og spontane aktiviteter gjennom hele året.",
      en: "The social group works to promote wellbeing and community among club members through events and spontaneous activities throughout the year.",
    },
    sections: [
      section(
        "Faste tradisjoner",
        "Regular traditions",
        [block("1. mai: AVPLASK markerer sesongstarten. Første søndag i advent: Adventpadling. Høst: Krabbe-kvelder. Før jul: Lutefiskmiddag.")],
        [block("1 May: AVPLASK marks the start of the season. First Sunday of Advent: Advent paddling. Autumn: Crab evenings. Before Christmas: Lutefisk dinner.")]
      ),
      section(
        "Spontane aktiviteter",
        "Spontaneous activities",
        [block("Gjennom sommeren arrangeres frokostpadlinger på varme morgener — gjerne til Munkholmen. Om høst og vinter arrangeres kvelds- og måneskinnsturer fra Skansen.")],
        [block("During summer, breakfast paddling trips are arranged on warm mornings — often to Munkholmen. In autumn and winter, evening and moonlight tours are arranged from Skansen.")]
      ),
      section(
        "Kontakt",
        "Contact",
        [block("Oppdateringer om spontane turer og arrangementer publiseres i klubbens Facebook-gruppe. Sosialkoordinator: Håvard Dahlen, 970 79 822.")],
        [block("Updates about spontaneous trips and events are published in the club's Facebook group. Social coordinator: Håvard Dahlen, 970 79 822.")]
      ),
    ],
  },
  // Klubben Støtteordninger
  {
    _id: "flexiblePage-klubben-stotteordninger",
    _type: "flexiblePage",
    pageId: "klubben-stotteordninger",
    title: { no: "Støtteordninger", en: "Support schemes" },
    intro: {
      no: "TKK har to vedtatte støtteordninger for medlemmer.",
      en: "TKK has two adopted support schemes for members.",
    },
    sections: [
      section(
        "Utdanningsstøtte",
        "Education support",
        [block("Støtte til medlemmer som ønsker å ta relevante kurs eller utdanning innen padling og sikkerhet. Søknad sendes til styret med beskrivelse av kurs, kostnad og relevans for klubbens virksomhet.")],
        [block("Support for members who wish to take relevant courses or training in paddling and safety. Applications are sent to the board with a description of the course, cost and relevance to the club's activities.")]
      ),
      section(
        "Støtte til konkurransepadling for unge",
        "Support for competitive paddling for youth",
        [block("TKK støtter unge padlere som ønsker å delta i konkurranser nasjonalt eller internasjonalt. Ordningen gjelder for medlemmer under 25 år. Søknad sendes til styret. Søknader sendes til styret på e-post eller leveres skriftlig på klubbhuset.")],
        [block("TKK supports young paddlers who wish to compete nationally or internationally. The scheme applies to members under 25 years old. Applications are sent to the board by email or submitted in writing at the clubhouse.")]
      ),
    ],
  },
  // Klubben Refusjon
  {
    _id: "flexiblePage-klubben-refusjon",
    _type: "flexiblePage",
    pageId: "klubben-refusjon",
    title: { no: "Refusjon", en: "Refunds" },
    intro: {
      no: "TKK refunderer kjøregodtgjørelse og visse utgifter for frivillige og tillitsvalgte som utfører oppdrag for klubben.",
      en: "TKK reimburses mileage allowance and certain expenses for volunteers and elected officials who carry out assignments for the club.",
    },
    sections: [
      section(
        "Kjøregodtgjørelse",
        "Mileage allowance",
        [block("Satsen følger Statens reiseregulativ. Kjøringen må godkjennes på forhånd av styret eller relevant gruppesjef. Skjema for utfylling fås på klubbhuset eller ved å kontakte kasserer.")],
        [block("The rate follows the Government's travel regulations. Driving must be approved in advance by the board or the relevant group leader. Forms are available at the clubhouse or by contacting the treasurer.")]
      ),
      section(
        "Andre utgifter",
        "Other expenses",
        [block("Kvittering for utgifter pådratt på vegne av klubben leveres til kasserer innen 30 dager. Manglende kvittering kan medføre at refusjon ikke innvilges. Kasserer: Monica Engan Døhl, 990 06 484.")],
        [block("Receipts for expenses incurred on behalf of the club must be submitted to the treasurer within 30 days. Missing receipts may result in reimbursement being denied. Treasurer: Monica Engan Døhl, 990 06 484.")]
      ),
    ],
  },
  // Medlemskap
  {
    _id: "flexiblePage-medlemskap",
    _type: "flexiblePage",
    pageId: "medlemskap",
    title: { no: "Medlemskap", en: "Membership" },
    intro: {
      no: "Meld deg inn via Min Idrett, betal medlemskontingenten og aksepter klubbens vedtekter. Du er da medlem!",
      en: "Register via Min Idrett, pay the membership fee and accept the club's bylaws. You are then a member!",
    },
    sections: [
      section(
        "Priser 2026",
        "2026 Prices",
        [
          block("Voksen: kr 800"),
          block("Ungdom (19–25 år): kr 400"),
          block("Barn (–18 år): kr 50"),
          block("Boplassleie Skansen: kr 750"),
          block("Boplassleie Østmarkneset: kr 600"),
        ],
        [
          block("Adult: NOK 800"),
          block("Youth (19–25 years): NOK 400"),
          block("Children (under 18): NOK 50"),
          block("Storage Skansen: NOK 750"),
          block("Storage Østmarkneset: NOK 600"),
        ]
      ),
      section(
        "Dette er inkludert",
        "What's included",
        [
          block("Gratis lån av kajakk og utstyr til klubbaktiviteter"),
          block("Tilgang til alle turer og aktiviteter"),
          block("Vinterbassengtrening i Pirbadet"),
          block("Aktivt sosialt miljø"),
          block("Rabatter hos samarbeidspartnere"),
        ],
        [
          block("Free loan of kayak and equipment for club activities"),
          block("Access to all tours and activities"),
          block("Winter pool training at Pirbadet"),
          block("Active social community"),
          block("Discounts from partner businesses"),
        ]
      ),
      section(
        "Krav til kvalifikasjoner",
        "Qualification requirements",
        [block("For å padle sjø, elv og surfski kreves NPF grunnkurs (16 timer, vått kort) før du kan låne utstyr eller delta på turer. Flattvann, polo og junior kan starte uten kurs, men må padle med instruktør inntil kvalifikasjon er oppnådd.")],
        [block("For sea, river and surfski paddling, an NPF basic course (16 hours, wet card) is required before borrowing equipment or joining tours. Flat water, polo and junior can start without a course but must paddle with an instructor until qualified.")]
      ),
      section(
        "Etter innmelding",
        "After joining",
        [block("Send bilde av vått kort til godkjenning og registrer deg i Padleboken før du deltar på turer eller låner utstyr.")],
        [block("Submit a photo of your wet card for approval and register in Padleboken before joining tours or borrowing equipment.")]
      ),
    ],
  },
];

// --- main ---

async function main() {
  console.log(`Connecting to project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);

  const transaction = client.transaction();

  transaction.createOrReplace(siteSettings);
  transaction.createOrReplace(navLabels);

  for (const person of persons) {
    transaction.createOrReplace(person);
  }

  for (const page of disciplinePages) {
    transaction.createOrReplace(page);
  }

  for (const page of flexiblePages) {
    transaction.createOrReplace(page);
  }

  const result = await transaction.commit();
  console.log(`\nFerdig! ${result.results.length} dokumenter opprettet/oppdatert:`);
  console.log(`  - 1 siteSettings`);
  console.log(`  - 1 navLabels`);
  console.log(`  - ${persons.length} person-dokumenter`);
  console.log(`  - ${disciplinePages.length} disiplinsider`);
  console.log(`  - ${flexiblePages.length} fleksible sider`);
  console.log("\nÅpne Studio for å se og redigere innholdet: http://localhost:3000/studio");
}

main().catch((err) => {
  console.error("Feil:", err.message);
  process.exit(1);
});
