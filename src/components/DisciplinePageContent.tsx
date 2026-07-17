import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { DisciplinePage } from "@/lib/queries/page";
import { richTextComponents } from "@/components/portableText/richTextComponents";

type Props = {
  page: DisciplinePage;
  locale: string;
};

export default function DisciplinePageContent({ page, locale }: Props) {
  const isNo = locale === "no";
  const title = isNo ? page.title.no : (page.title.en ?? page.title.no);
  const intro = isNo ? page.intro?.no : (page.intro?.en ?? page.intro?.no);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (isNo ? page.body?.no : (page.body?.en ?? page.body?.no)) as any[] | undefined;
  const heroImageUrl = page.heroImage?.asset
    ? urlFor(page.heroImage).width(1200).height(600).url()
    : "/images/hav.jpg";
  const heroAlt = page.heroImage?.alt ?? title;

  return (
    <article>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image src={heroImageUrl} alt={heroAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 flex items-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">{title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {intro && (
          <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
        )}

        {body?.length ? (
          <div className="prose prose-slate max-w-none text-slate leading-relaxed mb-14">
            <PortableText value={body} components={richTextComponents} />
          </div>
        ) : null}

        <div className="mt-10">
          <Link
            href={`/${locale}/aktiviteter`}
            className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            {isNo ? "Se kommende turer →" : "View upcoming trips →"}
          </Link>
        </div>
      </div>

      {page.subPageLinks && page.subPageLinks.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy text-2xl mb-8">
              {isNo ? "Mer om dette" : "Learn more"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.subPageLinks.map((link) => {
                const linkTitle = isNo ? (link.title.no ?? link.title.en) : (link.title.en ?? link.title.no);
                return (
                  <Link
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    className="group block bg-white border border-slate-200 rounded-lg px-6 py-5 hover:border-teal hover:shadow-md transition-all"
                  >
                    <span className="font-semibold text-navy group-hover:text-teal transition-colors">
                      {linkTitle}
                    </span>
                    <span className="block text-teal text-sm mt-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
