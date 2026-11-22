"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, Plus, Layers } from "lucide-react";
import { useComparison } from "@/context/ComparisonContext";

interface ModelDetailActionsProps {
  slug: string;
  name: string;
}

export const ModelDetailActions: React.FC<ModelDetailActionsProps> = ({
  slug,
  name,
}) => {
  const [copied, setCopied] = useState(false);
  const { addModel, removeModel, isModelSelected, selectedSlugs } = useComparison();
  const selected = isModelSelected(slug);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleCompare = () => {
    if (selected) {
      removeModel(slug);
    } else {
      addModel(slug);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-200 hover:bg-surface-300 text-gray-200 text-xs font-semibold border border-surface-300 transition-colors"
        title="Copy Model Slug to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">Copied Slug</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-gray-400" />
            <span>Copy Identifier</span>
          </>
        )}
      </button>

      <button
        onClick={handleToggleCompare}
        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
          selected
            ? "bg-electric-blue/20 border-electric-blue text-electric-blue"
            : "bg-electric-blue hover:bg-electric-blue-600 border-transparent text-white shadow-glow"
        }`}
      >
        {selected ? (
          <>
            <Check className="w-4 h-4" />
            <span>In Comparison</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Add to Compare</span>
          </>
        )}
      </button>

      {selectedSlugs.length >= 2 && (
        <Link
          href={`/compare?models=${selectedSlugs.join(",")}`}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet hover:bg-violet-600 text-white text-xs font-semibold shadow-glow-violet transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>Compare Now ({selectedSlugs.length})</span>
        </Link>
      )}
    </div>
  );
};
