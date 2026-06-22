/**
 * Creates the new flexiblePage "klubben-stotte-konkurransepadling"
 * (Støtte til konkurransepadling for unge padlere), scraped verbatim
 * from the old site.
 *
 * Run: npx tsx sanity/import-konkurransestotte.ts
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

function block(text: string, style: "normal" | "h3" = "normal") {
  return { _type: "block", _key: key(), style, markDefs: [], children: [{ _type: "span", _key: key(), text, marks: [] }] };
}
function bullet(text: string) {
  return block(`• ${text}`);
}

const body = [
  block("Vedtatt på styremøte 26.09.2023."),
  block("Målsetning", "h3"),
  block("TKK ønsker å gjøre konkurransepadling mer tilgjengelig for unge padlere uavhengig av økonomi, og slik bidra til mer padleglede for unge. Målsetningen er å rekruttere flere unge til sporten og bidra til talentutvikling. Dette vil også kunne støtte klubbens omdømme i ungdomsmiljøet."),
  block("Hva kan det søkes om støtte til?", "h3"),
  bullet("Påmeldingsavgift og akkreditering"),
  bullet("Reise og opphold"),
  block("Søknadskriterier", "h3"),
  bullet("Maksimalt 2000 kroner per arrangement"),
  bullet("Utøveren er medlem i Trondhjems Kajakklubb."),
  bullet("Utøveren deltar i en konkurranse som er i regi av NIF eller en klubb under NIF, eventuelt for et landslag."),
  bullet("Konkurransen finner sted senest året utøveren fyller 23 år."),
  bullet("Utøveren må representere TKK eller landslag i påmelding."),
  bullet("Utøvere over 16 år: Utøver er villig til å bidra tilbake til TKK enten ved å lage en oppsummering (tekst) fra konkurransen inkludert bilder som kan brukes på TKKs nettsider og i sosiale medier, holde et kort foredrag om sin padlegren ved en senere anledning, eller bidra på en trening med unge padlere, eller i klubbens rekrutteringsarbeid."),
  block("Slik søker man", "h3"),
  bullet("Bruk søknadsskjema «Refusjonsskjema» under «Skjemaer» på TKK.no."),
  bullet("Marker skjemaet med «Konkurransestøtte»."),
  bullet("Skriv tydelig hva søknaden gjelder. Legg ved bilag/kvittering for alle utlegg."),
  bullet("Send til trondhjemskajakklubb@ebilag.com"),
  bullet("For utøvere under 18 år skal foresatt søke på vegne av utøveren."),
  bullet("Frist for søknad er 1. desember. Dersom konkurransen er så sent på året at dette ikke er mulig å nå, ta kontakt med grensjef for en individuell avtale."),
  block("Søknadsprosessen", "h3"),
  bullet("Grensjef fordeler støtte ut ifra budsjett som vedtas på årsmøtet og godkjenner i regnskapssystemet."),
  bullet("Kasserer betaler ut til søkers konto."),
  bullet("Dersom det er usikkerhet for om budsjettet vil dekke årets totale søknader kan deler av støtten holdes igjen til årets slutt (01.12). Grensjef kan da bestemme om resterende midler deles ut eller overføres til neste år."),
];

async function main() {
  await client.createIfNotExists({
    _id: "flexiblePage-klubben-stotte-konkurransepadling",
    _type: "flexiblePage",
    pageId: "klubben-stotte-konkurransepadling",
    section: "klubb",
  });
  await client.patch("flexiblePage-klubben-stotte-konkurransepadling").set({
    title: { no: "Støtte til konkurransepadling for unge" },
    section: "klubb",
    intro: { no: "TKK støtter unge padlere (under 25 år) som ønsker å delta i konkurranser nasjonalt eller internasjonalt." },
    body: { no: body },
  }).commit();
  console.log(`klubben-stotte-konkurransepadling: ${body.length} blokker`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
