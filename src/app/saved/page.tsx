"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Box, ArrowRight, Sparkles, Layers } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ModelSummary } from "@/types";
import { ModelCard } from "@/components/models/ModelCard";
import { DisclaimerNotice } from "@/components/common/DisclaimerNotice";

export default function SavedModelsPage() {
  const { user, savedSlugs, openAuthModal, loginDemo } = useAuth();
  const [models, setModels] = useState<ModelSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setModels([]);
      return;
    }

    setLoading(true);
    fetch(`/api/user/saved?userId=${user.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setModels(json.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, savedSlugs]);

  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-200 border border-electric-blue/30 flex items-center justify-center text-electric-blue mx-auto shadow-glow">
          <Bookmark className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white">Your Bookmarked Models</h1>
        <p className="text-xs text-gray-400 leading-relaxed">
          Sign in to your account to save models, organize customized sets, and evaluate them across latency and pricing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Sign In / Register
          </button>
          <button
            onClick={loginDemo}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-gray-200 text-xs font-semibold border border-surface-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet" />
            <span>Try Demo Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-300 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-electric-blue" />
              <span>Bookmarked AI Models</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-xs font-mono font-semibold text-electric-blue">
              {models.length} Saved
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Models saved to your personal engineering workspace ({user.email}).
          </p>
        </div>

        {models.length >= 2 && (
          <Link
            href={`/compare?models=${models.map((m) => m.slug).slice(0, 4).join(",")}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet hover:bg-violet-600 text-white text-xs font-semibold shadow-glow-violet transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Compare Saved Models ({Math.min(4, models.length)})</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          Loading bookmarked models...
        </div>
      ) : models.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-surface-300 rounded-2xl bg-card/40 p-8">
          <Bookmark className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-white mb-1">
            No models saved yet
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
            Browse the AI catalog and click the bookmark button on any model card to save it here for fast retrieval.
          </p>
          <Link
            href="/models"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-electric-blue hover:bg-electric-blue-600 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <Box className="w-4 h-4" />
            <span>Browse 30+ Models</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}

      <DisclaimerNotice />
    </div>
  );
}
