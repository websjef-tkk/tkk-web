import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { DisciplinePage } from "@/lib/queries/page";

type Props = {
  page: DisciplinePage;
  locale: string;
};

export default function DisciplinePageContent({ page, locale }: Props) {
  const title = locale === "no" ? page.title.no : (page.title.en ?? page.title.no);
  const intro = locale === "no" ? page.intro?.no : (page.intro?.en ?? page.intro?.no);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (locale === "no" ? page.body?.no : (page.body?.en ?? page.body?.no)) as any[] | undefined;
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
            <PortableText value={body} />
          </div>
        ) : null}

        <div className="mt-10">
          <Link
            href={`/${locale}/aktiviteter`}
            className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
          >
            {locale === "no" ? "Se kommende turer →" : "View upcoming trips →"}
          </Link>
        </div>
      </div>
    </article>
  );
}
