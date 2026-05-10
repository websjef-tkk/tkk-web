import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
  emoji: string;
  readMore: string;
};

export default function DisciplineCard({ title, description, href, emoji, readMore }: Props) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-xl border-t-4 border-tkk-blue shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-display font-bold text-navy text-xl mb-2">{title}</h3>
      <p className="text-slate text-sm leading-relaxed mb-4">{description}</p>
      <span className="text-teal text-sm font-semibold group-hover:underline">{readMore} →</span>
    </Link>
  );
}
