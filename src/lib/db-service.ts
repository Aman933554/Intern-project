import { prisma, checkDatabaseConnection } from "./prisma";
import {
  SEED_COMPANIES,
  SEED_PROVIDERS,
  SEED_CAPABILITIES,
  SEED_BENCHMARKS,
  SEED_MODELS,
  SeedModel,
} from "../../prisma/seedData";
import {
  ModelSummary,
  ModelDetail,
  Company,
  Provider,
  Benchmark,
  DashboardStats,
  ModelsFilterQuery,
  PaginatedResult,
  CompareModelsResponse,
  GlobalSearchResult,
  ModelBenchmarkScore,
} from "@/types";

// Helper to format seed model into ModelSummary
function seedModelToSummary(m: SeedModel): ModelSummary {
  const company = SEED_COMPANIES.find((c) => c.slug === m.companySlug);
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    description: m.description,
    architecture: m.architecture,
    modelType: m.modelType,
    contextWindow: m.contextWindow,
    maxOutputTokens: m.maxOutputTokens,
    releaseDate: m.releaseDate,
    isFree: m.isFree,
    isTrending: m.isTrending,
    isFeatured: m.isFeatured,
    modalities: m.modalities,
    company: {
      id: company?.id ?? "comp_unknown",
      name: company?.name ?? "Unknown",
      slug: company?.slug ?? m.companySlug,
      logoUrl: company?.logoUrl,
    },
    pricing: {
      inputPricePerMillion: m.pricing.inputPricePerMillion,
      outputPricePerMillion: m.pricing.outputPricePerMillion,
      cacheReadPricePerMillion: m.pricing.cacheReadPricePerMillion,
    },
    capabilities: m.capabilities.map((c) => {
      const cap = SEED_CAPABILITIES.find((sc) => sc.slug === c.capabilitySlug);
      return {
        name: cap?.name ?? c.capabilitySlug,
        slug: c.capabilitySlug,
        icon: cap?.icon,
      };
    }),
    providers: m.providers.map((p) => {
      const prov = SEED_PROVIDERS.find((sp) => sp.slug === p.providerSlug);
      return {
        name: prov?.name ?? p.providerSlug,
        slug: p.providerSlug,
        latencyMs: p.latencyMs,
      };
    }),
  };
}

