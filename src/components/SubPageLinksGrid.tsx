import Link from "next/link";
import type { SubPageLink } from "@/lib/queries/page";
import { resolveContentLink } from "@/lib/linkResolver";

type Props = {
  links: SubPageLink[];
  heading?: string;
};

const cardClass =
  "group flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-6 py-5 hover:border-teal hover:shadow-md transition-all";

export default function SubPageLinksGrid({ links, heading = "Mer om dette" }: Props) {
  return (
    <div className="bg-slate-50 border-t border-slate-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-navy text-2xl mb-8">{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, i) => {
            const isPdf = link.linkType === "pdf";
            const href = isPdf ? link.pdfFile?.asset?.url : resolveContentLink(link);
            if (!href) return null;
            const newTab = !!link.openInNewTab;
            const content = (
              <>
                <span className="font-semibold text-navy group-hover:text-teal transition-colors">
                  {link.title.no}
                  {isPdf && <span className="text-xs align-super ml-0.5">(PDF)</span>}
                </span>
                <span className="text-teal text-sm group-hover:translate-x-1 transition-transform">→</span>
              </>
            );
            const key = `${href}-${i}`;
            if (href.startsWith("/") && !isPdf && !newTab) {
              return (
                <Link key={key} href={href} className={cardClass}>
                  {content}
                </Link>
              );
            }
            return (
              <a
                key={key}
                href={href}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noopener noreferrer" : undefined}
                download={isPdf ? link.pdfFile?.asset?.originalFilename : undefined}
                className={cardClass}
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
