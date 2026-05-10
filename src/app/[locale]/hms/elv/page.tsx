import { useTranslations } from "next-intl";
import HmsSubLayout from "@/components/HmsSubLayout";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HmsElvPage({ params }: PageProps) {
  const { locale } = await params;
  return <HmsElvContent locale={locale} />;
}

function HmsElvContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  return (
    <HmsSubLayout
      locale={locale}
      title={t("elv_title")}
      intro={t("elv_intro")}
      sections={[
        { title: t("elv_nidelva_title"), text: t("elv_nidelva_text") },
        { title: t("elv_risk_title"), text: t("elv_risk_text") },
        { title: t("elv_spontaneous_title"), text: t("elv_spontaneous_text") },
      ]}
      backLabel={t("back")}
    />
  );
}
