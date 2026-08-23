import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("hms-hav-fellespadling");
  return buildPageMetadata(page);
}

export default async function HmsHavFellespadlingPage() {
  const page = await getFlexiblePage("hms-hav-fellespadling");
  if (!page) notFound();
  return <FlexiblePageContent page={page} backHref={"/hms/hav"} />;
}
