import type { Metadata } from "next";
import { urlFor } from "@/lib/sanity";
import type { SeoField } from "@/lib/queries/shared";

type ImageRef = { asset?: { _ref: string } } | null | undefined;

type SeoPageInput = {
  title?: { no?: string };
  intro?: { no?: string };
  summary?: { no?: string };
  description?: { no?: string };
  seo?: SeoField;
  image?: ImageRef;
  heroImage?: ImageRef;
};

function pick(field?: { no?: string }): string | undefined {
  return field?.no || undefined;
}

export function buildPageMetadata(page: SeoPageInput | null | undefined): Metadata {
  if (!page) return {};

  const title = pick(page.seo?.metaTitle) ?? pick(page.title);
  const description =
    pick(page.seo?.metaDescription) ??
    pick(page.intro) ??
    pick(page.summary) ??
    pick(page.description);

  const ogImage = page.seo?.ogImage ?? page.image ?? page.heroImage;
  const metadata: Metadata = { title, description };

  if (ogImage?.asset) {
    const imageUrl = urlFor(ogImage).width(1200).height(630).url();
    metadata.openGraph = { images: [imageUrl] };
  }

  return metadata;
}
