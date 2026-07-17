import type { Metadata } from "next";
import { urlFor } from "@/lib/sanity";
import type { SeoField } from "@/lib/queries/shared";

type ImageRef = { asset?: { _ref: string } } | null | undefined;

type SeoPageInput = {
  title?: { no?: string; en?: string };
  intro?: { no?: string; en?: string };
  summary?: { no?: string; en?: string };
  description?: { no?: string; en?: string };
  seo?: SeoField;
  image?: ImageRef;
  heroImage?: ImageRef;
};

function pick(locale: string, field?: { no?: string; en?: string }): string | undefined {
  if (!field) return undefined;
  return (locale === "no" ? field.no : field.en ?? field.no) || undefined;
}

export function buildPageMetadata(page: SeoPageInput | null | undefined, locale: string): Metadata {
  if (!page) return {};

  const title = pick(locale, page.seo?.metaTitle) ?? pick(locale, page.title);
  const description =
    pick(locale, page.seo?.metaDescription) ??
    pick(locale, page.intro) ??
    pick(locale, page.summary) ??
    pick(locale, page.description);

  const ogImage = page.seo?.ogImage ?? page.image ?? page.heroImage;
  const metadata: Metadata = { title, description };

  if (ogImage?.asset) {
    const imageUrl = urlFor(ogImage).width(1200).height(630).url();
    metadata.openGraph = { images: [imageUrl] };
  }

  return metadata;
}
