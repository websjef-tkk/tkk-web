import { useTranslations } from "next-intl";
import BlogCard from "@/components/BlogCard";
import { getAllBlogPosts } from "@/lib/queries/blog";
import type { BlogPostSummary } from "@/lib/queries/blog";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export default async function BloggPage({ params }: PageProps) {
  const { locale } = await params;
  const posts = await getAllBlogPosts();
  return <BloggContent locale={locale} posts={posts} />;
}

function BloggContent({ locale, posts }: { locale: string; posts: BlogPostSummary[] }) {
  const t = useTranslations("blog");

  const catLabels: Record<string, string> = {
    category_tur: t("category_tur"),
    category_info: t("category_info"),
    category_klubb: t("category_klubb"),
    category_sosial: t("category_sosial"),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display font-bold text-navy text-4xl mb-10">{t("title")}</h1>
      {posts.length === 0 ? (
        <p className="text-slate">{locale === "no" ? "Ingen innlegg ennå." : "No posts yet."}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post._id}
              post={post}
              locale={locale}
              readMoreLabel={t("read_more")}
              byLabel={t("by")}
              categoryLabels={catLabels}
            />
          ))}
        </div>
      )}
    </div>
  );
}
