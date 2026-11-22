"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Search,
  Filter,
  BarChart2,
  Cpu,
  Coins,
  ArrowRight,
  ExternalLink,
  Info,
} from "lucide-react";
import { formatPrice, formatContextWindow, getCompanyInitials } from "@/lib/utils";
import { RankingsChart } from "@/components/rankings/RankingsChart";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export default function RankingsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    "Overall",
    "Coding",
    "Reasoning",
    "Mathematics",
    "Knowledge",
    "Vision",
  ];

  useEffect(() => {
    setIsLoading(true);
    const param = activeCategory === "All" ? "" : `?category=${activeCategory}`;
    fetch(`/api/rankings${param}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  const rankingsList: any[] = data?.rankings || [];

  const filteredRankings = rankingsList.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.model.name.toLowerCase().includes(q) ||
      item.model.company.name.toLowerCase().includes(q) ||
      item.benchmarkName.toLowerCase().includes(q)
    );
  });

  // Top items for performance chart
  const chartData = filteredRankings.slice(0, 8).map((r) => ({
    modelName: r.model.name,
    score: r.score,
    benchmarkName: r.benchmarkName,
    unit: r.unit,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-surface-300 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>AI Model Leaderboards & Benchmarks</span>
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-xs font-mono font-semibold text-amber-400">
            Standardized Evals
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
          Evaluate frontier LLM performance across coding (HumanEval, SWE-bench), reasoning (GPQA), mathematics (MATH), multimodal understanding (MMMU), and crowdsourced human preferences (LMSYS Arena).
        </p>
      </div>

      {/* Categories & Filter Bar */}
      <div className="bg-card border border-surface-300 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-amber-400 text-black shadow-glow"
                    : "bg-surface-200 text-gray-300 hover:text-white hover:bg-surface-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leaderboard..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-100 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Benchmark Performance Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-card border border-surface-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>Performance Comparison ({activeCategory} Category)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Top scoring models visualized by benchmark result
              </p>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              Top {chartData.length} Contenders
            </span>
          </div>

          <RankingsChart data={chartData} />
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-surface-300 bg-card overflow-hidden shadow-xl">
        <div className="p-4 border-b border-surface-300 flex items-center justify-between bg-surface-100">
          <span className="font-bold text-sm text-white">
            Leaderboard Rankings ({filteredRankings.length} Scores)
          </span>
          <span className="text-xs font-mono text-amber-400">
            Category: {activeCategory}
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-gray-400">
            Loading benchmark leaderboard...
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            No rankings found for &ldquo;{search}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-surface-50 text-gray-400 uppercase tracking-wider text-[11px] border-b border-surface-300">
                <tr>
                  <th className="py-3 px-4 w-14 font-mono">Rank</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">AI Lab</th>
                  <th className="py-3 px-4">Benchmark</th>
                  <th className="py-3 px-4 font-mono">Score</th>
                  <th className="py-3 px-4 font-mono">Context</th>
                  <th className="py-3 px-4 font-mono">Input $/1M</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-300">
                {filteredRankings.map((item, index) => {
                  return (
                    <tr
                      key={`${item.model.id}-${item.benchmarkName}-${index}`}
                      className="hover:bg-surface-200/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            index === 0
                              ? "bg-amber-400 text-black shadow-glow"
                              : index === 1
                              ? "bg-gray-300 text-black"
                              : index === 2
                              ? "bg-amber-700 text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-[10px] text-electric-blue">
                            {getCompanyInitials(item.model.company.name)}
                          </div>
                          <Link
                            href={`/models/${item.model.slug}`}
                            className="hover:text-electric-blue font-semibold transition-colors"
                          >
                            {item.model.name}
                          </Link>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Link
                          href={`/companies/${item.model.company.slug}`}
                          className="hover:underline text-gray-300"
                        >
                          {item.model.company.name}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface-200 text-gray-300 border border-surface-300 text-[10px]">
                          {item.benchmarkName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 text-sm">
                        {item.score}{" "}
                        <span className="text-[10px] font-normal text-gray-500">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-300">
                        {formatContextWindow(item.model.contextWindow)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-emerald-400">
                        {formatPrice(item.model.pricing?.inputPricePerMillion)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/models/${item.model.slug}`}
                          className="p-1.5 rounded bg-surface-200 hover:bg-surface-300 text-electric-blue hover:text-white inline-flex items-center transition-colors"
                          title="View Model"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance Disclaimer */}
      <DisclaimerNotice />
    </div>
  );
}
