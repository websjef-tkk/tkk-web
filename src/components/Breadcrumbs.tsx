import Link from "next/link";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

type Props = {
  /** Sidens adresse uten skråstrek først, f.eks. "padling/hav/reolplasser". */
  path: string;
  /** Tittelen på siden man står på — vises sist og er ikke en lenke. */
  current: string;
  /** Tilbake-lenke som vises på samme linje, foran stien. */
  back?: React.ReactNode;
};

export default async function Breadcrumbs({ path, current, back }: Props) {
  const crumbs = await getBreadcrumbs(path, current);

  return (
    <nav
      aria-label="Brødsmulesti"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 text-xs text-slate/70"
    >
      {back}
      {back && <span aria-hidden="true" className="h-3 border-l border-slate/30" />}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map(({ label, href }, i) => (
          <li key={href ?? label} className="flex items-center gap-x-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-slate/30">
                /
              </span>
            )}
            {href ? (
              <Link href={href} className="hover:text-teal hover:underline">
                {label}
              </Link>
            ) : (
              <span aria-current="page">
                {label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
