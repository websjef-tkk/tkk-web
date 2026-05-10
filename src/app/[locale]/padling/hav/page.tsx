import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import GroupLeaderCard from "@/components/GroupLeaderCard";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HavPage({ params }: PageProps) {
  const { locale } = await params;
  return <HavContent locale={locale} />;
}

function HavContent({ locale }: { locale: string }) {
  const t = useTranslations("hav");

  const sections = [
    { title: t("local_title"), text: t("local_text") },
    { title: t("weekly_title"), text: t("weekly_text") },
    { title: t("expedition_title"), text: t("expedition_text") },
    { title: t("equipment_title"), text: t("equipment_text") },
    { title: t("safety_title"), text: t("safety_text") },
  ];

  return (
    <article>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image src="/images/bohuslan.jpg" alt="Havpadling" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 flex items-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">{t("title")}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">
          {t("intro")}
        </p>

        <div className="space-y-10 mb-14">
          {sections.map((s, i) => (
            <div key={i}>
              <div className="w-8 border-t-2 border-teal mb-2" />
              <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
              <p className="text-slate leading-relaxed">{s.text}</p>
            </div>
          ))}
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
            href={`/${locale}/aktiviteter`}
            className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            {locale === "no" ? "Se kommende turer →" : "View upcoming trips →"}
          </Link>
        </div>
      </div>
    </article>
  );
}
