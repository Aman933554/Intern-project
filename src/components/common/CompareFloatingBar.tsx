"use client";

import React from "react";
import Link from "next/link";
import { useComparison } from "@/context/ComparisonContext";
import { ArrowRight, X, Layers } from "lucide-react";

export const CompareFloatingBar: React.FC = () => {
  const { selectedSlugs, removeModel, clearAll } = useComparison();

  if (selectedSlugs.length === 0) return null;

  return (
    <aside
      aria-label="Model Comparison Dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-card/95 backdrop-blur-md border border-electric-blue/40 rounded-xl shadow-2xl p-3 px-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-electric-blue whitespace-nowrap">
          <Layers className="w-4 h-4" />
          <span>Comparing ({selectedSlugs.length}/4):</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {selectedSlugs.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1.5 bg-surface-300 text-gray-200 text-xs px-2.5 py-1 rounded-md border border-gray-700 whitespace-nowrap"
            >
              <span className="font-medium">{slug}</span>
              <button
                onClick={() => removeModel(slug)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 transition-colors"
        >
          Clear
        </button>

        {selectedSlugs.length >= 2 ? (
          <Link
            href={`/compare?models=${selectedSlugs.join(",")}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-electric-blue to-violet hover:opacity-95 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-glow transition-all"
          >
            <span>Compare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-[11px] text-gray-500 italic">
            Add 1 more to compare
          </span>
        )}
      </div>
    </aside>
  );
};
