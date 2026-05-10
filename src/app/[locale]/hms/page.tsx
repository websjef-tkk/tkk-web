import { useTranslations } from "next-intl";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HmsPage({ params }: PageProps) {
  const { locale } = await params;
  return <HmsContent locale={locale} />;
}

const hmsSubPages = [
  { key: "hms_generelt", path: "/hms/generelt" },
  { key: "hms_hav", path: "/hms/hav" },
  { key: "hms_elv", path: "/hms/elv" },
  { key: "mitt_varsel", path: "/hms/mitt-varsel" },
  { key: "hendelsesrapporter", path: "/hms/hendelsesrapporter" },
  { key: "politiattest", path: "/hms/politiattest" },
] as const;

function HmsContent({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  const tn = useTranslations("nav");

  const sections = [
    { title: t("org_title"), text: t("org_text") },
    { title: t("children_title"), text: t("children_text") },
    { title: t("incident_title"), text: t("incident_text") },
    { title: t("environment_title"), text: t("environment_text") },
    { title: t("equipment_title"), text: t("equipment_text") },
    { title: t("emergency_title"), text: t("emergency_text") },
    { title: t("background_title"), text: t("background_text") },
    { title: t("revision_title"), text: t("revision_text") },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{t("plan_title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{t("plan_intro")}</p>

      {/* Sub-page quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {hmsSubPages.map(({ key, path }) => (
          <Link
            key={key}
            href={`/${locale}${path}`}
            className="bg-white border border-mist rounded-lg px-4 py-3 text-sm font-medium text-navy hover:border-tkk-blue hover:text-teal transition-colors shadow-sm"
          >
            {tn(key)} →
          </Link>
        ))}
      </div>

      <div className="space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <div className="w-8 border-t-2 border-teal mb-2" />
            <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
            <p className="text-slate leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
