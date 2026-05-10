import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PirbadPage({ params }: PageProps) {
  const { locale } = await params;
  return <PirbadContent locale={locale} />;
}

function PirbadContent({ locale }: { locale: string }) {
  const t = useTranslations("pirbadet");

  const sessions = [
    { title: t("teknikk_title"), text: t("teknikk_text"), emoji: "🌀" },
    { title: t("polo_title"), text: t("polo_text"), emoji: "🏐" },
    { title: t("junior_title"), text: t("junior_text"), emoji: "🌱" },
  ];

  return (
    <article>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/hav.jpg" alt="Pirbadet" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">{t("title")}</h1>
          <p className="text-tkk-blue font-semibold mt-1">{t("tagline")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-12">
          {t("intro")}
        </p>

        <div className="w-8 border-t-2 border-teal mb-3" />
        <h2 className="font-display font-bold text-navy text-2xl mb-6">{t("schedule_title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {sessions.map((s) => (
            <div key={s.title} className="bg-white rounded-xl border-t-4 border-tkk-blue shadow-sm p-5">
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h3 className="font-display font-bold text-navy text-lg mb-2">{s.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-mist rounded-xl border border-mist p-6">
          <div className="w-8 border-t-2 border-teal mb-3" />
          <h2 className="font-display font-bold text-navy text-xl mb-2">{t("rules_title")}</h2>
          <p className="text-slate leading-relaxed">{t("rules_text")}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={`/${locale}/padling/polo`}
            className="inline-block border border-navy text-navy font-semibold px-5 py-2.5 rounded hover:bg-navy hover:text-white transition-colors text-sm">
            {locale === "no" ? "Om kajakkpolo →" : "About kayak polo →"}
          </Link>
          <Link href={`/${locale}/padling/junior`}
            className="inline-block border border-navy text-navy font-semibold px-5 py-2.5 rounded hover:bg-navy hover:text-white transition-colors text-sm">
            {locale === "no" ? "Om juniorgruppen →" : "About the junior group →"}
          </Link>
        </div>
      </div>
    </article>
  );
}
