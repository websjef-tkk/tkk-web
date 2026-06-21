import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import type { BlogPostSummary } from "@/lib/queries/blog";

type Props = {
  post: BlogPostSummary;
  locale: string;
  readMoreLabel: string;
  byLabel: string;
  categoryLabels: Record<string, string>;
};

export default function BlogCard({ post, locale, readMoreLabel, byLabel, categoryLabels }: Props) {
  const title = locale === "no" ? post.title.no : (post.title.en ?? post.title.no);
  const summary = locale === "no" ? post.summary.no : (post.summary.en ?? post.summary.no);
  const catKey = `category_${post.category}`;
  const catLabel = categoryLabels[catKey] ?? post.category;
  const imageUrl = post.image?.asset ? urlFor(post.image).width(600).height(400).url() : null;

  return (
    <Link href={`/${locale}/blogg/${post.slug}`} className="group block bg-white rounded-xl shadow-sm border border-mist overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image src={imageUrl} alt={post.image?.alt ?? title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-navy/30" />
          <span className="absolute top-3 left-3 bg-tkk-blue text-navy text-xs font-semibold px-2 py-0.5 rounded">
            {catLabel}
          </span>
        </div>
      )}
      <div className="p-5">
        <p className="text-slate text-xs mb-2">
          {new Date(post.publishedAt).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
          {post.author && <> &middot; {byLabel} {post.author}</>}
        </p>
        <h3 className="font-display font-bold text-navy text-lg leading-snug mb-2 group-hover:text-teal transition-colors">{title}</h3>
        <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-3">{summary}</p>
        <span className="text-teal text-sm font-semibold">{readMoreLabel} →</span>
      </div>
    </Link>
  );
}
