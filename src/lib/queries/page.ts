import { sanityClient } from "../sanity";

export interface PageSection {
  title?: { no?: string; en?: string };
  body?: { no?: unknown[]; en?: unknown[] };
}

export interface FlexiblePage {
  _id: string;
  pageId: string;
  title: { no: string; en?: string };
  intro?: { no?: string; en?: string };
  sections?: PageSection[];
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
}

export async function getFlexiblePage(pageId: string): Promise<FlexiblePage | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "flexiblePage" && pageId == $pageId][0] {
        _id,
        pageId,
        title,
        intro,
        sections[] {
          title,
          body
        }
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
        body,
        heroImage,
        subPageLinks[] { title, href }
      }`,
      { discipline }
    );
  } catch {
    return null;
  }
}
