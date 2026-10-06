import type { SanityClient } from "sanity";

export const PAGE_PATH_API_VERSION = "2024-01-01";

// Sider som har egen rute i koden (src/app/(site)/<sti>/page.tsx) og hentes
// på fast adresse. De kan derfor ikke flyttes eller få ny adresse i Studio.
export const CODE_ROUTED_PAGES = new Set(["hms", "om-klubben", "medlemskap"]);

// Adresser som er opptatt av ruter i koden og ikke kan brukes av en side.
const RESERVED_ROOTS = new Set(["blogg", "aktiviteter", "kontakt", "studio", "api"]);
const RESERVED_PATHS = new Set(["padling/hav/turrapporter"]);

type PathSource = { _type?: string; slug?: string; discipline?: string };

/** Adressen til en side som kan være forelder: en fleksibel side eller en grenside. */
export function pagePath(doc: PathSource | null | undefined): string | null {
  if (doc?._type === "disciplinePage") return doc.discipline ? `padling/${doc.discipline}` : null;
  if (doc?._type === "flexiblePage") return doc.slug ?? null;
  return null;
}

/**
 * Slår opp adressen til dokumentet `id`. Publisert versjon foretrekkes: en
 * forelder med upublisert adresseendring flytter først undersidene sine når
 * den publiseres (se actions/publishWithPathSync.ts).
 */
export async function fetchPagePath(client: SanityClient, id: string): Promise<string | null> {
  const publishedId = id.replace(/^drafts\./, "");
  const docs = await client.fetch<({ _id: string } & PathSource)[]>(
    `*[_id in [$id, "drafts." + $id]]{ _id, _type, "slug": slug.current, discipline }`,
    { id: publishedId }
  );
  return pagePath(docs.find((d) => d._id === publishedId) ?? docs[0]);
}

export function slugifyPath(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-*\/-*/g, "/")
    .replace(/^-|-$/g, "")
    .replace(/^\/|\/$/g, "");
}

/** Siste ledd i en adresse ("om-klubben/klubbhus" → "klubbhus"). */
export const lastSegment = (path: string) => path.slice(path.lastIndexOf("/") + 1);

export function isReservedPath(path: string, disciplines: string[]): boolean {
  const [root, second, ...rest] = path.split("/");
  if (RESERVED_ROOTS.has(root) || RESERVED_PATHS.has(path)) return true;
  return root === "padling" && rest.length === 0 && disciplines.includes(second);
}
