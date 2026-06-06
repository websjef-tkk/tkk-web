import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function MedlemskapPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getFlexiblePage("medlemskap");
  if (!page) notFound();
  return <FlexiblePageContent page={page} locale={locale} />;
}
