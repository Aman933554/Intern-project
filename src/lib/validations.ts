import { z } from "zod";

export const modelsQuerySchema = z.object({
  search: z.string().optional(),
  company: z.string().optional(),
  provider: z.string().optional(),
  type: z.string().optional(),
  capability: z.string().optional(),
  isFree: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
  minContext: z.preprocess((val) => (val ? Number(val) : undefined), z.number().nonnegative()).optional(),
  maxPrice: z.preprocess((val) => (val ? Number(val) : undefined), z.number().nonnegative()).optional(),
  sort: z.enum([
    "price-asc",
    "price-desc",
    "context-desc",
    "newest",
    "oldest",
    "name-asc",
  ]).optional(),
  page: z.preprocess((val) => (val ? Math.max(1, Number(val)) : 1), z.number()).default(1),
  limit: z.preprocess((val) => (val ? Math.min(100, Math.max(1, Number(val))) : 12), z.number()).default(12),
});

export const compareRequestSchema = z.object({
  modelSlugs: z
    .array(z.string().min(1))
    .min(2, "Must select at least 2 models for comparison")
    .max(4, "Cannot compare more than 4 models simultaneously"),
});

export const searchSuggestionsSchema = z.object({
  q: z.string().min(1, "Query is required").max(100),
  limit: z.preprocess((val) => (val ? Number(val) : 8), z.number().max(20)).default(8),
});
