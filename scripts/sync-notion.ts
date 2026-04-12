import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
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
const NOTION_TEXT_COLORS: Record<string, string> = {
  gray: "#787774",
  brown: "#976d57",
  orange: "#d9730d",
  yellow: "#cb912f",
  green: "#448361",
  blue: "#337ea9",
  purple: "#9065b0",
  pink: "#c14c8a",
  red: "#e03e3e",
};

const NOTION_BG_COLORS: Record<string, string> = {
  gray: "#f1f1ef",
  brown: "#f4eeee",
  orange: "#fbecdd",
  yellow: "#fbf3db",
  green: "#edf3ec",
  blue: "#e7f3f8",
  purple: "#f4f0f7",
  pink: "#faf0f5",
  red: "#fdebec",
};

function richTextToMd(
  richTexts: Array<{
    plain_text: string;
    annotations?: {
      bold?: boolean;
      italic?: boolean;
      code?: boolean;
      strikethrough?: boolean;
      color?: string;
    };
    href?: string | null;
  }>,
): string {
  return richTexts
    .map((t) => {
      let text = t.plain_text;

      // 공백이 마크다운 기호 안에 들어가면 렌더링이 깨지므로
      // 앞뒤 공백을 분리해서 기호 바깥에 배치
      const leading = text.match(/^\s*/)?.[0] ?? "";
      const trailing = text.match(/\s*$/)?.[0] ?? "";
      let inner = text.trim();

      if (!inner) return text; // 공백만 있는 세그먼트는 그대로 유지

      if (t.annotations?.code) inner = `\`${inner}\``;
      if (t.annotations?.bold) inner = `**${inner}**`;
      if (t.annotations?.italic) inner = `*${inner}*`;
      if (t.annotations?.strikethrough) inner = `~~${inner}~~`;
      if (t.href) inner = `[${inner}](${t.href})`;

      const color = t.annotations?.color;
      if (color && color !== "default") {
        if (color.endsWith("_background")) {
          const hex = NOTION_BG_COLORS[color.replace("_background", "")];
          if (hex) inner = `<span style="background-color:${hex}">${inner}</span>`;
        } else {
          const hex = NOTION_TEXT_COLORS[color];
          if (hex) inner = `<span style="color:${hex}">${inner}</span>`;
        }
      }

      return leading + inner + trailing;
    })
    .join("");
}

async function blockToMd(block: NotionBlock): Promise<string> {
  const b = block as Record<string, unknown>;

  switch (block.type) {
    case "paragraph": {
      const text = richTextToMd((b.paragraph as { rich_text: [] }).rich_text);
      return text ? `${text}\n\n` : "\n\n";
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
        has_children?: boolean;
      };
      const text = richTextToMd(callout.rich_text);
      let inner = text;

      const hasChildren = (b as Record<string, unknown>).has_children as boolean;
      if (hasChildren) {
        const children = await getBlocks(block.id);
        const childrenMd = (
          await Promise.all(children.map((child) => blockToMd(child)))
        ).join("");
        inner = text + "\n" + childrenMd;
      }

      return `<div class="callout">\n\n${inner}\n\n</div>\n\n`;
    }
    case "image": {
      const image = b.image as {
        type: string;
        external?: { url: string };
        file?: { url: string };
      };
      const url =
        image.type === "external" ? image.external!.url : image.file!.url;

      // external 이미지는 URL 그대로 사용, file(Notion 업로드) 이미지는 다운로드
      if (image.type === "external") {
        return `![image](${url})\n\n`;
      }

      // Notion file 이미지 → 로컬로 다운로드
      const ext = path.extname(new URL(url).pathname) || ".png";
      const hash = crypto.createHash("md5").update(url.split("?")[0]).digest("hex").slice(0, 12);
      const filename = `${block.id.replace(/-/g, "").slice(0, 8)}-${hash}${ext}`;
      const imgDir = path.join(process.cwd(), "public", "images");
      const imgPath = path.join(imgDir, filename);

      try {
        const res = await fetch(url);
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.mkdirSync(imgDir, { recursive: true });
          fs.writeFileSync(imgPath, buffer);
          return `![image](/images/${filename})\n\n`;
        }
      } catch (e) {
        console.warn(`  ⚠️  이미지 다운로드 실패: ${(e as Error).message}`);
      }
      // 다운로드 실패 시 원본 URL 폴백
      return `![image](${url})\n\n`;
    }
    case "bookmark": {
      const bookmark = b.bookmark as { url: string };
      return `[${bookmark.url}](${bookmark.url})\n\n`;
    }
    case "table": {
      const rows = await getBlocks(block.id);
      if (rows.length === 0) return "";

      const lines: string[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as Record<string, unknown>;
        const cells = (row.table_row as { cells: Array<[]> }).cells;
        const cols = cells.map((cell) => richTextToMd(cell));
        lines.push(`| ${cols.join(" | ")} |`);

        // 헤더 뒤 구분선
        if (i === 0) {
          lines.push(`| ${cols.map(() => "---").join(" | ")} |`);
        }
      }
      return lines.join("\n") + "\n\n";
    }
    default:
      return "";
  }
}

async function blocksToMarkdown(blocks: NotionBlock[]): Promise<string> {
  const parts = await Promise.all(blocks.map(blockToMd));
  return parts.join("");
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
