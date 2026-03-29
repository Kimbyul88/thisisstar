"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { fetchSubcategories, type Subcategory } from "@/lib/actions";

const CATEGORIES = [
  { label: "CLASSES", key: "classes" },
  { label: "PROJECTS", key: "projects" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const menuVariants = {
  closed: { opacity: 0, clipPath: "circle(0% at 50% 100%)" },
  open: {
    opacity: 1,
    clipPath: "circle(150% at 50% 100%)",
    transition: { duration: 0.7, ease },
  },
};

const linkVariants = {
  closed: { y: 40, opacity: 0 },
  open: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease },
  }),
};

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [subs, setSubs] = useState<Record<string, Subcategory[]>>({});

  const toggle = (key: string) => {
    const next = !expanded[key];
    setExpanded((prev) => ({ ...prev, [key]: next }));

    if (next && !subs[key]) {
      fetchSubcategories(key).then((items) =>
        setSubs((prev) => ({ ...prev, [key]: items })),
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 z-100 bg-white text-black/40 flex flex-col justify-center px-8 md:px-24"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 md:top-12 md:right-12 p-4 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Links */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Home */}
            <motion.div
              custom={0}
              variants={linkVariants}
              className="overflow-hidden"
            >
              <Link
                href="/"
                onClick={onClose}
                className="text-5xl md:text-8xl font-sans tracking-tighter hover:text-blue-600 hover:translate-x-4 transition-all duration-300 block"
              >
                HOME
              </Link>
            </motion.div>

            {/* Categories with expandable subcategories */}
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.key}
                custom={idx + 1}
                variants={linkVariants}
                className="overflow-hidden"
              >
                <button
                  onClick={() => toggle(cat.key)}
                  className="flex items-center gap-4 text-5xl md:text-8xl font-sans tracking-tighter hover:text-blue-600 hover:translate-x-4 transition-all duration-300 text-left"
                >
                  {cat.label}
                  <ChevronRight
                    size={32}
                    className={`transition-transform duration-300 ${
                      expanded[cat.key] ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Subcategory links */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    expanded[cat.key]
                      ? "max-h-125 opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-2 pl-2">
                    {(subs[cat.key] ?? []).map((sub) => (
                      <li key={sub.path}>
                        <Link
                          href={`/${sub.path}`}
                          onClick={onClose}
                          className="block text-lg md:text-2xl font-medium text-black/50 hover:text-blue-600 hover:translate-x-2 transition-all duration-200 py-1 pl-6"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom social links */}
          <motion.div
            variants={linkVariants}
            custom={CATEGORIES.length + 2}
            className="absolute bottom-12 left-8 md:left-24 flex gap-8 text-sm font-bold tracking-widest text-gray-400"
          >
            <a
              href="https://github.com/Kimbyul88/thisisstar"
              className="hover:text-black transition-colors"
            >
              GITHUB
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
