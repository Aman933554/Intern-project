"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  LayoutGrid,
  List,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { ModelSummary, ModelsFilterQuery, PaginatedResult } from "@/types";
import { ModelFilters } from "@/components/models/ModelFilters";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelTableView } from "@/components/models/ModelTableView";
import { Pagination } from "@/components/models/Pagination";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

function ExploreModelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modelsData, setModelsData] = useState<PaginatedResult<ModelSummary>>({
    data: [],
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });

  const [companies, setCompanies] = useState<{ name: string; slug: string }[]>([]);
  const [providers, setProviders] = useState<{ name: string; slug: string }[]>([]);

  // Parse filters from URL searchParams
  const [filters, setFilters] = useState<ModelsFilterQuery>(() => {
    return {
      search: searchParams.get("search") || undefined,
      company: searchParams.get("company") || undefined,
      provider: searchParams.get("provider") || undefined,
      type: searchParams.get("type") || undefined,
      capability: searchParams.get("capability") || undefined,
      isFree: searchParams.get("isFree") === "true" ? true : undefined,
      minContext: searchParams.get("minContext") ? Number(searchParams.get("minContext")) : undefined,
      sort: (searchParams.get("sort") as any) || "newest",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    };
  });

  // Load companies & providers list for filter dropdowns
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/providers"),
        ]);
        const [cData, pData] = await Promise.all([cRes.json(), pRes.json()]);
        if (cData.success) {
          setCompanies(cData.data.map((c: any) => ({ name: c.name, slug: c.slug })));
        }
        if (pData.success) {
          setProviders(pData.data.map((p: any) => ({ name: p.name, slug: p.slug })));
        }
      } catch (err) {
        console.error("Error loading filter metadata:", err);
      }
    }
    loadMeta();
  }, []);

  // Fetch models with current filters
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.company) params.set("company", filters.company);
      if (filters.provider) params.set("provider", filters.provider);
      if (filters.type) params.set("type", filters.type);
      if (filters.capability) params.set("capability", filters.capability);
      if (filters.isFree) params.set("isFree", "true");
      if (filters.minContext) params.set("minContext", String(filters.minContext));
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.page) params.set("page", String(filters.page));
      params.set("limit", String(filters.limit || 12));

      const res = await fetch(`/api/models?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch models");
      }

      setModelsData({
        data: json.data,
        pagination: json.pagination,
      });

      // Synchronize URL without full reload
      const newQuery = params.toString();
      router.replace(newQuery ? `/models?${newQuery}` : "/models", { scroll: false });
    } catch (err: any) {
      console.error("Fetch models error:", err);
      setError(err.message || "Failed to load models");
    } finally {
      setIsLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleFilterChange = (updated: Partial<ModelsFilterQuery>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      sort: "newest",
      page: 1,
      limit: 12,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-300 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Box className="w-6 h-6 text-electric-blue" />
              <span>Explore AI Models</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-xs font-mono font-semibold text-electric-blue">
              {modelsData.pagination.total} Available
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Search, filter, and analyze commercial & open-weights models across companies, context windows, and token pricing.
          </p>
        </div>

        {/* View mode toggle (Grid vs Table) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 rounded-lg bg-surface-100 border border-surface-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-electric-blue text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-electric-blue text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Filters Component */}
      <ModelFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        companies={companies}
        providers={providers}
      />

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Error loading models: {error}. Please try resetting filters or refreshing the page.</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-surface-300 rounded-xl p-5 h-64 animate-pulse flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-surface-300" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-surface-300 rounded w-1/2" />
                    <div className="h-3 bg-surface-300 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-surface-300 rounded w-full" />
                  <div className="h-3 bg-surface-300 rounded w-4/5" />
                </div>
              </div>
              <div className="h-10 bg-surface-200 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && modelsData.data.length === 0 && (
        <div className="py-16 text-center border border-dashed border-surface-300 rounded-2xl bg-card/40 p-8">
          <Box className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-white mb-1">
            No models match the selected filters
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
            Try adjusting your search terms, relaxing context window restrictions, or clearing filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Data display (Grid Cards or Table) */}
      {!isLoading && !error && modelsData.data.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modelsData.data.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <ModelTableView models={modelsData.data} />
          )}

          {/* Pagination Controls */}
          <Pagination
            page={modelsData.pagination.page}
            totalPages={modelsData.pagination.totalPages}
            total={modelsData.pagination.total}
            limit={modelsData.pagination.limit}
            onPageChange={(newPage) => handleFilterChange({ page: newPage })}
          />
        </>
      )}

      {/* Compliance Disclaimer */}
      <DisclaimerNotice />
    </div>
  );
}

export default function ExploreModelsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-gray-400">
          Loading models intelligence...
        </div>
      }
    >
      <ExploreModelsContent />
    </Suspense>
  );
}
