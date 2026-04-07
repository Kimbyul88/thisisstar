"use client";

import { useState } from "react";

interface Metric {
  label: string;
  value: string;
}

interface TroubleItem {
  q: string;
  a: string;
}

interface Project {
  tag: string;
  name: string;
  nameEn: string;
  period: string;
  role: string;
  sub: string;
  desc: string;
  stack: string[];
  metrics: Metric[];
  troubles: TroubleItem[];
}

const projects: Project[] = [
  {
    tag: "Web / React",
    name: "미교님 어디계세요",
    nameEn: "Equipment Management System",
    period: "2024.02 — 2025.11",
    role: "Frontend · Design 100%",
    sub: "학과 장비/랩실 통합 관리 시스템",
    desc: "사용자와 관리자 양쪽의 불편을 분석하고 설계한 학과 장비 대여 통합 시스템. 조교의 수기 관리 방식과 학생의 대기 문제를 해결하기 위해 기획부터 개발, 디자인까지 전담했습니다.",
    stack: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo Client",
      "Firebase",
      "FCM",
    ],
    metrics: [
      { label: "역할", value: "Frontend 100%" },
      { label: "기간", value: "약 22개월" },
    ],
    troubles: [
      {
        q: "예약 시 캐시된 데이터로 더블부킹 발생 가능성",
        a: "fetchPolicy: 'network-only' 로 항상 서버 최신 상태 기준으로 판단. Promise.all로 복수 장비를 병렬 조회해 응답 시간도 최소화했습니다.",
      },
      {
        q: "컴포넌트마다 Firebase 토큰 수동 주입으로 인증 로직 반복",
        a: "Apollo Link 체인에 authLink를 구현해 요청 레벨에서 인증 자동 처리. needsAuth 컨텍스트 옵션으로 공개 쿼리와 인증 쿼리를 분리했습니다.",
      },
      {
        q: "대여 승인 여부를 사용자가 직접 새로고침해야 하는 문제",
        a: "Firebase Cloud Messaging 연동으로 대여 승인·반려 시 즉시 웹 푸시 알림 전송. 서비스 미접속 상태에서도 알림 수신 가능하도록 구현했습니다.",
      },
    ],
  },
  {
    tag: "Web / React",
    name: "2025 서강대 축제 웹사이트",
    nameEn: "Sogang University Festival 2025",
    period: "2025.09",
    role: "Frontend 50%",
    sub: "고유 사용자 5,221명 · 보안 + 데이터 기반 UX",
    desc: "일주일간 고유 사용자 5,221명이 사용한 축제 공식 웹사이트. 스탬프 대리 적립 방지 보안 설계, 이중 인증 아키텍처, Microsoft Clarity 데이터 기반 UX 개선까지 담당했습니다.",
    stack: [
      "React",
      "TypeScript",
      "SWR",
      "Framer Motion",
      "Firebase",
      "SHA256",
    ],
    metrics: [
      { label: "고유 사용자", value: "5,221명" },
      { label: "역할", value: "Frontend 50%" },
    ],
    troubles: [
      {
        q: "QR 코드 공유로 스탬프 대리 적립 가능한 보안 취약점",
        a: "QR URL에 SHA256(닉네임) 해시를 포함해 클라이언트에서 본인 여부를 먼저 검증. 비로그인 스캔 시 sessionStorage에 저장 후 로그인 완료 시 자동 적립되는 Deferred Auth 패턴 구현.",
      },
      {
        q: "일반 유저(카카오 OAuth)와 관리자(ID/PW)가 동일 인터셉터 공유 시 토큰 혼재",
        a: "URL 패턴으로 realm을 분리해 토큰 키와 갱신 엔드포인트를 각각 관리. isRefreshing 플래그 + subscriber 패턴으로 refresh가 딱 한 번만 실행되도록 구현했습니다.",
      },
      {
        q: "핵심 기능(옷입히기 게임) 유입률이 메인 방문자 대비 1/5 수준",
        a: "Microsoft Clarity 히트맵 데이터를 근거로 디자이너를 설득해 메인 홈 팝업 추가. 세션 단위 노출 제어로 피로도를 줄이고, 게임 페이지 일일 방문자 2배 증가.",
      },
    ],
  },
  {
    tag: "Web / React",
    name: "Dotted",
    nameEn: "Foreign Student Community",
    period: "2025.01 — 2025.03",
    role: "Frontend 50% · Design 100%",
    sub: "외국인 유학생 커뮤니티 · 실사용자 100명",
    desc: "외국인 유학생을 위한 커뮤니티 서비스. 리팩토링, 디자인 시스템 구축, 학생증 검증 설계까지 디자인과 개발 전체를 담당했습니다.",
    stack: ["React", "TypeScript", "SWR", "Framer Motion"],
    metrics: [
      { label: "실사용자", value: "100명" },
      { label: "디자인", value: "100% 담당" },
    ],
    troubles: [
      {
        q: "유학생 재학 여부 검증 — OCR 자동화 vs 신뢰도 사이 의사결정",
        a: "OCR은 텍스트 추출만 가능하고 위조 판별이 불가능하다는 한계를 발견. 자동화보다 신뢰도를 우선해 관리자가 직접 대조하는 어드민 검증 시스템으로 결정했습니다.",
      },
      {
        q: "파일마다 하드코딩된 컬러, 페이지별로 파편화된 컴포넌트 구조",
        a: "컬러 토큰 기반 디자인 시스템을 구축해 전체 UI를 통일. 컴포넌트를 재사용 가능한 단위로 분리하고 Server/Client 상태관리 구조도 정리했습니다.",
      },
    ],
  },
  {
    tag: "AI / Full Stack",
    name: "생성형 AI 안경 디자인 서비스",
    nameEn: "AI Glasses Design Service",
    period: "2025.03 — 2025.11",
    role: "Frontend",
    sub: "IP-Adapter + ControlNet + SDXL 파이프라인",
    desc: "생성형 AI를 활용한 안경 디자인 서비스. IP-Adapter, ControlNet, SDXL 파이프라인으로 사용자 스타일을 보존하면서 새로운 안경 디자인 이미지를 생성합니다.",
    stack: [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "SDXL",
      "IP-Adapter",
      "ControlNet",
    ],
    metrics: [
      { label: "AI 파이프라인", value: "SDXL" },
      { label: "스타일 보존", value: "IP-Adapter" },
    ],
    troubles: [
      {
        q: "이미지 생성 응답 시간 30초 이상으로 UX 저하",
        a: "WebSocket 기반 진행률 스트리밍과 생성 큐 시스템으로 개선. 프론트에서 실시간 프리뷰를 제공해 체감 대기시간을 크게 줄였습니다.",
      },
    ],
  },
  {
    tag: "Community / Next.js",
    name: "음악 추천 Q&A 커뮤니티",
    nameEn: "Music Recommendation Q&A",
    period: "2025 — 진행중",
    role: "Full Stack",
    sub: "ALS + Spotify API 하이브리드 추천 · 발굴왕 뱃지",
    desc: "창의융합 자유연구 프로그램 프로젝트. ALS 협업 필터링과 Spotify API를 결합한 하이브리드 추천 엔진과 발굴왕 뱃지 게이미피케이션 시스템을 구현 중입니다.",
    stack: [
      "Next.js 14",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Python",
      "FastAPI",
      "Spotify API",
    ],
    metrics: [
      { label: "추천 방식", value: "Hybrid" },
      { label: "게이미피케이션", value: "발굴왕" },
    ],
    troubles: [
      {
        q: "신규 유저 추천 정확도 저하 (Cold Start 문제)",
        a: "콘텐츠 기반 필터링과 ALS를 유저 활동량에 따라 가중치를 달리 적용하는 Hybrid 전략으로 Cold Start 문제를 완화했습니다.",
      },
    ],
  },
  {
    tag: "Web / Next.js",
    name: "관계 기억 아카이빙 웹",
    nameEn: "Memory Archiving Service",
    period: "2026.01 — 현재",
    role: "Full Stack",
    sub: "관계 기억의 기록 및 재생을 위한 아카이빙 서비스",
    desc: "관계의 기억을 기록하고 재생하는 아카이빙 웹 서비스. 스플릿 레이아웃 에디터, 정사각형 소책자 포맷, OpenAI API를 활용한 백커버 감성 텍스트 자동 생성 기능을 구현 중입니다.",
    stack: ["Next.js", "TypeScript", "OpenAI API", "Three.js", "GLSL"],
    metrics: [
      { label: "상태", value: "진행중" },
      { label: "AI 기능", value: "OpenAI API" },
    ],
    troubles: [
      {
        q: "Three.js ShareScene에서 반사 바닥 글로우 효과 구현",
        a: "커스텀 GLSL 셰이더로 반사 바닥 글로우 이펙트를 직접 구현. 기존 Three.js 내장 기능의 한계를 셰이더 레벨에서 해결했습니다.",
      },
    ],
  },
];