// Helper to format seed model into ModelDetail
function seedModelToDetail(m: SeedModel, allModels: SeedModel[]): ModelDetail {
  const summary = seedModelToSummary(m);
  const company = SEED_COMPANIES.find((c) => c.slug === m.companySlug);

  const modelProviders = m.providers.map((p) => {
    const prov = SEED_PROVIDERS.find((sp) => sp.slug === p.providerSlug);
    return {
      id: `mp_${m.id}_${p.providerSlug}`,
      providerId: prov?.id ?? `prov_${p.providerSlug}`,
      provider: {
        id: prov?.id ?? `prov_${p.providerSlug}`,
        name: prov?.name ?? p.providerSlug,
        slug: p.providerSlug,
        description: prov?.description ?? null,
        websiteUrl: prov?.websiteUrl ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      providerModelId: p.providerModelId,
      latencyMs: p.latencyMs ?? null,
      throughputTps: p.throughputTps ?? null,
      isAvailable: true,
    };
  });

  const capabilitiesList = m.capabilities.map((c) => {
    const cap = SEED_CAPABILITIES.find((sc) => sc.slug === c.capabilitySlug);
    return {
      id: `mc_${m.id}_${c.capabilitySlug}`,
      capabilityId: cap?.id ?? `cap_${c.capabilitySlug}`,
      capability: {
        id: cap?.id ?? `cap_${c.capabilitySlug}`,
        name: cap?.name ?? c.capabilitySlug,
        slug: c.capabilitySlug,
        description: cap?.description ?? null,
        icon: cap?.icon ?? null,
      },
      score: c.score,
    };
  });

  const benchmarks: ModelBenchmarkScore[] = m.benchmarks.map((b) => {
    const benchmark = SEED_BENCHMARKS.find((sb) => sb.name === b.benchmarkName);
    return {
      id: `mb_${m.id}_${b.benchmarkName}`,
      benchmarkId: benchmark?.id ?? `bench_${b.benchmarkName}`,
      benchmark: {
        id: benchmark?.id ?? `bench_${b.benchmarkName}`,
        name: b.benchmarkName,
        category: benchmark?.category ?? "Overall",
        description: benchmark?.description ?? null,
        maxScore: benchmark?.maxScore ?? 100,
        unit: benchmark?.unit ?? "%",
      },
      score: b.score,
      notes: b.notes ?? null,
      isSampleData: true,
    };
  });

  const related = allModels
    .filter((other) => other.id !== m.id && (other.companySlug === m.companySlug || other.modelType === m.modelType))
    .slice(0, 4)
    .map(seedModelToSummary);

  return {
    ...summary,
    modelProviders,
    capabilitiesList,
    benchmarks,
    relatedModels: related,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const [totalModels, totalProviders, totalCompanies, totalBenchmarks] = await Promise.all([
        prisma.model.count(),
        prisma.provider.count(),
        prisma.company.count(),
        prisma.benchmark.count(),
      ]);

      const models = await prisma.model.findMany({
        include: {
          company: true,
          pricing: true,
          capabilities: { include: { capability: true } },
          modelProviders: { include: { provider: true } },
          benchmarks: { include: { benchmark: true } },
        },
      });

      // Trending & Recent
      const trending = models
        .filter((m) => m.isTrending)
        .slice(0, 6)
        .map((m) => ({
          id: m.id,
          name: m.name,
          slug: m.slug,
          description: m.description,
          architecture: m.architecture,
          modelType: m.modelType,
          contextWindow: m.contextWindow,
          maxOutputTokens: m.maxOutputTokens,
          releaseDate: m.releaseDate ? m.releaseDate.toISOString() : null,
          isFree: m.isFree,
          isTrending: m.isTrending,
          isFeatured: m.isFeatured,
          modalities: m.modalities,
          company: {
            id: m.company.id,
            name: m.company.name,
            slug: m.company.slug,
            logoUrl: m.company.logoUrl,
          },
          pricing: m.pricing[0]
            ? {
                inputPricePerMillion: m.pricing[0].inputPricePerMillion,
                outputPricePerMillion: m.pricing[0].outputPricePerMillion,
                cacheReadPricePerMillion: m.pricing[0].cacheReadPricePerMillion,
              }
            : null,
          capabilities: m.capabilities.map((c) => ({
            name: c.capability.name,
            slug: c.capability.slug,
            icon: c.capability.icon,
          })),
          providers: m.modelProviders.map((p) => ({
            name: p.provider.name,
            slug: p.provider.slug,
            latencyMs: p.latencyMs,
          })),
        }));

      const recent = [...models]
        .sort((a, b) => (b.releaseDate?.getTime() ?? 0) - (a.releaseDate?.getTime() ?? 0))
        .slice(0, 6)
        .map((m) => trending.find((t) => t.id === m.id) ?? trending[0]);

      // Category distribution
      const catCountMap: Record<string, number> = {};
      models.forEach((m) => {
        catCountMap[m.modelType] = (catCountMap[m.modelType] || 0) + 1;
      });
      const categoryDistribution = Object.entries(catCountMap).map(([name, count]) => ({
        name,
        count,
      }));

      // Price distribution
      const priceBuckets = {
        "Free": 0,
        "<$0.50": 0,
        "$0.50-$2.00": 0,
        "$2.00-$5.00": 0,
        ">$5.00": 0,
      };

      models.forEach((m) => {
        const inputPrice = m.pricing[0]?.inputPricePerMillion ?? 0;
        if (m.isFree || inputPrice === 0) {
          priceBuckets["Free"]++;
        } else if (inputPrice < 0.5) {
          priceBuckets["<$0.50"]++;
        } else if (inputPrice <= 2.0) {
          priceBuckets["$0.50-$2.00"]++;
        } else if (inputPrice <= 5.0) {
          priceBuckets["$2.00-$5.00"]++;
        } else {
          priceBuckets[">$5.00"]++;
        }
      });

      const priceDistribution = Object.entries(priceBuckets).map(([range, count]) => ({
        range,
        count,
      }));

      // Popular Providers
      const providersWithCount = await prisma.provider.findMany({
        include: {
          _count: {
            select: { modelProviders: true },
          },
        },
      });

      const popularProviders = providersWithCount.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        websiteUrl: p.websiteUrl,
        logoUrl: p.logoUrl,
        modelCount: p._count.modelProviders,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));

      // Top Performing Models (by Arena Elo or MMLU)
      const topScores = await prisma.modelBenchmark.findMany({
        where: {
          benchmark: {
            name: "LMSYS Arena Elo",
          },
        },
        orderBy: { score: "desc" },
        take: 5,
        include: {
          model: {
            include: {
              company: true,
              pricing: true,
              capabilities: { include: { capability: true } },
              modelProviders: { include: { provider: true } },
            },
          },
          benchmark: true,
        },
      });

      const topPerformingModels = topScores.map((ts) => {
        const m = ts.model;
        return {
          model: {
            id: m.id,
            name: m.name,
            slug: m.slug,
            description: m.description,
            architecture: m.architecture,
            modelType: m.modelType,
            contextWindow: m.contextWindow,
            maxOutputTokens: m.maxOutputTokens,
            releaseDate: m.releaseDate?.toISOString() ?? null,
            isFree: m.isFree,
            isTrending: m.isTrending,
            isFeatured: m.isFeatured,
            modalities: m.modalities,
            company: {
              id: m.company.id,
              name: m.company.name,
              slug: m.company.slug,
              logoUrl: m.company.logoUrl,
            },
            pricing: m.pricing[0]
              ? {
                  inputPricePerMillion: m.pricing[0].inputPricePerMillion,
                  outputPricePerMillion: m.pricing[0].outputPricePerMillion,
                  cacheReadPricePerMillion: m.pricing[0].cacheReadPricePerMillion,
                }
              : null,
            capabilities: m.capabilities.map((c) => ({
              name: c.capability.name,
              slug: c.capability.slug,
            })),
            providers: m.modelProviders.map((p) => ({
              name: p.provider.name,
              slug: p.provider.slug,
            })),
          },
          topScore: ts.score,
          benchmarkName: ts.benchmark.name,
        };
      });

      return {
        totalModels,
        totalProviders,
        totalCompanies,
        totalBenchmarks,
        categoryDistribution,
        priceDistribution,
        trendingModels: trending,
        recentlyAddedModels: recent,
        popularProviders,
        topPerformingModels,
      };
    } catch (e) {
      console.warn("Error running Postgres query, falling back to cached seed data:", e);
    }
  }

  // Fallback to in-memory seed dataset
  const summaries = SEED_MODELS.map(seedModelToSummary);
  const trending = summaries.filter((m) => m.isTrending).slice(0, 6);
  const recent = [...summaries]
    .sort((a, b) => (new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()))
    .slice(0, 6);

  const catCountMap: Record<string, number> = {};
  summaries.forEach((m) => {
    catCountMap[m.modelType] = (catCountMap[m.modelType] || 0) + 1;
  });

  const categoryDistribution = Object.entries(catCountMap).map(([name, count]) => ({
    name,
    count,
  }));

  const priceBuckets = {
    "Free": 0,
    "<$0.50": 0,
    "$0.50-$2.00": 0,
    "$2.00-$5.00": 0,
    ">$5.00": 0,
  };

  summaries.forEach((m) => {
    const inputPrice = m.pricing?.inputPricePerMillion ?? 0;
    if (m.isFree || inputPrice === 0) {
      priceBuckets["Free"]++;
    } else if (inputPrice < 0.5) {
      priceBuckets["<$0.50"]++;
    } else if (inputPrice <= 2.0) {
      priceBuckets["$0.50-$2.00"]++;
    } else if (inputPrice <= 5.0) {
      priceBuckets["$2.00-$5.00"]++;
    } else {
      priceBuckets[">$5.00"]++;
    }
  });

  const priceDistribution = Object.entries(priceBuckets).map(([range, count]) => ({
    range,
    count,
  }));

  const popularProviders = SEED_PROVIDERS.map((p) => {
    const count = SEED_MODELS.filter((m) =>
      m.providers.some((mp) => mp.providerSlug === p.slug)
    ).length;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      websiteUrl: p.websiteUrl,
      logoUrl: p.logoUrl,
      modelCount: count,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const topPerforming = SEED_MODELS.map((m) => {
    const arenaElo = m.benchmarks.find((b) => b.benchmarkName === "LMSYS Arena Elo");
    return {
      model: seedModelToSummary(m),
      topScore: arenaElo ? arenaElo.score : 0,
      benchmarkName: "LMSYS Arena Elo",
    };
  })
    .filter((item) => item.topScore > 0)
    .sort((a, b) => b.topScore - a.topScore)
    .slice(0, 5);

  return {
    totalModels: SEED_MODELS.length,
    totalProviders: SEED_PROVIDERS.length,
    totalCompanies: SEED_COMPANIES.length,
    totalBenchmarks: SEED_BENCHMARKS.length,
    categoryDistribution,
    priceDistribution,
    trendingModels: trending,
    recentlyAddedModels: recent,
    popularProviders,
    topPerformingModels: topPerforming,
  };
}

export async function getModels(filters: ModelsFilterQuery): Promise<PaginatedResult<ModelSummary>> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const page = Number(filters.page) || 1;
      const limit = Number(filters.limit) || 12;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          { company: { name: { contains: filters.search, mode: "insensitive" } } },
          { modelProviders: { some: { provider: { name: { contains: filters.search, mode: "insensitive" } } } } },
        ];
      }

      if (filters.company) {
        where.company = { slug: filters.company };
      }

      if (filters.provider) {
        where.modelProviders = { some: { provider: { slug: filters.provider } } };
      }

      if (filters.type) {
        where.modelType = filters.type;
      }

      if (filters.capability) {
        where.capabilities = { some: { capability: { slug: filters.capability } } };
      }

      if (filters.isFree !== undefined) {
        where.isFree = filters.isFree;
      }

      if (filters.minContext) {
        where.contextWindow = { gte: Number(filters.minContext) };
      }

      let orderBy: any = { createdAt: "desc" };
      if (filters.sort === "newest") orderBy = { releaseDate: "desc" };
      if (filters.sort === "oldest") orderBy = { releaseDate: "asc" };
      if (filters.sort === "context-desc") orderBy = { contextWindow: "desc" };
      if (filters.sort === "name-asc") orderBy = { name: "asc" };

      const [total, dbModels] = await Promise.all([
        prisma.model.count({ where }),
        prisma.model.findMany({
          where,
          include: {
            company: true,
            pricing: true,
            capabilities: { include: { capability: true } },
            modelProviders: { include: { provider: true } },
          },
          orderBy,
          skip,
          take: limit,
        }),
      ]);

      const formatted = dbModels.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        description: m.description,
        architecture: m.architecture,
        modelType: m.modelType,
        contextWindow: m.contextWindow,
        maxOutputTokens: m.maxOutputTokens,
        releaseDate: m.releaseDate?.toISOString() ?? null,
        isFree: m.isFree,
        isTrending: m.isTrending,
        isFeatured: m.isFeatured,
        modalities: m.modalities,
        company: {
          id: m.company.id,
          name: m.company.name,
          slug: m.company.slug,
          logoUrl: m.company.logoUrl,
        },
        pricing: m.pricing[0]
          ? {
              inputPricePerMillion: m.pricing[0].inputPricePerMillion,
              outputPricePerMillion: m.pricing[0].outputPricePerMillion,
              cacheReadPricePerMillion: m.pricing[0].cacheReadPricePerMillion,
            }
          : null,
        capabilities: m.capabilities.map((c) => ({
          name: c.capability.name,
          slug: c.capability.slug,
          icon: c.capability.icon,
        })),
        providers: m.modelProviders.map((p) => ({
          name: p.provider.name,
          slug: p.provider.slug,
          latencyMs: p.latencyMs,
        })),
      }));

      return {
        data: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (e) {
      console.warn("Postgres getModels error, fallback to memory:", e);
    }
  }

  // Memory fallback query logic
  let filtered = SEED_MODELS.map(seedModelToSummary);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.company.name.toLowerCase().includes(q) ||
        m.providers.some((p) => p.name.toLowerCase().includes(q))
    );
  }

  if (filters.company) {
    filtered = filtered.filter((m) => m.company.slug === filters.company);
  }

  if (filters.provider) {
    filtered = filtered.filter((m) => m.providers.some((p) => p.slug === filters.provider));
  }

  if (filters.type) {
    filtered = filtered.filter((m) => m.modelType === filters.type);
  }

  if (filters.capability) {
    filtered = filtered.filter((m) => m.capabilities.some((c) => c.slug === filters.capability));
  }

  if (filters.isFree !== undefined) {
    filtered = filtered.filter((m) => m.isFree === filters.isFree);
  }

  if (filters.minContext) {
    filtered = filtered.filter((m) => m.contextWindow >= Number(filters.minContext));
  }

  if (filters.maxPrice) {
    filtered = filtered.filter((m) => (m.pricing?.inputPricePerMillion ?? 0) <= Number(filters.maxPrice));
  }

  // Sorting
  if (filters.sort === "price-asc") {
    filtered.sort((a, b) => (a.pricing?.inputPricePerMillion ?? 0) - (b.pricing?.inputPricePerMillion ?? 0));
  } else if (filters.sort === "price-desc") {
    filtered.sort((a, b) => (b.pricing?.inputPricePerMillion ?? 0) - (a.pricing?.inputPricePerMillion ?? 0));
  } else if (filters.sort === "context-desc") {
    filtered.sort((a, b) => b.contextWindow - a.contextWindow);
  } else if (filters.sort === "newest") {
    filtered.sort((a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime());
  } else if (filters.sort === "oldest") {
    filtered.sort((a, b) => new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime());
  } else if (filters.sort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 12;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getModelBySlug(slug: string): Promise<ModelDetail | null> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const dbModel = await prisma.model.findUnique({
        where: { slug },
        include: {
          company: true,
          pricing: true,
          modelProviders: { include: { provider: true } },
          capabilities: { include: { capability: true } },
          benchmarks: { include: { benchmark: true } },
        },
      });

      if (!dbModel) return null;

      const relatedDbModels = await prisma.model.findMany({
        where: {
          id: { not: dbModel.id },
          OR: [{ companyId: dbModel.companyId }, { modelType: dbModel.modelType }],
        },
        take: 4,
        include: {
          company: true,
          pricing: true,
          capabilities: { include: { capability: true } },
          modelProviders: { include: { provider: true } },
        },
      });

      const relatedSummaries: ModelSummary[] = relatedDbModels.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        description: m.description,
        architecture: m.architecture,
        modelType: m.modelType,
        contextWindow: m.contextWindow,
        maxOutputTokens: m.maxOutputTokens,
        releaseDate: m.releaseDate?.toISOString() ?? null,
        isFree: m.isFree,
        isTrending: m.isTrending,
        isFeatured: m.isFeatured,
        modalities: m.modalities,
        company: {
          id: m.company.id,
          name: m.company.name,
          slug: m.company.slug,
          logoUrl: m.company.logoUrl,
        },
        pricing: m.pricing[0]
          ? {
              inputPricePerMillion: m.pricing[0].inputPricePerMillion,
              outputPricePerMillion: m.pricing[0].outputPricePerMillion,
              cacheReadPricePerMillion: m.pricing[0].cacheReadPricePerMillion,
            }
          : null,
        capabilities: m.capabilities.map((c) => ({
          name: c.capability.name,
          slug: c.capability.slug,
          icon: c.capability.icon,
        })),
        providers: m.modelProviders.map((p) => ({
          name: p.provider.name,
          slug: p.provider.slug,
          latencyMs: p.latencyMs,
        })),
      }));

      return {
        id: dbModel.id,
        name: dbModel.name,
        slug: dbModel.slug,
        description: dbModel.description,
        architecture: dbModel.architecture,
        modelType: dbModel.modelType,
        contextWindow: dbModel.contextWindow,
        maxOutputTokens: dbModel.maxOutputTokens,
        releaseDate: dbModel.releaseDate?.toISOString() ?? null,
        isFree: dbModel.isFree,
        isTrending: dbModel.isTrending,
        isFeatured: dbModel.isFeatured,
        modalities: dbModel.modalities,
        company: {
          id: dbModel.company.id,
          name: dbModel.company.name,
          slug: dbModel.company.slug,
          logoUrl: dbModel.company.logoUrl,
        },
        pricing: dbModel.pricing[0]
          ? {
              inputPricePerMillion: dbModel.pricing[0].inputPricePerMillion,
              outputPricePerMillion: dbModel.pricing[0].outputPricePerMillion,
              cacheReadPricePerMillion: dbModel.pricing[0].cacheReadPricePerMillion,
            }
          : null,
        capabilities: dbModel.capabilities.map((c) => ({
          name: c.capability.name,
          slug: c.capability.slug,
          icon: c.capability.icon,
        })),
        providers: dbModel.modelProviders.map((p) => ({
          name: p.provider.name,
          slug: p.provider.slug,
          latencyMs: p.latencyMs,
        })),
        modelProviders: dbModel.modelProviders.map((mp) => ({
          id: mp.id,
          providerId: mp.providerId,
          provider: {
            id: mp.provider.id,
            name: mp.provider.name,
            slug: mp.provider.slug,
            description: mp.provider.description,
            websiteUrl: mp.provider.websiteUrl,
            logoUrl: mp.provider.logoUrl,
            createdAt: mp.provider.createdAt.toISOString(),
            updatedAt: mp.provider.updatedAt.toISOString(),
          },
          providerModelId: mp.providerModelId,
          latencyMs: mp.latencyMs,
          throughputTps: mp.throughputTps,
          isAvailable: mp.isAvailable,
        })),
        capabilitiesList: dbModel.capabilities.map((mc) => ({
          id: mc.id,
          capabilityId: mc.capabilityId,
          capability: {
            id: mc.capability.id,
            name: mc.capability.name,
            slug: mc.capability.slug,
            description: mc.capability.description,
            icon: mc.capability.icon,
          },
          score: mc.score,
        })),
        benchmarks: dbModel.benchmarks.map((mb) => ({
          id: mb.id,
          benchmarkId: mb.benchmarkId,
          benchmark: {
            id: mb.benchmark.id,
            name: mb.benchmark.name,
            category: mb.benchmark.category,
            description: mb.benchmark.description,
            maxScore: mb.benchmark.maxScore,
            unit: mb.benchmark.unit,
          },
          score: mb.score,
          notes: mb.notes,
          isSampleData: mb.isSampleData,
        })),
        relatedModels: relatedSummaries,
      };
    } catch (e) {
      console.warn("Postgres getModelBySlug error, fallback:", e);
    }
  }

  const found = SEED_MODELS.find((m) => m.slug === slug);
  if (!found) return null;
  return seedModelToDetail(found, SEED_MODELS);
}

