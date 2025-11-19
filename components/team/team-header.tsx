"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeIn, slideUp } from "@/lib/animations";
import { getRatingClasses } from "@/lib/rating-colors";
import { Users, TrendingUp, Trophy, Star, User } from "lucide-react";

export interface TeamHeaderProps {
  team: string;
  teamType: "curr" | "class" | "allt";
  logo?: string;
  playerCount: number;
  avgOverall: number;
  topPlayer?: {
    name: string;
    slug: string;
    overall: number;
    positions?: string[];
    image?: string;
  };
  className?: string;
}

export function TeamHeader({
  team,
  teamType,
  logo,
  playerCount,
  avgOverall,
  topPlayer,
  className,
}: TeamHeaderProps) {
  const teamTypeLabel =
    teamType === "curr"
      ? "Current Team"
      : teamType === "class"
      ? "Classic Team"
      : "All-Time Team";

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Team Logo */}
            {logo && (
              <motion.div
                variants={slideUp}
                className="relative mx-auto h-32 w-32 shrink-0 lg:h-40 lg:w-40"
              >
                <Image
                  src={logo}
                  alt={team}
                  fill
                  className="rounded-lg object-contain"
                />
              </motion.div>
            )}

            {/* Team Info */}
            <div className="flex-1 space-y-4 min-w-0">
              <motion.div variants={slideUp}>
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  {team}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  {teamTypeLabel}
                </p>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={slideUp}
                className="flex flex-wrap gap-4 text-sm"
              >
                <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{playerCount} Players</span>
                </div>

                <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Avg Rating:</span>
                  <div
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-sm",
                      getRatingClasses(avgOverall).bg,
                      getRatingClasses(avgOverall).shadow
                    )}
                  >
                    <span className="font-bold tabular-nums text-white">
                      {avgOverall}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top Player - Right Side */}
            {topPlayer && (
              <motion.div
                variants={slideUp}
                className="shrink-0 lg:w-64"
              >
                <a
                  href={`/players/${topPlayer.slug}?type=${teamType}&team=${encodeURIComponent(team)}`}
                  className="block"
                >
                  <Card className="transition-all hover:shadow-lg hover:border-primary/50">
                    <CardContent className="">
                      <div className="flex items-center gap-1 mb-3">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Top Player
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                          {topPlayer.image ? (
                            <Image
                              src={topPlayer.image}
                              alt={topPlayer.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <User className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {topPlayer.name}
                          </p>
                          {topPlayer.positions && topPlayer.positions.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {topPlayer.positions.join(", ")}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <div
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm",
                                getRatingClasses(topPlayer.overall).bg,
                                getRatingClasses(topPlayer.overall).shadow
                              )}
                            >
                              <span className="text-lg font-bold tabular-nums text-white">
                                {topPlayer.overall}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">OVR</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
