"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Check, Plus, Box } from "lucide-react";
import { ModelSummary } from "@/types";
import { formatPrice, formatContextWindow } from "@/lib/utils";

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
  alreadySelectedSlugs: string[];
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  alreadySelectedSlugs,
}) => {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<ModelSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/models?limit=50`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setModels(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = models.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.company.name.toLowerCase().includes(query.toLowerCase()) ||
      m.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add Model to Comparison"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-card border border-surface-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-300">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Box className="w-4 h-4 text-electric-blue" />
            <span>Select Model to Compare</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-surface-300 bg-surface-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by model or company name..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-200 border border-surface-300 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Loading models catalog...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No matching models found.
            </div>
          ) : (
            filtered.map((model) => {
              const isAdded = alreadySelectedSlugs.includes(model.slug);
              return (
                <div
                  key={model.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    isAdded
                      ? "bg-electric-blue/10 border-electric-blue/30 text-gray-300"
                      : "bg-surface-100 border-surface-300 hover:border-gray-600 text-white"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-white">
                      {model.name}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {model.company.name} • {formatContextWindow(model.contextWindow)} ctx • {formatPrice(model.pricing?.inputPricePerMillion)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isAdded) {
                        onSelect(model.slug);
                        onClose();
                      }
                    }}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isAdded
                        ? "bg-surface-300 text-gray-500 cursor-not-allowed"
                        : "bg-electric-blue hover:bg-electric-blue-600 text-white shadow-glow"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Select</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