export async function getCompanies(): Promise<Company[]> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const companies = await prisma.company.findMany({
        include: {
          _count: { select: { models: true } },
          models: {
            take: 4,
            include: { company: true, pricing: true, capabilities: { include: { capability: true } }, modelProviders: { include: { provider: true } } },
          },
        },
      });

      return companies.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        websiteUrl: c.websiteUrl,
        logoUrl: c.logoUrl,
        country: c.country,
        modelCount: c._count.models,
        models: c.models.map((m) => ({
          id: m.id,
          name: m.name,
          slug: m.slug,
          description: m.description,
          architecture: m.architecture,
          modelType: m.modelType,
          contextWindow: m.contextWindow,
          maxOutputTokens: m.maxOutputTokens,
          releaseDate: m.releaseDate?.toISOString() ?? null,
          isFree: m.isFree,
          isTrending: m.isTrending,
          isFeatured: m.isFeatured,
          modalities: m.modalities,
          company: { id: c.id, name: c.name, slug: c.slug, logoUrl: c.logoUrl },
          pricing: m.pricing[0]
            ? {
                inputPricePerMillion: m.pricing[0].inputPricePerMillion,
                outputPricePerMillion: m.pricing[0].outputPricePerMillion,
                cacheReadPricePerMillion: m.pricing[0].cacheReadPricePerMillion,
              }
            : null,
          capabilities: m.capabilities.map((cap) => ({ name: cap.capability.name, slug: cap.capability.slug })),
          providers: m.modelProviders.map((p) => ({ name: p.provider.name, slug: p.provider.slug })),
        })),
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
    } catch (e) {
      console.warn("Postgres getCompanies error, fallback:", e);
    }
  }

  return SEED_COMPANIES.map((c) => {
    const compModels = SEED_MODELS.filter((m) => m.companySlug === c.slug).map(seedModelToSummary);
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      websiteUrl: c.websiteUrl,
      logoUrl: c.logoUrl,
      country: c.country,
      modelCount: compModels.length,
      models: compModels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const companies = await getCompanies();
  return companies.find((c) => c.slug === slug) ?? null;
}

export async function getProviders(): Promise<Provider[]> {
  const isPostgres = await checkDatabaseConnection();

  if (isPostgres) {
    try {
      const providers = await prisma.provider.findMany({
        include: {
          _count: { select: { modelProviders: true } },
          modelProviders: {
            take: 4,
            include: {
              model: {
                include: { company: true, pricing: true, capabilities: { include: { capability: true } }, modelProviders: { include: { provider: true } } },
              },
            },
          },
        },
      });

      return providers.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        websiteUrl: p.websiteUrl,
        logoUrl: p.logoUrl,
        modelCount: p._count.modelProviders,
        supportedModels: p.modelProviders.map((mp) => ({
          id: mp.model.id,
          name: mp.model.name,
          slug: mp.model.slug,
          description: mp.model.description,
          architecture: mp.model.architecture,
          modelType: mp.model.modelType,
          contextWindow: mp.model.contextWindow,
          maxOutputTokens: mp.model.maxOutputTokens,
          releaseDate: mp.model.releaseDate?.toISOString() ?? null,
          isFree: mp.model.isFree,
          isTrending: mp.model.isTrending,
          isFeatured: mp.model.isFeatured,
          modalities: mp.model.modalities,
          company: { id: mp.model.company.id, name: mp.model.company.name, slug: mp.model.company.slug },
          pricing: mp.model.pricing[0]
            ? {
                inputPricePerMillion: mp.model.pricing[0].inputPricePerMillion,
                outputPricePerMillion: mp.model.pricing[0].outputPricePerMillion,
              }
            : null,
          capabilities: mp.model.capabilities.map((c) => ({ name: c.capability.name, slug: c.capability.slug })),
          providers: mp.model.modelProviders.map((x) => ({ name: x.provider.name, slug: x.provider.slug })),
        })),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));
    } catch (e) {
      console.warn("Postgres getProviders error, fallback:", e);
    }
  }

  return SEED_PROVIDERS.map((p) => {
    const supported = SEED_MODELS.filter((m) => m.providers.some((mp) => mp.providerSlug === p.slug)).map(
      seedModelToSummary
    );
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      websiteUrl: p.websiteUrl,
      logoUrl: p.logoUrl,
      modelCount: supported.length,
      supportedModels: supported,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const providers = await getProviders();
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) return null;

  // Ensure full supported models list
  const fullSupported = SEED_MODELS.filter((m) =>
    m.providers.some((mp) => mp.providerSlug === slug)
  ).map(seedModelToSummary);

  return {
    ...provider,
    supportedModels: fullSupported,
  };
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  const isPostgres = await checkDatabaseConnection();
  if (isPostgres) {
    try {
      const dbb = await prisma.benchmark.findMany();
      return dbb.map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        maxScore: b.maxScore,
        unit: b.unit,
      }));
    } catch (e) {
      console.warn("Postgres getBenchmarks fallback:", e);
    }
  }
  return SEED_BENCHMARKS;
}

