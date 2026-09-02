import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getFlexiblePage, getFlexiblePageRedirect } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Params = { slug: string[] };
type Props = { params: Promise<Params> };

/** Foreldre-stien for tilbake-lenken — siste segment av adressen strippes. */
function backHrefFor(path: string): string | undefined {
  const segments = path.split("/");
  if (segments.length <= 1) return undefined;
  return `/${segments.slice(0, -1).join("/")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getFlexiblePage(slug.join("/"));
  return buildPageMetadata(page);
}

export default async function FlexiblePageRoute({ params }: Props) {
  const { slug } = await params;
  const path = slug.join("/");

  const page = await getFlexiblePage(path);
  if (page) {
    return (
      <FlexiblePageContent page={page} backHref={backHrefFor(path)} backLabel={page.backLabel} />
    );
  }

  const newPath = await getFlexiblePageRedirect(path);
  if (newPath) permanentRedirect(`/${newPath}`);

  notFound();
}
