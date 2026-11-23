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
      <section className="relative rounded-2xl border border-surface-300 bg-gradient-to-br from-surface-100 via-surface-50 to-surface-100 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-electric-blue/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-violet/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-xs font-semibold text-electric-blue mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OneAtlas.dev Intelligence Registry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Discover, Compare & Evaluate{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-blue-400 to-violet">
              Frontier AI Models
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            A centralized platform mapping the foundation model landscape. Explore token pricing, verified benchmarks, 2M+ context windows, and latency across top inference providers.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/models"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white font-semibold text-sm shadow-glow transition-all"
            >
              <Box className="w-4 h-4" />
              <span>Explore All Models</span>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-gray-200 font-semibold text-sm border border-surface-300 transition-all"
            >
              <span>Compare Top Models</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/rankings"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-transparent hover:bg-surface-200 text-gray-400 hover:text-white text-sm transition-all"
            >
              <Trophy className="w-4 h-4 text-violet" />
              <span>Benchmark Rankings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Primary KPI Stats Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ecosystem Key Metrics
            </h2>
            <p className="text-xs text-gray-400">
              Aggregated across active foundation model entities
            </p>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            UPDATED: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Models Indexed"
            value={stats.totalModels}
            subtitle="Frontier LLMs, MoE & multimodal"
            icon={Box}
            accentColor="blue"
          />
          <StatCard
            title="AI Labs & Creators"
            value={stats.totalCompanies}
            subtitle="Leading frontier & open-weights labs"
            icon={Building2}
            accentColor="violet"
          />
          <StatCard
            title="Inference Gateways"
            value={stats.totalProviders}
            subtitle="Serverless & enterprise API endpoints"
            icon={Server}
            accentColor="emerald"
          />
          <StatCard
            title="Benchmarked Evals"
            value={stats.totalBenchmarks}
            subtitle="MMLU, HumanEval, MATH, GPQA"
            icon={Trophy}
            accentColor="amber"
          />
        </div>
      </section>

      {/* Visual Analytics Charts: Category Distribution & Pricing Ranges */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart data={stats.categoryDistribution} />
        <PricingOverviewChart data={stats.priceDistribution} />
      </section>

      {/* Trending & Featured Models Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Featured & Trending Models
            </h2>
          </div>
          <Link
            href="/models"
            className="text-xs font-semibold text-electric-blue hover:underline flex items-center gap-1"
          >
            <span>View all {stats.totalModels} models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.trendingModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Quick Launchpad to Core Sections */}
      <section className="p-6 rounded-xl bg-surface-100 border border-surface-300">
        <h3 className="text-sm font-bold text-white mb-2">
          Explore Advanced Decision Workflows
        </h3>
        <p className="text-xs text-gray-400 mb-4 max-w-2xl leading-relaxed">
          Need to select the right model for low-latency coding, cost-sensitive summarization, or high-accuracy reasoning? Use our specialized tools:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/compare"
            className="p-3.5 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-300 text-xs font-medium text-gray-200 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-white">Side-by-Side Dock</div>
              <div className="text-[11px] text-gray-400">Compare up to 4 models</div>
            </div>
            <ArrowRight className="w-4 h-4 text-electric-blue" />
          </Link>

          <Link
            href="/rankings"
            className="p-3.5 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-300 text-xs font-medium text-gray-200 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-white">Benchmark Matrix</div>
              <div className="text-[11px] text-gray-400">MMLU, HumanEval, GPQA</div>
            </div>
            <ArrowRight className="w-4 h-4 text-violet" />
          </Link>

          <Link
            href="/search"
            className="p-3.5 rounded-lg bg-surface-200 hover:bg-surface-300 border border-surface-300 text-xs font-medium text-gray-200 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-white">Advanced Search</div>
              <div className="text-[11px] text-gray-400">Filter by modality & price</div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

      {/* Production MVP Disclaimer Notice */}
      <DisclaimerNotice />
    </div>
  );
}
