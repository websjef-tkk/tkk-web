import type { Metadata } from "next";
import { getFlexiblePage } from "@/lib/queries/page";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { richTextComponents } from "@/components/portableText/richTextComponents";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("medlemskap");
  return buildPageMetadata(page);
}

type Block = PortableTextBlock & { style?: string };
type Section = { title: string; blocks: Block[] };

/** Hele teksten i en blokk, på tvers av lenker og formatering. */
function plainText(block: Block): string {
  return (block.children ?? []).map((c) => ("text" in c && typeof c.text === "string" ? c.text : "")).join("");
}

function splitBySections(blocks: unknown[]): Section[] {
  const result: Section[] = [];
  let current: Section | null = null;
  for (const b of blocks as Block[]) {
    if (b.style === "h2") {
      if (current) result.push(current);
      current = { title: plainText(b), blocks: [] };
    } else if (current && plainText(b)) {
      current.blocks.push(b);
    }
  }
  if (current) result.push(current);
  return result;
}

// Lenker og formatering beholdes, men avsnitt- og listeinnpakningen droppes
// siden siden har sitt eget oppsett rundt hver tekstlinje.
const inlineComponents = { ...richTextComponents, block: { normal: ({ children }) => <>{children}</> } } satisfies PortableTextComponents;

function InlineText({ block }: { block: Block }) {
  return (
    <PortableText
      value={{ ...block, style: "normal", listItem: undefined, level: undefined }}
      components={inlineComponents}
    />
  );
}

/** Hele brødteksten i en seksjon — alle avsnitt og punktlister, med lenker. */
function BoxText({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose prose-sm prose-slate max-w-none text-slate leading-relaxed">
      <PortableText value={blocks} components={richTextComponents} />
    </div>
  );
}

/** Deler "Kategori: pris" ved siste kolon; prisen må stå i den siste tekstbiten. */
function splitPrice(block: Block): [Block, string] {
  const children = block.children ?? [];
  const last = children[children.length - 1];
  const lastText = last && "text" in last && typeof last.text === "string" ? last.text : "";
  const idx = lastText.lastIndexOf(": ");
  if (idx === -1) return [block, ""];
  return [
    { ...block, children: [...children.slice(0, -1), { ...last, text: lastText.slice(0, idx) }] },
    lastText.slice(idx + 2),
  ];
}

export default async function MedlemskapPage() {
  const page = await getFlexiblePage("medlemskap");
  if (!page) notFound();

  const title = page.title.no;
  const intro = page.intro?.no;

  const rawBody = page.body?.no ?? [];
  const sections = splitBySections(rawBody);

  const priceRows = (sections[0]?.blocks ?? []).map(splitPrice);
  const benefits = sections[1]?.blocks ?? [];
  const qualBlocks = sections[2]?.blocks ?? [];
  const afterBlocks = sections[3]?.blocks ?? [];

  const secTitle = (i: number) => sections[i]?.title ?? "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs path="medlemskap" current={title} />
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
                    Kategori
                  </th>
                  <th className="text-right px-4 py-3 font-semibold">
                    Pris
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map(([cat, price], i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-4 py-3 text-slate"><InlineText block={cat} /></td>
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
                <span className="text-slate text-sm leading-relaxed"><InlineText block={b} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {qualBlocks.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h3 className="font-display font-bold text-navy text-lg mb-2">{secTitle(2)}</h3>
            <BoxText blocks={qualBlocks} />
          </div>
        )}
        {afterBlocks.length > 0 && (
          <div className="bg-tkk-blue/10 rounded-lg p-6 border border-tkk-blue/20">
            <h3 className="font-display font-bold text-navy text-lg mb-2">{secTitle(3)}</h3>
            <BoxText blocks={afterBlocks} />
          </div>
        )}
      </div>

      <div className="bg-navy rounded-xl p-8 text-center">
        <h2 className="font-display font-bold text-white text-2xl mb-2">
          Klar til å bli medlem?
        </h2>
        <p className="text-white/70 text-sm mb-6">
          Meld deg inn via Min Idrett — det tar under 5 minutter.
        </p>
        <Link
          href="https://www.minidrett.no"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-tkk-blue text-navy font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors text-sm"
        >
          Meld deg inn via Min Idrett →
        </Link>
      </div>
    </div>
  );
}
