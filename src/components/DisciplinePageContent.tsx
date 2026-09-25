import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { DisciplinePage } from "@/lib/queries/page";
import { richTextComponents } from "@/components/portableText/richTextComponents";
import { resolveContentLink } from "@/lib/linkResolver";
import SubPageLinksGrid from "@/components/SubPageLinksGrid";

type Props = {
  page: DisciplinePage;
};

export default function DisciplinePageContent({ page }: Props) {
  const title = page.title.no;
  const tagline = page.tagline?.no;
  const intro = page.intro?.no;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = page.body?.no as any[] | undefined;
  const heroImageUrl = page.heroImage?.asset
    ? urlFor(page.heroImage).width(1200).height(600).url()
    : "/images/hav.jpg";
  const heroAlt = page.heroImage?.alt ?? title;

  return (
    <article>
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image src={heroImageUrl} alt={heroAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">{title}</h1>
          {tagline && <p className="text-tkk-blue font-semibold mt-1">{tagline}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {intro && (
          <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
        )}

        {page.safetyLinks && page.safetyLinks.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-6 mb-10">
            <h2 className="flex items-center gap-2 font-display font-bold text-navy text-xl mb-4">
              <span aria-hidden="true">🛟</span> Sikker padling
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.safetyLinks.map((link, i) => {
                const isPdf = link.linkType === "pdf";
                const href = isPdf ? link.pdfFile?.asset?.url : resolveContentLink(link);
                if (!href) return null;
                const newTab = !!link.openInNewTab;
                return (
                  <a
                    key={`${link.label}-${i}`}
                    href={href}
                    target={newTab ? "_blank" : undefined}
                    rel={newTab ? "noopener noreferrer" : undefined}
                    download={isPdf ? link.pdfFile?.asset?.originalFilename : undefined}
                    className="bg-white border border-amber-200 rounded-lg px-4 py-3 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors shadow-sm"
                  >
                    {link.label} →{isPdf && <span className="text-xs align-super ml-0.5">(PDF)</span>}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {body?.length ? (
          <div className="prose prose-slate max-w-none text-slate leading-relaxed mb-14">
            <PortableText value={body} components={richTextComponents} />
          </div>
        ) : null}

        <div className="mt-10">
          <Link
            href="/aktiviteter"
            className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            Se kommende turer →
          </Link>
        </div>
      </div>

      {page.subPageLinks && page.subPageLinks.length > 0 && (
        <SubPageLinksGrid links={page.subPageLinks} />
      )}
    </article>
  );
}
