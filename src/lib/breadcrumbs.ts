import { getSanityClient } from "./sanity";

export type Crumb = { label: string; href?: string };

// Sider som har egen rute i koden og ikke er et dokument i Sanity.
const STATIC_LABELS: Record<string, string> = {
  blogg: "Blogg og nyheter",
  aktiviteter: "Aktiviteter og kurs",
};

/**
 * Bygger brødsmulestien for en side ut fra adressen: "Hjem", deretter hvert
 * nivå over siden som faktisk finnes som en side, og til slutt siden selv.
 * Nivåer uten egen side (f.eks. "/padling") hoppes over.
 */
export async function getBreadcrumbs(path: string, current: string): Promise<Crumb[]> {
  const segments = path.split("/").filter(Boolean);
  const ancestors = segments.slice(0, -1).map((_, i) => segments.slice(0, i + 1).join("/"));

  const labels = new Map<string, string>();
  const unresolved = ancestors.filter((p) => !(p in STATIC_LABELS));
  if (unresolved.length > 0) {
    try {
      const client = await getSanityClient();
      const found: { path: string; label?: string }[] = await client.fetch(
        `*[
          (_type == "flexiblePage" && slug.current in $paths) ||
          (_type == "disciplinePage" && "padling/" + discipline in $paths)
        ] {
          "path": select(_type == "disciplinePage" => "padling/" + discipline, slug.current),
          "label": title.no
        }`,
        { paths: unresolved }
      );
      for (const { path: p, label } of found) if (label) labels.set(p, label);
    } catch {
      // Uten svar fra Sanity vises stien uten mellomnivåene.
    }
  }

  const crumbs: Crumb[] = [{ label: "Hjem", href: "/" }];
  for (const p of ancestors) {
    const label = STATIC_LABELS[p] ?? labels.get(p);
    if (label) crumbs.push({ label, href: `/${p}` });
  }
  crumbs.push({ label: current });
  return crumbs;
}
