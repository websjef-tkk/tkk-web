import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getBlogPost } from "@/lib/queries/blog";
import { urlFor } from "@/lib/sanity";
import type { BlogPostFull } from "@/lib/queries/blog";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  return <BlogPostContent locale={locale} post={post} />;
}

function BlogPostContent({ locale, post }: { locale: string; post: BlogPostFull }) {
  const t = useTranslations("blog");

  const title = locale === "no" ? post.title.no : (post.title.en ?? post.title.no);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (locale === "no" ? post.body?.no : (post.body?.en ?? post.body?.no)) as any[] | undefined;
  const catKey = `category_${post.category}` as const;
  const imageUrl = post.image?.asset ? urlFor(post.image).width(1200).height(600).url() : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === "no" ? "nb-NO" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/blogg`} className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
        {t("back")}
      </Link>

      {imageUrl && (
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image src={imageUrl} alt={post.image?.alt ?? title} fill className="object-cover" priority />
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

      {body?.length ? (
        <div className="prose prose-slate max-w-none leading-relaxed">
          <PortableText value={body} />
        </div>
      ) : null}

      <div className="mt-12 border-t border-mist pt-6">
        <Link href={`/${locale}/blogg`} className="text-teal text-sm font-semibold hover:underline">
          {t("back")}
        </Link>
      </div>
    </article>
  );
}
