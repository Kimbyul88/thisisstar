/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Menu } from "lucide-react";
import { css, keyframes } from "@emotion/css";

const marqueeAnim = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
`;

const marqueeAnim2 = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(0%); }
`;

const bounceAnim = keyframes`
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
`;

const styles = {
  container: css`
    position: relative;
    min-height: 100vh;
    background-color: #f8f8f8;
    font-family: sans-serif;
    ::selection {
      background-color: #bfdbfe;
    }
  `,
  heroSection: css`
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem;
    @media (min-width: 768px) {
      padding: 3rem;
    }
  `,
  meshBg: css`
    position: absolute;
    inset: 0;
    background-color: #00c6ff;
    z-index: -20;
  `,
  meshBlue1: css`
    position: absolute;
    top: -20%;
    right: -10%;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background-color: #fdfbfb;
    filter: blur(120px);
    opacity: 0.9;
  `,
  meshBlue2: css`
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: #0072ff;
    filter: blur(150px);
    opacity: 0.8;
  `,
  meshPinkLayer: css`
    position: absolute;
    inset: 0;
    background: linear-gradient(to top right, #ff0844, #ffb199);
    mix-blend-mode: overlay;
  `,
  meshPink1: css`
    position: absolute;
    top: -10%;
    right: -20%;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background-color: #ff0844;
    filter: blur(150px);
  `,
  meshPink2: css`
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background-color: #ffb199;
    filter: blur(150px);
  `,
  noiseTexture: css`
    position: absolute;
    inset: 0;
    opacity: 0.15;
    mix-blend-mode: overlay;
    z-index: -10;
    pointer-events: none;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.4) 1px,
      transparent 1px
    );
    background-size: 4px 4px;
  `,
  topRightText: css`
    position: absolute;
    top: 6rem;
    right: 2rem;
    text-align: right;
    z-index: 10;
    @media (min-width: 768px) {
      right: 6rem;
    }
  `,
  title: css`
    font-size: 2.25rem;
    font-weight: 500;
    color: white;
    line-height: 1.5;
    letter-spacing: 0.1em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    margin: 0;
    @media (min-width: 768px) {
      font-size: 3rem;
    }
    @media (min-width: 1024px) {
      font-size: 3.75rem;
    }
  `,
  bottomLeftText: css`
    position: absolute;
    bottom: 8rem;
    left: 2rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    color: white;
    @media (min-width: 768px) {
      left: 3rem;
    }
  `,
  subtitle: css`
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    @media (min-width: 768px) {
      font-size: 1rem;
    }
  `,
  subtitleLeading: css`
    line-height: 2;
  `,
  scrollDown: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    margin-top: 2rem;
    opacity: 0.9;
  `,
  bounceIcon: css`
    animation: ${bounceAnim} 1s infinite;
  `,
  contentSection: css`
    position: relative;
    background-color: #f8f8f8;
    z-index: 20;
    padding-bottom: 16rem;
    padding-top: 4rem;
  `,
  weDoHeader: css`
    padding: 0 2rem;
    margin-bottom: 4rem;
    @media (min-width: 768px) {
      padding: 0 3rem;
    }
  `,
  weDoTitle: css`
    font-size: 0.875rem;
    font-weight: bold;
    letter-spacing: 0.2em;
    color: #111;
    margin: 0;
  `,
  marqueeContainer: css`
    position: relative;
    display: flex;
    overflow-x: hidden;
    padding: 3rem 0;
    background-color: #f8f8f8;
  `,
  marqueeTrack1: css`
    animation: ${marqueeAnim} 40s linear infinite;
    white-space: nowrap;
    display: flex;
    align-items: center;
  `,
  marqueeTrack2: css`
    position: absolute;
    top: 0;
    animation: ${marqueeAnim2} 40s linear infinite;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 3rem 0;
  `,
  marqueeItem: css`
    margin: 0 2rem;
    font-size: 1.875rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: #1f2937;
    @media (min-width: 768px) {
      font-size: 3rem;
    }
  `,
  weAreSection: css`
    padding: 8rem 2rem 0;
    max-width: 80rem;
    margin: 0 auto;
    @media (min-width: 768px) {
      padding-top: 12rem;
      padding-left: 3rem;
      padding-right: 3rem;
    }
  `,
  weAreTitle: css`
    font-size: 4.5rem;
    font-weight: bold;
    color: #111;
    letter-spacing: -0.05em;
    margin-bottom: 3rem;
    margin-top: 0;
    @media (min-width: 768px) {
      font-size: 8rem;
    }
  `,
  weAreDesc: css`
    font-size: 1.25rem;
    color: #1f2937;
    font-weight: 500;
    letter-spacing: 0.1em;
    line-height: 1.625;
    margin: 0;
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  navContainer: css`
    position: fixed;
    bottom: 2rem;
    left: 0;
    width: 100%;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 50;
    pointer-events: none;
    @media (min-width: 768px) {
      padding: 0 3rem;
    }
  `,
  navCenter: css`
    pointer-events: auto;
    display: flex;
    align-items: center;
    margin: 0 auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
  `,
  navCenterInner: css`
    background-color: #151922;
    color: white;
    display: flex;
    align-items: center;
    border-radius: 0.125rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  `,
  navBrand: css`
    padding: 1rem 2rem;
    font-weight: bold;
    letter-spacing: 0.15em;
    font-size: 0.875rem;
    border-right: 1px solid rgba(55, 65, 81, 0.5);
  `,
  navMenuBtn: css`
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #1f2937;
    }
  `,
  navRight: css`
    pointer-events: auto;
    position: absolute;
    right: 2rem;
    bottom: 0;
    @media (min-width: 768px) {
      right: 3rem;
    }
  `,
  navContactBtn: css`
    background-color: #0f172a;
    color: white;
    padding: 1rem 2rem;
    font-size: 0.75rem;
    font-weight: bold;
    letter-spacing: 0.15em;
    border-radius: 0.125rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    &:hover {
      background-color: #000;
    }
  `,
};

