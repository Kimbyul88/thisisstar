"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import type { PostMeta } from "@/lib/posts";

const Card = styled.article`
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);

  &:last-of-type {
    border-bottom: none;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;

  a:hover {
    color: var(--accent);
  }
`;

const Meta = styled.time`
  font-size: 0.85rem;
  color: var(--muted);
`;

const Summary = styled.p`
  margin-top: 0.5rem;
  color: var(--muted);
  font-size: 0.95rem;
`;

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Card>
      <Title>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </Title>
      <Meta dateTime={post.date}>{post.date}</Meta>
      {post.summary && <Summary>{post.summary}</Summary>}
    </Card>
  );
}
