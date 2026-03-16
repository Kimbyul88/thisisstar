import { notFound } from "next/navigation";
import { getAllSlugsUnder, getPostByPath } from "@/lib/posts";
import PostContent from "@/components/PostContent";

export function generateStaticParams() {
  return getAllSlugsUnder("classes").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullPath = `classes/${slug.map(decodeURIComponent).join("/")}`;
  try {
    const post = await getPostByPath(fullPath);
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

  let post;
  try {
    post = await getPostByPath(fullPath);
  } catch {
    notFound();
  }

  return <PostContent post={post} />;
}
