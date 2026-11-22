"use client";

import React from "react";
import Link from "next/link";
import { ModelSummary } from "@/types";
import { formatPrice, formatContextWindow, formatDate, getCompanyInitials } from "@/lib/utils";
import { useComparison } from "@/context/ComparisonContext";
import {
  Layers,
  ArrowRight,
  Check,
  Plus,
  Coins,
  Cpu,
  Sparkles,
} from "lucide-react";

interface ModelCardProps {
  model: ModelSummary;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const { addModel, removeModel, isModelSelected } = useComparison();
  const selected = isModelSelected(model.slug);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeModel(model.slug);
    } else {
      addModel(model.slug);
    }
  };

  return (
    <div className="bg-card border border-surface-300 rounded-xl p-5 hover:border-gray-600 transition-all flex flex-col justify-between glow-border relative group">
      {/* Top row: Company initials badge, name, trending pill */}
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
            {model.isTrending && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet/15 border border-violet/30 text-[10px] font-semibold text-violet">
                <Sparkles className="w-3 h-3" />
                <span>Trending</span>
              </span>
            )}
            {model.isFree && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
                Free Tier
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {model.description}
        </p>

        {/* Spec Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-surface-50 border border-surface-300 mb-4 text-xs font-mono">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-sans">
              Context Window
            </div>
            <div className="font-semibold text-gray-200 flex items-center gap-1 mt-0.5">
              <Cpu className="w-3 h-3 text-electric-blue" />
              <span>{formatContextWindow(model.contextWindow)}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-sans">
              Input / Output
            </div>
            <div className="font-semibold text-gray-200 flex items-center gap-1 mt-0.5">
              <Coins className="w-3 h-3 text-emerald-400" />
              <span>
                {formatPrice(model.pricing?.inputPricePerMillion)} / {formatPrice(model.pricing?.outputPricePerMillion)}
              </span>
            </div>
          </div>
        </div>

        {/* Capabilities Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {model.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap.slug}
              className="text-[10px] px-2 py-0.5 rounded bg-surface-200 text-gray-300 border border-surface-300"
            >
              {cap.name}
            </span>
          ))}
          {model.capabilities.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-gray-500">
              +{model.capabilities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-surface-300 flex items-center justify-between gap-2">
        <button
          onClick={handleToggleCompare}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selected
              ? "bg-electric-blue/20 border-electric-blue text-electric-blue"
              : "bg-surface-200 border-surface-300 text-gray-300 hover:text-white hover:bg-surface-300"
          }`}
        >
          {selected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>In Compare</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Compare</span>
            </>
          )}
        </button>

        <Link
          href={`/models/${model.slug}`}
          className="flex items-center gap-1 text-xs font-semibold text-electric-blue hover:text-blue-300 py-1.5 px-2 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
