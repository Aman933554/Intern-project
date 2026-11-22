"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Box, Building2, Server, ArrowRight, X } from "lucide-react";
import { GlobalSearchResult, ModelSummary } from "@/types";
import { formatContextWindow, getCompanyInitials } from "@/lib/utils";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "models" | "companies" | "providers">("all");
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    fetch(`/api/models/search?q=${encodeURIComponent(initialQuery.trim())}&limit=20`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setResults(json.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const totalResults =
    (results?.models.length || 0) +
    (results?.companies.length || 0) +
    (results?.providers.length || 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Header Form */}
      <div className="bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
          Global Intelligence Search
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all foundation models, companies, and providers..."
            className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-surface-100 border border-surface-300 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Search
          </button>
        </form>

        {initialQuery && (
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span>
              Showing results for:{" "}
              <strong className="text-white">&ldquo;{initialQuery}&rdquo;</strong>
            </span>
            <span>•</span>
            <span>{totalResults} items identified</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      {results && totalResults > 0 && (
        <div className="flex items-center gap-2 border-b border-surface-300 pb-3 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "all"
                ? "bg-electric-blue text-white shadow-glow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All Results ({totalResults})
          </button>

          <button
            onClick={() => setActiveTab("models")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "models"
                ? "bg-electric-blue text-white shadow-glow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Models ({results.models.length})
          </button>

          <button
            onClick={() => setActiveTab("companies")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "companies"
                ? "bg-electric-blue text-white shadow-glow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            AI Labs ({results.companies.length})
          </button>

          <button
            onClick={() => setActiveTab("providers")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "providers"
                ? "bg-electric-blue text-white shadow-glow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Providers ({results.providers.length})
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="py-16 text-center text-xs text-gray-400">
          Querying relational database...
        </div>
      )}

      {/* Empty */}
      {!isLoading && initialQuery && totalResults === 0 && (
        <div className="py-16 text-center border border-dashed border-surface-300 rounded-xl p-8 text-xs text-gray-400">
          No records matched &ldquo;{initialQuery}&rdquo;. Try another model name, lab, or provider.
        </div>
      )}

      {/* Results Content */}
      {!isLoading && results && (
        <div className="space-y-6">
          {/* Models Group */}
          {(activeTab === "all" || activeTab === "models") &&
            results.models.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-electric-blue" />
                  <span>Matching AI Models</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.models.map((m) => (
                    <Link
                      key={m.id}
                      href={`/models/${m.slug}`}
                      className="p-4 rounded-xl bg-card border border-surface-300 hover:border-gray-600 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">
                          {m.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {m.companyName} • {m.modelType} • {formatContextWindow(m.contextWindow)} context
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-electric-blue transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Companies Group */}
          {(activeTab === "all" || activeTab === "companies") &&
            results.companies.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-violet" />
                  <span>Matching AI Labs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.companies.map((c) => (
                    <Link
                      key={c.id}
                      href={`/companies/${c.slug}`}
                      className="p-4 rounded-xl bg-card border border-surface-300 hover:border-gray-600 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-violet transition-colors">
                          {c.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {c.modelCount} Models cataloged
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-violet transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Providers Group */}
          {(activeTab === "all" || activeTab === "providers") &&
            results.providers.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Matching Inference Gateways</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.providers.map((p) => (
                    <Link
                      key={p.id}
                      href={`/providers/${p.slug}`}
                      className="p-4 rounded-xl bg-card border border-surface-300 hover:border-gray-600 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {p.modelCount} Supported models
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-gray-400">
          Loading search results...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