export default function ProjectsSection() {
  const [selected, setSelected] = useState<number>(0);
  const project = projects[selected];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&display=swap');

        .proj-root * { box-sizing: border-box; }

        .proj-root {
          font-family: 'Syne', sans-serif;
          background: #fafaf7;
        }

        .proj-list-btn {
          width: 100%;
          padding: 22px 40px;
          border: none;
          border-bottom: 0.5px solid rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s;
        }

        .proj-list-btn:hover { background: rgba(51,132,255,0.04); }

        .proj-item-arrow {
          width: 22px;
          height: 22px;
          border: 0.5px solid rgba(0,0,0,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #999;
          flex-shrink: 0;
          transition: border-color 0.2s, color 0.2s;
        }

        .proj-item-arrow.active {
          border-color: #3384FF;
          color: #3384FF;
        }

        .trouble-q {
          font-size: 12px;
          font-weight: 600;
          color: #222;
          margin-bottom: 5px;
          display: flex;
          align-items: flex-start;
          gap: 7px;
          line-height: 1.5;
        }

        .trouble-q::before {
          content: 'Q';
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          background: rgba(51,132,255,0.12);
          color: #3384FF;
          padding: 2px 5px;
          border-radius: 3px;
          flex-shrink: 0;
          margin-top: 1px;
        }
      `}</style>

      <section className="proj-root min-h-screen pb-32 pt-12">
        {/* Header */}
        <div className="px-10 mb-9 flex justify-between items-end">
          <div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Portfolio / 2024 — 2026
            </p>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: -1,
                lineHeight: 1,
                color: "#0a0a0a",
              }}
            >
              PROJ<span style={{ color: "#3384FF" }}>.</span>
            </h2>
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: "#aaa",
            }}
          >
            {String(selected + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 600,
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* List */}
          <div style={{ borderRight: "0.5px solid rgba(0,0,0,0.1)" }}>
            {projects.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className="proj-list-btn"
                style={{
                  background:
                    i === selected ? "rgba(51,132,255,0.06)" : "transparent",
                  borderLeft:
                    i === selected
                      ? "3px solid #3384FF"
                      : "3px solid transparent",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: "#3384FF",
                      textTransform: "uppercase",
                      marginBottom: 5,
                    }}
                  >
                    {p.tag}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#111",
                      lineHeight: 1.2,
                    }}
                  >
                    {p.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                    {p.sub}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "#bbb",
                      textAlign: "right",
                      lineHeight: 1.4,
                    }}
                  >
                    {p.period}
                  </span>
                  <span
                    className={`proj-item-arrow ${i === selected ? "active" : ""}`}
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div
            style={{
              padding: "40px",
              position: "sticky",
              top: 0,
              overflowY: "auto",
              maxHeight: "100vh",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "#fff",
                  background: "#3384FF",
                  padding: "4px 10px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                }}
              >
                {project.tag}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#bbb",
                }}
              >
                {String(selected + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Name */}
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: -0.5,
                color: "#0a0a0a",
                lineHeight: 1.15,
                marginBottom: 4,
              }}
            >
              {project.name}
              <span style={{ color: "#3384FF" }}>.</span>
            </h3>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "#aaa",
                marginBottom: 4,
              }}
            >
              {project.nameEn}
            </p>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "#3384FF",
                marginBottom: 16,
                opacity: 0.8,
              }}
            >
              {project.period} · {project.role}
            </p>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.75,
                color: "#555",
                marginBottom: 28,
              }}
            >
              {project.desc}
            </p>

            <hr
              style={{
                border: "none",
                borderTop: "0.5px solid rgba(0,0,0,0.08)",
                marginBottom: 22,
              }}
            />

            {/* Stack */}
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "#aaa",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Tech Stack
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 24,
              }}
            >
              {project.stack.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    padding: "4px 10px",
                    border: "0.5px solid rgba(51,132,255,0.35)",
                    borderRadius: 4,
                    color: "#3384FF",
                    background: "rgba(51,132,255,0.06)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "#aaa",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Key Metrics
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "rgba(51,132,255,0.05)",
                    border: "0.5px solid rgba(51,132,255,0.2)",
                    borderRadius: 8,
                    padding: "12px 14px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "#3384FF",
                      opacity: 0.7,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {m.label}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#3384FF",
                    }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "0.5px solid rgba(0,0,0,0.08)",
                marginBottom: 22,
              }}
            />

            {/* Trouble Shooting */}
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "#aaa",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Trouble Shooting
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {project.troubles.map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 16px",
                    border: "0.5px solid rgba(0,0,0,0.08)",
                    borderRadius: 8,
                    background: "#fff",
                  }}
                >
                  <p className="trouble-q">{t.q}</p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#666",
                      lineHeight: 1.65,
                      paddingLeft: 28,
                    }}
                  >
                    {t.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
