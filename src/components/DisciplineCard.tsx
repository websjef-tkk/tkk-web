import Link from "next/link";

type Props = {
  title: string;
  href: string;
  emoji: string;
  readMore: string;
};

export default function DisciplineCard({ title, href, emoji, readMore }: Props) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-xl border-t-4 border-tkk-blue shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className="font-display font-bold text-navy text-lg mb-2">{title}</h3>
      <span className="text-teal text-sm font-semibold group-hover:underline">{readMore} →</span>
    </Link>
  );
}
