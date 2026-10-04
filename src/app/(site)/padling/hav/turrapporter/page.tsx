import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/queries/blog";

export const revalidate = 3600;

export default async function TurrapporterPage() {
  const allPosts = await getAllBlogPosts();
  const posts = allPosts.filter((p) => p.category === "turrapport");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        path="padling/hav/turrapporter"
        current="Turrapporter"
        back={
          <Link href="/padling/hav" className="hover:text-teal hover:underline">
            ← Tilbake til Havpadling
          </Link>
        }
      />
      <h1 className="font-display font-bold text-navy text-4xl mb-10">
        Turrapporter
      </h1>
      {posts.length === 0 ? (
        <p className="text-slate">
          Ingen turrapporter ennå.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              post={post}
              readMoreLabel="Les mer"
              byLabel="av"
              categoryLabels={{ turrapport: "Turrapport" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
