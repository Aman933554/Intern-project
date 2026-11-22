"use client";

import React from "react";
import { Search, X, RotateCcw, Filter, Check } from "lucide-react";
import { ModelsFilterQuery } from "@/types";

interface ModelFiltersProps {
  filters: ModelsFilterQuery;
  onChange: (updated: Partial<ModelsFilterQuery>) => void;
  onClear: () => void;
  companies: { name: string; slug: string }[];
  providers: { name: string; slug: string }[];
}

export const ModelFilters: React.FC<ModelFiltersProps> = ({
  filters,
  onChange,
  onClear,
  companies,
  providers,
}) => {
  const modelTypes = ["All", "Chat", "Multimodal", "Reasoning", "Code"];
  const contextOptions = [
    { label: "Any Context", value: 0 },
    { label: "≥ 32k tokens", value: 32000 },
    { label: "≥ 128k tokens", value: 128000 },
    { label: "≥ 200k tokens", value: 200000 },
    { label: "≥ 1M tokens", value: 1000000 },
  ];

  const sortOptions = [
    { label: "Newest Release", value: "newest" },
    { label: "Lowest Input Price", value: "price-asc" },
    { label: "Highest Input Price", value: "price-desc" },
    { label: "Highest Context Window", value: "context-desc" },
    { label: "Oldest Release", value: "oldest" },
    { label: "Alphabetical (A-Z)", value: "name-asc" },
  ];

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.company ||
      filters.provider ||
      filters.type ||
      filters.capability ||
      filters.isFree !== undefined ||
      filters.minContext ||
      filters.sort !== "newest"
  );

  return (
    <div className="bg-card border border-surface-300 rounded-xl p-4 sm:p-5 mb-6 space-y-4 shadow-sm">
      {/* Top search & quick options bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Search by model, company, provider, or architecture..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: "", page: 1 })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Company Dropdown */}
        <div className="md:col-span-2">
          <select
            value={filters.company || ""}
            onChange={(e) => onChange({ company: e.target.value || undefined, page: 1 })}
            className="w-full py-2 px-3 rounded-lg bg-surface-100 border border-surface-300 text-xs text-gray-200 focus:outline-none focus:border-electric-blue transition-colors"
          >
            <option value="">All AI Labs</option>
            {companies.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Provider Dropdown */}
        <div className="md:col-span-2">
          <select
            value={filters.provider || ""}
            onChange={(e) => onChange({ provider: e.target.value || undefined, page: 1 })}
            className="w-full py-2 px-3 rounded-lg bg-surface-100 border border-surface-300 text-xs text-gray-200 focus:outline-none focus:border-electric-blue transition-colors"
          >
            <option value="">All Providers</option>
            {providers.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filters.sort || "newest"}
            onChange={(e) => onChange({ sort: e.target.value as any, page: 1 })}
            className="w-full py-2 px-3 rounded-lg bg-surface-100 border border-surface-300 text-xs text-gray-200 focus:outline-none focus:border-electric-blue transition-colors"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary filter chips row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-300/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </span>

          {modelTypes.map((type) => {
            const isSelected =
              type === "All" ? !filters.type : filters.type === type;
            return (
              <button
                key={type}
                onClick={() =>
                  onChange({
                    type: type === "All" ? undefined : type,
                    page: 1,
                  })
                }
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-electric-blue text-white shadow-glow"
                    : "bg-surface-200 text-gray-400 hover:text-white hover:bg-surface-300"
                }`}
              >
                {type}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-surface-300 mx-1 hidden sm:block" />

          {/* Context threshold select */}
          <select
            value={filters.minContext || 0}
            onChange={(e) =>
              onChange({
                minContext: Number(e.target.value) || undefined,
                page: 1,
              })
            }
            className="py-1 px-2.5 rounded-md bg-surface-200 border border-surface-300 text-xs text-gray-300 focus:outline-none"
          >
            {contextOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Free Tier Only Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer ml-1 text-gray-300 bg-surface-200 px-2.5 py-1 rounded-md border border-surface-300 hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(filters.isFree)}
              onChange={(e) =>
                onChange({
                  isFree: e.target.checked ? true : undefined,
                  page: 1,
                })
              }
              className="rounded bg-surface-100 border-gray-600 text-electric-blue focus:ring-0"
            />
            <span className="text-xs">Free Tier Only</span>
          </label>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
