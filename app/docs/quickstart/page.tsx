import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageTabs } from "@/components/language-tabs";
import { ArrowRight } from "lucide-react";

export default function QuickstartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Quickstart</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Get up and running with the NBA 2K Ratings API in under 5 minutes.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-2xl font-bold">1. Get your API key</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            First, you'll need an API key to authenticate your requests. Click the button below to
            get started:
          </p>
          <Button asChild>
            <Link href="/dashboard">Get API Key</Link>
          </Button>
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">2. Make your first request</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            Once you have your API key, you can start making requests. Here's how to fetch a
            player's data:
          </p>
          <LanguageTabs
            examples={{
              javascript: `const response = await fetch(
  'https://canny-kingfisher-472.convex.site/api/players/lebron-james',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);

const data = await response.json();

if (data.success) {
  console.log(data.data.name);          // "LeBron James"
  console.log(data.data.overallRating);  // 97
  console.log(data.data.position);       // "SF"
  console.log(data.data.team);           // "Los Angeles Lakers"
}`,
              python: `import requests

response = requests.get(
    'https://canny-kingfisher-472.convex.site/api/players/lebron-james',
    headers={'X-API-Key': 'your_api_key_here'}
)

data = response.json()

if data['success']:
    print(data['data']['name'])          # "LeBron James"
    print(data['data']['overallRating'])  # 97
    print(data['data']['position'])       # "SF"
    print(data['data']['team'])           # "Los Angeles Lakers"`,
              curl: `curl -X GET \\
  'https://canny-kingfisher-472.convex.site/api/players/lebron-james' \\
  -H 'X-API-Key: your_api_key_here'`,
            }}
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">3. Understanding the response</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            All API responses follow a consistent structure:
          </p>
          <LanguageTabs
            examples={{
              javascript: `{
  "success": true,
  "data": {
    "_id": "abc123",
    "name": "LeBron James",
    "slug": "lebron-james",
    "team": "Los Angeles Lakers",
    "teamType": "curr",
    "overallRating": 97,
    "position": "SF",
    "height": "6'9\\"",
    "weight": "250 lbs",
    "playerImage": "https://...",
    "teamImage": "https://...",
    // Detailed attributes
    "closeShot": 92,
    "midRangeShot": 88,
    "threePointShot": 44,
    // ... 40+ more attributes
    "lastUpdated": "2025-01-15T00:00:00.000Z"
  }
}`,
            }}
          />
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-bold">4. Try other endpoints</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            Now that you've made your first request, explore other endpoints:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                <Link
                  href="/docs/endpoints/players"
                  className="font-medium text-primary hover:underline"
                >
                  GET /api/players
                </Link>{" "}
                - List all players with filtering
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                <Link
                  href="/docs/endpoints/teams"
                  className="font-medium text-primary hover:underline"
                >
                  GET /api/teams
                </Link>{" "}
                - Get all team rosters
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                <Link
                  href="/docs/endpoints/search"
                  className="font-medium text-primary hover:underline"
                >
                  GET /api/players/search
                </Link>{" "}
                - Search for players by name
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Next steps</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                Learn about{" "}
                <Link
                  href="/docs/authentication"
                  className="font-medium text-primary hover:underline"
                >
                  authentication best practices
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                Explore the full{" "}
                <Link
                  href="/docs/endpoints/players"
                  className="font-medium text-primary hover:underline"
                >
                  API reference
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                Understand{" "}
                <Link
                  href="/docs/rate-limits"
                  className="font-medium text-primary hover:underline"
                >
                  rate limits
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
