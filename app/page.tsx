"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageTabs } from "@/components/language-tabs";
import { RegistrationDialog } from "@/components/registration-dialog";
import { PlayerSearchDemo } from "@/components/player-search-demo";
import { Skeleton } from "@/components/ui/skeleton";
import { API_KEY_STORAGE_KEY } from "@/lib/constants";
import { Users, Database, TrendingUp } from "lucide-react";

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const router = useRouter();

  // Fetch live stats
  const stats = useQuery(api.players.getStats);

  useEffect(() => {
    // Check if user already has an API key
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    setHasApiKey(!!apiKey);
  }, []);

  const handleGetApiKey = () => {
    if (hasApiKey) {
      router.push("/dashboard");
    } else {
      setShowRegistration(true);
    }
  };

  const handleRegistrationSuccess = (apiKey: string) => {
    setHasApiKey(true);
    setShowRegistration(false);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                Access NBA 2K Player Ratings via REST API
              </h1>
              <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                Get detailed player attributes, team rosters, and historical data from NBA 2K ratings.
                Fast, reliable, and developer-friendly API with built-in caching and authentication.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={handleGetApiKey}>
                  {hasApiKey ? "View Dashboard" : "Get API Key"}
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">Read Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Features</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Everything you need to integrate NBA 2K data into your application
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Player Data</CardTitle>
              <CardDescription>
                Access detailed attributes including overall ratings, positions, archetypes, and 40+ stat categories
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Rosters</CardTitle>
              <CardDescription>
                Query current rosters, classic teams, and all-time teams with filtering by team, position, or rating
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fast Performance</CardTitle>
              <CardDescription>
                159ms average response time with intelligent caching and ETag support for optimal bandwidth usage
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication & Rate Limiting</CardTitle>
              <CardDescription>
                Secure API key authentication with configurable rate limits to protect against abuse
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Updated Data</CardTitle>
              <CardDescription>
                Bi-weekly scraping keeps current player ratings in sync with NBA 2K updates during the season
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RESTful Design</CardTitle>
              <CardDescription>
                Clean, intuitive endpoints with consistent JSON responses and proper HTTP status codes
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Live Search Demo */}
      <section className="border-t bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">Try it Live</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Search our database of NBA 2K players in real-time
            </p>
          </div>
          <div className="mx-auto flex max-w-2xl justify-center">
            <PlayerSearchDemo />
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="border-t bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Quick Start</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Get started in minutes with our simple REST API
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <LanguageTabs
              examples={{
                javascript: `const response = await fetch(
  'https://canny-kingfisher-472.convex.site/api/players/slug/bronny-james',
  {
    headers: {
      'X-API-Key': 'your_api_key_here'
    }
  }
);

const data = await response.json();
console.log(data.data.name); // "Bronny James Jr."
console.log(data.data.overall); // 68`,
                python: `import requests

response = requests.get(
    'https://canny-kingfisher-472.convex.site/api/players/slug/bronny-james',
    headers={'X-API-Key': 'your_api_key_here'}
)

data = response.json()
print(data['data']['name'])  # "Bronny James Jr."
print(data['data']['overall'])  # 68`,
                curl: `curl 'https://canny-kingfisher-472.convex.site/api/players/slug/bronny-james' \\
  -H 'X-API-Key: your_api_key_here'

# Response:
# {
#   "success": true,
#   "data": {
#     "name": "Bronny James Jr.",
#     "overall": 68,
#     "team": "Los Angeles Lakers",
#     ...
#   }
# }`,
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Create your free API key and start building with NBA 2K data today
          </p>
          <Button size="lg" onClick={handleGetApiKey}>
            {hasApiKey ? "Go to Dashboard" : "Get Your API Key"}
          </Button>
        </div>
      </section>
    </div>

    <RegistrationDialog
      open={showRegistration}
      onOpenChange={setShowRegistration}
      onSuccess={handleRegistrationSuccess}
    />
    </>
  );
}
