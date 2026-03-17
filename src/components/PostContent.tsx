"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Markdown from "react-markdown";
import type { Post } from "@/lib/posts";
import { log } from "node:console";

export default function PostContent({ post }: { post: Post }) {
  const router = useRouter();

  console.log(post);

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans selection:bg-blue-200 text-gray-900 pb-32">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full px-8 md:px-12 py-6 flex justify-between items-center z-50 bg-[#f8f8f8]/80 backdrop-blur-md border-b border-gray-200/50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          BACK
        </button>
        <div className="font-bold tracking-[0.15em] text-sm">
          {post.slug.split("/")[1]}
        </div>
        <div className="w-16" />
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-8 pt-32 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold tracking-widest rounded-full"
                >
                  <Tag size={12} />
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.3] mb-8 text-[#111]">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500 border-b border-gray-200 pb-8 mb-12">
            {post.date && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={post.date}>{post.date}</time>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff]" />
              <span>thisisstar</span>
            </div>
          </div>
        </motion.div>

        {/* Markdown Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
        >
          <Markdown>{post.content}</Markdown>
        </motion.div>
      </article>
    </div>
  );
}
