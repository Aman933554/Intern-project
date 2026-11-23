import Link from "next/link";
import {
  Box,
  Server,
  Building2,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu,
  Clock,
  ExternalLink,
} from "lucide-react";
import { getDashboardStats } from "@/lib/db-service";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { PricingOverviewChart } from "@/components/dashboard/PricingOverviewChart";
import { ModelCard } from "@/components/models/ModelCard";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export const revalidate = 60; // Refresh data every 60s

export default async function HomeDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="relative rounded-2xl border border-surface-300/80 bg-gradient-to-br from-surface-100/90 via-surface-50/70 to-surface-100/90 p-6 sm:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-electric-blue/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-96 h-96 rounded-full bg-violet/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-electric-blue/20 via-violet/15 to-transparent border border-electric-blue/30 text-xs font-semibold text-electric-blue mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OneAtlas.dev Intelligence Registry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Discover, Compare & Evaluate{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-sky-300 to-violet drop-shadow-[0_0_30px_rgba(14,165,233,0.35)]">
              Frontier AI Models
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal">
            A centralized platform mapping the foundation model landscape. Explore token pricing, verified benchmarks, 2M+ context windows, and latency across top inference providers.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/models"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-blue-600 hover:from-electric-blue-400 hover:to-electric-blue text-white font-semibold text-sm shadow-glow transition-all cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Explore All Models</span>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-200/90 hover:bg-surface-300 text-white font-semibold text-sm border border-surface-300/80 transition-all shadow-sm cursor-pointer"
            >
              <span>Compare Top Models</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/rankings"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent hover:bg-surface-200/80 text-gray-300 hover:text-white text-sm transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboards</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Level Metric Statistics */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Models"
            value={stats.totalModels}
            subtitle="Curated & indexed"
            icon={Box}
            accentColor="blue"
          />
          <StatCard
            title="AI Providers"
            value={stats.totalProviders}
            subtitle="Inference gateways"
            icon={Server}
            accentColor="emerald"
          />
          <StatCard
            title="AI Labs & Creators"
            value={stats.totalCompanies}
            subtitle="Frontier organizations"
            icon={Building2}
            accentColor="violet"
          />
          <StatCard
            title="Standard Benchmarks"
            value={stats.totalBenchmarks}
            subtitle="Across STEM & coding"
            icon={Trophy}
            accentColor="amber"
          />
        </div>
      </section>

      {/* Interactive Analytics & Distribution Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Categories Donut Chart */}
        <div className="bg-card border border-surface-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-electric-blue" />
                <span>Model Category Distribution</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Breakdown of models by modality and architecture type
              </p>
            </div>
            <span className="text-xs font-mono text-gray-500">
              {stats.totalModels} Total
            </span>
          </div>
          <CategoryDistributionChart data={stats.categoryDistribution} />
        </div>

        {/* Pricing Overview Bar Chart */}
        <div className="bg-card border border-surface-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Pricing Spectrum ($/1M Input Tokens)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Volume of models across standard API pricing tiers
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              USD / 1M Tokens
            </span>
          </div>
          <PricingOverviewChart data={stats.priceDistribution} />
        </div>
      </section>

      {/* Trending Models Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-electric-blue" />
              <span>Trending AI Models</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              High-traction models capturing developer mindshare this week
            </p>
          </div>
          <Link
            href="/models?sort=newest"
            className="text-xs font-semibold text-electric-blue hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.trendingModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Top Performing Models & Popular Providers Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Performing Models Leaderboard Preview (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-surface-300 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Top Performing Models (LMSYS Arena Elo)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Frontier crowd-sourced conversational Elo rankings
                </p>
              </div>
              <Link
                href="/rankings"
                className="text-xs text-electric-blue hover:underline font-semibold"
              >
                Full Leaderboard →
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats.topPerformingModels.map((item, index) => (
                <div
                  key={item.model.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-100 border border-surface-300 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        index === 0
                          ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
                          : index === 1
                          ? "bg-gray-300/20 text-gray-300 border border-gray-300/40"
                          : index === 2
                          ? "bg-amber-700/20 text-amber-600 border border-amber-700/40"
                          : "bg-surface-300 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <Link
                        href={`/models/${item.model.slug}`}
                        className="text-sm font-semibold text-white hover:text-electric-blue transition-colors"
                      >
                        {item.model.name}
                      </Link>
                      <div className="text-xs text-gray-400">
                        {item.model.company.name} • {item.model.modelType}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-electric-blue">
                      {item.topScore}
                    </div>
                    <div className="text-[10px] text-gray-500">Arena Elo</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-300 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Evaluated on multi-turn blind user prompts</span>
            <Link href="/rankings" className="text-electric-blue hover:underline">
              Explore STEM & Coding benchmarks
            </Link>
          </div>
        </div>

        {/* Popular Inference Providers (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-surface-300 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Popular Inference Providers</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  High-throughput deployment & routing infrastructure
                </p>
              </div>
              <Link
                href="/providers"
                className="text-xs text-electric-blue hover:underline font-semibold"
              >
                All Providers →
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats.popularProviders.slice(0, 5).map((prov) => (
                <Link
                  key={prov.id}
                  href={`/providers/${prov.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-100 border border-surface-300 hover:border-gray-600 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {prov.name}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-1">
                      {prov.description}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-surface-200 border border-surface-300 text-gray-200">
                      {prov.modelCount} Models
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-300 text-[11px] text-gray-400">
            Compare latency, throughput, and SLAs across providers.
          </div>
        </div>
      </section>

      {/* Recently Added Models Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-300" />
              <span>Recently Cataloged Models</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              The latest foundation models added to the OneAtlas database
            </p>
          </div>
          <Link
            href="/models?sort=newest"
            className="text-xs font-semibold text-electric-blue hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.recentlyAddedModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Compliance / Benchmark Disclaimer */}
      <DisclaimerNotice />
    </div>
  );
}
