"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Post } from "@/lib/posts";

const GRADIENTS = [
  "from-[#00c6ff] to-[#0072ff]",
  "from-[#f857a6] to-[#ff5858]",
  "from-[#a18cd1] to-[#fbc2eb]",
  "from-[#fccb90] to-[#d57eeb]",
  "from-[#4facfe] to-[#00f2fe]",
  "from-[#43e97b] to-[#38f9d7]",
];

interface CategoryListPageProps {
  title: string;
  posts: Post[];
}

export default function CategoryListPage({
  title,
  posts,
}: CategoryListPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const parentPath = pathname.split("/").slice(0, -1).join("/") || "/";

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans selection:bg-blue-200 text-gray-900 pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full px-8 md:px-12 py-6 flex justify-between items-center z-50 bg-[#f8f8f8]/80 backdrop-blur-md border-b border-gray-200/50">
        <button
          onClick={() => router.push(parentPath)}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          BACK
        </button>
        <div className="font-bold tracking-[0.15em] text-sm">
          {title.toUpperCase()}
        </div>
        <div className="w-16" />
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            {title.toUpperCase()}
          </h1>
          <p className="text-gray-500 text-lg">
            {posts.length} post{posts.length !== 1 && "s"}
          </p>
        </motion.div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/${post.slug}`} className="block">
                {/* Gradient Thumbnail */}
                <div
                  className={`w-full aspect-2/1 rounded-3xl mb-8 bg-linear-to-tr ${GRADIENTS[i % GRADIENTS.length]} opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 relative overflow-hidden shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                      backgroundSize: "6px 6px",
                    }}
                  />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-bold tracking-widest text-gray-400 border border-gray-300 px-3 py-1 rounded-full group-hover:border-gray-400 transition-colors"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h2>

                {/* Date */}
                {post.date && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-32 text-gray-400">
            <p className="text-2xl font-medium">No posts yet</p>
          </div>
        )}
      </main>
    </div>
  );
}