export async function getRankings(category?: string) {
  const benchmarks = await getBenchmarks();
  const targetBenchmarks = category && category !== "All"
    ? benchmarks.filter((b) => b.category.toLowerCase() === category.toLowerCase())
    : benchmarks;

  const targetNames = new Set(targetBenchmarks.map((b) => b.name));

  // Build ranking entries
  const entries: {
    rank: number;
    model: ModelSummary;
    benchmarkName: string;
    category: string;
    score: number;
    unit: string;
    isSampleData: boolean;
  }[] = [];

  for (const m of SEED_MODELS) {
    for (const b of m.benchmarks) {
      if (targetNames.has(b.benchmarkName)) {
        const benchmarkDef = benchmarks.find((x) => x.name === b.benchmarkName);
        entries.push({
          rank: 0,
          model: seedModelToSummary(m),
          benchmarkName: b.benchmarkName,
          category: benchmarkDef?.category ?? "Overall",
          score: b.score,
          unit: benchmarkDef?.unit ?? "%",
          isSampleData: true,
        });
      }
    }
  }

  // Sort and assign ranks
  entries.sort((a, b) => b.score - a.score);
  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return {
    categories: ["All", "Overall", "Coding", "Reasoning", "Mathematics", "Knowledge", "Vision"],
    activeCategory: category || "All",
    benchmarks: targetBenchmarks,
    rankings: entries,
  };
}

