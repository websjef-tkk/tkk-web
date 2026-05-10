import { useTranslations } from "next-intl";
import { blogPosts } from "@/data/blog";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogPostContent locale={locale} slug={slug} />;
}

function BlogPostContent({ locale, slug }: { locale: string; slug: string }) {
  const t = useTranslations("blog");
  const post = blogPosts.find((p) => p.slug === slug)!;

  const title = locale === "no" ? post.titleNo : post.titleEn;
  const body = locale === "no" ? post.bodyNo : post.bodyEn;
  const catKey = `category_${post.category}` as const;

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "no" ? "nb-NO" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/blogg`} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
        {t("back")}
      </Link>

      {post.imageSrc && (
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image src={post.imageSrc} alt={post.imageAlt} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-navy/30" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="bg-tkk-blue text-navy text-xs font-semibold px-2 py-0.5 rounded">
          {t(catKey)}
        </span>
        <span className="text-slate text-sm">{formattedDate}</span>
        {post.author && <span className="text-slate text-sm">&middot; {t("by")} {post.author}</span>}
      </div>

      <h1 className="font-display font-bold text-navy text-3xl md:text-4xl leading-tight mb-8">{title}</h1>

      <div className="prose prose-navy max-w-none text-slate leading-relaxed space-y-4">
        {body.split("\n\n").map((para, i) => {
          const trimmed = para.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.split("**").length === 3) {
            return <h2 key={i} className="font-display font-bold text-navy text-xl mt-6">{trimmed.slice(2, -2)}</h2>;
          }
          const rendered = trimmed
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-teal underline">$1</a>`);
          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
            return (
              <ul key={i} className="list-disc list-inside space-y-1">
                {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item.slice(2) }} />)}
              </ul>
            );
          }
          return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
        })}
      </div>

      <div className="mt-12 border-t border-mist pt-6">
        <Link href={`/${locale}/blogg`} className="text-teal text-sm font-semibold hover:underline">
          {t("back")}
        </Link>
      </div>
    </article>
  );
}
