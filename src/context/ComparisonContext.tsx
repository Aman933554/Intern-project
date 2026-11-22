"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ModelSummary } from "@/types";

interface ComparisonContextType {
  selectedSlugs: string[];
  addModel: (slug: string) => boolean;
  removeModel: (slug: string) => void;
  clearAll: () => void;
  isModelSelected: (slug: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("oneatlas_compare_slugs");
      if (stored) {
        setSelectedSlugs(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const addModel = (slug: string): boolean => {
    if (selectedSlugs.includes(slug)) return false;
    if (selectedSlugs.length >= 4) {
      alert("You can compare a maximum of 4 models simultaneously.");
      return false;
    }
    const updated = [...selectedSlugs, slug];
    setSelectedSlugs(updated);
    try {
      sessionStorage.setItem("oneatlas_compare_slugs", JSON.stringify(updated));
    } catch {}
    return true;
  };

  const removeModel = (slug: string) => {
    const updated = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(updated);
    try {
      sessionStorage.setItem("oneatlas_compare_slugs", JSON.stringify(updated));
    } catch {}
  };

  const clearAll = () => {
    setSelectedSlugs([]);
    try {
      sessionStorage.removeItem("oneatlas_compare_slugs");
    } catch {}
  };

  const isModelSelected = (slug: string) => selectedSlugs.includes(slug);

  return (
    <ComparisonContext.Provider
      value={{
        selectedSlugs,
        addModel,
        removeModel,
        clearAll,
        isModelSelected,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
