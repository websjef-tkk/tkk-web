import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

// Egen fil uten next/headers, slik at urlFor også kan brukes i klientkomponenter.
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
