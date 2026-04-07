/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Menu } from "lucide-react";
import SideMenu from "@/components/SideMenu";
import ProjectsSection from "@/components/ProjectsSection";

const Marquee = () => {
  return (
    <div className="relative flex overflow-x-hidden py-12 ">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # Frontend Developement
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # Typescript
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # Next.js
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # React.js
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # UI/UX Design
        </span>
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center py-12">
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # Frontend Developement
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # Typescript
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # Next.js
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # React.js
        </span>
        <span className="mx-8 text-3xl md:text-5xl font-light tracking-widest text-gray-800">
          # UI/UX Design
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#fafaf7] font-sans selection:bg-blue-200">
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-between p-8 md:p-12">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 bg-[#8EACF1] z-10">
          <motion.div
            className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-[#447cf7] blur-[120px] opacity-90"
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#0072ff] blur-[150px] opacity-80"
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 40, -20, 0],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-linear-to-tr from-[#F4F2FD] to-[#b9bad7] mix-blend-overlay"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[#b9bad7] blur-[150px]"
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero Image Overlay */}
        <div
          className="absolute inset-0 z-10 bg-cover bg-center mix-blend-overlay opacity-40 pointer-events-none grayscale"
          style={{ backgroundImage: "url('/hero.jpeg')" }}
        />

        {/* Halftone/Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay z-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Top Right Text — inverted knockout */}
        <div className="absolute top-24 right-8 md:right-24 text-right z-30">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-normal tracking-[10px] mix-blend-overlay"
            style={{
              background: "inherit",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "rgba(51, 132, 255, 0.5)",
              // filter: "invert(1) grayscale(1)",
              mixBlendMode: "difference",
            }}
          >
            THISISSTARTHISISSTARTHISISSTARTHISISSTAR
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
      <ProjectsSection />
      {/* Content Section */}
      <section className="relative bg-[#fafaf7] z-20 pb-64 pt-16">
        <div className="px-8 md:px-12 mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-gray-900">
            I DO
          </h2>
        </div>

        <Marquee />
      </section>

      {/* Fixed Bottom Center Menu Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setMenuOpen(true)}
          className="bg-[#F8F8F8] text-[#3384FF] rounded-full px-6 py-6 hover:bg-gray-800 transition-colors shadow-2xl"
        >
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}
