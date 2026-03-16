"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import type { Post } from "@/lib/posts";

const Article = styled.article`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }
`;

const Meta = styled.time`
  display: block;
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 2rem;
`;

const Content = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 0.75rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  code {
    background: var(--border);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: var(--font-geist-mono, monospace);
  }

  pre {
    background: var(--border);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1rem;

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 1rem;
    color: var(--muted);
    margin-bottom: 1rem;
  }
`;

const BackLink = styled.div`
  margin-top: 3rem;

  a {
    color: var(--accent);
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function PostContent({ post }: { post: Post }) {
  return (
    <Article>
      <h1>{post.title}</h1>
      <Meta dateTime={post.date}>{post.date}</Meta>
      <Content dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <BackLink>
        <Link href="/">&larr; Back to posts</Link>
      </BackLink>
    </Article>
  );
}
