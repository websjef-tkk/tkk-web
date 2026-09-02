import type { Metadata } from "next";
import Link from "next/link";
import { getFlexiblePage } from "@/lib/queries/page";
import FlexiblePageContent from "@/components/FlexiblePageContent";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const HMS_SUB_PAGES = [
  { label: "HMS generelt", path: "/hms/generelt" },
  { label: "HMS hav", path: "/hms/hav" },
  { label: "HMS elv", path: "/hms/elv" },
  { label: "Mitt varsel", path: "/hms/mitt-varsel" },
  { label: "Hendelsesrapporter", path: "/hms/hendelsesrapporter" },
  { label: "Politiattest", path: "/hms/politiattest" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFlexiblePage("hms");
  return buildPageMetadata(page);
}

export default async function HmsPage() {
  const page = await getFlexiblePage("hms");
  if (page) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            <HmsSubPageLinks />
          </div>
        </div>
        <FlexiblePageContent page={page} />
      </>
    );
  }
  return <HmsFallback />;
}

function HmsSubPageLinks() {
  return (
    <>
      {HMS_SUB_PAGES.map(({ label, path }) => (
        <Link
          key={path}
          href={path}
          className="bg-white border border-mist rounded-lg px-4 py-3 text-sm font-medium text-navy hover:border-tkk-blue hover:text-teal transition-colors shadow-sm"
        >
          {label} →
        </Link>
      ))}
    </>
  );
}

function HmsFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-4">Klubbens HMS-plan</h1>
      <p className="text-slate text-lg leading-relaxed border-l-4 border-tkk-blue pl-5 mb-10">
        Trondhjems Kajakklubb (TKK) er et idrettslag med ca. 500 medlemmer. Klubben har som mål å unngå
        hendelser som fører til skade på folk, miljø og utstyr.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <HmsSubPageLinks />
      </div>
    </div>
  );
}
