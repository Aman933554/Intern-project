# OneAtlas.dev – AI Model Discovery & Intelligence Platform

> **Production-Quality MVP Engineering Assignment**  
> *A centralized platform to discover, search, explore, compare, and evaluate AI models, providers, architectures, and benchmarks.*

![OneAtlas Architecture](https://img.shields.io/badge/Architecture-Next.js%2014%20App%20Router-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma%20ORM-emerald)
![TypeScript](https://img.shields.io/badge/Language-TypeScript%205.6-blue)
![Styling](https://img.shields.io/badge/Design-Tailwind%20CSS%20Dark%20System-violet)
![Tests](https://img.shields.io/badge/Tests-17%2F17%20Passing-brightgreen)

---

## 1. Executive Summary & Product Overview

**OneAtlas.dev** is a full-stack developer intelligence platform designed for AI engineers, software architects, and researchers. As modern foundation models proliferate rapidly across modalities, context windows, and hosting platforms, engineering teams face significant challenges discovering optimal models, evaluating accurate token economics, and comparing benchmark scores.

Inspired by industry pioneers such as **OpenRouter**, **RouterPlus**, and **LiteLLM**, OneAtlas delivers a unified, production-grade intelligence layer that combines:
- **Comprehensive Model Catalog**: 30+ curated models across frontier LLMs, open-weights releases, reasoning architectures, and coding specialists.
- **Dynamic Side-by-Side Matrix**: Real-time comparison of up to 4 models highlighting lowest token input/output pricing, largest context window, and benchmark leaders.
- **STEM & Coding Leaderboards**: Standardized benchmark evaluations across LMSYS Arena Elo, HumanEval, SWE-bench, MATH, GPQA Diamond, and MMMU.
- **AI Labs & Inference Directory**: Dedicated profile pages for 10 creators (OpenAI, Anthropic, Google DeepMind, Meta, Mistral, DeepSeek, xAI, Cohere, Qwen, Microsoft) and 7 inference providers (OpenRouter, Together AI, Fireworks AI, DeepInfra, Google AI Studio, AWS Bedrock, Azure AI).
- **Global Keyboard-First Search**: Instant modal search with keyboard navigation (`Ctrl+K` or `/`) and dedicated multi-tab search results.

---

## 2. System Architecture

```mermaid
flowchart TD
    Client["User Client / Browser (Dark-First SaaS UI)"] -->|HTTP / JSON| NextApp["Next.js 14 App Router (React 18 + TS)"]
    
    subgraph Frontend["Frontend Layer"]
        Pages["Pages (Dashboard, Explore, Detail, Compare, Rankings, Labs, Providers)"]
        Components["Reusable UI Components (Cards, Tables, Filters, Charts, Modals)"]
        Context["Comparison Context & Global Search"]
    end

    subgraph Backend["Backend API Layer (/api)"]
        ZodValidator["Input Validation (Zod Schemas)"]
        RouteHandlers["Next.js Route Handlers (13 REST Endpoints)"]
        DBService["Database Service Layer (src/lib/db-service.ts)"]
    end

    subgraph DatabaseLayer["Data Persistence Layer"]
        PrismaORM["Prisma Client ORM (v5.22.0)"]
        PostgresDB[("Neon PostgreSQL / Local PostgreSQL")]
        SeedCache["In-Memory Curated Fallback Store (Zero Breakage Guarantee)"]
    end

    NextApp --> Frontend
    Frontend --> RouteHandlers
    RouteHandlers --> ZodValidator
    ZodValidator --> DBService
    DBService --> PrismaORM
    PrismaORM --> PostgresDB
    DBService -.->|Fallback if DB unconfigured| SeedCache
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | Modern SSR/SSG hybrid rendering, route grouping, streaming, and server actions |
| **Language** | **TypeScript 5.6** | Strict type safety across database schemas, APIs, and React components |
| **UI Library** | **React 18.3** | Component lifecycle, custom hooks, and concurrent hydration |
| **Design System** | **Tailwind CSS 3.4** | Dark-first design tokens (`#080B12` base, `#111827` cards, electric blue `#3B82F6`, violet `#8B5CF6`) |
| **Icons** | **Lucide React** | Consistent iconography across models, providers, and capabilities |
| **Data Visualization** | **Recharts 2.13** | Category distribution donuts, pricing spectrum bars, and leaderboard charts |
| **Database ORM** | **Prisma ORM 5.22** | Type-safe migrations, query generation, and relational schema management |
| **Primary Database** | **PostgreSQL (Neon Ready)** | Normalized relational persistence with indexed foreign keys |
| **Validation** | **Zod 3.23** | Strict schema validation for incoming query parameters and mutation bodies |
| **Deployment Target** | **Vercel + Neon** | Edge CDN delivery with serverless autoscaling PostgreSQL |

---

## 4. Normalized Database Schema

The database is modeled in `prisma/schema.prisma` with 11 relational entities, indexed primary/foreign keys, and cascading behavior:

```prisma
// Core relational schema representation
model Company {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  websiteUrl  String?
  logoUrl     String?
  country     String?
  models      Model[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([name])
}

model Provider {
  id             String          @id @default(cuid())
  name           String
  slug           String          @unique
  description    String?
  websiteUrl     String?
  logoUrl        String?
  modelProviders ModelProvider[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([name])
}

model Model {
  id              String            @id @default(cuid())
  name            String
  slug            String            @unique
  description     String
  architecture    String?
  modelType       String            // e.g., "Chat", "Multimodal", "Reasoning", "Code"
  contextWindow   Int               // In tokens (e.g. 128000, 2097152)
  maxOutputTokens Int?              // Output generation limit
  releaseDate     DateTime?
  isFree          Boolean           @default(false)
  isTrending      Boolean           @default(false)
  isFeatured      Boolean           @default(false)
  modalities      String[]          @default([])
  
  companyId       String
  company         Company           @relation(fields: [companyId], references: [id], onDelete: Cascade)

  pricing         Pricing[]
  modelProviders  ModelProvider[]
  capabilities    ModelCapability[]
  benchmarks      ModelBenchmark[]
  savedBy         SavedModel[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([name])
  @@index([modelType])
  @@index([contextWindow])
  @@index([companyId])
}

model ModelProvider {
  id              String   @id @default(cuid())
  modelId         String
  providerId      String
  providerModelId String   // e.g., "openai/gpt-4o"
  latencyMs       Float?   // Time to first token
  throughputTps   Float?   // Tokens per second
  isAvailable     Boolean  @default(true)

  model    Model    @relation(fields: [modelId], references: [id], onDelete: Cascade)
  provider Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)

  @@unique([modelId, providerId])
  @@index([providerId])
  @@index([modelId])
}

model Pricing {
  id                       String   @id @default(cuid())
  modelId                  String
  inputPricePerMillion     Float    // Price in USD per 1M input tokens
  outputPricePerMillion    Float    // Price in USD per 1M output tokens
  cacheReadPricePerMillion Float?   // Price in USD per 1M cached prompt tokens
  currency                 String   @default("USD")
  effectiveDate            DateTime @default(now())

  model Model @relation(fields: [modelId], references: [id], onDelete: Cascade)

  @@index([inputPricePerMillion])
  @@index([outputPricePerMillion])
  @@index([modelId])
}

model Benchmark {
  id              String           @id @default(cuid())
  name            String           @unique
  category        String           // "Overall", "Coding", "Reasoning", "Mathematics", "Knowledge", "Vision"
  description     String?
  maxScore        Float            @default(100.0)
  unit            String           @default("%")
  modelBenchmarks ModelBenchmark[]
}

model ModelBenchmark {
  id           String    @id @default(cuid())
  modelId      String
  benchmarkId  String
  score        Float
  notes        String?
  isSampleData Boolean   @default(true) // Explicit disclaimer compliance

  model     Model     @relation(fields: [modelId], references: [id], onDelete: Cascade)
  benchmark Benchmark @relation(fields: [benchmarkId], references: [id], onDelete: Cascade)

  @@unique([modelId, benchmarkId])
  @@index([benchmarkId, score])
  @@index([modelId])
}
```

---

## 5. Backend REST API Documentation

All API routes are implemented under `src/app/api/` with strict Zod validation, proper HTTP status codes, and type-safe database queries.

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated dashboard metrics & charts | None |
| `GET` | `/api/dashboard/trending` | Trending foundation models | None |
| `GET` | `/api/dashboard/recent` | Recently cataloged models | None |
| `GET` | `/api/models` | Paginated, filtered, and sorted model catalog | `search`, `company`, `provider`, `type`, `capability`, `isFree`, `minContext`, `sort`, `page`, `limit` |
| `GET` | `/api/models/[slug]` | Complete model profile with architecture, pricing & evals | URL slug param |
| `GET` | `/api/models/search` | Fast debounce search suggestions | `q` (string), `limit` (number) |
| `POST` | `/api/compare` | Side-by-side comparison with highlight analysis | `{ "modelSlugs": ["gpt-4o", "claude-3-5-sonnet"] }` |
| `GET` | `/api/companies` | List all AI Labs with model counts | None |
| `GET` | `/api/companies/[slug]` | Lab profile and its foundation models | URL slug param |
| `GET` | `/api/providers` | List all inference gateways and hosts | None |
| `GET` | `/api/providers/[slug]` | Provider profile and supported endpoints | URL slug param |
| `GET` | `/api/rankings` | Benchmark leaderboards ranked by score | `category` (Overall, Coding, Reasoning, etc.) |
| `GET` | `/api/benchmarks` | Benchmark catalog and evaluation criteria | None |

---

## 6. Project Structure

```
├── .env.example                  # Environment variable reference template
├── .gitignore                    # Git tracking rules
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies & execution scripts
├── postcss.config.js             # PostCSS Tailwind plugins
├── tailwind.config.ts            # Custom dark design system tokens
├── tsconfig.json                 # TypeScript strict compiler options
│
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema definition
│   ├── seedData.ts               # Curated seed database (30+ models, 10 labs, 7 providers)
│   └── seed.ts                   # Executable database seeder
│
├── scripts/
│   └── test-workflows.ts         # Automated 17-point end-to-end test runner
│
└── src/
    ├── app/
    │   ├── layout.tsx            # Global Root layout with AppShell
    │   ├── globals.css           # Custom scrollbars, glassmorphism, glows
    │   ├── page.tsx              # Home Dashboard with charts & stats
    │   ├── not-found.tsx         # 404 Route handling
    │   ├── about/page.tsx        # Platform mission & architecture documentation
    │   ├── compare/page.tsx      # Model Comparison Matrix & ModelSelectorModal
    │   ├── models/page.tsx       # Explore Models page with filtering, sorting, pagination
    │   ├── models/[slug]/        # Model details & ModelDetailActions
    │   ├── rankings/page.tsx     # Leaderboards, category tabs & RankingsChart
    │   ├── companies/page.tsx    # AI Labs directory
    │   ├── companies/[slug]/     # Lab details & associated models
    │   ├── providers/page.tsx    # Inference Gateways directory
    │   ├── providers/[slug]/     # Provider details & hosted endpoints
    │   ├── search/page.tsx       # Global search results page with tabs
    │   └── api/                  # 13 REST API endpoints (models, compare, stats, etc.)
    │
    ├── components/
    │   ├── layout/               # Navbar, Sidebar, Footer, GlobalSearchModal, AppShell
    │   ├── common/               # CompareFloatingBar, DisclaimerNotice
    │   ├── dashboard/            # StatCard, CategoryDistributionChart, PricingOverviewChart
    │   ├── models/               # ModelCard, ModelTableView, ModelFilters, Pagination
    │   ├── comparison/           # ModelSelectorModal
    │   └── rankings/             # RankingsChart
    │
    ├── context/
    │   └── ComparisonContext.tsx # React Context managing comparison dock state
    │
    ├── lib/
    │   ├── prisma.ts             # Prisma Client instance & DB connection tester
    │   ├── db-service.ts         # Hybrid PostgreSQL / Seed Cache database service
    │   ├── validations.ts        # Zod validation schemas
    │   └── utils.ts              # Currency, tokens, dates, and styling formatters
    │
    └── types/
        └── index.ts              # Core TypeScript interfaces & API contracts
```

---

## 7. Local Development Guide

### Prerequisites
- **Node.js**: v18.18+ or v20+ (v26+ supported)
- **npm** or **pnpm**

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-username/oneatlas-dev.git
cd oneatlas-dev
npm install
```

### Step 2: Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oneatlas?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Database Provisioning & Seeding

OneAtlas is engineered to connect to **Neon Serverless PostgreSQL** or any standard PostgreSQL instance.

### Provisioning on Neon:
1. Create a free PostgreSQL database at [neon.tech](https://neon.tech).
2. Copy your pooled connection string (format: `postgresql://username:password@ep-name.region.aws.neon.tech/neondb?sslmode=require`).
3. Set `DATABASE_URL` in your `.env` file.

### Apply Database Schema & Migrations:
```bash
# Push schema to PostgreSQL without data loss
npm run prisma:push
```

### Populate Seed Dataset:
```bash
# Seeds 30+ AI models, 10 labs, 7 providers, pricing & benchmark relations
npm run prisma:seed
```

> **Zero-Breakage Architecture Note**: If `DATABASE_URL` is omitted or PostgreSQL is unreachable during offline review, OneAtlas automatically serves identical relational queries from its integrated seed repository with full search, sorting, filtering, and comparison capabilities.

---

## 9. Automated Testing Suite

A dedicated verification test suite checks all 17 requirements defined in the assignment specification:

```bash
npm run test:workflows
```

### Verified Test Results:
```
=================================================
  ONEATLAS.DEV AUTOMATED WORKFLOW TEST HARNESS   
=================================================

✅ [TEST 1] PASSED: Home dashboard loads database statistics
✅ [TEST 2] PASSED: Models are retrieved from database layer
✅ [TEST 3] PASSED: Model search works accurately
✅ [TEST 4] PASSED: Company filter works accurately
✅ [TEST 5] PASSED: Provider filter works accurately
✅ [TEST 6] PASSED: Pricing sorting works (price-asc)
✅ [TEST 7] PASSED: Pagination works correctly across pages
✅ [TEST 8] PASSED: Model details open correctly with full relational data
✅ [TEST 9] PASSED: Model comparison works with side-by-side highlights
✅ [TEST 10] PASSED: Models can be removed and comparison recalculates dynamically
✅ [TEST 11] PASSED: Rankings display benchmark data and category filters
✅ [TEST 12] PASSED: Company details display associated models
✅ [TEST 13] PASSED: Provider details display supported models
✅ [TEST 14] PASSED: Global search returns multi-entity results
✅ [TEST 15] PASSED: Mobile navigation and responsive layout configured
✅ [TEST 16] PASSED: Invalid model and company slugs safely return 404
✅ [TEST 17] PASSED: API validation (Zod) blocks invalid request payloads

=================================================
TOTAL TESTS: 17 | PASSED: 17 | FAILED: 0
🎉 ALL 17 FUNCTIONAL TESTS PASSED!
=================================================
```

---

## 10. Production Deployment to Vercel

### Step 1: Push Code to GitHub / GitLab
```bash
git add .
git commit -m "feat: complete OneAtlas production MVP"
git push origin main
```

### Step 2: Import into Vercel
1. Navigate to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `oneatlas-dev` repository.
3. In **Build and Output Settings**, verify:
   - Framework Preset: **Next.js**
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`

### Step 3: Configure Environment Variables
Under **Environment Variables**, add:
- `DATABASE_URL`: Your Neon PostgreSQL connection string.
- `NEXT_PUBLIC_APP_URL`: Your production Vercel domain (e.g. `https://oneatlas.vercel.app`).

### Step 4: Deploy & Seed
Click **Deploy**. Once the build succeeds, run database seeding against your Neon database from your local machine:
```bash
DATABASE_URL="your-neon-production-url" npx prisma db push
DATABASE_URL="your-neon-production-url" npm run prisma:seed
```

---

## 11. Data Integrity and Public Compliance

In accordance with responsible engineering standards:
- All benchmark metrics (MMLU, HumanEval, SWE-bench, MATH, GPQA, MMMU, Arena Elo) and pricing records are clearly labeled as **curated reference samples**.
- They are derived from published laboratory technical reports and provider documentation for architectural planning.
- OneAtlas does not represent sample benchmark figures as real-time audited live results.

---

## 12. License

Created for technical internship evaluation. MIT License.
