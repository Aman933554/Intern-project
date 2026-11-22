import Link from "next/link";
import { Server, Globe, ArrowRight, ExternalLink, Box, Zap } from "lucide-react";
import { getProviders } from "@/lib/db-service";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export const revalidate = 60;

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-surface-300 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-emerald-400" />
            <span>AI Inference Gateways & Providers</span>
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-400">
            {providers.length} Platforms Cataloged
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
          Directory of inference routing platforms, serverless GPU clouds, and enterprise foundation model hosts.
        </p>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-card border border-surface-300 rounded-2xl p-6 hover:border-gray-600 transition-all flex flex-col justify-between glow-border"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-sm text-emerald-400 shadow-inner">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <Link
                      href={`/providers/${provider.slug}`}
                      className="font-bold text-base text-white hover:text-emerald-400 transition-colors line-clamp-1"
                    >
                      {provider.name}
                    </Link>
                    <div className="text-xs text-gray-400">
                      Inference & Routing
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-surface-200 border border-surface-300 text-xs font-mono text-emerald-400">
                  {provider.modelCount} Models
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-2">
                {provider.description}
              </p>

              {/* Supported models preview */}
              {provider.supportedModels && provider.supportedModels.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 font-sans">
                    Hosted Endpoints:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.supportedModels.slice(0, 3).map((m) => (
                      <Link
                        key={m.id}
                        href={`/models/${m.slug}`}
                        className="text-[11px] px-2 py-0.5 rounded bg-surface-100 hover:bg-surface-200 text-gray-300 hover:text-white border border-surface-300 transition-colors"
                      >
                        {m.name}
                      </Link>
                    ))}
                    {provider.supportedModels.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-100 text-gray-500">
                        +{provider.supportedModels.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-surface-300 flex items-center justify-between">
              {provider.websiteUrl ? (
                <a
                  href={provider.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              ) : (
                <div />
              )}

              <Link
                href={`/providers/${provider.slug}`}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>View Endpoints</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <DisclaimerNotice />
    </div>
  );
}
