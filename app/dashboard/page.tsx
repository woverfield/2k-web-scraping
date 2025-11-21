"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ApiKeyDisplay } from "@/components/api-key-display";
import { RegistrationDialog } from "@/components/registration-dialog";
import { QuickActionCard } from "@/components/quick-action-card";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/ui/game-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Activity,
  AlertCircle,
  BookOpen,
  Code2,
  Github,
  TrendingUp,
  SlidersHorizontal,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { API_KEY_STORAGE_KEY } from "@/lib/constants";
import { parseEndpointToDeepLink } from "@/lib/deep-link-parser";

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const regenerateApiKey = useMutation(api.apiKeys.regenerateApiKey);

  // Get stats using the API key
  const stats = useQuery(
    api.apiKeys.getApiKeyStats,
    apiKey ? { key: apiKey } : "skip"
  );

  useEffect(() => {
    setIsMounted(true);
    // Check for API key in localStorage
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowRegistration(true);
    }
  }, []);

  const handleRegistrationSuccess = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowRegistration(false);
  };

  const handleRegenerate = async () => {
    if (!apiKey) return;

    const result = await regenerateApiKey({ oldKey: apiKey });
    const newKey = result.apiKey;

    // Update localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
    setApiKey(newKey);
  };

  const getStatusColor = (statusCode: number): "default" | "secondary" | "destructive" | "outline" => {
    if (statusCode >= 200 && statusCode < 300) return "default";
    if (statusCode >= 400 && statusCode < 500) return "outline";
    if (statusCode >= 500) return "destructive";
    return "secondary";
  };

  const getMethodColor = (method: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (method.toUpperCase()) {
      case "GET":
        return "default";
      case "POST":
        return "secondary";
      case "PUT":
      case "PATCH":
        return "outline";
      case "DELETE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const calculateTimeUntilReset = (resetAt: string) => {
    const reset = new Date(resetAt);
    const now = new Date();
    const diff = reset.getTime() - now.getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 1) return "< 1 minute";
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
  };

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <>
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Welcome to NBA 2K API</h1>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Create a free API key to get started
            </p>
            <Button onClick={() => setShowRegistration(true)} size="lg">
              Get Your API Key
            </Button>
          </div>
        </div>

        <RegistrationDialog
          open={!apiKey || showRegistration}
          onOpenChange={setShowRegistration}
          onSuccess={handleRegistrationSuccess}
        />
      </>
    );
  }

  // Show loading state while fetching stats
  if (apiKey && (!stats || !stats.apiKey)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-48" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // If we have an API key but no stats, something went wrong
  if (apiKey && stats === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please check your API key or try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // TypeScript guard: stats is guaranteed to be defined here
  if (!stats) {
    return null;
  }

  const progressPercentage = Math.min(
    100,
    (stats.requestCount / stats.rateLimit) * 100
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold font-rajdhani tracking-tight">API Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 font-rajdhani tracking-wide text-lg">
            Try the playground to explore data visually, then use the API to integrate into your application
          </p>
        </div>

        <div className="space-y-6">
          {/* API Key Section */}
          <GameCard showCorners={false} hoverEffect={false}>
            <CardHeader>
              <CardTitle className="font-rajdhani text-2xl">API Key</CardTitle>
              <CardDescription>
                Use this key to authenticate your API requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyDisplay
                apiKey={apiKey}
                createdAt={stats.apiKey.createdAt}
                onRegenerate={handleRegenerate}
              />
            </CardContent>
          </GameCard>

          {/* Usage Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <GameCard showCorners={false} hoverEffect={false}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium font-rajdhani text-lg">
                  <Activity className="h-4 w-4 text-primary" />
                  Requests This Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-rajdhani">
                    {stats.requestCount}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    / {stats.rateLimit}
                  </span>
                </div>
                <Progress value={progressPercentage} className="mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {stats.requestsRemaining} requests remaining
                </p>
              </CardContent>
            </GameCard>

            <GameCard showCorners={false} hoverEffect={false}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium font-rajdhani text-lg">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold font-rajdhani">
                  {stats.totalRequests.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All-time API requests
                </p>
              </CardContent>
            </GameCard>

            <GameCard showCorners={false} hoverEffect={false}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium font-rajdhani text-lg">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Rate Limit Reset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold font-rajdhani">
                  {calculateTimeUntilReset(stats.resetAt)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Until limit resets
                </p>
              </CardContent>
            </GameCard>
          </div>

          {/* Recent Requests */}
          <GameCard showCorners={false} hoverEffect={false}>
            <CardHeader>
              <CardTitle className="font-rajdhani text-2xl">Recent Requests</CardTitle>
              <CardDescription>
                Your last 10 API requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentRequests.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No requests yet. Start using your API key to see request
                    logs here.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">
                          Response Time
                        </TableHead>
                        <TableHead className="text-right">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentRequests.map((request, index) => {
                        const deepLink = parseEndpointToDeepLink(request.endpoint);
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-sm">
                              {formatTimestamp(request.timestamp)}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {request.endpoint}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getMethodColor(request.method)}>
                                {request.method}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(request.statusCode)}>
                                {request.statusCode}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {request.responseTime}ms
                            </TableCell>
                            <TableCell className="text-right">
                              {deepLink.available ? (
                                <Link
                                  href={deepLink.href}
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  {deepLink.label}
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </GameCard>

          {/* Explore Your Data */}
          <GameCard showCorners={false} hoverEffect={false}>
            <CardHeader className="pb-4">
              <CardTitle className="font-rajdhani text-2xl">Explore Your Data</CardTitle>
              <CardDescription>
                Preview what your API returns with our interactive tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                {/* Player Playground Card */}
                <GameCard 
                  variant="hollow" 
                  className="space-y-3 p-4 bg-white/50 dark:bg-white/5"
                  hoverEffect={true}
                  showCorners={false}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <SlidersHorizontal className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold font-rajdhani text-lg">Player Playground</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter through all players interactively
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/playground">
                      Explore Players
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </GameCard>

                {/* Team Browser Card */}
                <GameCard 
                  variant="hollow" 
                  className="space-y-3 p-4 bg-white/50 dark:bg-white/5"
                  hoverEffect={true}
                  showCorners={false}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold font-rajdhani text-lg">Team Browser</h4>
                  <p className="text-sm text-muted-foreground">
                    View rosters and team statistics
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/teams">
                      Browse Teams
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </GameCard>

                {/* API Docs Card */}
                <GameCard 
                  variant="hollow" 
                  className="space-y-3 p-4 bg-white/50 dark:bg-white/5"
                  hoverEffect={true}
                  showCorners={false}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold font-rajdhani text-lg">API Docs</h4>
                  <p className="text-sm text-muted-foreground">
                    Reference and code examples
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/docs">
                      View Docs
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </GameCard>
              </div>
            </CardContent>
          </GameCard>
        </div>
      </div>

      <RegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
}
