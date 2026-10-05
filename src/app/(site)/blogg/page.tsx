import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/queries/blog";
import BloggClient from "./BloggClient";

export const revalidate = 3600;

export default async function BloggPage() {
  const posts = await getAllBlogPosts();
  return <BloggClient posts={posts} breadcrumbs={<Breadcrumbs path="blogg" current="Blogg og nyheter" />} />;
}
