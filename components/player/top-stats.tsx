"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { getRatingColor } from "@/lib/rating-colors";
import { getTopThreeStats } from "@/lib/player-stats";
import { Trophy, TrendingUp, Star } from "lucide-react";
import type { Player } from "@/types/player";

export interface TopStatsProps {
  player: Player;
  className?: string;
}

const ICONS = [Trophy, TrendingUp, Star];

export function TopStats({ player, className }: TopStatsProps) {
  const topStats = React.useMemo(() => getTopThreeStats(player), [player]);

  if (topStats.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <CardTitle>Top Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStats.map((stat, index) => {
              const Icon = ICONS[index];
              const color = getRatingColor(stat.value);
              const rank = index + 1;

              return (
                <motion.div
                  key={`${stat.attribute}-${index}`}
                  variants={staggerItem}
                  initial="initial"
                  animate="animate"
                  className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  {/* Rank Badge */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold"
                    style={{
                      backgroundColor: `${color}20`,
                      color,
                    }}
                  >
                    {rank}
                  </div>

                  {/* Icon */}
                  <div
                    className="rounded-lg p-2"
                    style={{
                      backgroundColor: `${color}15`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color }}
                    />
                  </div>

                  {/* Attribute Name */}
                  <div className="flex-1">
                    <p className="font-semibold">{stat.attribute}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.category}
                    </p>
                  </div>

                  {/* Value */}
                  <div
                    className="text-2xl font-bold tabular-nums"
                    style={{ color }}
                  >
                    {stat.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
