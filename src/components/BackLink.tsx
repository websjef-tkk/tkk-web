"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  /** Brukes når det ikke finnes en forrige side på nettstedet å gå tilbake til. */
  fallbackHref: string;
  className?: string;
  children: React.ReactNode;
};

/** Sant når forrige side i nettleserhistorikken er en side på dette nettstedet. */
function canGoBackOnSite() {
  const navigation = (window as { navigation?: { canGoBack?: boolean } }).navigation;
  if (typeof navigation?.canGoBack === "boolean") return navigation.canGoBack;
  return window.history.length > 1 && document.referrer.startsWith(window.location.origin);
}

/**
 * Tilbake-lenke som går til forrige side i nettleserhistorikken. Kom den
 * besøkende rett inn på siden (f.eks. fra et søk eller en delt lenke), finnes
 * det ingen forrige side hos oss, og lenken går til fallbackHref i stedet.
 */
export default function BackLink({ fallbackHref, className, children }: Props) {
  const router = useRouter();

  return (
    <Link
      href={fallbackHref}
      className={className}
      onClick={(e) => {
        // La nettleseren håndtere "åpne i ny fane" og lignende selv.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!canGoBackOnSite()) return;
        e.preventDefault();
        router.back();
      }}
    >
      {children}
    </Link>
  );
}
