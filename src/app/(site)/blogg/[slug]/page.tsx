import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getBlogPost } from "@/lib/queries/blog";
import { urlFor } from "@/lib/sanity";
import type { BlogPostFull } from "@/lib/queries/blog";
import { richTextComponents } from "@/components/portableText/richTextComponents";
import { buildPageMetadata } from "@/lib/seo";
import { BLOG_CATEGORY_LABELS } from "@/lib/labels";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return buildPageMetadata(post);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  return <BlogPostContent post={post} />;
}

function BlogPostContent({ post }: { post: BlogPostFull }) {
  const title = post.title.no;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = post.body?.no as any[] | undefined;
  const catLabel = BLOG_CATEGORY_LABELS[`category_${post.category}`] ?? post.category;
  const imageUrl = post.image?.asset ? urlFor(post.image).width(1200).height(600).url() : null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/blogg" className="text-teal text-sm font-semibold hover:underline mb-6 inline-block">
        ← Tilbake til bloggen
      </Link>

      {imageUrl && (
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image src={imageUrl} alt={post.image?.alt ?? title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-navy/30" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="bg-tkk-blue text-navy text-xs font-semibold px-2 py-0.5 rounded">
          {catLabel}
        </span>
        <span className="text-slate text-sm">{formattedDate}</span>
        {post.author && <span className="text-slate text-sm">&middot; Av {post.author}</span>}
      </div>

      <h1 className="font-display font-bold text-navy text-3xl md:text-4xl leading-tight mb-8">{title}</h1>

      {body?.length ? (
        <div className="prose prose-slate max-w-none leading-relaxed">
          <PortableText value={body} components={richTextComponents} />
        </div>
      ) : null}

      <div className="mt-12 border-t border-mist pt-6">
        <Link href="/blogg" className="text-teal text-sm font-semibold hover:underline">
          ← Tilbake til bloggen
        </Link>
      </div>
    </article>
  );
}
