/**
 * Oppretter en redigerbar flexiblePage for /om-klubben (fantes ikke i Sanity
 * fra før — siden var helt hardkodet), og lenker opp alle undersidene som
 * allerede fantes i Sanity med slug "om-klubben/..." men som ikke var
 * koblet til fra noe sted (subPageLinks manglet). Legger også til
 * "Utmerkelser" i subPageLinks på Sosialgruppen-siden, som var i samme
 * situasjon (publisert, men uten innkommende lenke).
 *
 * Opprettes/oppdateres som KLADDER (drafts.*) for gjennomgang i Studio før
 * publisering.
 *
 * Run: npx tsx sanity/import-om-klubben.ts
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

let _seq = 0;
const key = () => `omk${++_seq}`;

function textBlock(text: string, style: "normal" | "h2" | "h3" = "normal") {
  return {
    _type: "block" as const,
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
  };
}

function subPageLink(title: string, href: string) {
  return { _key: key(), _type: "object", title: { no: title }, href };
}

async function createOmKlubben() {
  const draftId = "drafts.flexiblePage-om-klubben";
  await client.createOrReplace({
    _id: draftId,
    _type: "flexiblePage",
    slug: { _type: "slug", current: "om-klubben" },
    section: "klubb",
    title: { no: "Om klubben" },
    intro: {
      no: "Trondhjems Kajakklubb er en av Norges største kajakklubber, med rundt 500 medlemmer og seks aktive grener.",
    },
    body: {
      no: [
        textBlock("Våre verdier", "h2"),
        textBlock("Trivsel, eventyrlyst og inkludering. Vi tar vare på hverandre på vannet og på land."),
        textBlock("Slik driftes klubben", "h2"),
        textBlock("Klubben styres av en organisasjonsplan som vedtas av årsmøtet, og av klubbens vedtekter."),
      ],
    },
    subPageLinks: [
      subPageLink("Organisasjonsplanen", "/om-klubben/organisasjonsplanen"),
      subPageLink("Vedtektene", "/om-klubben/vedtektene"),
      subPageLink("Klubbdrift", "/om-klubben/klubbdrift"),
      subPageLink("Klubbhus og eiendom", "/om-klubben/klubbhus"),
      subPageLink("Skjemaer", "/om-klubben/skjemaer"),
      subPageLink("Kjøregodtgjørelse", "/om-klubben/kjoregodtgjorelse"),
      subPageLink("Huskalender", "/om-klubben/huskalender"),
      subPageLink("Sosialgruppen", "/om-klubben/sosialgruppe"),
      subPageLink("Støtteordninger", "/om-klubben/stotteordninger"),
      subPageLink("Støtte til konkurransepadling for unge", "/om-klubben/stotte-konkurransepadling"),
    ],
  });
  console.log(`Lagret som kladd: ${draftId}`);
}

function stripSystemFields(doc: Record<string, unknown>) {
  const clone: Record<string, unknown> = { ...doc };
  delete clone._rev;
  delete clone._createdAt;
  delete clone._updatedAt;
  // Migration-script-only helper: the stripped clone still has `_id`/`_type`
  // from the source doc at runtime, but TS can't track that through `delete`.
  return clone as { _id: string; _type: string } & Record<string, unknown>;
}

async function linkUtmerkelserFromSosialgruppe() {
  const id = "flexiblePage-klubben-sosialgruppe";
  const published = await client.getDocument(id);
  if (!published) throw new Error(`Fant ikke ${id}`);
  const existing: unknown[] = (published.subPageLinks as unknown[]) ?? [];

  const draftId = `drafts.${id}`;
  await client.createIfNotExists({ ...stripSystemFields(published), _id: draftId });
  await client
    .patch(draftId)
    .set({ subPageLinks: [...existing, subPageLink("Utmerkelser", "/om-klubben/sosialgruppe/utmerkelser")] })
    .commit();
  console.log(`Lagret som kladd: ${draftId} (lenke til Utmerkelser lagt til)`);
}

async function main() {
  await createOmKlubben();
  await linkUtmerkelserFromSosialgruppe();
  console.log("\nFerdig. Gå til Sanity Studio og se gjennom kladdene før publisering.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
