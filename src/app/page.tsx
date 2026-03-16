/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Menu } from "lucide-react";
import SideMenu from "@/components/SideMenu";

const Marquee = () => {
  return (
    <div className="relative flex overflow-x-hidden py-12 ">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # プロジェクションマッピング
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # イベント事業
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # 映像制作
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # デジタルクリエイティブ事業
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # 世界を盛り上げる
        </span>
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center py-12">
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # プロジェクションマッピング
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # イベント事業
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # 映像制作
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # デジタルクリエイティブ事業
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # 世界を盛り上げる
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Fade in pink layer as we scroll down
  const pinkOpacity = useTransform(scrollY, [100, 0], [0, 1]);

  return (
    <div className="relative min-h-screen bg-[#fafaf7] font-sans selection:bg-blue-200">
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-between p-8 md:p-12">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 bg-[#8EACF1] z-10">
          {/* Base Blue/Cyan */}
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-[#83A4EF] blur-[120px] opacity-90" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#0072ff] blur-[150px] opacity-80" />

          {/* Pink layer that fades in on scroll */}
          <motion.div
            className="absolute inset-0 bg-linear-to-tr from-[#F4F2FD] to-[#b9bad7] mix-blend-overlay"
            style={{ opacity: pinkOpacity }}
          />
          {/* <motion.div
            className="absolute top-[-10%] right-[-20%] w-[90%] h-[90%] rounded-full bg-[#F4F2FD] blur-[150px]"
            style={{ opacity: pinkOpacity }}
          /> */}
          <motion.div
            className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[#b9bad7] blur-[150px]"
            style={{ opacity: pinkOpacity }}
          />
        </div>

        {/* Halftone/Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay z-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Top Right Text */}
        <div className="absolute top-24 right-8 md:right-24 text-right z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-[1.5] tracking-widest drop-shadow-sm">
            thisisstar
          </h1>
        </div>

        {/* Bottom Left Text */}
        <div className="absolute bottom-32 left-8 md:left-12 z-10 flex flex-col gap-8 text-black">
          <div className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] mt-8 opacity-90">
            <ArrowDown size={16} className="animate-bounce" />
            SCROLL DOWN
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative bg-[#fafaf7] z-20 pb-64 pt-16">
        <div className="px-8 md:px-12 mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-gray-900">
            WE DO
          </h2>
        </div>

        <Marquee />
      </section>

      {/* Fixed Bottom Navigation */}
      <div className="fixed top-20 left-0 w-full px-8 md:px-12 flex justify-between items-end z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-start absolute ">
          <div className="bg-[#151922] text-white flex items-center overflow-hidden shadow-2xl">
            <button
              onClick={() => setMenuOpen(true)}
              className="px-6 py-4 hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
