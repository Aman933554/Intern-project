import Link from "next/link";
import {
  Sparkles,
  Database,
  Layers,
  ShieldCheck,
  Cpu,
  Server,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-surface-300 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-xs font-semibold text-electric-blue mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Architecture & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          About OneAtlas.dev
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          The centralized AI model discovery, benchmark intelligence, and pricing evaluation platform engineered for software architects, ML engineers, and enterprise builders.
        </p>
      </div>

      {/* Core Mission & Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card border border-surface-300 rounded-xl p-5 space-y-2 glow-border">
          <div className="w-8 h-8 rounded-lg bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center text-electric-blue">
            <Cpu className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Full-Spectrum Discovery</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Index frontier reasoning models, open weights workhorses, and multimodal vision architectures across all major AI laboratories.
          </p>
        </div>

        <div className="bg-card border border-surface-300 rounded-xl p-5 space-y-2 glow-border">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Transparent Pricing</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Normalize token input, output, and prompt cache pricing per million tokens across multiple routing providers.
          </p>
        </div>

        <div className="bg-card border border-surface-300 rounded-xl p-5 space-y-2 glow-border">
          <div className="w-8 h-8 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center text-violet">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Multi-Model Matrix</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Side-by-side comparison matrix with automated parameter highlighting for lowest price and largest context window.
          </p>
        </div>
      </div>

      {/* System Architecture */}
      <div className="bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-electric-blue" />
          <span>Technology & Database Architecture</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-100 border border-surface-300 space-y-1.5">
            <div className="font-bold text-white text-sm">Frontend Framework</div>
            <div className="text-gray-400 leading-relaxed">
              Next.js (App Router) + React 18 + TypeScript + Tailwind CSS. Designed with a custom dark-first design system (`#080B12` base, `#111827` cards) and interactive Recharts data visualizations.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-surface-300 space-y-1.5">
            <div className="font-bold text-white text-sm">Relational Database Layer</div>
            <div className="text-gray-400 leading-relaxed">
              PostgreSQL schema managed via Prisma ORM with normalized tables for Models, Companies, Providers, Capabilities, Pricing, and Benchmarks, with relational foreign keys and indexes.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-surface-300 space-y-1.5">
            <div className="font-bold text-white text-sm">Type-Safe API Routes</div>
            <div className="text-gray-400 leading-relaxed">
              RESTful Next.js API endpoints validated with Zod schemas. Supports server-side pagination, multi-field search, multi-criteria filtering, and model comparison calculations.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-surface-300 space-y-1.5">
            <div className="font-bold text-white text-sm">Deployment Readiness</div>
            <div className="text-gray-400 leading-relaxed">
              Optimized for zero-friction deployment to Vercel paired with Neon Serverless PostgreSQL, with environment variable isolation and build scripts.
            </div>
          </div>
        </div>
      </div>

      {/* Reference & Inspiration */}
      <div className="bg-surface-50 border border-surface-300 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-gray-400">
          Inspiration & Industry References
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          OneAtlas was engineered by studying leading AI routing and gateway interfaces, synthesizing key strengths into a unified developer intelligence experience:
        </p>
        <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
          <li>
            <strong className="text-white">OpenRouter</strong> – Dynamic model directory and transparent routing.
          </li>
          <li>
            <strong className="text-white">LiteLLM</strong> – Standardized multi-provider completion interfaces.
          </li>
          <li>
            <strong className="text-white">RouterPlus</strong> – Aggregated provider throughput and latency metrics.
          </li>
        </ul>
      </div>

      {/* Compliance Notice */}
      <DisclaimerNotice />

      {/* Action links */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-300">
        <Link
          href="/models"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white font-semibold text-xs shadow-glow transition-all"
        >
          <span>Explore All 30+ AI Models</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/compare"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Compare Foundation Models →
        </Link>
      </div>
    </div>
  );
}
