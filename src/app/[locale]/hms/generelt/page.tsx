import { useTranslations } from "next-intl";
import HmsSubLayout from "@/components/HmsSubLayout";

type PageProps = { params: Promise<{ locale: string }> };

export default async function GenereltPage({ params }: PageProps) {
  const { locale } = await params;
  return <GenereltContent locale={locale} />;
}

function GenereltContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  return (
    <HmsSubLayout
      locale={locale}
      title={t("generelt_title")}
      intro={t("generelt_intro")}
      sections={[{ title: "", text: t("generelt_text") }]}
      backLabel={t("back")}
    />
  );
}
