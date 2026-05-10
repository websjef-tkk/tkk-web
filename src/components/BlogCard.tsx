import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/data/blog";

type Props = {
  post: BlogPost;
  locale: string;
  readMoreLabel: string;
  byLabel: string;
  categoryLabels: Record<string, string>;
};

export default function BlogCard({ post, locale, readMoreLabel, byLabel, categoryLabels }: Props) {
  const title = locale === "no" ? post.titleNo : post.titleEn;
  const summary = locale === "no" ? post.summaryNo : post.summaryEn;
  const catKey = `category_${post.category}`;
  const catLabel = categoryLabels[catKey] ?? post.category;

  return (
    <Link href={`/${locale}/blogg/${post.slug}`} className="group block bg-white rounded-xl shadow-sm border border-mist overflow-hidden hover:shadow-md transition-shadow">
      {post.imageSrc && (
        <div className="relative h-48 overflow-hidden">
          <Image src={post.imageSrc} alt={post.imageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-navy/30" />
          <span className="absolute top-3 left-3 bg-tkk-blue text-navy text-xs font-semibold px-2 py-0.5 rounded">
            {catLabel}
          </span>
        </div>
      )}
      <div className="p-5">
        <p className="text-slate text-xs mb-2">
          {new Date(post.date).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
          {post.author && <> &middot; {byLabel} {post.author}</>}
        </p>
        <h3 className="font-display font-bold text-navy text-lg leading-snug mb-2 group-hover:text-teal transition-colors">{title}</h3>
        <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-3">{summary}</p>
        <span className="text-teal text-sm font-semibold">{readMoreLabel} →</span>
      </div>
    </Link>
  );
}
