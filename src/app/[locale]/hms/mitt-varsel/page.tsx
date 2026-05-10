import { useTranslations } from "next-intl";
import HmsSubLayout from "@/components/HmsSubLayout";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function MittVarselPage({ params }: PageProps) {
  const { locale } = await params;
  return <MittVarselContent locale={locale} />;
}

function MittVarselContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  return (
    <HmsSubLayout
      locale={locale}
      title={t("varsel_title")}
      intro={t("varsel_intro")}
      sections={[
        { title: t("varsel_what_title"), text: t("varsel_what_text") },
        { title: t("varsel_how_title"), text: t("varsel_how_text") },
      ]}
      backLabel={t("back")}
      extra={
        <Link
          href={t("varsel_link_url")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
        >
          {t("varsel_link")} →
        </Link>
      }
    />
  );
}
