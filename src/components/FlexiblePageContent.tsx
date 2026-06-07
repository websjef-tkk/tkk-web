import { PortableText } from "@portabletext/react";
import Link from "next/link";
import type { FlexiblePage } from "@/lib/queries/page";

const portableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} className="text-teal underline hover:text-navy" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

type Props = {
  page: FlexiblePage;
  locale: string;
  backHref?: string;
  backLabel?: string;
  extra?: React.ReactNode;
};

export default function FlexiblePageContent({ page, locale, backHref, backLabel, extra }: Props) {
  const title = locale === "no" ? page.title.no : (page.title.en ?? page.title.no);
  const intro = locale === "no" ? page.intro?.no : (page.intro?.en ?? page.intro?.no);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {backHref && (
        <Link href={backHref} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
          {backLabel ?? (locale === "no" ? "← Tilbake" : "← Back")}
        </Link>
      )}
      <div className="w-8 border-t-2 border-teal mb-2 mt-4" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{title}</h1>
      {intro && (
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
      )}
      <div className="space-y-10 mb-10">
        {page.sections?.map((s, i) => {
          const sTitle = locale === "no" ? s.title?.no : (s.title?.en ?? s.title?.no);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sBody = (locale === "no" ? s.body?.no : (s.body?.en ?? s.body?.no)) as any[];
          return (
            <div key={i}>
              {sTitle && (
                <>
                  <div className="w-8 border-t-2 border-teal mb-2" />
                  <h2 className="font-display font-bold text-navy text-2xl mb-3">{sTitle}</h2>
                </>
              )}
              {sBody?.length ? (
                <div className="prose prose-slate max-w-none text-slate leading-relaxed">
                  <PortableText value={sBody} components={portableTextComponents} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {extra}
    </div>
  );
}