export async function compareModels(slugs: string[]): Promise<CompareModelsResponse> {
  const models: ModelDetail[] = [];
  for (const slug of slugs) {
    const detail = await getModelBySlug(slug);
    if (detail) {
      models.push(detail);
    }
  }

  let lowestInputPriceModelId: string | null = null;
  let lowestOutputPriceModelId: string | null = null;
  let largestContextWindowModelId: string | null = null;

  let minInput = Infinity;
  let minOutput = Infinity;
  let maxContext = -1;

  const highestBenchmarkScores: Record<string, { modelId: string; score: number }> = {};

  for (const m of models) {
    const inputPrice = m.pricing?.inputPricePerMillion ?? 0;
    const outputPrice = m.pricing?.outputPricePerMillion ?? 0;

    if (inputPrice < minInput) {
      minInput = inputPrice;
      lowestInputPriceModelId = m.id;
    }
    if (outputPrice < minOutput) {
      minOutput = outputPrice;
      lowestOutputPriceModelId = m.id;
    }
    if (m.contextWindow > maxContext) {
      maxContext = m.contextWindow;
      largestContextWindowModelId = m.id;
    }

    for (const b of m.benchmarks) {
      const existing = highestBenchmarkScores[b.benchmark.name];
      if (!existing || b.score > existing.score) {
        highestBenchmarkScores[b.benchmark.name] = {
          modelId: m.id,
          score: b.score,
        };
      }
    }
  }

  return {
    models,
    highlights: {
      lowestInputPriceModelId,
      lowestOutputPriceModelId,
      largestContextWindowModelId,
      highestBenchmarkScores,
    },
  };
}

export async function globalSearch(query: string, limit = 8): Promise<GlobalSearchResult> {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { query, models: [], companies: [], providers: [] };
  }

  const models = SEED_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.slug.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  )
    .slice(0, limit)
    .map((m) => {
      const comp = SEED_COMPANIES.find((c) => c.slug === m.companySlug);
      return {
        id: m.id,
        name: m.name,
        slug: m.slug,
        companyName: comp?.name ?? m.companySlug,
        modelType: m.modelType,
        contextWindow: m.contextWindow,
      };
    });

  const companies = SEED_COMPANIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
  )
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      modelCount: SEED_MODELS.filter((m) => m.companySlug === c.slug).length,
    }));

  const providers = SEED_PROVIDERS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
  )
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      modelCount: SEED_MODELS.filter((m) => m.providers.some((mp) => mp.providerSlug === p.slug)).length,
    }));

  return {
    query,
    models,
    companies,
    providers,
  };
}
