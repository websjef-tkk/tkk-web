import type { Metadata } from "next";
import { getDisciplinePage } from "@/lib/queries/page";
import DisciplinePageContent from "@/components/DisciplinePageContent";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDisciplinePage("junior");
  return buildPageMetadata(page);
}

export default async function JuniorPage() {
  const page = await getDisciplinePage("junior");
  if (!page) notFound();
  return <DisciplinePageContent page={page} />;
}
