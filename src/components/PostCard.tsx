import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import styles from "./PostCard.module.css";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <time className={styles.meta} dateTime={post.date}>
        {post.date}
      </time>
      {post.summary && <p className={styles.summary}>{post.summary}</p>}
    </article>
  );
}
