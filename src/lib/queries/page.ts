import { sanityClient, getSanityClient } from "../sanity";
import { bodyProjection, type SeoField } from "./shared";

export interface FlexiblePage {
  _id: string;
  slug: string;
  title: { no: string };
  heroImage?: { asset: { _ref: string }; alt?: string };
  intro?: { no?: string };
  body?: { no?: unknown[] };
  seo?: SeoField;
  backLabel?: string;
  subPageLinks?: SubPageLink[];
}

export interface SubPageLink {
  title: { no?: string };
  href: string;
}

export interface SafetyLink {
  label: string;
  linkType?: "page" | "url" | "pdf";
  page?: { _type?: string; slug?: string; discipline?: string } | null;
  href?: string;
  pdfFile?: { asset?: { url?: string; originalFilename?: string; size?: number } };
  openInNewTab?: boolean;
}

export interface DisciplinePage {
  _id: string;
  discipline: string;
  title: { no: string };
  tagline?: { no?: string };
  intro?: { no?: string };
  body?: { no?: unknown[] };
  heroImage?: { asset: { _ref: string }; alt?: string };
  subPageLinks?: SubPageLink[];
  safetyLinks?: SafetyLink[];
  seo?: SeoField;
}

export async function getFlexiblePage(slug: string): Promise<FlexiblePage | null> {
  try {
    const client = await getSanityClient();
    return await client.fetch(
      `*[_type == "flexiblePage" && slug.current == $slug][0] {
        _id,
        "slug": slug.current,
        title,
        heroImage,
        intro,
        ${bodyProjection},
        seo,
        backLabel,
        subPageLinks[] { title, href }
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

/** Finner ny adresse for en side som har blitt flyttet, via previousSlugs. */
export async function getFlexiblePageRedirect(slug: string): Promise<string | null> {
  try {
    const doc = await sanityClient.fetch<{ slug: string } | null>(
      `*[_type == "flexiblePage" && $slug in previousSlugs][0]{ "slug": slug.current }`,
      { slug }
    );
    return doc?.slug ?? null;
  } catch {
    return null;
  }
}

export async function getDisciplinePage(discipline: string): Promise<DisciplinePage | null> {
  try {
    const client = await getSanityClient();
    return await client.fetch(
      `*[_type == "disciplinePage" && discipline == $discipline][0] {
        _id,
        discipline,
        title,
        tagline,
        intro,
        ${bodyProjection},
        heroImage,
        subPageLinks[] { title, href },
        safetyLinks[] {
          label,
          linkType,
          page->{ _type, "slug": slug.current, discipline },
          href,
          pdfFile{ asset->{ url, originalFilename, size } },
          openInNewTab
        },
        seo
      }`,
      { discipline }
    );
  } catch {
    return null;
  }
}
