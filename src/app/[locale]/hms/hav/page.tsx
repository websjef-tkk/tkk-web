import { useTranslations } from "next-intl";
import HmsSubLayout from "@/components/HmsSubLayout";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HmsHavPage({ params }: PageProps) {
  const { locale } = await params;
  return <HmsHavContent locale={locale} />;
}

function HmsHavContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  return (
    <HmsSubLayout
      locale={locale}
      title={t("hav_title")}
      intro={t("hav_intro")}
      sections={[
        { title: t("hav_competence_title"), text: t("hav_competence_text") },
        { title: t("hav_collective_title"), text: t("hav_collective_text") },
        { title: t("hav_traffic_title"), text: t("hav_traffic_text") },
        { title: t("hav_risk_title"), text: t("hav_risk_text") },
        { title: t("hav_emergency_title"), text: t("hav_emergency_text") },
      ]}
      backLabel={t("back")}
    />
  );
}
