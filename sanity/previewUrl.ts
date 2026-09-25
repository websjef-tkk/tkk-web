type PreviewableDocument = {
  _type?: string;
  slug?: { current?: string };
  discipline?: string;
};

function pathFor(document: PreviewableDocument): string | null {
  switch (document._type) {
    case "disciplinePage":
      return document.discipline ? `/padling/${document.discipline}` : null;
    case "flexiblePage":
      return document.slug?.current ? `/${document.slug.current}` : null;
    case "blogPost":
      return document.slug?.current ? `/blogg/${document.slug.current}` : null;
    case "event":
      return document.slug?.current ? `/aktiviteter/${document.slug.current}` : null;
    default:
      return null;
  }
}

/**
 * Bygger "Forhåndsvis"-lenken som vises i dokument-verktøylinjen i Studio.
 * Hemmeligheten må ha NEXT_PUBLIC_-prefiks siden Studio kjører som en
 * Next.js-klientkomponent (next-sanity/studio) og ikke via Sanitys egen CLI —
 * den er derfor synlig i nettleserbunten, med vilje: den gir kun lesetilgang
 * til kladder på frontend, ingen skriverettighet.
 */
export function resolvePreviewUrl(document: PreviewableDocument): string | undefined {
  const path = pathFor(document);
  const secret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET;
  if (!path || !secret || typeof window === "undefined") return undefined;
  const url = new URL("/api/draft", window.location.origin);
  url.searchParams.set("secret", secret);
  url.searchParams.set("path", path);
  return url.toString();
}
