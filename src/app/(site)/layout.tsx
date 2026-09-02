import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getMainMenu } from "@/lib/queries/menu";

/**
 * Rammen rundt selve nettstedet — meny og bunntekst. Sanity Studio ligger
 * utenfor denne gruppen, og skal vises uten klubbens meny.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const menu = await getMainMenu();
  return (
    <>
      <Nav menu={menu} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
