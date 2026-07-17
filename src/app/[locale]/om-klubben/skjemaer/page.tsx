import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getFlexiblePage("klubben-skjemaer");
  return buildPageMetadata(page, locale);
}

export default async function SkjemaerPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getFlexiblePage("klubben-skjemaer");
  if (!page) notFound();
  return <FlexiblePageContent page={page} locale={locale} backHref={`/${locale}/om-klubben`} />;
}
