import { notFound } from "next/navigation";
import {
  getAllSlugsUnder,
  getSubdirectories,
  getPostByPath,
  getPostsInDirectory,
  isPostDirectory,
} from "@/lib/posts";
import PostContent from "@/components/PostContent";
import CategoryListPage from "@/components/CategoryListPage";

export function generateStaticParams() {
  const fileSlugs = getAllSlugsUnder("classes").map((slug) => ({ slug }));
  const dirSlugs = getSubdirectories("classes").map((slug) => ({ slug }));
  return [...dirSlugs, ...fileSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullPath = `classes/${slug.map(decodeURIComponent).join("/")}`;

  if (isPostDirectory(fullPath)) {
    const name = decodeURIComponent(slug[slug.length - 1]);
    return { title: `${name} | thisisstar` };
  }

  try {
    const post = getPostByPath(fullPath);
    return { title: `${post.title} | thisisstar` };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function ClassPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullPath = `classes/${slug.map(decodeURIComponent).join("/")}`;

  if (isPostDirectory(fullPath)) {
    const posts = getPostsInDirectory(fullPath);
    const name = decodeURIComponent(slug[slug.length - 1]);
    return <CategoryListPage title={name} posts={posts} />;
  }

  let post;
  try {
    post = getPostByPath(fullPath);
  } catch {
    notFound();
  }

  return <PostContent post={post} />;
}
