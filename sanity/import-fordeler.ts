/**
 * Oppretter siden "Fordeler hos samarbeidspartnere" (/medlemskap/fordeler)
 * med innholdet fra den gamle nettsiden:
 *   https://tkk.no/medlemskap?view=article&id=9:rabatter&catid=14
 *
 * Partnerlogoene på forsiden lenker hit.
 *
 * Kjør: npx tsx sanity/import-fordeler.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

let _seq = 0;
const key = () => `k${++_seq}`;

function block(text: string, style: "normal" | "h2" = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function linkBlock(before: string, label: string, href: string, after: string) {
  const markKey = key();
  const external = href.startsWith("http");
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _key: markKey, _type: "link", linkType: "url", href, openInNewTab: external }],
    children: [
      { _type: "span", _key: key(), text: before, marks: [] },
      { _type: "span", _key: key(), text: label, marks: [markKey] },
      { _type: "span", _key: key(), text: after, marks: [] },
    ],
  };
}

const doc = {
  _id: "flexiblePage-medlemskap-fordeler",
  _type: "flexiblePage",
  pageId: "medlemskap-fordeler",
  section: "klubb",
  title: { no: "Fordeler hos samarbeidspartnere" },
  intro: {
    no: "Medlemmer i Trondhjems Kajakklubb får følgende fordeler hos våre samarbeidspartnere.",
  },
  body: {
    no: [
      block("VPG", "h2"),
      block("20 % på alle varer under kategorien padling på vpg.no, og 5 % på kajakker."),
      block(
        "Bruk rabattkoden som er sendt ut per e-post til alle medlemmer. Instrukser finnes i e-posten."
      ),
      linkBlock("Se utvalget på ", "vpg.no", "https://www.vpg.no", "."),

      block("Padlespesialisten", "h2"),
      block("15 % rabatt på hele sortimentet hele året — gjelder både kajakk og utstyr."),
      block(
        "Bruk rabattkoden som er sendt ut per e-post til alle medlemmer. Instrukser finnes i e-posten."
      ),
      linkBlock("Se utvalget på ", "padlespesialisten.no", "https://www.padlespesialisten.no", "."),

      block("Mangler du rabattkoden?", "h2"),
      linkBlock("Har du ikke mottatt rabattkoden på e-post, ", "ta kontakt med klubben", "/kontakt", "."),
    ],
  },
  seo: {
    metaTitle: { no: "Medlemsfordeler hos samarbeidspartnere" },
    metaDescription: {
      no: "Som medlem i Trondhjems Kajakklubb får du rabatt på padleutstyr og kajakk hos VPG og Padlespesialisten.",
    },
  },
};

async function main() {
  await client.createOrReplace(doc);
  console.log(`Opprettet/oppdaterte ${doc._id} — siden ligger på /medlemskap/fordeler.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
