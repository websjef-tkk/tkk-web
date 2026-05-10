import { useTranslations } from "next-intl";
import HmsSubLayout from "@/components/HmsSubLayout";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PolitiattestPage({ params }: PageProps) {
  const { locale } = await params;
  return <PolitiattestContent locale={locale} />;
}

function PolitiattestContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  return (
    <HmsSubLayout
      locale={locale}
      title={t("politiattest_title")}
      intro={t("politiattest_intro")}
      sections={[
        { title: t("politiattest_who_title"), text: t("politiattest_who_text") },
        { title: t("politiattest_how_title"), text: t("politiattest_how_text") },
      ]}
      backLabel={t("back")}
      extra={
        <div className="bg-white rounded-xl border border-mist shadow-sm p-5">
          <p className="text-sm text-slate">{t("politiattest_contact")}</p>
        </div>
      }
    />
  );
}
