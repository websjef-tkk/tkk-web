import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { getAllBlogPosts } from "@/lib/queries/blog";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function TurrapporterPage({ params }: PageProps) {
  const { locale } = await params;
  const allPosts = await getAllBlogPosts();
  const posts = allPosts.filter((p) => p.category === "turrapport");
  const isNo = locale === "no";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${locale}/padling/hav`}
        className="text-sm text-teal hover:underline mb-6 inline-block"
      >
        ← {isNo ? "Tilbake til Havpadling" : "Back to Sea Kayaking"}
      </Link>
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-10">
        {isNo ? "Turrapporter" : "Trip Reports"}
      </h1>
      {posts.length === 0 ? (
        <p className="text-slate">
          {isNo ? "Ingen turrapporter ennå." : "No trip reports yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              post={post}
              locale={locale}
              readMoreLabel={isNo ? "Les mer" : "Read more"}
              byLabel={isNo ? "av" : "by"}
              categoryLabels={{ turrapport: isNo ? "Turrapport" : "Trip report" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
