import { getDisciplinePage } from "@/lib/queries/page";
import DisciplinePageContent from "@/components/DisciplinePageContent";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function JuniorPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getDisciplinePage("junior");
  if (!page) notFound();
  return <DisciplinePageContent page={page} locale={locale} />;
}
