import Link from "next/link";

type Section = { title: string; text: string };

type Props = {
  locale: string;
  title: string;
  intro: string;
  sections: Section[];
  backLabel: string;
  extra?: React.ReactNode;
};

export default function HmsSubLayout({ locale, title, intro, sections, backLabel, extra }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/hms`} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
        {backLabel}
      </Link>
      <h1 className="font-display font-bold text-navy text-4xl mb-4">{title}</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">{intro}</p>
      <div className="space-y-10 mb-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-display font-bold text-navy text-2xl mb-3">{s.title}</h2>
            <p className="text-slate leading-relaxed whitespace-pre-line">{s.text}</p>
          </div>
        ))}
      </div>
      {extra}
    </div>
  );
}
