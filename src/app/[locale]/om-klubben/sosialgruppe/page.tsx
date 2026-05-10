import { useTranslations } from "next-intl";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function SosialgruppaPage({ params }: PageProps) {
  const { locale } = await params;
  return <SosialgruppaContent locale={locale} />;
}

function SosialgruppaContent({ locale }: { locale: string }) {
  const t = useTranslations("klubben");

  const sections = [
    { title: t("social_traditions_title"), text: t("social_traditions_text") },
    { title: t("social_spontaneous_title"), text: t("social_spontaneous_text") },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-teal text-sm font-semibold mb-1">
        <Link href={`/${locale}/om-klubben`} className="hover:underline">
          {locale === "no" ? "← Klubben" : "← The club"}
        </Link>
      </p>
      <div className="w-8 border-t-2 border-teal mb-2 mt-4" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{t("social_title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{t("social_intro")}</p>

      <div className="space-y-10 mb-10">
        {sections.map((s, i) => (
          <div key={i}>
            <div className="w-8 border-t-2 border-teal mb-2" />
            <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
            <p className="text-slate leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Facebook */}
      <div className="bg-mist rounded-xl p-5 mb-6 flex items-center gap-3">
        <svg className="w-5 h-5 text-teal shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <p className="text-slate text-sm">{t("social_facebook_text")}</p>
      </div>

      <div className="bg-white rounded-xl border border-mist shadow-sm p-5">
        <p className="text-sm text-slate">{t("social_contact")}</p>
      </div>
    </div>
  );
}
