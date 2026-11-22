"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Plus,
  X,
  Check,
  Trophy,
  Coins,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react";
import { CompareModelsResponse, ModelDetail } from "@/types";
import { formatPrice, formatContextWindow, formatDate, getCompanyInitials } from "@/lib/utils";
import { ModelSelectorModal } from "@/components/comparison/ModelSelectorModal";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [slugs, setSlugs] = useState<string[]>([]);
  const [comparison, setComparison] = useState<CompareModelsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const rawParam = searchParams.get("models");
    let initialSlugs: string[] = [];

    if (rawParam) {
      initialSlugs = rawParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      // Default to 3 prominent models for an immediate impressive comparison
      initialSlugs = ["gpt-4o", "claude-3-5-sonnet", "deepseek-r1"];
    }

    setSlugs(initialSlugs.slice(0, 4));
  }, [searchParams]);

  // Fetch comparison data whenever slugs change
  useEffect(() => {
    if (slugs.length === 0) {
      setComparison(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelSlugs: slugs }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComparison(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [slugs]);

  // Synchronize URL query parameter
  const updateUrl = (newSlugs: string[]) => {
    setSlugs(newSlugs);
    const query = newSlugs.length > 0 ? `?models=${newSlugs.join(",")}` : "";
    router.replace(`/compare${query}`, { scroll: false });
  };

  const handleAddSlug = (newSlug: string) => {
    if (slugs.includes(newSlug)) return;
    if (slugs.length >= 4) {
      alert("You can compare a maximum of 4 models simultaneously.");
      return;
    }
    const updated = [...slugs, newSlug];
    updateUrl(updated);
  };

  const handleRemoveSlug = (slugToRemove: string) => {
    const updated = slugs.filter((s) => s !== slugToRemove);
    updateUrl(updated);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const models = comparison?.models || [];
  const highlights = comparison?.highlights;

  // Collect union of all benchmarks present in compared models
  const allBenchmarkNames = Array.from(
    new Set(
      models.flatMap((m) => m.benchmarks.map((b) => b.benchmark.name))
    )
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-300 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-electric-blue" />
              <span>Model Comparison Matrix</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-xs font-mono font-semibold text-electric-blue">
              {models.length} / 4 Selected
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Side-by-side technical evaluation highlighting lowest token pricing, context windows, and benchmark leaders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-200 hover:bg-surface-300 text-gray-300 hover:text-white text-xs font-semibold border border-surface-300 transition-colors"
            title="Copy shareable comparison link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
          </button>

          {slugs.length < 4 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Model ({slugs.length}/4)</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm text-gray-400">Loading comparison intelligence...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && models.length === 0 && (
        <div className="py-16 text-center border border-dashed border-surface-300 rounded-2xl bg-card/40 p-8">
          <Layers className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-white mb-1">
            No models selected for comparison
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
            Select 2 to 4 models to see a comprehensive side-by-side architectural and pricing breakdown.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Add Models to Compare
          </button>
        </div>
      )}

      {/* Comparison Grid Matrix */}
      {!isLoading && models.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-surface-300 bg-card shadow-xl">
          <table className="w-full border-collapse text-left text-xs">
            {/* Header row: Model Cards */}
            <thead>
              <tr className="border-b border-surface-300 bg-surface-100">
                <th className="p-4 w-48 min-w-[180px] text-gray-400 font-semibold uppercase tracking-wider text-[11px] align-top">
                  Attribute / Parameter
                </th>
                {models.map((model) => (
                  <th
                    key={model.id}
                    className="p-4 min-w-[220px] align-top border-l border-surface-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-xs text-electric-blue">
                            {getCompanyInitials(model.company.name)}
                          </div>
                          <div>
                            <Link
                              href={`/models/${model.slug}`}
                              className="font-bold text-sm text-white hover:text-electric-blue transition-colors line-clamp-1"
                            >
                              {model.name}
                            </Link>
                            <div className="text-[11px] text-gray-400">
                              {model.company.name}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveSlug(model.slug)}
                          className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Remove model"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-200 border border-surface-300 text-gray-300">
                          {model.modelType}
                        </span>
                        {model.isTrending && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet/20 text-violet font-semibold">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-300">
              {/* Category: Pricing Parameters */}
              <tr className="bg-surface-50/50">
                <td
                  colSpan={models.length + 1}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-electric-blue"
                >
                  API Token Pricing
                </td>
              </tr>

              {/* Input Pricing Row */}
              <tr>
                <td className="p-4 font-medium text-gray-400">
                  Input Price ($/1M tokens)
                </td>
                {models.map((m) => {
                  const isLowest = highlights?.lowestInputPriceModelId === m.id;
                  return (
                    <td
                      key={m.id}
                      className={`p-4 border-l border-surface-300 font-mono text-xs ${
                        isLowest ? "bg-emerald-500/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{formatPrice(m.pricing?.inputPricePerMillion)}</span>
                        {isLowest && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-sans font-semibold">
                            Lowest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Output Pricing Row */}
              <tr>
                <td className="p-4 font-medium text-gray-400">
                  Output Price ($/1M tokens)
                </td>
                {models.map((m) => {
                  const isLowest = highlights?.lowestOutputPriceModelId === m.id;
                  return (
                    <td
                      key={m.id}
                      className={`p-4 border-l border-surface-300 font-mono text-xs ${
                        isLowest ? "bg-emerald-500/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{formatPrice(m.pricing?.outputPricePerMillion)}</span>
                        {isLowest && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-sans font-semibold">
                            Lowest
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Category: Architecture & Context */}
              <tr className="bg-surface-50/50">
                <td
                  colSpan={models.length + 1}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-violet"
                >
                  Architecture & Context
                </td>
              </tr>

              {/* Context Window Row */}
              <tr>
                <td className="p-4 font-medium text-gray-400">Context Window</td>
                {models.map((m) => {
                  const isLargest = highlights?.largestContextWindowModelId === m.id;
                  return (
                    <td
                      key={m.id}
                      className={`p-4 border-l border-surface-300 font-mono text-xs ${
                        isLargest ? "bg-electric-blue/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{formatContextWindow(m.contextWindow)}</span>
                        {isLargest && (
                          <span className="px-1.5 py-0.5 rounded bg-electric-blue/20 text-electric-blue text-[10px] font-sans font-semibold">
                            Largest
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 font-mono">
                        {m.contextWindow.toLocaleString()} tokens
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Max Output Tokens Row */}
              <tr>
                <td className="p-4 font-medium text-gray-400">Max Generation</td>
                {models.map((m) => (
                  <td
                    key={m.id}
                    className="p-4 border-l border-surface-300 font-mono text-gray-300"
                  >
                    {m.maxOutputTokens
                      ? `${formatContextWindow(m.maxOutputTokens)} tokens`
                      : "Standard"}
                  </td>
                ))}
              </tr>

              {/* Architecture Row */}
              <tr>
                <td className="p-4 font-medium text-gray-400">Architecture</td>
                {models.map((m) => (
                  <td
                    key={m.id}
                    className="p-4 border-l border-surface-300 text-gray-300 text-[11px]"
                  >
                    {m.architecture || "Proprietary Transformer"}
                  </td>
                ))}
              </tr>

              {/* Release Date */}
              <tr>
                <td className="p-4 font-medium text-gray-400">Release Date</td>
                {models.map((m) => (
                  <td
                    key={m.id}
                    className="p-4 border-l border-surface-300 font-mono text-gray-300"
                  >
                    {formatDate(m.releaseDate)}
                  </td>
                ))}
              </tr>

              {/* Category: Standard Benchmarks */}
              <tr className="bg-surface-50/50">
                <td
                  colSpan={models.length + 1}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-400"
                >
                  Standard Benchmark Scores
                </td>
              </tr>

              {allBenchmarkNames.map((benchName) => {
                const highInfo = highlights?.highestBenchmarkScores[benchName];
                return (
                  <tr key={benchName}>
                    <td className="p-4 font-medium text-gray-300">
                      <div>{benchName}</div>
                    </td>
                    {models.map((m) => {
                      const scoreObj = m.benchmarks.find(
                        (b) => b.benchmark.name === benchName
                      );
                      const isHigh = highInfo && highInfo.modelId === m.id;

                      return (
                        <td
                          key={m.id}
                          className={`p-4 border-l border-surface-300 font-mono text-xs ${
                            isHigh ? "bg-amber-400/10" : ""
                          }`}
                        >
                          {scoreObj ? (
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-white">{scoreObj.score}</span>
                              <span className="text-[10px] text-gray-500 font-normal">
                                {scoreObj.benchmark.unit}
                              </span>
                              {isHigh && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-sans font-semibold">
                                  Top Score
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Category: Capabilities */}
              <tr className="bg-surface-50/50">
                <td
                  colSpan={models.length + 1}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400"
                >
                  Modalities & Capabilities
                </td>
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-400">Modalities</td>
                {models.map((m) => (
                  <td key={m.id} className="p-4 border-l border-surface-300">
                    <div className="flex flex-wrap gap-1">
                      {m.modalities.map((mod) => (
                        <span
                          key={mod}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-gray-300 border border-surface-300"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-400">Supported Tools</td>
                {models.map((m) => (
                  <td key={m.id} className="p-4 border-l border-surface-300">
                    <div className="flex flex-wrap gap-1">
                      {m.capabilities.map((cap) => (
                        <span
                          key={cap.slug}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-gray-300"
                        >
                          {cap.name}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Providers Available */}
              <tr>
                <td className="p-4 font-medium text-gray-400">Providers</td>
                {models.map((m) => (
                  <td key={m.id} className="p-4 border-l border-surface-300">
                    <div className="flex flex-wrap gap-1">
                      {m.providers.map((p) => (
                        <span
                          key={p.slug}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-gray-400"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Model Selector Modal */}
      <ModelSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddSlug}
        alreadySelectedSlugs={slugs}
      />

      {/* Compliance Disclaimer */}
      <DisclaimerNotice />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-gray-400">
          Loading comparison matrix...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
