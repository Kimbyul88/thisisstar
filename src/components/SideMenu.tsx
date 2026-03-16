"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { fetchCategoryTree, type TreeNode } from "@/lib/actions";

interface CategoryConfig {
  label: string;
  key: string;
}

const CATEGORIES: CategoryConfig[] = [
  { label: "Classes", key: "classes" },
  { label: "Projects", key: "projects" },
];

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [trees, setTrees] = useState<Record<string, TreeNode[]>>({});

  const toggle = (key: string) => {
    const next = !expanded[key];
    setExpanded((prev) => ({ ...prev, [key]: next }));

    if (next && !trees[key]) {
      fetchCategoryTree(key).then((nodes) =>
        setTrees((prev) => ({ ...prev, [key]: nodes })),
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
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-90 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <nav
        className={`fixed top-0 left-0 h-full w-[85vw] sm:w-[40vw] lg:w-[33vw] bg-black z-100 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-8 pb-12">
          {/* Home */}
          <Link
            href="/"
            onClick={onClose}
            className="block text-white text-2xl font-medium tracking-wide hover:text-white/70 transition-colors mb-8"
          >
            Home
          </Link>

          {/* Expandable categories */}
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="mb-6">
              <button
                onClick={() => toggle(cat.key)}
                className="flex items-center gap-2 text-white text-2xl font-medium tracking-wide hover:text-white/70 transition-colors w-full text-left"
              >
                <ChevronRight
                  size={18}
                  className={`transition-transform duration-200 ${
                    expanded[cat.key] ? "rotate-90" : ""
                  }`}
                />
                {cat.label}
              </button>

              {/* Subfolders & files */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded[cat.key]
                    ? "max-h-125 opacity-100 mt-3"
                    : "max-h-0 opacity-0"
                }`}
              >
                <NodeList
                  nodes={trees[cat.key] ?? []}
                  depth={0}
                  onNavigate={onClose}
                />
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}

function NodeList({
  nodes,
  depth,
  onNavigate,
}: {
  nodes: TreeNode[];
  depth: number;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (nodes.length === 0) return null;

  return (
    <ul className="space-y-1" style={{ paddingLeft: depth > 0 ? 12 : 8 }}>
      {nodes.map((node) => {
        const isOpen = expanded[node.name];

        if (node.isFile) {
          // File → navigable link: /classes/subfolder/filename
          return (
            <li key={node.path}>
              <Link
                href={`/${node.path}`}
                onClick={onNavigate}
                className="block text-white/80 text-sm hover:text-white transition-colors py-1 pl-5"
              >
                {node.name}
              </Link>
            </li>
          );
        }

        // Folder → toggle to show children
        return (
          <li key={node.path}>
            <button
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [node.name]: !prev[node.name],
                }))
              }
              className="flex items-center gap-1.5 text-white/80 text-sm hover:text-white transition-colors py-1 w-full text-left"
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
              {node.name}
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-75 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <NodeList
                nodes={node.children}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
