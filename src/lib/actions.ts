"use server";

import fs from "fs";
import path from "path";
import { getAllPosts, type PostMeta } from "./posts";

export async function fetchAllPosts(): Promise<PostMeta[]> {
  return getAllPosts();
}

export interface Subcategory {
  name: string;
  path: string;
}

export async function fetchSubcategories(
  category: string,
): Promise<Subcategory[]> {
  const base = path.join(process.cwd(), "posts", category);
  if (!fs.existsSync(base)) return [];

  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, path: `${category}/${e.name}` }));
}
