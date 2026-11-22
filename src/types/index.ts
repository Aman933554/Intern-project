export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl?: string | null;
  country: string | null;
  modelCount?: number;
  models?: ModelSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  logoUrl?: string | null;
  modelCount?: number;
  supportedModels?: ModelSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Capability {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export interface ModelCapabilityItem {
  id: string;
  capabilityId: string;
  capability: Capability;
  score: number | null;
}

export interface Pricing {
  id: string;
  modelId: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cacheReadPricePerMillion: number | null;
  currency: string;
  effectiveDate: string;
}

export interface Benchmark {
  id: string;
  name: string;
  category: "Overall" | "Coding" | "Reasoning" | "Mathematics" | "Knowledge" | "Vision" | string;
  description: string | null;
  maxScore: number;
  unit: string;
}

export interface ModelBenchmarkScore {
  id: string;
  benchmarkId: string;
  benchmark: Benchmark;
  score: number;
  notes?: string | null;
  isSampleData: boolean;
}

export interface ModelProviderInfo {
  id: string;
  providerId: string;
  provider: Provider;
  providerModelId: string;
  latencyMs: number | null;
  throughputTps: number | null;
  isAvailable: boolean;
}

export interface ModelSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  architecture: string | null;
  modelType: string;
  contextWindow: number;
  maxOutputTokens: number | null;
  releaseDate: string | null;
  isFree: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  modalities: string[];
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  pricing: {
    inputPricePerMillion: number;
    outputPricePerMillion: number;
    cacheReadPricePerMillion?: number | null;
  } | null;
  capabilities: {
    name: string;
    slug: string;
    icon?: string | null;
  }[];
  providers: {
    name: string;
    slug: string;
    latencyMs?: number | null;
  }[];
}

export interface ModelDetail extends ModelSummary {
  modelProviders: ModelProviderInfo[];
  capabilitiesList: ModelCapabilityItem[];
  benchmarks: ModelBenchmarkScore[];
  relatedModels: ModelSummary[];
}

export interface DashboardStats {
  totalModels: number;
  totalProviders: number;
  totalCompanies: number;
  totalBenchmarks: number;
  categoryDistribution: {
    name: string;
    count: number;
  }[];
  priceDistribution: {
    range: string;
    count: number;
  }[];
  trendingModels: ModelSummary[];
  recentlyAddedModels: ModelSummary[];
  popularProviders: (Provider & { modelCount: number })[];
  topPerformingModels: {
    model: ModelSummary;
    topScore: number;
    benchmarkName: string;
  }[];
}

export interface ModelsFilterQuery {
  search?: string;
  company?: string;
  provider?: string;
  type?: string;
  capability?: string;
  isFree?: boolean;
  minContext?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "context-desc" | "newest" | "oldest" | "name-asc";
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CompareModelsResponse {
  models: ModelDetail[];
  highlights: {
    lowestInputPriceModelId: string | null;
    lowestOutputPriceModelId: string | null;
    largestContextWindowModelId: string | null;
    highestBenchmarkScores: {
      [benchmarkName: string]: {
        modelId: string;
        score: number;
      };
    };
  };
}

export interface GlobalSearchResult {
  query: string;
  models: {
    id: string;
    name: string;
    slug: string;
    companyName: string;
    modelType: string;
    contextWindow: number;
  }[];
  companies: {
    id: string;
    name: string;
    slug: string;
    modelCount: number;
  }[];
  providers: {
    id: string;
    name: string;
    slug: string;
    modelCount: number;
  }[];
}
