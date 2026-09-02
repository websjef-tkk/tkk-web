import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import type { Partner } from "@/lib/queries/settings";

export const BENEFITS_HREF = "/medlemskap/fordeler";

export default function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-bold text-navy text-3xl mb-2">Samarbeidspartnere</h2>
        <p className="text-slate text-sm mb-8">
          Klikk på en logo for å se fordelene du får som medlem.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {partners.map((p, i) => (
            <Link
              key={i}
              href={BENEFITS_HREF}
              title={p.name ? `Fordeler hos ${p.name}` : "Medlemsfordeler"}
              className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {/* Fast ramme rundt hver logo slik at de opptar like mye plass
                  uansett hvilket format logofilen har. */}
              <div className="flex h-32 w-64 items-center justify-center">
                {p.logo ? (
                  <Image
                    src={urlFor(p.logo).width(520).height(260).fit("max").url()}
                    alt={p.name ?? ""}
                    width={520}
                    height={260}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="font-semibold text-navy text-lg">{p.name}</span>
                )}
              </div>
              {p.logo && p.name && <span className="text-xs text-slate font-medium">{p.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
