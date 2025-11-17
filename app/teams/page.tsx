"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingCard } from "@/components/ui/loading-card";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { getRatingClasses } from "@/lib/rating-colors";
import { Users, Trophy, TrendingUp } from "lucide-react";
import type { TeamType } from "@/types/player";
import { cn } from "@/lib/utils";

export default function TeamsPage() {
  const [teamType, setTeamType] = React.useState<TeamType>("curr");

  const teams = useQuery(api.teams.getAllTeams, { teamType });

  // Loading state
  if (teams === undefined) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="h-6 w-96 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-10 w-full max-w-md animate-pulse rounded bg-muted" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <LoadingCard key={i} variant="player" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight">NBA 2K Teams</h1>
        <p className="text-lg text-muted-foreground">
          Browse teams from current NBA, classic, and all-time rosters
        </p>
      </motion.div>

      {/* Team Type Filter */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.1 }}
      >
        <Tabs value={teamType} onValueChange={(v) => setTeamType(v as TeamType)}>
          <TabsList>
            <TabsTrigger value="curr">Current Teams</TabsTrigger>
            <TabsTrigger value="class">Classic Teams</TabsTrigger>
            <TabsTrigger value="allt">All-Time Teams</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Teams Grid */}
      <motion.div
        key={teamType}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {teams.map((team, index) => (
          <motion.div key={`${team.name}-${team.type}`} variants={staggerItem}>
            <a href={`/teams/${team.slug}?type=${team.type}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {team.logo && (
                        <div className="relative h-12 w-12 shrink-0">
                          <Image
                            src={team.logo}
                            alt={team.name}
                            fill
                            className="rounded-lg object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">{team.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {team.type === "curr"
                            ? "Current"
                            : team.type === "class"
                            ? "Classic"
                            : "All-Time"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Players</p>
                      </div>
                      <p className="text-lg font-bold">{team.playerCount}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Avg Rating</p>
                      </div>
                      <div
                        className={cn(
                          "inline-flex items-center justify-center px-2 py-0.5 rounded-sm",
                          getRatingClasses(team.avgRating).bg,
                          getRatingClasses(team.avgRating).shadow
                        )}
                      >
                        <span className="text-lg font-bold tabular-nums text-white">
                          {team.avgRating}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Top Player</p>
                      </div>
                      <div
                        className={cn(
                          "inline-flex items-center justify-center px-2 py-0.5 rounded-sm",
                          getRatingClasses(team.topPlayerOverall).bg,
                          getRatingClasses(team.topPlayerOverall).shadow
                        )}
                      >
                        <span className="text-lg font-bold tabular-nums text-white">
                          {team.topPlayerOverall}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Team Button */}
                  <Button className="w-full" variant="outline">
                    View Roster
                  </Button>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {teams.length === 0 && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">
            No teams found for this category
          </p>
        </motion.div>
      )}
    </div>
  );
}
