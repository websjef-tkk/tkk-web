import type { Metadata } from "next";
import { getDisciplinePage } from "@/lib/queries/page";
import DisciplinePageContent from "@/components/DisciplinePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getDisciplinePage("surfski");
  return buildPageMetadata(page, locale);
}

export default async function SurfskiPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getDisciplinePage("surfski");
  if (!page) notFound();
  return <DisciplinePageContent page={page} locale={locale} />;
}
