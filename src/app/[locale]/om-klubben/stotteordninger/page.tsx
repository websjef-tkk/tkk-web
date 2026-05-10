import { useTranslations } from "next-intl";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function StotteordningerPage({ params }: PageProps) {
  const { locale } = await params;
  return <StotteordningerContent locale={locale} />;
}

function StotteordningerContent({ locale }: { locale: string }) {
  const t = useTranslations("klubben");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-teal text-sm font-semibold mb-1">
        <Link href={`/${locale}/om-klubben`} className="hover:underline">
          {locale === "no" ? "← Klubben" : "← The club"}
        </Link>
      </p>
      <div className="w-8 border-t-2 border-teal mb-2 mt-4" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{t("support_title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{t("support_intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Educational support */}
        <div className="bg-white rounded-xl border border-mist shadow-sm p-6">
          <div className="w-8 border-t-2 border-teal mb-3" />
          <h2 className="font-display font-bold text-navy text-xl mb-3">{t("support_edu_title")}</h2>
          <p className="text-slate text-sm leading-relaxed">{t("support_edu_text")}</p>
        </div>

        {/* Competition support */}
        <div className="bg-white rounded-xl border border-mist shadow-sm p-6">
          <div className="w-8 border-t-2 border-teal mb-3" />
          <h2 className="font-display font-bold text-navy text-xl mb-3">{t("support_comp_title")}</h2>
          <p className="text-slate text-sm leading-relaxed">{t("support_comp_text")}</p>
        </div>
      </div>

      <div className="bg-tkk-blue/15 border border-tkk-blue rounded-xl p-5">
        <p className="text-navy text-sm font-medium">{t("support_apply")}</p>
        <Link href={`/${locale}/kontakt`} className="inline-block mt-3 text-sm font-semibold text-teal hover:underline">
          {locale === "no" ? "Kontakt styret →" : "Contact the board →"}
        </Link>
      </div>
    </div>
  );
}
