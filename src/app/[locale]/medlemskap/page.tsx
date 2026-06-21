import { getFlexiblePage } from "@/lib/queries/page";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

type Block = { style?: string; children?: { text?: string }[] };

function splitBySections(blocks: unknown[]): { title: string; texts: string[] }[] {
  const result: { title: string; texts: string[] }[] = [];
  let current: { title: string; texts: string[] } | null = null;
  for (const b of blocks as Block[]) {
    if (b.style === "h2") {
      if (current) result.push(current);
      current = { title: b.children?.[0]?.text ?? "", texts: [] };
    } else if (current) {
      const text = b.children?.[0]?.text ?? "";
      if (text) current.texts.push(text);
    }
  }
  if (current) result.push(current);
  return result;
}

function parsePrice(line: string): [string, string] {
  const idx = line.lastIndexOf(": ");
  if (idx === -1) return [line, ""];
  return [line.slice(0, idx), line.slice(idx + 2)];
}

export default async function MedlemskapPage({ params }: PageProps) {
  const { locale } = await params;
  const page = await getFlexiblePage("medlemskap");
  if (!page) notFound();

  const no = locale === "no";
  const title = no ? page.title.no : (page.title.en ?? page.title.no);
  const intro = no ? page.intro?.no : (page.intro?.en ?? page.intro?.no);

  const rawBody = (no ? page.body?.no : (page.body?.en ?? page.body?.no)) ?? [];
  const sections = splitBySections(rawBody);

  const priceRows = (sections[0]?.texts ?? []).map(parsePrice);
  const benefits = sections[1]?.texts ?? [];
  const qualText = sections[2]?.texts[0];
  const afterText = sections[3]?.texts[0];

  const secTitle = (i: number) => sections[i]?.title ?? "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{title}</h1>
      {intro && (
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Pricing table */}
        <div>
          <h2 className="font-display font-bold text-navy text-2xl mb-4">{secTitle(0)}</h2>
          <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-4 py-3 font-semibold">
                    {no ? "Kategori" : "Category"}
                  </th>
                  <th className="text-right px-4 py-3 font-semibold">
                    {no ? "Pris" : "Price"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map(([cat, price], i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-4 py-3 text-slate">{cat}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy whitespace-nowrap">
                      {price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefits list */}
        <div>
          <h2 className="font-display font-bold text-navy text-2xl mb-4">{secTitle(1)}</h2>
          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center">
                  <svg className="w-3 h-3 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-slate text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {qualText && (
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h3 className="font-display font-bold text-navy text-lg mb-2">{secTitle(2)}</h3>
            <p className="text-slate text-sm leading-relaxed">{qualText}</p>
          </div>
        )}
        {afterText && (
          <div className="bg-tkk-blue/10 rounded-lg p-6 border border-tkk-blue/20">
            <h3 className="font-display font-bold text-navy text-lg mb-2">{secTitle(3)}</h3>
            <p className="text-slate text-sm leading-relaxed">{afterText}</p>
          </div>
        )}
      </div>

      <div className="bg-navy rounded-xl p-8 text-center">
        <h2 className="font-display font-bold text-white text-2xl mb-2">
          {no ? "Klar til å bli medlem?" : "Ready to join?"}
        </h2>
        <p className="text-white/70 text-sm mb-6">
          {no
            ? "Meld deg inn via Min Idrett — det tar under 5 minutter."
            : "Sign up via Min Idrett — it takes under 5 minutes."}
        </p>
        <Link
          href="https://www.minidrett.no"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-tkk-blue text-navy font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors text-sm"
        >
          {no ? "Meld deg inn via Min Idrett →" : "Join via Min Idrett →"}
        </Link>
      </div>
    </div>
  );
}
