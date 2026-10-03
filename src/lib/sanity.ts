import { createClient } from "next-sanity";
import { draftMode } from "next/headers";

export { urlFor } from "./sanityImage";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  // Uten dette blir kladder (drafts.*) som matcher en spørring vist til alle besøkende,
  // ikke bare redaktører i "Forhåndsvis"-modus (se previewClient under).
  perspective: "published",
});

/** Samme klient, men lest med kladder inkludert — brukes bare når Draft Mode er aktivert. */
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});

/** Velger kladd-klienten når en redaktør ser på siden via "Forhåndsvis" i Studio. */
export async function getSanityClient() {
  return (await draftMode()).isEnabled ? previewClient : sanityClient;
}

export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
