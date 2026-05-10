import { useTranslations } from "next-intl";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function RefusjonPage({ params }: PageProps) {
  const { locale } = await params;
  return <RefusjonContent locale={locale} />;
}

function RefusjonContent({ locale }: { locale: string }) {
  const t = useTranslations("klubben");

  const sections = [
    { title: t("refund_rate_title"), text: t("refund_rate_text") },
    { title: t("refund_other_title"), text: t("refund_other_text") },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-teal text-sm font-semibold mb-1">
        <Link href={`/${locale}/om-klubben`} className="hover:underline">
          {locale === "no" ? "← Klubben" : "← The club"}
        </Link>
      </p>
      <div className="w-8 border-t-2 border-teal mb-2 mt-4" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{t("refund_title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{t("refund_intro")}</p>

      <div className="space-y-10 mb-10">
        {sections.map((s, i) => (
          <div key={i}>
            <div className="w-8 border-t-2 border-teal mb-2" />
            <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
            <p className="text-slate leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-mist shadow-sm p-5">
        <p className="text-sm text-slate">{t("refund_contact")}</p>
        <Link href={`/${locale}/kontakt`} className="inline-block mt-3 text-sm font-semibold text-teal hover:underline">
          {locale === "no" ? "Kontakt kasserer →" : "Contact the treasurer →"}
        </Link>
      </div>
    </div>
  );
}
