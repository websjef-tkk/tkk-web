import { useTranslations } from "next-intl";
import HmsSubLayout from "@/components/HmsSubLayout";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HendelsesrapporterPage({ params }: PageProps) {
  const { locale } = await params;
  return <HendelsesrapporterContent locale={locale} />;
}

function HendelsesrapporterContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  return (
    <HmsSubLayout
      locale={locale}
      title={t("hendelser_title")}
      intro={t("hendelser_intro")}
      sections={[
        { title: t("hendelser_how_title"), text: t("hendelser_how_text") },
      ]}
      backLabel={t("back")}
      extra={
        <div className="space-y-6">
          <Link
            href={t("hendelser_form_url")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            {t("hendelser_form_link")} →
          </Link>

          <div className="mt-8">
            <div className="w-8 border-t-2 border-teal mb-3" />
            <h2 className="font-display font-bold text-navy text-xl mb-3">{t("hendelser_previous_title")}</h2>
            <ul className="space-y-2 text-slate text-sm list-disc list-inside">
              <li>{t("hendelser_previous_2024")}</li>
            </ul>
          </div>
        </div>
      }
    />
  );
}
