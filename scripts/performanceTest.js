/**
 * Performance Testing Script
 * Measures response times for all API endpoints
 */

const API_BASE = process.env.API_BASE_URL || "https://polished-bee-946.convex.site";
const API_KEY = process.env.TEST_API_KEY;

if (!API_KEY) {
  console.error("❌ TEST_API_KEY environment variable is required");
  console.error("Set it in your .env.local file or pass it: TEST_API_KEY=your_key node scripts/performanceTest.js");
  process.exit(1);
}

const endpoints = [
  {
    name: "GET /api/stats (public)",
    url: `${API_BASE}/api/stats`,
    requiresAuth: false,
  },
  {
    name: "GET /api/players (paginated)",
    url: `${API_BASE}/api/players?limit=20`,
    requiresAuth: true,
  },
  {
    name: "GET /api/players/search",
    url: `${API_BASE}/api/players/search?q=LeBron`,
    requiresAuth: true,
  },
  {
    name: "GET /api/players/:id",
    url: `${API_BASE}/api/players/j9733j4termyc8t88mx7bppk0n7vg467`,
    requiresAuth: true,
  },
  {
    name: "GET /api/teams",
    url: `${API_BASE}/api/teams?teamType=curr`,
    requiresAuth: true,
  },
  {
    name: "GET /api/teams/:name/roster",
    url: `${API_BASE}/api/teams/Los%20Angeles%20Lakers/roster?teamType=curr`,
    requiresAuth: true,
  },
  {
    name: "GET /api/dashboard/usage",
    url: `${API_BASE}/api/dashboard/usage`,
    requiresAuth: true,
  },
];

async function measureEndpoint(endpoint, iteration = 1) {
  const headers = endpoint.requiresAuth
    ? { "X-API-Key": API_KEY }
    : {};

  const start = Date.now();

  try {
    const response = await fetch(endpoint.url, { headers });
    const duration = Date.now() - start;

    const cacheControl = response.headers.get("Cache-Control");
    const etag = response.headers.get("ETag");
    const contentEncoding = response.headers.get("Content-Encoding");

    return {
      name: endpoint.name,
      duration,
      status: response.status,
      cacheControl,
      etag: etag ? "present" : "none",
      compressed: contentEncoding || "none",
      iteration,
    };
  } catch (error) {
    return {
      name: endpoint.name,
      duration: Date.now() - start,
      status: "error",
      error: error.message,
      iteration,
    };
  }
}

async function runPerformanceTests() {
  console.log("🚀 NBA 2K API Performance Test");
  console.log("================================\n");

  const results = [];

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`);

    // Run 5 iterations to get average
    const iterations = [];
    for (let i = 1; i <= 5; i++) {
      const result = await measureEndpoint(endpoint, i);
      iterations.push(result);

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const durations = iterations.map((r) => r.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    const summary = {
      endpoint: endpoint.name,
      avg: Math.round(avgDuration),
      min: minDuration,
      max: maxDuration,
      p95: durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)],
      status: iterations[0].status,
      cacheControl: iterations[0].cacheControl,
      etag: iterations[0].etag,
      compressed: iterations[0].compressed,
    };

    results.push(summary);

    const statusEmoji = summary.avg < 200 ? "✅" : summary.avg < 500 ? "⚠️" : "❌";
    console.log(`  ${statusEmoji} Avg: ${summary.avg}ms | Min: ${summary.min}ms | Max: ${summary.max}ms | P95: ${summary.p95}ms`);
    console.log(`     Cache: ${summary.cacheControl || "none"} | ETag: ${summary.etag} | Compressed: ${summary.compressed}\n`);
  }

  // Summary
  console.log("\n📊 Performance Summary");
  console.log("======================");

  const allAvgs = results.map((r) => r.avg);
  const overallAvg = allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length;
  const fastestEndpoint = results.reduce((prev, curr) => (prev.avg < curr.avg ? prev : curr));
  const slowestEndpoint = results.reduce((prev, curr) => (prev.avg > curr.avg ? prev : curr));

  console.log(`Overall Average: ${Math.round(overallAvg)}ms`);
  console.log(`Fastest Endpoint: ${fastestEndpoint.endpoint} (${fastestEndpoint.avg}ms)`);
  console.log(`Slowest Endpoint: ${slowestEndpoint.endpoint} (${slowestEndpoint.avg}ms)`);

  const under200 = results.filter((r) => r.avg < 200).length;
  const under500 = results.filter((r) => r.avg < 500).length;

  console.log(`\n✅ Endpoints under 200ms: ${under200}/${results.length}`);
  console.log(`⚠️  Endpoints under 500ms: ${under500}/${results.length}`);

  if (overallAvg < 200) {
    console.log("\n🎉 Performance target MET: <200ms average response time!");
  } else {
    console.log(`\n⚠️  Performance target NOT MET: ${Math.round(overallAvg)}ms average (target: <200ms)`);
  }

  // Check caching
  const cachedEndpoints = results.filter((r) => r.cacheControl && r.cacheControl !== "none").length;
  console.log(`\n💾 Endpoints with caching: ${cachedEndpoints}/${results.length}`);
  console.log(`🏷️  Endpoints with ETags: ${results.filter((r) => r.etag === "present").length}/${results.length}`);
  console.log(`📦 Endpoints with compression: ${results.filter((r) => r.compressed && r.compressed !== "none").length}/${results.length}`);
}

runPerformanceTests().catch(console.error);
