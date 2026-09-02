import { sanityClient } from "../sanity";
import { bodyProjection, type SeoField } from "./shared";

export interface FlexiblePage {
  _id: string;
  slug: string;
  title: { no: string };
  intro?: { no?: string };
  body?: { no?: unknown[] };
  seo?: SeoField;
  backLabel?: string;
}

export interface SubPageLink {
  title: { no?: string };
  href: string;
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
  seo?: SeoField;
}

export async function getFlexiblePage(slug: string): Promise<FlexiblePage | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "flexiblePage" && slug.current == $slug][0] {
        _id,
        "slug": slug.current,
        title,
        intro,
        ${bodyProjection},
        seo,
        backLabel
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
    return await sanityClient.fetch(
      `*[_type == "disciplinePage" && discipline == $discipline][0] {
        _id,
        discipline,
        title,
        tagline,
        intro,
        ${bodyProjection},
        heroImage,
        subPageLinks[] { title, href },
        seo
      }`,
      { discipline }
    );
  } catch {
    return null;
  }
}
