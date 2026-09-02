import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { FlexiblePage } from "@/lib/queries/page";
import { richTextComponents } from "@/components/portableText/richTextComponents";

type Props = {
  page: FlexiblePage;
  backHref?: string;
  backLabel?: string;
  extra?: React.ReactNode;
};

export default function FlexiblePageContent({ page, backHref, backLabel, extra }: Props) {
  const title = page.title.no;
  const intro = page.intro?.no;
  const body = page.body?.no as unknown[];
  const heroImageUrl = page.heroImage?.asset
    ? urlFor(page.heroImage).width(1200).height(600).url()
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {backHref && (
        <Link href={backHref} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
          {backLabel ?? "← Tilbake"}
        </Link>
      )}
      {heroImageUrl && (
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image src={heroImageUrl} alt={page.heroImage?.alt ?? title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-navy/30" />
        </div>
      )}
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{title}</h1>
      {intro && (
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
      )}
      {body?.length ? (
        <div className="prose prose-slate max-w-none text-slate leading-relaxed mb-10">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PortableText value={body as any} components={richTextComponents} />
        </div>
      ) : null}
      {extra}
    </div>
  );
}
