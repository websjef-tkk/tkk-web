import Link from "next/link";
import type { SubPageLink } from "@/lib/queries/page";

type Props = {
  links: SubPageLink[];
  heading?: string;
};

export default function SubPageLinksGrid({ links, heading = "Mer om dette" }: Props) {
  return (
    <div className="bg-slate-50 border-t border-slate-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-navy text-2xl mb-8">{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const linkTitle = link.title.no;
            return (
              <Link
                key={link.href}
                href={link.href}
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
  );
}
