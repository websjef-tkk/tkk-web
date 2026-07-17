import { sanityClient } from "../sanity";
import { bodyProjection, type SeoField } from "./shared";

export interface FlexiblePage {
  _id: string;
  pageId: string;
  title: { no: string; en?: string };
  intro?: { no?: string; en?: string };
  body?: { no?: unknown[]; en?: unknown[] };
  seo?: SeoField;
}

export interface SubPageLink {
  title: { no?: string; en?: string };
  href: string;
}

export interface DisciplinePage {
  _id: string;
  discipline: string;
  title: { no: string; en?: string };
  tagline?: { no?: string; en?: string };
  intro?: { no?: string; en?: string };
  body?: { no?: unknown[]; en?: unknown[] };
  heroImage?: { asset: { _ref: string }; alt?: string };
  subPageLinks?: SubPageLink[];
  seo?: SeoField;
}

export async function getFlexiblePage(pageId: string): Promise<FlexiblePage | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "flexiblePage" && pageId == $pageId][0] {
        _id,
        pageId,
        title,
        intro,
        ${bodyProjection},
        seo
      }`,
      { pageId }
    );
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
