import { useTranslations } from "next-intl";
import { blogPosts } from "@/data/blog";
import BlogCard from "@/components/BlogCard";

type PageProps = { params: Promise<{ locale: string }> };

export default async function BloggPage({ params }: PageProps) {
  const { locale } = await params;
  return <BloggContent locale={locale} />;
}

function BloggContent({ locale }: { locale: string }) {
  const t = useTranslations("blog");

  const catLabels: Record<string, string> = {
    category_tur: t("category_tur"),
    category_info: t("category_info"),
    category_klubb: t("category_klubb"),
    category_sosial: t("category_sosial"),
  };

  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-8 border-t-2 border-teal mb-2" />
      <h1 className="font-display font-bold text-navy text-4xl mb-10">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((post) => (
          <BlogCard
            key={post.slug}
            post={post}
            locale={locale}
            readMoreLabel={t("read_more")}
            byLabel={t("by")}
            categoryLabels={catLabels}
          />
        ))}
      </div>
    </div>
  );
}
