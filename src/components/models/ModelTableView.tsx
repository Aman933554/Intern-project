"use client";

import React from "react";
import Link from "next/link";
import { ModelSummary } from "@/types";
import { formatPrice, formatContextWindow, getCompanyInitials } from "@/lib/utils";
import { useComparison } from "@/context/ComparisonContext";
import { Plus, Check, ArrowRight } from "lucide-react";

interface ModelTableViewProps {
  models: ModelSummary[];
}

export const ModelTableView: React.FC<ModelTableViewProps> = ({ models }) => {
  const { addModel, removeModel, isModelSelected } = useComparison();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-300 bg-card">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-surface-100 text-gray-400 uppercase tracking-wider text-[11px] border-b border-surface-300">
          <tr>
            <th className="py-3 px-4">Model</th>
            <th className="py-3 px-4">Company</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4 font-mono">Context</th>
            <th className="py-3 px-4 font-mono">Input $/1M</th>
            <th className="py-3 px-4 font-mono">Output $/1M</th>
            <th className="py-3 px-4">Providers</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-300">
          {models.map((model) => {
            const selected = isModelSelected(model.slug);
            return (
              <tr
                key={model.id}
                className="hover:bg-surface-200/50 transition-colors group"
              >
                <td className="py-3.5 px-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-surface-200 border border-surface-300 flex items-center justify-center font-bold text-[10px] text-electric-blue">
                      {getCompanyInitials(model.company.name)}
                    </div>
                    <Link
                      href={`/models/${model.slug}`}
                      className="hover:text-electric-blue font-semibold transition-colors"
                    >
                      {model.name}
                    </Link>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <Link
                    href={`/companies/${model.company.slug}`}
                    className="hover:underline text-gray-300"
                  >
                    {model.company.name}
                  </Link>
                </td>

                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-surface-200 text-gray-300 border border-surface-300 text-[10px]">
                    {model.modelType}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-mono text-gray-200">
                  {formatContextWindow(model.contextWindow)}
                </td>

                <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                  {formatPrice(model.pricing?.inputPricePerMillion)}
                </td>

                <td className="py-3.5 px-4 font-mono text-gray-200">
                  {formatPrice(model.pricing?.outputPricePerMillion)}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    {model.providers.slice(0, 2).map((p) => (
                      <span
                        key={p.slug}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-gray-400"
                      >
                        {p.name}
                      </span>
                    ))}
                    {model.providers.length > 2 && (
                      <span className="text-[10px] text-gray-500">
                        +{model.providers.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        selected ? removeModel(model.slug) : addModel(model.slug)
                      }
                      className={`p-1.5 rounded border text-xs transition-colors ${
                        selected
                          ? "bg-electric-blue/20 border-electric-blue text-electric-blue"
                          : "bg-surface-200 border-surface-300 text-gray-400 hover:text-white"
                      }`}
                      title={selected ? "Remove from comparison" : "Add to comparison"}
                    >
                      {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>

                    <Link
                      href={`/models/${model.slug}`}
                      className="p-1.5 rounded bg-surface-200 border border-surface-300 text-gray-400 hover:text-electric-blue transition-colors"
                      title="View Details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
