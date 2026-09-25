import { draftMode } from "next/headers";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getMainMenu } from "@/lib/queries/menu";

/**
 * Rammen rundt selve nettstedet — meny og bunntekst. Sanity Studio ligger
 * utenfor denne gruppen, og skal vises uten klubbens meny.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const menu = await getMainMenu();
  const isDraft = (await draftMode()).isEnabled;
  return (
    <>
      {isDraft && (
        <div className="bg-amber-400 text-navy text-sm font-medium text-center py-2 px-4">
          Du ser en kladd — ikke publisert innhold.{" "}
          <Link href="/api/disable-draft" className="underline font-semibold">
            Avslutt forhåndsvisning
          </Link>
        </div>
      )}
      <Nav menu={menu} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
