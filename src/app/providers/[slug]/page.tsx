import Link from "next/link";
import { notFound } from "next/navigation";
import { Server, Globe, ArrowLeft, ExternalLink, Box, Zap } from "lucide-react";
import { getProviderBySlug } from "@/lib/db-service";
import { ModelCard } from "@/components/models/ModelCard";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export const revalidate = 60;

interface ProviderDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProviderDetailPage({ params }: ProviderDetailPageProps) {
  const provider = await getProviderBySlug(params.slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <Link
          href="/providers"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Providers</span>
        </Link>
        <span className="font-mono text-gray-500">GATEWAY: {provider.slug}</span>
      </div>

      {/* Header Profile Card */}
      <div className="bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-lg text-emerald-400 shadow-inner shrink-0">
              <Server className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {provider.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-400">
                  {provider.modelCount} Endpoints Active
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {provider.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                {provider.websiteUrl && (
                  <a
                    href={provider.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Provider Gateway Documentation</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Models Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-surface-300 pb-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-emerald-400" />
              <span>Supported Models via {provider.name}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Available endpoints hosted on this provider
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {provider.supportedModels?.length || 0} Models
          </span>
        </div>

        {provider.supportedModels && provider.supportedModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {provider.supportedModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-surface-300 rounded-xl">
            No active endpoints listed for this provider yet.
          </div>
        )}
      </div>

      <DisclaimerNotice />
    </div>
  );
}
