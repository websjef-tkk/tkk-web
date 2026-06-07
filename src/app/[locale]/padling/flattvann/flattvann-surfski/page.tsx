import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function FlattvannsurfskiPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getFlexiblePage("padling-flattvann-flattvann-surfski");
  if (!page) notFound();
  return <FlexiblePageContent page={page} locale={locale} backHref={`/${locale}/padling/flattvann`} />;
}
