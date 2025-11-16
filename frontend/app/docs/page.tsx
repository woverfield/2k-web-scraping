import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Zap, Shield } from "lucide-react";

export default function DocsIntroduction() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Introduction</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Welcome to the NBA 2K Ratings API documentation. Access comprehensive NBA 2K player data
          through a simple REST API.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Database className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-base">Comprehensive Data</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Access 40+ player attributes, badges, team rosters, and historical data
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-base">Fast & Reliable</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              159ms average response time with intelligent caching and 99%+ uptime
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-base">Secure</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              API key authentication with rate limiting to protect against abuse
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What is this API?</h2>
        <p className="text-slate-600 dark:text-slate-400">
          The NBA 2K Ratings API provides programmatic access to player ratings and statistics from
          the NBA 2K video game series. Our API scrapes data from{" "}
          <a
            href="https://2kratings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            2kratings.com
          </a>{" "}
          and makes it available through a clean REST interface.
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          Whether you're building a basketball game, creating a Discord bot, or analyzing player
          stats, this API gives you instant access to detailed NBA 2K player data.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What data is available?</h2>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Player Attributes:</strong> Overall rating, position, height, weight,
              archetype, and 40+ individual stats (shooting, finishing, playmaking, defense,
              athleticism)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Badges:</strong> Complete badge information with tiers (Bronze, Silver, Gold,
              Hall of Fame, Legend)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Team Rosters:</strong> Current NBA teams, classic teams, and all-time teams
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Player Images:</strong> Headshot URLs for each player
            </span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Who is this for?</h2>
        <p className="text-slate-600 dark:text-slate-400">
          This API is designed for developers, data analysts, and basketball gaming enthusiasts who
          need programmatic access to NBA 2K data:
        </p>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>Indie game developers building basketball games or fantasy tools</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>Discord bot creators wanting to add NBA 2K stats commands</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>Data analysts researching player ratings and trends</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>Web developers creating 2K-related websites and tools</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-4 border-t pt-8">
        <Button asChild>
          <Link href="/docs/quickstart">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs/endpoints/players">View API Reference</Link>
        </Button>
      </div>
    </div>
  );
}
