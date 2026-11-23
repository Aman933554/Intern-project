"use client";

import React from "react";
import Link from "next/link";
import { ModelSummary } from "@/types";
import { formatPrice, formatContextWindow, formatDate, getCompanyInitials } from "@/lib/utils";
import { useComparison } from "@/context/ComparisonContext";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  ArrowRight,
  Check,
  Plus,
  Coins,
  Cpu,
  Sparkles,
  Bookmark,
} from "lucide-react";

interface ModelCardProps {
  model: ModelSummary;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const { addModel, removeModel, isModelSelected } = useComparison();
  const { toggleSave, isModelSaved } = useAuth();

  const selected = isModelSelected(model.slug);
  const saved = isModelSaved(model.slug);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeModel(model.slug);
    } else {
      addModel(model.slug);
    }
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSave(model.slug);
  };

  return (
    <div className="bg-card border border-surface-300 rounded-xl p-5 hover:border-gray-600 transition-all flex flex-col justify-between glow-border relative group">
      {/* Top row: Company initials badge, name, trending pill & bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-xs text-electric-blue">
              {getCompanyInitials(model.company.name)}
            </div>
            <div>
              <Link
                href={`/models/${model.slug}`}
                className="font-bold text-base text-white group-hover:text-electric-blue transition-colors line-clamp-1"
              >
                {model.name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Link
                  href={`/companies/${model.company.slug}`}
                  className="hover:underline hover:text-gray-200"
                >
                  {model.company.name}
                </Link>
                <span>•</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-200 text-gray-300 border border-surface-300">
                  {model.modelType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border transition-colors ${
                saved
                  ? "bg-electric-blue/20 border-electric-blue text-electric-blue"
                  : "bg-surface-200 border-surface-300 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
              title={saved ? "Remove from bookmarks" : "Bookmark model"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-electric-blue" : ""}`} />
            </button>

            {model.isTrending && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet/15 text-violet border border-violet/30">
                <Sparkles className="w-2.5 h-2.5" />
                Trending
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-surface-100 border border-surface-300 text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <Cpu className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Context:</span>
            <span className="font-mono font-semibold text-white">
              {formatContextWindow(model.contextWindow)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-300">
            <Coins className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Input:</span>
            <span className="font-mono font-semibold text-white">
              {formatPrice(model.pricing?.inputPricePerMillion)}
            </span>
          </div>
        </div>

        {/* Modalities pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {model.modalities.map((mod) => (
            <span
              key={mod}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-200 text-gray-300 border border-surface-300"
            >
              {mod}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom actions: Compare toggle & Details link */}
      <div className="pt-3 border-t border-surface-300 flex items-center justify-between gap-2">
        <button
          onClick={handleToggleCompare}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            selected
              ? "bg-electric-blue text-white border-electric-blue shadow-glow"
              : "bg-surface-200 text-gray-300 border-surface-300 hover:text-white hover:border-gray-600"
          }`}
        >
          {selected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>In Dock</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-electric-blue" />
              <span>Compare</span>
            </>
          )}
        </button>

        <Link
          href={`/models/${model.slug}`}
          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          <span>Deep Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
