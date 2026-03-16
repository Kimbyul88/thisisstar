"use server";

import fs from "fs";
import path from "path";
import { getAllPosts, type PostMeta } from "./posts";

export async function fetchAllPosts(): Promise<PostMeta[]> {
  return getAllPosts();
}

export interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children: TreeNode[];
}

export async function fetchCategoryTree(
  category: string
): Promise<TreeNode[]> {
  const base = path.join(process.cwd(), "posts", category);
  if (!fs.existsSync(base)) return [];
  return readTree(base, category);
}

function readTree(dir: string, relativePath: string): TreeNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const childRel = `${relativePath}/${entry.name}`;
      const childAbs = path.join(dir, entry.name);
      nodes.push({
        name: entry.name,
        path: childRel,
        isFile: false,
        children: readTree(childAbs, childRel),
      });
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      const slug = entry.name.replace(/\.mdx?$/, "");
      nodes.push({
        name: slug,
        path: `${relativePath}/${slug}`,
        isFile: true,
        children: [],
      });
    }
  }

  return nodes;
}
