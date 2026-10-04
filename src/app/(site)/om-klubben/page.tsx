import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import { getAllPeople } from "@/lib/queries/people";
import type { SanityPerson } from "@/lib/queries/people";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { buildPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("om-klubben");
  return buildPageMetadata(page);
}

export default async function OmKlubbenPage() {
  const [page, people] = await Promise.all([getFlexiblePage("om-klubben"), getAllPeople()]);
  const peopleTables = <PeopleTables people={people} />;

  if (page) {
    return <FlexiblePageContent page={page} path="om-klubben" extra={peopleTables} />;
  }
  return <OmKlubbenFallback>{peopleTables}</OmKlubbenFallback>;
}

/** Brukes bare hvis flexiblePage-dokumentet "om-klubben" ikke finnes (ennå) i Sanity. */
function OmKlubbenFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs path="om-klubben" current="Om klubben" />
      <h1 className="font-display font-bold text-navy text-4xl mb-6">Om klubben</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-12">
        Trondhjems Kajakklubb er en av Norges største kajakklubber, med rundt 500 medlemmer og seks aktive grener.
      </p>

      <section className="mb-12">
        <h2 className="font-display font-bold text-navy text-2xl mb-3">Våre verdier</h2>
        <p className="text-slate leading-relaxed">Trivsel, eventyrlyst og inkludering. Vi tar vare på hverandre på vannet og på land.</p>
      </section>

      <section className="mb-12">
        <h2 className="font-display font-bold text-navy text-2xl mb-3">Slik driftes klubben</h2>
        <p className="text-slate leading-relaxed">
          Klubben styres av en organisasjonsplan som vedtas av årsmøtet, og av klubbens vedtekter.
        </p>
      </section>

      {children}
    </div>
  );
}

function PeopleTables({ people }: { people: SanityPerson[] }) {
  const board = people.filter((p) => p.group === "board");
  const leaders = people.filter((p) => p.group === "leaders");
  const others = people.filter((p) => p.group === "others");

  return (
    <>
      {board.length > 0 && <PersonTable title="Styre" people={board} />}
      {leaders.length > 0 && <PersonTable title="Gruppeledere" people={leaders} />}
      {others.length > 0 && <PersonTable title="Andre" people={others} />}
    </>
  );
}

function PersonTable({ title, people }: { title: string; people: SanityPerson[] }) {
  return (
    <section className="mb-12">
      <h2 className="font-display font-bold text-navy text-2xl mb-5">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-mist overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {people.map((p, i) => (
              <tr key={p._id} className={i % 2 === 0 ? "bg-white" : "bg-mist"}>
                <td className="px-5 py-3 text-slate">{p.role.no}</td>
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
