import { useTranslations } from "next-intl";

type PageProps = { params: Promise<{ locale: string }> };

export default async function MedlemskapPage({ params }: PageProps) {
  const { locale } = await params;
  return <MedlemskapContent locale={locale} />;
}

function MedlemskapContent({ locale }: { locale: string }) {
  const t = useTranslations("membership");

  const prices = [
    { label: t("price_adult"), amount: "800" },
    { label: t("price_youth"), amount: "400" },
    { label: t("price_child"), amount: "50" },
    { label: t("price_storage_skansen"), amount: "750" },
    { label: t("price_storage_ostmark"), amount: "600" },
  ];

  const included = [
    t("included_equipment"),
    t("included_tours"),
    t("included_pool"),
    t("included_social"),
    t("included_discount"),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-10">{t("title")}</h1>

      {/* How to join */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-navy text-2xl mb-3">{t("how_title")}</h2>
        <p className="text-slate leading-relaxed mb-5">{t("how_text")}</p>
        <a
          href="https://www.minidrett.no"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
        >
          {t("minyidrett_btn")} →
        </a>
      </section>

      {/* Prices */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-navy text-2xl mb-5">{t("prices_title")}</h2>
        <div className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {prices.map((p, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-mist"}>
                  <td className="px-5 py-3 text-slate">{p.label}</td>
                  <td className="px-5 py-3 text-right font-semibold text-navy">kr {p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Included */}
      <section className="mb-12">
        <h2 className="font-display font-bold text-navy text-2xl mb-5">{t("included_title")}</h2>
        <ul className="space-y-3">
          {included.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate">
              <span className="text-tkk-blue font-bold mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Qualifications */}
      <section className="mb-12 bg-white rounded-xl border border-mist p-6 shadow-sm">
        <h2 className="font-display font-bold text-navy text-xl mb-3">{t("qual_title")}</h2>
        <p className="text-slate leading-relaxed">{t("qual_text")}</p>
      </section>

      {/* After joining */}
      <section className="border-l-4 border-sand pl-5">
        <h2 className="font-display font-bold text-navy text-xl mb-2">{t("after_title")}</h2>
        <p className="text-slate leading-relaxed">{t("after_text")}</p>
      </section>
    </div>
  );
}
