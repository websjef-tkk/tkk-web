import { useTranslations } from "next-intl";

type PageProps = { params: Promise<{ locale: string }> };

type Person = { role: { no: string; en: string }; name: string; phone: string; email: string };

const board: Person[] = [
  { role: { no: "Leder", en: "Chair" }, name: "Chris Thomas Skogli", phone: "476 44 224", email: "leder@tkk.no" },
  { role: { no: "Nestleder", en: "Vice Chair" }, name: "Isabelle Sande", phone: "902 99 808", email: "nestleder@tkk.no" },
  { role: { no: "Kasserer", en: "Treasurer" }, name: "Monica Engan Døhl", phone: "990 06 484", email: "kasserer@tkk.no" },
  { role: { no: "Styremedlem", en: "Board member" }, name: "Øyvind Anda", phone: "", email: "post@tkk.no" },
  { role: { no: "Styremedlem", en: "Board member" }, name: "Ulf Stordalmo", phone: "", email: "post@tkk.no" },
  { role: { no: "Styremedlem", en: "Board member" }, name: "Hans Helmer Sæternes", phone: "", email: "post@tkk.no" },
];

const leaders: Person[] = [
  { role: { no: "Havpadling", en: "Sea kayaking" }, name: "Frode Vassenden", phone: "414 10 163", email: "hav@tkk.no" },
  { role: { no: "Elvepadling", en: "River kayaking" }, name: "Øyvind Inge Bakksjø", phone: "922 83 522", email: "elv@tkk.no" },
  { role: { no: "Kajakkpolo", en: "Kayak polo" }, name: "Sofie Gradmann", phone: "968 04 684", email: "polo@tkk.no" },
  { role: { no: "Flattvann", en: "Flat water" }, name: "Fernando J Perez-Fernandez", phone: "454 12 494", email: "flattvann@tkk.no" },
  { role: { no: "Junior", en: "Junior" }, name: "Anders Foldvik", phone: "402 03 036", email: "junior@tkk.no" },
  { role: { no: "Surfski", en: "Surfski" }, name: "Torleif Holm", phone: "977 53 020", email: "surfski@tkk.no" },
];

const others: Person[] = [
  { role: { no: "Hyllemann / Medlemskoord.", en: "Storage / Membership coord." }, name: "Magne Lysberg", phone: "450 65 636", email: "hyllemann@tkk.no" },
  { role: { no: "Husansvarlig", en: "Building manager" }, name: "André Sæther Berger", phone: "454 25 851", email: "hussjef@tkk.no" },
  { role: { no: "Sosialkoordinator", en: "Social coordinator" }, name: "Håvard Dahlen", phone: "970 79 822", email: "sosialt@tkk.no" },
  { role: { no: "Politiattestansvarlig", en: "Background check coordinator" }, name: "Isabelle Sande", phone: "902 99 808", email: "politiattest@tkk.no" },
  { role: { no: "Barneidrettsansvarlig", en: "Youth sports coordinator" }, name: "Anders Foldvik", phone: "402 03 036", email: "junior@tkk.no" },
  { role: { no: "Paraansvarlig", en: "Para sports coordinator" }, name: "Kristian Rye", phone: "452 64 480", email: "para@tkk.no" },
];

export default async function OmKlubbenPage({ params }: PageProps) {
  const { locale } = await params;
  return <OmKlubbenContent locale={locale} />;
}

function OmKlubbenContent({ locale }: { locale: string }) {
  const t = useTranslations("about");
  const isNo = locale === "no";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-6">{t("title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-12">{t("intro")}</p>

      <section className="mb-12">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-2xl mb-3">{t("values_title")}</h2>
        <p className="text-slate leading-relaxed">{t("values_text")}</p>
      </section>

      <PersonTable title={t("board_title")} people={board} isNo={isNo} />
      <PersonTable title={t("leaders_title")} people={leaders} isNo={isNo} />
      <PersonTable title={isNo ? "Andre" : "Others"} people={others} isNo={isNo} />

      <section className="mt-12">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-2xl mb-4">{t("partners_title")}</h2>
        <div className="flex flex-wrap gap-4">
          <a href="https://www.padlespesialisten.no" target="_blank" rel="noopener noreferrer"
            className="bg-white border border-mist rounded-lg px-5 py-3 text-navy hover:border-tkk-blue transition-colors text-sm font-medium">
            Padlespesialisten
          </a>
          <a href="https://www.padling.no" target="_blank" rel="noopener noreferrer"
            className="bg-white border border-mist rounded-lg px-5 py-3 text-navy hover:border-tkk-blue transition-colors text-sm font-medium">
            Norges Padleforbund
          </a>
        </div>
        <p className="mt-6 text-slate text-sm">{t("orgnr")}: 990 255 105</p>
      </section>
    </div>
  );
}

function PersonTable({ title, people, isNo }: { title: string; people: Person[]; isNo: boolean }) {
  return (
    <section className="mb-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h2 className="font-display font-bold text-navy text-2xl mb-5">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {people.map((p, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-mist"}>
                <td className="px-5 py-3 text-slate">{isNo ? p.role.no : p.role.en}</td>
                <td className="px-5 py-3 font-medium text-navy">{p.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-slate">{p.phone}</td>
                <td className="px-4 py-3 w-8">
                  <a href={`mailto:${p.email}`} title={p.email} className="text-teal hover:text-navy transition-colors inline-flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
