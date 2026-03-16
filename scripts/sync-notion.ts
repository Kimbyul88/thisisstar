import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
// ========================================
// 타입 정의
// ========================================
interface NotionPage {
  id: string;
  properties: {
    title: { title: Array<{ plain_text: string }> };
    status: { status: { name: string } };
    slug: { rich_text: Array<{ plain_text: string }> };
    tags: { multi_select: Array<{ name: string }> };
    date: { date: { start: string } | null };
    // projects DB 전용
    category?: { select: { name: string } | null };
    // classes DB 전용
    className?: { select: { name: string } | null };
  };
}

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface DBConfig {
  id: string;
  folder: string; // "projects" | "classes"
  subFolderProp: "category" | "className"; // 서브폴더를 결정하는 속성명
}

// ========================================
// 환경변수
// ========================================
const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const DB_CONFIGS: DBConfig[] = [
  {
    id: process.env.NOTION_DB_PROJECTS!,
    folder: "projects",
    subFolderProp: "category",
  },
  {
    id: process.env.NOTION_DB_CLASSES!,
    folder: "classes",
    subFolderProp: "className",
  },
];
const POSTS_DIR = path.join(process.cwd(), "posts");

// ========================================
// Notion API 유틸
// ========================================
async function notionFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Notion API error ${res.status}: ${error}`);
  }

  return res.json();
}

// DB에서 Published 상태인 페이지 목록 가져오기
async function getPublishedPages(dbId: string): Promise<NotionPage[]> {
  const data = await notionFetch(`/databases/${dbId}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: {
        property: "status",
        status: { equals: "Published" },
      },
    }),
  });

  return data.results as NotionPage[];
}

// 페이지의 블록들 가져오기
async function getBlocks(pageId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const data: { results: NotionBlock[]; next_cursor?: string } =
      await notionFetch(
        `/blocks/${pageId}/children${cursor ? `?start_cursor=${cursor}` : ""}`,
      );
    blocks.push(...data.results);
    cursor = data.next_cursor;
  } while (cursor);

  return blocks;
}

// ========================================
// Notion 블록 → 마크다운 변환
// ========================================
function richTextToMd(
  richTexts: Array<{
    plain_text: string;
    annotations?: {
      bold?: boolean;
      italic?: boolean;
      code?: boolean;
      strikethrough?: boolean;
    };
    href?: string | null;
  }>,
): string {
  return richTexts
    .map((t) => {
      let text = t.plain_text;
      if (t.annotations?.code) text = `\`${text}\``;
      if (t.annotations?.bold) text = `**${text}**`;
      if (t.annotations?.italic) text = `*${text}*`;
      if (t.annotations?.strikethrough) text = `~~${text}~~`;
      if (t.href) text = `[${text}](${t.href})`;
      return text;
    })
    .join("");
}

function blockToMd(block: NotionBlock): string {
  const b = block as Record<string, unknown>;

  switch (block.type) {
    case "paragraph": {
      const text = richTextToMd((b.paragraph as { rich_text: [] }).rich_text);
      return text ? `${text}\n\n` : "\n";
    }
    case "heading_1": {
      const text = richTextToMd((b.heading_1 as { rich_text: [] }).rich_text);
      return `# ${text}\n\n`;
    }
    case "heading_2": {
      const text = richTextToMd((b.heading_2 as { rich_text: [] }).rich_text);
      return `## ${text}\n\n`;
    }
    case "heading_3": {
      const text = richTextToMd((b.heading_3 as { rich_text: [] }).rich_text);
      return `### ${text}\n\n`;
    }
    case "bulleted_list_item": {
      const text = richTextToMd(
        (b.bulleted_list_item as { rich_text: [] }).rich_text,
      );
      return `- ${text}\n`;
    }
    case "numbered_list_item": {
      const text = richTextToMd(
        (b.numbered_list_item as { rich_text: [] }).rich_text,
      );
      return `1. ${text}\n`;
    }
    case "to_do": {
      const todo = b.to_do as { rich_text: []; checked: boolean };
      const text = richTextToMd(todo.rich_text);
      return `- [${todo.checked ? "x" : " "}] ${text}\n`;
    }
    case "quote": {
      const text = richTextToMd((b.quote as { rich_text: [] }).rich_text);
      return `> ${text}\n\n`;
    }
    case "divider":
      return `---\n\n`;
    case "code": {
      const code = b.code as { rich_text: []; language: string };
      const text = richTextToMd(code.rich_text);
      const lang = code.language || "";
      return `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
    }
    case "callout": {
      const callout = b.callout as {
        rich_text: [];
        icon?: { emoji?: string };
      };
      const text = richTextToMd(callout.rich_text);
      const icon = callout.icon?.emoji ?? "💡";
      return `> ${icon} ${text}\n\n`;
    }
    case "image": {
      const image = b.image as {
        type: string;
        external?: { url: string };
        file?: { url: string };
      };
      const url =
        image.type === "external" ? image.external!.url : image.file!.url;
      return `![image](${url})\n\n`;
    }
    case "bookmark": {
      const bookmark = b.bookmark as { url: string };
      return `[${bookmark.url}](${bookmark.url})\n\n`;
    }
    default:
      return "";
  }
}

async function blocksToMarkdown(blocks: NotionBlock[]): Promise<string> {
  return blocks.map(blockToMd).join("");
}

// ========================================
// MDX 파일 생성
// ========================================
function buildFrontmatter(page: NotionPage, subFolder: string): string {
  const title =
    page.properties.title.title.map((t) => t.plain_text).join("") || "Untitled";
  const tags = page.properties.tags.multi_select.map((t) => t.name);
  const date =
    page.properties.date.date?.start ?? new Date().toISOString().split("T")[0];

  return `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
category: "${subFolder}"
---

`;
}

// ========================================
// 메인 싱크 로직
// ========================================
async function syncDB(config: DBConfig) {
  console.log(`\n📦 Syncing DB: ${config.folder} (${config.id})`);

  const pages = await getPublishedPages(config.id);
  console.log(`  Found ${pages.length} published pages`);

  for (const page of pages) {
    const slug = page.properties.slug.rich_text[0]?.plain_text?.trim();

    if (!slug) {
      const title = page.properties.title.title
        .map((t) => t.plain_text)
        .join("");
      console.warn(`  ⚠️  Slug 없음, 건너뜀: "${title}"`);
      continue;
    }

    // 서브폴더 결정 (category or className)
    const subFolderProp = page.properties[config.subFolderProp];
    const subFolder =
      (subFolderProp as { select?: { name: string } } | undefined)?.select
        ?.name ?? "uncategorized";

    // 저장 경로 결정
    // ex) posts/projects/frontend/blog-ai-agent.mdx
    //     posts/classes/기초컴퓨터그래픽스/graphics0312.mdx
    const filePath = path.join(
      POSTS_DIR,
      config.folder,
      subFolder,
      `${slug}.mdx`,
    );

    // 폴더 없으면 자동 생성
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // 블록 가져와서 마크다운 변환
    const blocks = await getBlocks(page.id);
    const body = await blocksToMarkdown(blocks);
    const frontmatter = buildFrontmatter(page, subFolder);

    fs.writeFileSync(filePath, frontmatter + body, "utf-8");
    console.log(`  ✅ ${filePath}`);
  }
}

async function main() {
  console.log("🚀 Notion → MDX 싱크 시작\n");

  for (const config of DB_CONFIGS) {
    if (!config.id) {
      console.warn(`⚠️  DB ID 없음, 건너뜀: ${config.folder}`);
      continue;
    }
    await syncDB(config);
  }

  console.log("\n✨ 싱크 완료!");
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
