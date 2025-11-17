"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { calculateRadarStats } from "@/lib/player-stats";
import type { Player } from "@/types/player";

export interface PlayerRadarChartProps {
  player: Player;
  className?: string;
}

export function PlayerRadarChart({ player, className }: PlayerRadarChartProps) {
  const radarData = React.useMemo(() => calculateRadarStats(player), [player]);

  // Transform data for recharts format
  const chartData = React.useMemo(() => {
    return [
      {
        category: "Overall",
        value: radarData.overall,
        fullMark: 99,
      },
      {
        category: "Inside Scoring",
        value: radarData.insideScoring,
        fullMark: 99,
      },
      {
        category: "Outside Scoring",
        value: radarData.outsideScoring,
        fullMark: 99,
      },
      {
        category: "Athleticism",
        value: radarData.athleticism,
        fullMark: 99,
      },
      {
        category: "Playmaking",
        value: radarData.playmaking,
        fullMark: 99,
      },
      {
        category: "Rebounding",
        value: radarData.rebounding,
        fullMark: 99,
      },
      {
        category: "Defending",
        value: radarData.defending,
        fullMark: 99,
      },
    ];
  }, [radarData]);

  // Chart config for shadcn - using CSS variable pattern for theme compatibility
  const chartConfig = {
    value: {
      label: "Rating",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <CardTitle>Player Ratings</CardTitle>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]"
          >
            <RechartsRadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="category" />
              <PolarGrid />
              <Radar
                dataKey="value"
                fill="var(--color-value)"
                fillOpacity={0.6}
              />
            </RechartsRadarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
