"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerItem } from "@/lib/animations";
import { getRatingColor } from "@/lib/rating-colors";
import { getTopThreeStats } from "@/lib/player-stats";
import type { Player } from "@/types/player";

export interface TopStatsProps {
  player: Player;
  rankings?: Array<{ attribute: string; rank: number; total: number }>;
  className?: string;
}

/**
 * Compact top stats display for player header
 * Shows top 3 attributes with optional ranking information
 */
export function TopStats({ player, rankings, className }: TopStatsProps) {
  const topStats = React.useMemo(() => getTopThreeStats(player), [player]);

  if (topStats.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground">
        Top Attributes
      </h3>
      <div className="flex flex-col gap-2">
        {topStats.map((stat, index) => {
          const color = getRatingColor(stat.value);
          const ranking = rankings?.find((r) => r.attribute === stat.name);

          return (
            <motion.div
              key={`${stat.name}-${index}`}
              variants={staggerItem}
              initial="initial"
              animate="animate"
              className="flex items-center justify-between gap-3 rounded-md border bg-card/50 px-3 py-2"
            >
              {/* Attribute name and value */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="text-lg font-bold tabular-nums"
                  style={{ color }}
                >
                  {stat.value}
                </span>
                <span className="text-sm font-medium truncate">
                  {stat.label}
                </span>
              </div>

              {/* Ranking badge */}
              {ranking && (
                <div className="shrink-0 rounded-md bg-muted px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{ranking.rank}
                    <span className="opacity-60"> / {ranking.total}</span>
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
