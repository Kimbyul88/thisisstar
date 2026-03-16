# CLAUDE.md — 블로그 AI Agent 명세서

## 프로젝트 개요

Next.js + Vercel 블로그. 노션에서 글을 작성하면 자동으로 배포되는 구조.

## 디렉토리 구조

```
my-blog/
├── posts/
│   ├── projects/
│   │   └── [category]/        # ex) frontend/
│   │       └── [slug].mdx
│   └── classes/
│       └── [className]/       # ex) 기초컴퓨터그래픽스/
│           └── [slug].mdx
├── scripts/
│   └── sync-notion.ts         # 핵심 싱크 스크립트
├── .github/
│   └── workflows/
│       └── sync.yml           # 10분마다 자동 실행
└── .env.local                 # API 키 (절대 커밋 금지)
```

## 노션 DB 구조

### projects DB

| 컬럼     | 타입         | 설명                      |
| -------- | ------------ | ------------------------- |
| title    | title        | 글 제목                   |
| status   | status       | Published 이면 배포       |
| category | select       | 서브폴더명 (ex. frontend) |
| slug     | text         | URL 경로 (영문, 하이픈)   |
| tags     | multi_select | 태그                      |
| date     | date         | 발행일                    |

### classes DB

| 컬럼      | 타입         | 설명                                |
| --------- | ------------ | ----------------------------------- |
| title     | title        | 글 제목                             |
| status    | status       | Published 이면 배포                 |
| className | select       | 서브폴더명 (ex. 기초컴퓨터그래픽스) |
| slug      | text         | URL 경로 (영문, 하이픈)             |
| tags      | multi_select | 태그                                |
| date      | date         | 발행일                              |

## 싱크 흐름

```
노션 status → Published 변경
       ↓
GitHub Actions (10분마다 폴링)
       ↓
sync-notion.ts 실행
  - Published 글 조회
  - 블록 → MDX 변환
  - posts/[folder]/[subFolder]/[slug].mdx 저장
       ↓
변경사항 있으면 git commit + push
       ↓
Vercel 자동 감지 → 배포
```

## 자주 쓰는 명령어

```bash
# 로컬에서 수동 싱크 테스트
npx tsx scripts/sync-notion.ts

# 개발 서버 실행
npm run dev

# 빌드 테스트
npm run build
```

## 환경변수 (GitHub Secrets에도 동일하게 등록)

- `NOTION_TOKEN` — Notion Integration 토큰
- `NOTION_DB_PROJECTS` — projects DB ID
- `NOTION_DB_CLASSES` — classes DB ID
- `GH_TOKEN` — GitHub Personal Access Token (repo 권한)

## Claude Code에게 요청할 수 있는 것들

- "오늘 노션 글 싱크해줘" → `npx tsx scripts/sync-notion.ts` 실행
- "새 카테고리 추가해줘" → DB_CONFIGS에 항목 추가
- "MDX 변환이 이상해" → blockToMd 함수 수정
