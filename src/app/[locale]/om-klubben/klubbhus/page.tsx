import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: string }> };

export default async function KlubbhusPage({ params }: PageProps) {
  const { locale } = await params;
  return <KlubbhusContent locale={locale} />;
}

function KlubbhusContent({ locale }: { locale: string }) {
  const t = useTranslations("klubben");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-teal text-sm font-semibold mb-1">
        <Link href={`/${locale}/om-klubben`} className="hover:underline">
          {locale === "no" ? "← Klubben" : "← The club"}
        </Link>
      </p>
      <div className="w-8 border-t-2 border-teal mb-2 mt-4" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{t("clubhouse_title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{t("clubhouse_intro")}</p>

      {/* Skansen */}
      <div className="mb-10">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-2xl mb-3">{t("clubhouse_skansen_title")}</h2>
        <p className="text-slate leading-relaxed mb-4">{t("clubhouse_skansen_text")}</p>
        <div className="relative h-56 rounded-xl overflow-hidden">
          <Image src="/images/hav.jpg" alt="Skansen" fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/20" />
        </div>
      </div>

      {/* Østmarkneset */}
      <div className="mb-10">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-2xl mb-3">{t("clubhouse_ostmark_title")}</h2>
        <p className="text-slate leading-relaxed">{t("clubhouse_ostmark_text")}</p>
      </div>

      {/* Storage */}
      <div className="bg-white rounded-xl border border-mist shadow-sm p-6">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-xl mb-2">{t("clubhouse_storage_title")}</h2>
        <p className="text-slate leading-relaxed">{t("clubhouse_storage_text")}</p>
        <Link href={`/${locale}/kontakt`} className="inline-block mt-4 text-sm font-semibold text-teal hover:underline">
          {locale === "no" ? "Kontakt oss for venteliste →" : "Contact us for the waiting list →"}
        </Link>
      </div>
    </div>
  );
}
