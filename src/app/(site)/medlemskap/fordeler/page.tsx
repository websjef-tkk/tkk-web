import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("medlemskap-fordeler");
  return buildPageMetadata(page);
}

export default async function FordelerPage() {
  const page = await getFlexiblePage("medlemskap-fordeler");
  if (!page) notFound();
  return <FlexiblePageContent page={page} backHref="/medlemskap" backLabel="← Medlemskap" />;
}
