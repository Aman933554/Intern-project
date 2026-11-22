import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Globe, ArrowLeft, ExternalLink, Box } from "lucide-react";
import { getCompanyBySlug } from "@/lib/db-service";
import { getCompanyInitials } from "@/lib/utils";
import { ModelCard } from "@/components/models/ModelCard";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export const revalidate = 60;

interface CompanyDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const company = await getCompanyBySlug(params.slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <Link
          href="/companies"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Labs</span>
        </Link>
        <span className="font-mono text-gray-500">LAB PROFILE: {company.slug}</span>
      </div>

      {/* Header Profile Card */}
      <div className="bg-card border border-surface-300 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-lg text-violet shadow-inner shrink-0">
              {getCompanyInitials(company.name)}
            </div>

            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {company.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-violet/15 border border-violet/30 text-xs font-mono font-semibold text-violet">
                  {company.modelCount} Models Active
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {company.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                {company.country && <span>Headquarters: {company.country}</span>}
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-electric-blue hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
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
              <Box className="w-5 h-5 text-violet" />
              <span>Foundation Models by {company.name}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Curated models currently indexed in OneAtlas
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {company.models?.length || 0} Models
          </span>
        </div>

        {company.models && company.models.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {company.models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-surface-300 rounded-xl">
            No active models listed for this lab yet.
          </div>
        )}
      </div>

      {/* Compliance Disclaimer */}
      <DisclaimerNotice />
    </div>
  );
}
