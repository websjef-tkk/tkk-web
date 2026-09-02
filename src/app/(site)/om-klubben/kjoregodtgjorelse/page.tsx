import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("klubben-kjoregodtgjorelse");
  return buildPageMetadata(page);
}

export default async function KjoregodtgjorelserPage() {
  const page = await getFlexiblePage("klubben-kjoregodtgjorelse");
  if (!page) notFound();
  return <FlexiblePageContent page={page} backHref={"/om-klubben"} />;
}
