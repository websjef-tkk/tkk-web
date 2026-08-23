import type { Metadata } from "next";
import { getDisciplinePage } from "@/lib/queries/page";
import DisciplinePageContent from "@/components/DisciplinePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDisciplinePage("surfski");
  return buildPageMetadata(page);
}

export default async function SurfskiPage() {
  const page = await getDisciplinePage("surfski");
  if (!page) notFound();
  return <DisciplinePageContent page={page} />;
}
