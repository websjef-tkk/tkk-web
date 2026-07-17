import { sanityClient } from "../sanity";
import { bodyProjection, type SeoField } from "./shared";

export interface BlogPostSummary {
  _id: string;
  slug: string;
  publishedAt: string;
  title: { no: string; en?: string };
  summary: { no: string; en?: string };
  category: string;
  author?: string;
  image?: { asset: { _ref: string }; alt?: string };
  seo?: SeoField;
}

export interface BlogPostFull extends BlogPostSummary {
  body: { no: unknown[]; en?: unknown[] };
}

export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc) {
        _id,
        "slug": slug.current,
        publishedAt,
        title,
        summary,
        category,
        author,
        image,
        seo
      }`
    );
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostFull | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        "slug": slug.current,
        publishedAt,
        title,
        summary,
        ${bodyProjection},
        category,
        author,
        image,
        seo
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}
