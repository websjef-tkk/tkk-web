import { useTranslations } from "next-intl";
import { getAllPeople } from "@/lib/queries/people";
import type { SanityPerson } from "@/lib/queries/people";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function KontaktPage({ params }: PageProps) {
  const { locale } = await params;
  const people = await getAllPeople();
  return <KontaktContent locale={locale} people={people} />;
}

function KontaktContent({ locale, people }: { locale: string; people: SanityPerson[] }) {
  const t = useTranslations("contact");
  const isNo = locale === "no";

  const board = people.filter((p) => p.group === "board");
  const leaders = people.filter((p) => p.group === "leaders");
  const others = people.filter((p) => p.group === "others");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-10">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div className="bg-white rounded-xl border border-mist shadow-sm p-6">
          <h2 className="font-display font-bold text-navy text-xl mb-4">{t("address_title")}</h2>
          <div className="space-y-3 text-sm text-slate">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-1">{t("visiting")}</p>
              <p>Nedre Ila 12</p>
              <p>7018 Trondheim</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-1">{t("postal")}</p>
              <p>Postboks 9167 Ilsvika</p>
              <p>7428 Trondheim</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-1">{t("phone")}</p>
              <a href="tel:47644224" className="hover:text-teal transition-colors">476 44 224</a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-mist shadow-sm p-6">
          <h2 className="font-display font-bold text-navy text-xl mb-4">{t("social_title")}</h2>
          <div className="space-y-3 text-sm">
            <a href="https://www.instagram.com/trondhjemskajakklubb" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate hover:text-teal transition-colors">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @trondhjemskajakklubb
            </a>
            <a href="https://www.facebook.com/groups/trondhjemskajakklubb" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate hover:text-teal transition-colors">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>

      {board.length > 0 && <ContactTable title={t("board_title")} people={board} isNo={isNo} />}
      {leaders.length > 0 && <ContactTable title={t("leaders_title")} people={leaders} isNo={isNo} />}
      {others.length > 0 && <ContactTable title={isNo ? "Andre" : "Others"} people={others} isNo={isNo} />}

      <section className="mt-4">
        <div className="w-8 border-t-2 border-teal mb-2" />
        <h2 className="font-display font-bold text-navy text-2xl mb-4">{t("map_title")}</h2>
        <div className="rounded-xl overflow-hidden border border-mist shadow-sm">
          <iframe
            title="TKK Kart"
            src="https://www.openstreetmap.org/export/embed.html?bbox=10.367%2C63.429%2C10.397%2C63.443&layer=mapnik&marker=63.436%2C10.382"
            width="100%" height="340" className="block" loading="lazy"
          />
        </div>
        <p className="text-xs text-slate mt-2">
          <a href="https://www.openstreetmap.org/?mlat=63.436&mlon=10.382#map=15/63.436/10.382"
            target="_blank" rel="noopener noreferrer" className="hover:text-teal">
            Åpne i OpenStreetMap ↗
          </a>
        </p>
      </section>
    </div>
  );
}

function ContactTable({ title, people, isNo }: { title: string; people: SanityPerson[]; isNo: boolean }) {
  return (
    <section className="mb-10">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h2 className="font-display font-bold text-navy text-2xl mb-5">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {people.map((p, i) => (
              <tr key={p._id} className={i % 2 === 0 ? "bg-white" : "bg-mist"}>
                <td className="px-5 py-3 text-slate">{isNo ? p.role.no : (p.role.en ?? p.role.no)}</td>
                <td className="px-5 py-3 font-medium text-navy">{p.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {p.phone && <a href={`tel:${p.phone.replace(/\s/g, "")}`} className="text-teal hover:underline">{p.phone}</a>}
                </td>
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
