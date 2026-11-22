/**
 * Full End-to-End Deep Verification Suite
 * Checks all frontend endpoints, backend APIs, data transformations,
 * and calculations on the running production server (http://localhost:3000).
 */

const BASE_URL = "http://localhost:3000";

interface Check {
  name: string;
  pass: boolean;
  message: string;
}

const checks: Check[] = [];

function record(name: string, pass: boolean, message: string) {
  if (pass) {
    console.log(`✅ [PASS] ${name}: ${message}`);
  } else {
    console.error(`❌ [FAIL] ${name}: ${message}`);
  }
  checks.push({ name, pass, message });
}

async function verify() {
  console.log("=========================================================");
  console.log("   ONEATLAS.DEV DEEP PRODUCTION VERIFICATION SUITE       ");
  console.log("=========================================================\n");

  // 1. Dashboard Stats
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`);
    const json = await res.json();
    const ok =
      res.ok &&
      json.success &&
      json.data.totalModels >= 30 &&
      json.data.totalProviders >= 7 &&
      json.data.totalCompanies >= 8 &&
      json.data.totalBenchmarks >= 6 &&
      json.data.trendingModels.length > 0 &&
      json.data.categoryDistribution.length > 0 &&
      json.data.priceDistribution.length > 0;
    record(
      "Dashboard Statistics API",
      ok,
      `Total: ${json.data?.totalModels} models, ${json.data?.totalCompanies} companies, ${json.data?.totalProviders} providers`
    );
  } catch (e: any) {
    record("Dashboard Statistics API", false, e.message);
  }

  // 2. Models Search & Filter Multi-checks
  try {
    // Search by text
    const searchRes = await fetch(`${BASE_URL}/api/models?search=Llama`);
    const searchJson = await searchRes.json();
    const searchPass =
      searchJson.success &&
      searchJson.data.length > 0 &&
      searchJson.data.every((m: any) => m.name.toLowerCase().includes("llama") || m.company.name.toLowerCase().includes("llama"));
    record("Models Search Filtering", searchPass, `Found ${searchJson.data?.length} Llama models`);

    // Filter by Company
    const compRes = await fetch(`${BASE_URL}/api/models?company=anthropic`);
    const compJson = await compRes.json();
    const compPass =
      compJson.success &&
      compJson.data.length >= 3 &&
      compJson.data.every((m: any) => m.company.slug === "anthropic");
    record("Company Filter (/api/models?company=anthropic)", compPass, `Found ${compJson.data?.length} Anthropic models`);

    // Filter by Provider
    const provRes = await fetch(`${BASE_URL}/api/models?provider=together-ai`);
    const provJson = await provRes.json();
    const provPass =
      provJson.success &&
      provJson.data.length >= 5 &&
      provJson.data.every((m: any) => m.providers.some((p: any) => p.slug === "together-ai"));
    record("Provider Filter (/api/models?provider=together-ai)", provPass, `Found ${provJson.data?.length} Together AI endpoints`);

    // Filter by Free Models
    const freeRes = await fetch(`${BASE_URL}/api/models?isFree=true`);
    const freeJson = await freeRes.json();
    const freePass = freeJson.success && freeJson.data.length > 0 && freeJson.data.every((m: any) => m.isFree === true);
    record("Free Tier Filter (/api/models?isFree=true)", freePass, `Identified ${freeJson.data?.length} free tier models`);

    // Filter by Context Window >= 1,000,000
    const ctxRes = await fetch(`${BASE_URL}/api/models?minContext=1000000`);
    const ctxJson = await ctxRes.json();
    const ctxPass = ctxJson.success && ctxJson.data.length > 0 && ctxJson.data.every((m: any) => m.contextWindow >= 1000000);
    record("Long Context Filter (>= 1M tokens)", ctxPass, `Identified ${ctxJson.data?.length} models supporting >= 1M tokens`);

    // Price sorting ascending
    const sortRes = await fetch(`${BASE_URL}/api/models?sort=price-asc&limit=10`);
    const sortJson = await sortRes.json();
    let isAsc = true;
    for (let i = 0; i < sortJson.data.length - 1; i++) {
      if ((sortJson.data[i].pricing?.inputPricePerMillion ?? 0) > (sortJson.data[i + 1].pricing?.inputPricePerMillion ?? 0)) {
        isAsc = false;
        break;
      }
    }
    record("Price Sorting Ascending", isAsc, `Prices correctly ordered from $${sortJson.data[0]?.pricing?.inputPricePerMillion} to $${sortJson.data[sortJson.data.length - 1]?.pricing?.inputPricePerMillion}`);
  } catch (e: any) {
    record("Models Filtering & Sorting", false, e.message);
  }

  // 3. Dynamic Model Details Route
  try {
    const slug = "claude-3-5-sonnet";
    const res = await fetch(`${BASE_URL}/api/models/${slug}`);
    const json = await res.json();
    const pass =
      json.success &&
      json.data.slug === slug &&
      json.data.benchmarks.length > 0 &&
      json.data.modelProviders.length > 0 &&
      json.data.capabilitiesList.length > 0 &&
      json.data.relatedModels.length > 0;
    record("Model Detail Relational Integrity", pass, `Verified '${slug}' with ${json.data?.benchmarks?.length} benchmarks & ${json.data?.modelProviders?.length} providers`);
  } catch (e: any) {
    record("Model Detail Relational Integrity", false, e.message);
  }

  // 4. Comparison Engine Highlights & Calculation
  try {
    const comparePayload = {
      modelSlugs: ["gpt-4o", "claude-3-5-sonnet", "deepseek-r1"],
    };
    const res = await fetch(`${BASE_URL}/api/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comparePayload),
    });
    const json = await res.json();
    const pass =
      json.success &&
      json.data.models.length === 3 &&
      json.data.highlights.lowestInputPriceModelId === "mod_deepseek_r1" &&
      json.data.highlights.largestContextWindowModelId !== null &&
      Object.keys(json.data.highlights.highestBenchmarkScores).length > 0;
    record(
      "Comparison Matrix & Automatic Highlights",
      pass,
      `Calculated lowest input price model: ${json.data?.highlights?.lowestInputPriceModelId}, benchmark scores evaluated: ${Object.keys(json.data?.highlights?.highestBenchmarkScores || {}).length}`
    );
  } catch (e: any) {
    record("Comparison Matrix", false, e.message);
  }

  // 5. Benchmark Rankings across Categories
  try {
    const categories = ["Coding", "Mathematics", "Reasoning", "Knowledge", "Vision"];
    let allCatOk = true;
    for (const cat of categories) {
      const res = await fetch(`${BASE_URL}/api/rankings?category=${cat}`);
      const json = await res.json();
      if (!json.success || json.data.rankings.length === 0) {
        allCatOk = false;
        break;
      }
    }
    record("Benchmark Categories & Rankings", allCatOk, `Verified dynamic leaderboard generation across all 5 benchmark domains`);
  } catch (e: any) {
    record("Benchmark Rankings", false, e.message);
  }

  // 6. Global Search Multi-Entity Aggregation
  try {
    const res = await fetch(`${BASE_URL}/api/models/search?q=open`);
    const json = await res.json();
    const pass =
      json.success &&
      json.data.models.length > 0 &&
      json.data.companies.length > 0 &&
      json.data.providers.length > 0;
    record("Global Search Tri-Entity Lookup", pass, `Returned matching models, companies, and providers in a single debounced query`);
  } catch (e: any) {
    record("Global Search", false, e.message);
  }

  // 7. HTML Page Responses & HTTP 200
  try {
    const pages = ["/", "/models", "/compare", "/rankings", "/companies", "/providers", "/saved", "/about"];
    let pagesOk = true;
    for (const p of pages) {
      const res = await fetch(`${BASE_URL}${p}`);
      if (res.status !== 200) {
        pagesOk = false;
        console.error(`Page ${p} returned ${res.status}`);
        break;
      }
    }
    record("HTML Server-Rendered Pages", pagesOk, `All primary navigation pages including /saved return HTTP 200 OK`);
  } catch (e: any) {
    record("HTML Pages", false, e.message);
  }

  // 8. Auth & Saved Models API (Option B)
  try {
    // Test login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@oneatlas.dev", password: "password123" }),
    });
    const loginJson = await loginRes.json();

    // Test saved models query
    const savedRes = await fetch(`${BASE_URL}/api/user/saved?userId=${loginJson.data?.id}`);
    const savedJson = await savedRes.json();

    const authPass = loginRes.ok && loginJson.success && savedRes.ok && savedJson.success && savedJson.data.length >= 3;
    record("Auth & Saved Models API (Option B)", authPass, `Logged in as ${loginJson.data?.email}, retrieved ${savedJson.data?.length} saved models`);
  } catch (e: any) {
    record("Auth & Saved Models API (Option B)", false, e.message);
  }

  console.log("\n=========================================================");
  const allPassed = checks.every((c) => c.pass);
  console.log(`TOTAL AUDIT CHECKS: ${checks.length} | PASSED: ${checks.filter((c) => c.pass).length} | FAILED: ${checks.filter((c) => !c.pass).length}`);
  console.log(allPassed ? "🎉 ALL SYSTEM AUDIT CHECKS PASSED WITH 100% SUCCESS!" : "⚠️ SOME CHECKS FAILED");
  console.log("=========================================================\n");

  if (!allPassed) {
    process.exit(1);
  }
}

verify().catch((e) => {
  console.error(e);
  process.exit(1);
});
