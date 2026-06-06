import { useTranslations } from "next-intl";
import Link from "next/link";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function HmsPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getFlexiblePage("hms");
  if (page) {
    return <HmsOverviewWithSanity locale={locale} page={page} />;
  }
  return <HmsFallback locale={locale} />;
}

function HmsOverviewWithSanity({
  locale,
  page,
}: {
  locale: string;
  page: Awaited<ReturnType<typeof getFlexiblePage>>;
}) {
  const tn = useTranslations("nav");

  const hmsSubPages = [
    { key: "hms_generelt" as const, path: "/hms/generelt" },
    { key: "hms_hav" as const, path: "/hms/hav" },
    { key: "hms_elv" as const, path: "/hms/elv" },
    { key: "mitt_varsel" as const, path: "/hms/mitt-varsel" },
    { key: "hendelsesrapporter" as const, path: "/hms/hendelsesrapporter" },
    { key: "politiattest" as const, path: "/hms/politiattest" },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
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
      </div>
      <FlexiblePageContent page={page!} locale={locale} />
    </>
  );
}

function HmsFallback({ locale }: { locale: string }) {
  const t = useTranslations("hms");
  const tn = useTranslations("nav");

  const hmsSubPages = [
    { key: "hms_generelt" as const, path: "/hms/generelt" },
    { key: "hms_hav" as const, path: "/hms/hav" },
    { key: "hms_elv" as const, path: "/hms/elv" },
    { key: "mitt_varsel" as const, path: "/hms/mitt-varsel" },
    { key: "hendelsesrapporter" as const, path: "/hms/hendelsesrapporter" },
    { key: "politiattest" as const, path: "/hms/politiattest" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{t("plan_title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{t("plan_intro")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
    </div>
  );
}
