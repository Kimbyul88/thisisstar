import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

export interface Post extends PostMeta {
  content: string;
  tags: string[];
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        summary: data.summary ?? "",
      };
    });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Recursively find all post slugs under a category directory.
 * Returns slug arrays for catch-all routes, e.g. ["기초컴퓨터그래픽스", "graphics0312"]
 */
export function getAllSlugsUnder(category: string): string[][] {
  const base = path.join(postsDirectory, category);
  if (!fs.existsSync(base)) return [];
  return collectSlugs(base);
}

function collectSlugs(dir: string): string[][] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const slugs: string[][] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const sub = collectSlugs(path.join(dir, entry.name));
      for (const s of sub) {
        slugs.push([entry.name, ...s]);
      }
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      slugs.push([entry.name.replace(/\.mdx?$/, "")]);
    }
  }

  return slugs;
}

/**
 * Get a post by its full path relative to the posts directory.
 * e.g. getPostByPath("classes/기초컴퓨터그래픽스/graphics0312")
 */
export function getPostByPath(relativePath: string): Post {
  const mdxPath = path.join(postsDirectory, `${relativePath}.mdx`);
  const mdPath = path.join(postsDirectory, `${relativePath}.md`);
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: relativePath,
    title: data.title ?? path.basename(relativePath),
    date: data.date ?? "",
    summary: data.summary ?? "",
    content,
    tags: data.tags ?? [],
  };
}
