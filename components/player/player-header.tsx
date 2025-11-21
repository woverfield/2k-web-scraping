"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { RatingBadge } from "@/components/ui/rating-badge";
import { PlayerRadarChart } from "@/components/player/radar-chart";
import { cn } from "@/lib/utils";
import { fadeIn, slideUp } from "@/lib/animations";
import { User } from "lucide-react";
import type { Player } from "@/types/player";

export interface PlayerHeaderProps {
  player: Player;
  rankings?: Array<{ attribute: string; rank: number; total: number }>;
  className?: string;
}

export function PlayerHeader({ player, rankings, className }: PlayerHeaderProps) {
  // Build physical stats string
  const physicalStats = React.useMemo(() => {
    const stats = [];
    if (player.height) stats.push(player.height);
    if (player.weight) stats.push(player.weight);
    if (player.wingspan) stats.push(`${player.wingspan} wingspan`);
    return stats.join(" • ");
  }, [player.height, player.weight, player.wingspan]);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn("space-y-6", className)}
    >
      {/* Main Header with Image and Basic Info */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Player Image */}
        <motion.div
          variants={slideUp}
          className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl bg-muted shadow-lg md:mx-0 shrink-0"
        >
          {player.playerImage ? (
            <Image
              src={player.playerImage}
              alt={player.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </motion.div>

        {/* Player Info */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="space-y-2">
            {/* Name and Overall */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {player.name}
              </h1>
              <RatingBadge rating={player.overall} size="lg" showTier />
            </div>

            {/* Team and Positions */}
            <div className="flex flex-wrap items-center gap-3 text-lg text-muted-foreground">
              {player.teamImg && (
                <div className="relative h-8 w-8">
                  <Image
                    src={player.teamImg}
                    alt={player.team}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <a
                href={`/teams/${player.team.toLowerCase().replace(/[^a-z0-9]+/g, "-")}?type=${player.teamType}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {player.team}
              </a>
              {player.positions && player.positions.length > 0 && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{player.positions.join(" / ")}</span>
                </>
              )}
            </div>

            {/* Archetype and Build */}
            {(player.archetype || player.build) && (
              <div className="flex flex-wrap gap-2">
                {player.archetype && (
                  <div className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {player.archetype}
                  </div>
                )}
                {player.build && (
                  <div className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                    {player.build}
                  </div>
                )}
              </div>
            )}

            {/* Physical Stats - Inline */}
            {physicalStats && (
              <div className="text-sm text-muted-foreground">
                {physicalStats}
              </div>
            )}
          </div>
        </div>

        {/* Player Radar Chart - Right Side */}
        <motion.div
          variants={slideUp}
          className="shrink-0 lg:w-96"
        >
          <PlayerRadarChart player={player} />
        </motion.div>
      </div>
    </motion.div>
  );
}
