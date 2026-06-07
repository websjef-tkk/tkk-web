import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import type { FlexiblePage } from "@/lib/queries/page";

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a href={value?.href} className="text-teal underline hover:text-navy" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-display font-bold text-navy text-2xl mb-3 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-semibold text-navy text-xl mb-2 mt-6">{children}</h3>
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
  const body = (locale === "no" ? page.body?.no : (page.body?.en ?? page.body?.no)) as unknown[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {backHref && (
        <Link href={backHref} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
          {backLabel ?? (locale === "no" ? "← Tilbake" : "← Back")}
        </Link>
      )}
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{title}</h1>
      {intro && (
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
      )}
      {body?.length ? (
        <div className="prose prose-slate max-w-none text-slate leading-relaxed mb-10">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PortableText value={body as any} components={portableTextComponents} />
        </div>
      ) : null}
      {extra}
    </div>
  );
}
