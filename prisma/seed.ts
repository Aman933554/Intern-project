import { PrismaClient } from "@prisma/client";
import {
  SEED_COMPANIES,
  SEED_PROVIDERS,
  SEED_CAPABILITIES,
  SEED_BENCHMARKS,
  SEED_MODELS,
} from "./seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting OneAtlas database seeding...");

  // 1. Seed Companies
  console.log("Seeding companies...");
  for (const company of SEED_COMPANIES) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: {
        name: company.name,
        description: company.description,
        websiteUrl: company.websiteUrl,
        country: company.country,
      },
      create: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        description: company.description,
        websiteUrl: company.websiteUrl,
        country: company.country,
      },
    });
  }

  // 2. Seed Providers
  console.log("Seeding providers...");
  for (const provider of SEED_PROVIDERS) {
    await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: {
        name: provider.name,
        description: provider.description,
        websiteUrl: provider.websiteUrl,
      },
      create: {
        id: provider.id,
        name: provider.name,
        slug: provider.slug,
        description: provider.description,
        websiteUrl: provider.websiteUrl,
      },
    });
  }

  // 3. Seed Capabilities
  console.log("Seeding capabilities...");
  for (const capability of SEED_CAPABILITIES) {
    await prisma.capability.upsert({
      where: { slug: capability.slug },
      update: {
        name: capability.name,
        description: capability.description,
        icon: capability.icon,
      },
      create: {
        id: capability.id,
        name: capability.name,
        slug: capability.slug,
        description: capability.description,
        icon: capability.icon,
      },
    });
  }

  // 4. Seed Benchmarks
  console.log("Seeding benchmarks...");
  for (const benchmark of SEED_BENCHMARKS) {
    await prisma.benchmark.upsert({
      where: { name: benchmark.name },
      update: {
        category: benchmark.category,
        description: benchmark.description,
        maxScore: benchmark.maxScore,
        unit: benchmark.unit,
      },
      create: {
        id: benchmark.id,
        name: benchmark.name,
        category: benchmark.category,
        description: benchmark.description,
        maxScore: benchmark.maxScore,
        unit: benchmark.unit,
      },
    });
  }

  // Map slugs and names to database IDs for relational connections
  const dbCompanies = await prisma.company.findMany();
  const companySlugToId = new Map(dbCompanies.map((c) => [c.slug, c.id]));

  const dbProviders = await prisma.provider.findMany();
  const providerSlugToId = new Map(dbProviders.map((p) => [p.slug, p.id]));

  const dbCapabilities = await prisma.capability.findMany();
  const capSlugToId = new Map(dbCapabilities.map((cap) => [cap.slug, cap.id]));

  const dbBenchmarks = await prisma.benchmark.findMany();
  const benchNameToId = new Map(dbBenchmarks.map((b) => [b.name, b.id]));

  // 5. Seed Models with Pricing, Providers, Capabilities, and Benchmarks
  console.log(`Seeding ${SEED_MODELS.length} AI Models with relational data...`);
  for (const m of SEED_MODELS) {
    const companyId = companySlugToId.get(m.companySlug);
    if (!companyId) {
      console.warn(`Company not found for slug: ${m.companySlug}`);
      continue;
    }

    const createdModel = await prisma.model.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        description: m.description,
        architecture: m.architecture,
        modelType: m.modelType,
        contextWindow: m.contextWindow,
        maxOutputTokens: m.maxOutputTokens,
        releaseDate: new Date(m.releaseDate),
        isFree: m.isFree,
        isTrending: m.isTrending,
        isFeatured: m.isFeatured,
        modalities: m.modalities,
        companyId,
      },
      create: {
        id: m.id,
        name: m.name,
        slug: m.slug,
        description: m.description,
        architecture: m.architecture,
        modelType: m.modelType,
        contextWindow: m.contextWindow,
        maxOutputTokens: m.maxOutputTokens,
        releaseDate: new Date(m.releaseDate),
        isFree: m.isFree,
        isTrending: m.isTrending,
        isFeatured: m.isFeatured,
        modalities: m.modalities,
        companyId,
      },
    });

    // Seed Pricing
    await prisma.pricing.deleteMany({ where: { modelId: createdModel.id } });
    await prisma.pricing.create({
      data: {
        modelId: createdModel.id,
        inputPricePerMillion: m.pricing.inputPricePerMillion,
        outputPricePerMillion: m.pricing.outputPricePerMillion,
        cacheReadPricePerMillion: m.pricing.cacheReadPricePerMillion ?? null,
      },
    });

    // Seed ModelProvider
    for (const p of m.providers) {
      const providerId = providerSlugToId.get(p.providerSlug);
      if (providerId) {
        await prisma.modelProvider.upsert({
          where: {
            modelId_providerId: {
              modelId: createdModel.id,
              providerId,
            },
          },
          update: {
            providerModelId: p.providerModelId,
            latencyMs: p.latencyMs ?? null,
            throughputTps: p.throughputTps ?? null,
            isAvailable: true,
          },
          create: {
            modelId: createdModel.id,
            providerId,
            providerModelId: p.providerModelId,
            latencyMs: p.latencyMs ?? null,
            throughputTps: p.throughputTps ?? null,
            isAvailable: true,
          },
        });
      }
    }

    // Seed ModelCapability
    for (const cap of m.capabilities) {
      const capId = capSlugToId.get(cap.capabilitySlug);
      if (capId) {
        await prisma.modelCapability.upsert({
          where: {
            modelId_capabilityId: {
              modelId: createdModel.id,
              capabilityId: capId,
            },
          },
          update: {
            score: cap.score,
          },
          create: {
            modelId: createdModel.id,
            capabilityId: capId,
            score: cap.score,
          },
        });
      }
    }

    // Seed ModelBenchmark
    for (const bench of m.benchmarks) {
      const benchmarkId = benchNameToId.get(bench.benchmarkName);
      if (benchmarkId) {
        await prisma.modelBenchmark.upsert({
          where: {
            modelId_benchmarkId: {
              modelId: createdModel.id,
              benchmarkId,
            },
          },
          update: {
            score: bench.score,
            notes: bench.notes ?? null,
            isSampleData: true,
          },
          create: {
            modelId: createdModel.id,
            benchmarkId,
            score: bench.score,
            notes: bench.notes ?? null,
            isSampleData: true,
          },
        });
      }
    }
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
