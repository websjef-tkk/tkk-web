import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("padling-junior-utstyr");
  return buildPageMetadata(page);
}

export default async function JuniorutstyrPage() {
  const page = await getFlexiblePage("padling-junior-utstyr");
  if (!page) notFound();
  return <FlexiblePageContent page={page} backHref={"/padling/junior"} />;
}