const Marquee = () => {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack1}>
        <span className={styles.marqueeItem}>
          # プロジェクションマッピング
        </span>
        <span className={styles.marqueeItem}># イベント事業</span>
        <span className={styles.marqueeItem}># 映像制作</span>
        <span className={styles.marqueeItem}>
          # デジタルクリエイティブ事業
        </span>
        <span className={styles.marqueeItem}># 世界を盛り上げる</span>
      </div>
      <div className={styles.marqueeTrack2}>
        <span className={styles.marqueeItem}>
          # プロジェクションマッピング
        </span>
        <span className={styles.marqueeItem}># イベント事業</span>
        <span className={styles.marqueeItem}># 映像制作</span>
        <span className={styles.marqueeItem}>
          # デジタルクリエイティブ事業
        </span>
        <span className={styles.marqueeItem}># 世界を盛り上げる</span>
      </div>
    </div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const pinkOpacity = useTransform(scrollY, [0, 500], [0, 1]);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Animated Mesh Gradient Background */}
        <div className={styles.meshBg}>
          <div className={styles.meshBlue1} />
          <div className={styles.meshBlue2} />
          <motion.div
            className={styles.meshPinkLayer}
            style={{ opacity: pinkOpacity }}
          />
          <motion.div
            className={styles.meshPink1}
            style={{ opacity: pinkOpacity }}
          />
          <motion.div
            className={styles.meshPink2}
            style={{ opacity: pinkOpacity }}
          />
        </div>

        {/* Halftone/Noise Texture */}
        <div className={styles.noiseTexture} />

        {/* Top Right Text */}
        <div className={styles.topRightText}>
          <h1 className={styles.title}>
            ボーダレスな発想と事業で
            <br />
            まちを面白く。
          </h1>
        </div>

        {/* Bottom Left Text */}
        <div className={styles.bottomLeftText}>
          <div className={styles.subtitle}>Zero-Ten</div>
          <div className={`${styles.subtitle} ${styles.subtitleLeading}`}>
            Borderless by Design.
            <br />
            City, Reimagined
          </div>
          <div className={styles.scrollDown}>
            <ArrowDown size={16} className={styles.bounceIcon} />
            SCROLL DOWN
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.weDoHeader}>
          <h2 className={styles.weDoTitle}>WE DO</h2>
        </div>

        <Marquee />

        <div className={styles.weAreSection}>
          <h2 className={styles.weAreTitle}>WE ARE</h2>
          <p className={styles.weAreDesc}>
            イベントやクリエイティブ領域から、飲食・不動産まで。
          </p>
        </div>
      </section>

      {/* Fixed Bottom Navigation */}
      <div className={styles.navContainer}>
        <div className={styles.navCenter}>
          <div className={styles.navCenterInner}>
            <div className={styles.navBrand}>ZERO-TEN</div>
            <button className={styles.navMenuBtn}>
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className={styles.navRight}>
          <button className={styles.navContactBtn}>CONTACT</button>
        </div>
      </div>
    </div>
  );
}
