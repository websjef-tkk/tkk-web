import Image from "next/image";
import Link from "next/link";

type Section = {
  title: string;
  text: string;
};

type Props = {
  title: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  sections: Section[];
  linkLabel?: string;
  linkHref?: string;
};

export default function PaddlingPageLayout({
  title,
  intro,
  imageSrc,
  imageAlt,
  sections,
  linkLabel,
  linkHref,
}: Props) {
  return (
    <article>
      {/* Page hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 flex items-end pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold">{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-12">
          {intro}
        </p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
              <p className="text-slate leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {linkLabel && linkHref && (
          <div className="mt-12">
            <Link
              href={linkHref}
              className="inline-block bg-tkk-blue text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition-colors text-sm"
            >
              {linkLabel}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
