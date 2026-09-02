import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("hms-elv-klubbpadling-nidelven");
  return buildPageMetadata(page);
}

export default async function HmsElvKlubbpadlingPage() {
  const page = await getFlexiblePage("hms-elv-klubbpadling-nidelven");
  if (!page) notFound();
  return <FlexiblePageContent page={page} backHref={"/hms/elv"} />;
}
