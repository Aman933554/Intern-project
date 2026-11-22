"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Box, Building2, Server, ArrowRight } from "lucide-react";
import { GlobalSearchResult } from "@/types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/models/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard shortcut escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const handleViewAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  if (!isOpen) return null;

  const hasResults =
    results &&
    (results.models.length > 0 ||
      results.companies.length > 0 ||
      results.providers.length > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-2xl bg-card border border-surface-300 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <form onSubmit={handleViewAll} className="flex items-center gap-3 px-4 py-3.5 border-b border-surface-300">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI models, companies, or providers... (Press Enter for full results)"
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-surface-300 text-gray-400 px-2 py-1 rounded border border-gray-700 hover:text-white"
          >
            ESC
          </button>
        </form>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="py-8 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
              <span>Searching intelligence registry...</span>
            </div>
          )}

          {!isLoading && !query.trim() && (
            <div className="py-6 text-center text-xs text-gray-500">
              Try searching for <span className="text-gray-400">"GPT-4o"</span>, <span className="text-gray-400">"Claude 3.5 Sonnet"</span>, <span className="text-gray-400">"OpenAI"</span>, or <span className="text-gray-400">"Together AI"</span>
            </div>
          )}

          {!isLoading && query.trim() && !hasResults && (
            <div className="py-8 text-center text-sm text-gray-400">
              No results found for &ldquo;<span className="text-gray-200">{query}</span>&rdquo;.
            </div>
          )}

          {!isLoading && hasResults && (
            <>
              {/* Models */}
              {results.models.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-electric-blue" />
                    <span>Models ({results.models.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleSelect(`/models/${model.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-200 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-100 group-hover:text-electric-blue transition-colors">
                            {model.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {model.companyName} • {model.modelType} • {model.contextWindow.toLocaleString()} tokens
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-electric-blue transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies */}
              {results.companies.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-violet" />
                    <span>AI Companies ({results.companies.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.companies.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => handleSelect(`/companies/${comp.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-200 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-100 group-hover:text-violet transition-colors">
                            {comp.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {comp.modelCount} active models in catalog
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-violet transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Providers */}
              {results.providers.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inference Providers ({results.providers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.providers.map((prov) => (
                      <button
                        key={prov.id}
                        onClick={() => handleSelect(`/providers/${prov.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-200 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-100 group-hover:text-emerald-400 transition-colors">
                            {prov.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Routes {prov.modelCount} foundational models
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {query.trim() && (
          <div className="p-3 bg-surface-50 border-t border-surface-300 flex items-center justify-between text-xs text-gray-400">
            <span>Press <kbd className="px-1.5 py-0.5 bg-surface-300 rounded text-gray-200">Enter</kbd> to view full results</span>
            <button
              onClick={handleViewAll}
              className="text-electric-blue hover:underline flex items-center gap-1 font-medium"
            >
              <span>See all matching items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
