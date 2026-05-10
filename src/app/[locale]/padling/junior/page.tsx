import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import GroupLeaderCard from "@/components/GroupLeaderCard";

type PageProps = { params: Promise<{ locale: string }> };

export default async function JuniorPage({ params }: PageProps) {
  const { locale } = await params;
  return <JuniorContent locale={locale} />;
}

function JuniorContent({ locale }: { locale: string }) {
  const t = useTranslations("junior");

  const sections = [
    { title: t("about_title"), text: t("about_text") },
    { title: t("summer_title"), text: t("summer_text") },
    { title: t("winter_title"), text: t("winter_text") },
    { title: t("trips_title"), text: t("trips_text") },
  ];

  return (
    <article>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image src="/images/hero.jpeg" alt="Junior padling" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 flex items-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">{t("title")}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">
          {t("intro")}
        </p>

        <div className="space-y-10 mb-10">
          {sections.map((s, i) => (
            <div key={i}>
              <div className="w-8 border-t-2 border-teal mb-2" />
              <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
              <p className="text-slate leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Price highlight */}
        <div className="bg-tkk-blue/20 border border-tkk-blue rounded-xl px-5 py-4 mb-10 flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <p className="text-navy font-semibold">{t("price")}</p>
        </div>

        {/* Facebook link */}
        <div className="bg-mist rounded-xl p-5 mb-10 flex items-center gap-3">
          <svg className="w-5 h-5 text-teal shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <a
            href="https://www.facebook.com/groups/juniorpadlingtk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal font-semibold text-sm hover:underline"
          >
            {t("facebook")}
          </a>
        </div>

        <div className="w-8 border-t-2 border-teal mb-4" />
        <h2 className="font-display font-bold text-navy text-2xl mb-4">
          {locale === "no" ? "Kontakt gruppeledaren" : "Contact the group leader"}
        </h2>
        <GroupLeaderCard
          name={t("leader_name")}
          role={t("leader_role")}
          phone={t("leader_phone")}
          email={t("leader_email")}
        />

        <div className="mt-10">
          <Link
            href={`/${locale}/medlemskap`}
            className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            {locale === "no" ? "Meld inn barnet ditt →" : "Enrol your child →"}
          </Link>
        </div>
      </div>
    </article>
  );
}
