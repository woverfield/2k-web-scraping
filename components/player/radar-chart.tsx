"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
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

// Custom tick component for proper theming with label and value
const CustomTick = (props: any) => {
  const { payload, x, y, textAnchor, index } = props;

  if (!payload) return null;

  // Access the complete data point from the chart data using index
  const chartData = props.chartData;
  const dataPoint = chartData?.[index];

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Category label */}
      <text
        x={0}
        y={0}
        dy={-2}
        textAnchor={textAnchor}
        className="fill-muted-foreground text-[10px] font-medium"
      >
        {payload.value}
      </text>
      {/* Rating value */}
      {dataPoint?.value !== undefined && (
        <text
          x={0}
          y={0}
          dy={10}
          textAnchor={textAnchor}
          className="fill-foreground text-[11px] font-bold"
        >
          {dataPoint.value}
        </text>
      )}
    </g>
  );
};

// Custom tooltip to show full category names
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {data.fullLabel}
            </span>
            <span className="font-bold text-foreground">
              {data.value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function PlayerRadarChart({ player, className }: PlayerRadarChartProps) {
  const radarData = React.useMemo(() => calculateRadarStats(player), [player]);

  // Transform data for recharts format with abbreviated labels
  const chartData = React.useMemo(() => {
    return [
      {
        category: "OVR",
        fullLabel: "Overall",
        value: radarData.overall,
        fullMark: 99,
      },
      {
        category: "INS",
        fullLabel: "Inside Scoring",
        value: radarData.insideScoring,
        fullMark: 99,
      },
      {
        category: "OUT",
        fullLabel: "Outside Scoring",
        value: radarData.outsideScoring,
        fullMark: 99,
      },
      {
        category: "ATH",
        fullLabel: "Athleticism",
        value: radarData.athleticism,
        fullMark: 99,
      },
      {
        category: "PLY",
        fullLabel: "Playmaking",
        value: radarData.playmaking,
        fullMark: 99,
      },
      {
        category: "REB",
        fullLabel: "Rebounding",
        value: radarData.rebounding,
        fullMark: 99,
      },
      {
        category: "DEF",
        fullLabel: "Defending",
        value: radarData.defending,
        fullMark: 99,
      },
    ];
  }, [radarData]);

  // Chart config - vibrant primary color
  const chartConfig = {
    value: {
      label: "Rating",
      color: "#6366f1", // Indigo-500 as fallback
    },
  } satisfies ChartConfig;

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
      style={{
        "--color-value": "oklch(var(--primary))",
        "--color-label": "oklch(var(--foreground))",
      } as React.CSSProperties}
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full h-52"
      >
        <RechartsRadarChart data={chartData} >
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <PolarAngleAxis
            dataKey="category"
            tick={<CustomTick chartData={chartData} />}
            tickSize={15}
          />
          <PolarGrid />
          <Radar
            dataKey="value"
            fill="var(--color-value)"
            fillOpacity={0.7}
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ fill: "var(--color-value)", r: 4 }}
          />
        </RechartsRadarChart>
      </ChartContainer>
    </motion.div>
  );
}
