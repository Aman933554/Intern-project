import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Plus,
  Check,
  Cpu,
  Coins,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Zap,
  BarChart2,
  Server,
  Building2,
} from "lucide-react";
import { getModelBySlug } from "@/lib/db-service";
import { formatPrice, formatContextWindow, formatDate, getCompanyInitials } from "@/lib/utils";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelDetailActions } from "./ModelDetailActions";

export const revalidate = 60;

interface ModelDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ModelDetailPage({ params }: ModelDetailPageProps) {
  const model = await getModelBySlug(params.slug);

  if (!model) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back button & breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <Link
          href="/models"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Models</span>
        </Link>

        <div className="flex items-center gap-2">
          <span>Catalog</span>
          <span>/</span>
          <Link
            href={`/companies/${model.company.slug}`}
            className="hover:underline text-gray-300"
          >
            {model.company.name}
          </Link>
          <span>/</span>
          <span className="text-electric-blue font-mono font-medium">
            {model.slug}
          </span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-sm text-electric-blue shadow-inner">
                {getCompanyInitials(model.company.name)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {model.name}
                </h1>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Link
                    href={`/companies/${model.company.slug}`}
                    className="hover:underline text-gray-200 font-medium"
                  >
                    {model.company.name}
                  </Link>
                  <span>•</span>
                  <span>{model.modelType} Model</span>
                </div>
              </div>

              {model.isTrending && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet/15 border border-violet/30 text-xs font-semibold text-violet">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trending</span>
                </span>
              )}
              {model.isFree && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                  Free Tier Available
                </span>
              )}
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {model.description}
            </p>

            {/* Modalities Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gray-500 font-semibold mr-1">
                Modalities:
              </span>
              {model.modalities.map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-0.5 rounded-md bg-surface-200 border border-surface-300 text-xs text-gray-300"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons (Copy Identifier & Compare) */}
          <ModelDetailActions slug={model.slug} name={model.name} />
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-surface-300 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-electric-blue" />
            <span>Context Window</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {formatContextWindow(model.contextWindow)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {model.contextWindow.toLocaleString()} tokens
          </div>
        </div>

        <div className="bg-card border border-surface-300 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
            <Zap className="w-3.5 h-3.5 text-violet" />
            <span>Max Output</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {model.maxOutputTokens ? formatContextWindow(model.maxOutputTokens) : "Standard"}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {model.maxOutputTokens ? `${model.maxOutputTokens.toLocaleString()} tokens` : "Provider bounded"}
          </div>
        </div>

        <div className="bg-card border border-surface-300 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>Input Price</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            {formatPrice(model.pricing?.inputPricePerMillion)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Per 1 Million tokens
          </div>
        </div>

        <div className="bg-card border border-surface-300 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>Output Price</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {formatPrice(model.pricing?.outputPricePerMillion)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Per 1 Million tokens
          </div>
        </div>
      </div>

      {/* Model Architecture & Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Architecture details */}
        <div className="bg-card border border-surface-300 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-electric-blue" />
            <span>Architecture & Parameters</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-surface-300">
              <span className="text-gray-400">Model Architecture</span>
              <span className="font-mono text-gray-200 font-medium">
                {model.architecture || "Proprietary Transformer"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-surface-300">
              <span className="text-gray-400">Primary Modality</span>
              <span className="text-gray-200">{model.modelType}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-surface-300">
              <span className="text-gray-400">Release Date</span>
              <span className="font-mono text-gray-200">
                {formatDate(model.releaseDate)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Cache Read Price</span>
              <span className="font-mono text-emerald-400">
                {model.pricing?.cacheReadPricePerMillion
                  ? formatPrice(model.pricing.cacheReadPricePerMillion)
                  : "Standard rate"}
              </span>
            </div>
          </div>
        </div>

        {/* Capabilities list */}
        <div className="bg-card border border-surface-300 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet" />
            <span>Supported Model Capabilities</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {model.capabilitiesList.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-surface-100 border border-surface-300 flex items-start gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-electric-blue shrink-0 mt-1.5" />
                <div>
                  <div className="text-xs font-semibold text-gray-200">
                    {item.capability.name}
                  </div>
                  {item.capability.description && (
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {item.capability.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Benchmark Performance Table */}
      <div className="bg-card border border-surface-300 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-300 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <span>Benchmark Evaluations</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Standardized industry eval scores across reasoning, coding, and STEM
            </p>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
            Sample Reference Data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {model.benchmarks.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-gray-300">
                  {b.benchmark.name}
                </div>
                <div className="text-[10px] text-gray-500 mb-2">
                  Category: {b.benchmark.category}
                </div>
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-xl font-bold text-electric-blue">
                  {b.score}
                </span>
                <span className="text-xs text-gray-400">{b.benchmark.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Inference Providers */}
      <div className="bg-card border border-surface-300 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-300 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Available Inference Providers</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Production platforms hosting this model with observed latencies
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {model.modelProviders.length} Providers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {model.modelProviders.map((mp) => (
            <div
              key={mp.id}
              className="p-4 rounded-xl bg-surface-100 border border-surface-300 flex items-center justify-between gap-4"
            >
              <div>
                <Link
                  href={`/providers/${mp.provider.slug}`}
                  className="font-semibold text-sm text-white hover:text-emerald-400 transition-colors"
                >
                  {mp.provider.name}
                </Link>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  ID: {mp.providerModelId}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-right">
                {mp.latencyMs && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-sans">
                      Latency
                    </div>
                    <div className="text-gray-200 font-semibold">
                      {mp.latencyMs} ms
                    </div>
                  </div>
                )}
                {mp.throughputTps && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-sans">
                      Speed
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      {mp.throughputTps} tps
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Models */}
      {model.relatedModels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Related Models in Same Family or Category
            </h2>
            <Link
              href="/models"
              className="text-xs text-electric-blue hover:underline font-semibold"
            >
              View Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {model.relatedModels.map((rel) => (
              <ModelCard key={rel.id} model={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Compliance Notice */}
      <DisclaimerNotice />
    </div>
  );
}
