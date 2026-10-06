import { useClient, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { PAGE_PATH_API_VERSION } from "../pagePath";

type PageDoc = { _id: string; slug?: string; previousSlugs?: string[] };

const slugOf = (doc: Record<string, unknown> | null | undefined) =>
  (doc?.slug as { current?: string } | undefined)?.current;

const wrapped = new WeakMap<DocumentActionComponent, DocumentActionComponent>();

/**
 * "Publiser" for fleksible sider. Når en publisert side har fått ny adresse
 * (flyttet til en annen forelder, eller nytt siste ledd), følger undersidene
 * med, og de gamle adressene lagres i "Tidligere adresser" slik at gamle
 * lenker blir videresendt (se getFlexiblePageRedirect i src/lib/queries/page.ts).
 */
export function publishWithPathSync(originalPublish: DocumentActionComponent): DocumentActionComponent {
  // Samme komponent hver gang, ellers mister React tilstanden til handlingen
  // hver gang Studio regner ut handlingslisten på nytt.
  const cached = wrapped.get(originalPublish);
  if (cached) return cached;

  const PublishWithPathSync: DocumentActionComponent = (props) => {
    const original = originalPublish(props);
    const client = useClient({ apiVersion: PAGE_PATH_API_VERSION });
    const { patch } = useDocumentOperation(props.id, props.type);
    if (!original) return null;

    const oldPath = slugOf(props.published);
    const newPath = slugOf(props.draft);
    if (!oldPath || !newPath || oldPath === newPath) return original;

    return {
      ...original,
      onHandle: async () => {
        // Rå spørring uten perspektiv: både publiserte undersider og kladdene deres skal flyttes.
        const descendants = await client.fetch<PageDoc[]>(
          `*[_type == "flexiblePage" && string::startsWith(slug.current, $prefix)]{ _id, "slug": slug.current, previousSlugs }`,
          { prefix: `${oldPath}/` },
          { perspective: "raw" }
        );
        if (descendants.length > 0) {
          const tx = client.transaction();
          for (const doc of descendants) {
            if (!doc.slug) continue;
            const previousSlugs = [...new Set([...(doc.previousSlugs ?? []), doc.slug])];
            tx.patch(doc._id, { set: { "slug.current": newPath + doc.slug.slice(oldPath.length), previousSlugs } });
          }
          await tx.commit();
        }

        const previousSlugs = (props.draft?.previousSlugs as string[] | undefined) ?? [];
        if (!previousSlugs.includes(oldPath)) {
          patch.execute([{ set: { previousSlugs: [...previousSlugs, oldPath] } }]);
        }
        original.onHandle?.();
      },
    };
  };
  PublishWithPathSync.action = "publish";
  PublishWithPathSync.displayName = "PublishWithPathSync";
  wrapped.set(originalPublish, PublishWithPathSync);
  return PublishWithPathSync;
}
