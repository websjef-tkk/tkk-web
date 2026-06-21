import { useTranslations } from "next-intl";
import { getAllPeople } from "@/lib/queries/people";
import type { SanityPerson } from "@/lib/queries/people";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function OmKlubbenPage({ params }: PageProps) {
  const { locale } = await params;
  const people = await getAllPeople();
  return <OmKlubbenContent locale={locale} people={people} />;
}

function OmKlubbenContent({ locale, people }: { locale: string; people: SanityPerson[] }) {
  const t = useTranslations("about");
  const isNo = locale === "no";

  const board = people.filter((p) => p.group === "board");
  const leaders = people.filter((p) => p.group === "leaders");
  const others = people.filter((p) => p.group === "others");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-6">{t("title")}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-12">{t("intro")}</p>

      <section className="mb-12">
        <h2 className="font-display font-bold text-navy text-2xl mb-3">{t("values_title")}</h2>
        <p className="text-slate leading-relaxed">{t("values_text")}</p>
      </section>

      {board.length > 0 && <PersonTable title={t("board_title")} people={board} isNo={isNo} />}
      {leaders.length > 0 && <PersonTable title={t("leaders_title")} people={leaders} isNo={isNo} />}
      {others.length > 0 && <PersonTable title={isNo ? "Andre" : "Others"} people={others} isNo={isNo} />}

      <section className="mt-12">
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

function PersonTable({ title, people, isNo }: { title: string; people: SanityPerson[]; isNo: boolean }) {
  return (
    <section className="mb-12">
      <h2 className="font-display font-bold text-navy text-2xl mb-5">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {people.map((p, i) => (
              <tr key={p._id} className={i % 2 === 0 ? "bg-white" : "bg-mist"}>
                <td className="px-5 py-3 text-slate">{isNo ? p.role.no : (p.role.en ?? p.role.no)}</td>
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
