import BlogCard from "@/components/BlogCard";
import { getAllBlogPosts } from "@/lib/queries/blog";
import { BLOG_CATEGORY_LABELS } from "@/lib/labels";

export const revalidate = 3600;

export default async function BloggPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-10">Blogg og nyheter</h1>
      {posts.length === 0 ? (
        <p className="text-slate">Ingen innlegg ennå.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              post={post}
              readMoreLabel="Les mer"
              byLabel="Av"
              categoryLabels={BLOG_CATEGORY_LABELS}
            />
          ))}
        </div>
      )}
    </div>
  );
}
