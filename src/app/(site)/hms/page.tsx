import type { Metadata } from "next";
import Link from "next/link";
import { getChildPages, getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { buildPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("hms");
  return buildPageMetadata(page);
}

export default async function HmsPage() {
  const page = await getFlexiblePage("hms");
  if (page) {
    // Undersidene er sidene som ligger under HMS i Studio, så nye sider dukker opp her av seg selv.
    const subPages = await getChildPages(page._id);
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Breadcrumbs path="hms" current={page.title.no} />
          {subPages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
              {subPages.map(({ slug, title }) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="bg-white border border-mist rounded-lg px-4 py-3 text-sm font-medium text-navy hover:border-tkk-blue hover:text-teal transition-colors shadow-sm"
                >
                  {title} →
                </Link>
              ))}
            </div>
          )}
        </div>
        <FlexiblePageContent page={page} />
      </>
    );
  }
  return <HmsFallback />;
}

/** Brukes bare hvis flexiblePage-dokumentet "hms" ikke finnes i Sanity. */
function HmsFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs path="hms" current="Klubbens HMS-plan" />
      <h1 className="font-display font-bold text-navy text-4xl mb-4">Klubbens HMS-plan</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">
        Trondhjems Kajakklubb (TKK) er et idrettslag med ca. 500 medlemmer. Klubben har som mål å unngå
        hendelser som fører til skade på folk, miljø og utstyr.
      </p>
    </div>
  );
}
