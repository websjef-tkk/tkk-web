"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogPostSummary } from "@/lib/queries/blog";
import { BLOG_CATEGORY_LABELS } from "@/lib/labels";

const categoryTabs: { key: string; label: string }[] = [
  { key: "all", label: "Alle" },
  ...Object.entries(BLOG_CATEGORY_LABELS).map(([key, label]) => ({ key: key.replace(/^category_/, ""), label })),
];

type Props = {
  posts: BlogPostSummary[];
  /** Brødsmulestien, ferdig rendret på serveren. */
  breadcrumbs?: React.ReactNode;
};

export default function BloggClient({ posts, breadcrumbs }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = posts.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {breadcrumbs}
      <h1 className="font-display font-bold text-navy text-4xl mb-8">Blogg og nyheter</h1>

      <div className="flex flex-wrap gap-2 mb-10">
        {categoryTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              filter === key
                ? "bg-navy text-white"
                : "bg-white border border-navy/20 text-navy hover:bg-mist"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate">{posts.length === 0 ? "Ingen innlegg ennå." : "Ingen innlegg i denne kategorien."}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
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
