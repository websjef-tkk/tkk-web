import { disciplinePath } from "./menuRoutes";

export type ContentLinkPage = {
  _type?: string;
  slug?: string;
  discipline?: string;
} | null;

export type ContentLinkData = {
  linkType?: "page" | "url" | "pdf";
  page?: ContentLinkPage;
  href?: string | null;
};

function pageHref(page: ContentLinkPage): string | null {
  switch (page?._type) {
    case "flexiblePage":
      return page.slug ? `/${page.slug}` : null;
    case "disciplinePage":
      return page.discipline ? disciplinePath(page.discipline) : null;
    case "blogPost":
      return page.slug ? `/blogg/${page.slug}` : null;
    case "event":
      return page.slug ? `/aktiviteter/${page.slug}` : null;
    default:
      return null;
  }
}

/** Legger til "https://" hvis adressen mangler et kjent skjema eller ikke er en intern sti. */
function normalizeUrl(href: string): string {
  if (/^(https?:|mailto:|tel:)/i.test(href) || href.startsWith("/")) return href;
  return `https://${href}`;
}

/**
 * Regner ut faktisk href for et "side eller lenke"-felt (se `createLinkFields`).
 * Gamle dokumenter uten `linkType` men med `href` behandles som eksterne lenker,
 * for bakoverkompatibilitet med innhold lagret før dette feltet fantes.
 */
export function resolveContentLink(link: ContentLinkData | null | undefined): string | null {
  if (!link) return null;
  const linkType = link.linkType ?? (link.href ? "url" : undefined);
  if (linkType === "page") {
    return pageHref(link.page ?? null);
  }
  if (linkType === "url" && link.href) {
    return normalizeUrl(link.href);
  }
  return null;
}
