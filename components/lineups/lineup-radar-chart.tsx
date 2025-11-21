"use client";

import * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { calculateRadarStats, avg } from "@/lib/player-stats";
import type { Player, RadarChartData } from "@/types/player";

interface LineupRadarChartProps {
  lineup1: Player[];
  lineup2?: Player[];
  lineup1Name?: string;
  lineup2Name?: string;
}

interface ChartDataPoint {
  category: string;
  fullLabel: string;
  lineup1: number;
  lineup2?: number;
}

const CATEGORIES = [
  { key: "overall", label: "OVR", fullLabel: "Overall" },
  { key: "insideScoring", label: "INS", fullLabel: "Inside Scoring" },
  { key: "outsideScoring", label: "OUT", fullLabel: "Outside Scoring" },
  { key: "playmaking", label: "PLY", fullLabel: "Playmaking" },
  { key: "athleticism", label: "ATH", fullLabel: "Athleticism" },
  { key: "defending", label: "DEF", fullLabel: "Defending" },
  { key: "rebounding", label: "REB", fullLabel: "Rebounding" },
];

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
      {dataPoint?.lineup1 !== undefined && (
        <text
          x={0}
          y={0}
          dy={10}
          textAnchor={textAnchor}
          className="fill-foreground text-[11px] font-bold"
        >
          {dataPoint.lineup1}
        </text>
      )}
    </g>
  );
};

// Custom tooltip to show full category names
const CustomTooltip = ({ active, payload, lineup1Name, lineup2Name }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {data.fullLabel}
            </span>
            <div className="flex flex-col gap-1 mt-1">
              {payload.map((entry: any, index: number) => {
                const displayName = entry.dataKey === "lineup1" ? lineup1Name : lineup2Name;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {displayName}:
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {entry.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

function calculateLineupStats(players: Player[]): RadarChartData {
  if (players.length === 0) {
    return {
      overall: 0,
      insideScoring: 0,
      outsideScoring: 0,
      athleticism: 0,
      playmaking: 0,
      rebounding: 0,
      defending: 0,
    };
  }

  const allStats = players.map((p) => calculateRadarStats(p));

  return {
    overall: avg(allStats.map((s) => s.overall)),
    insideScoring: avg(allStats.map((s) => s.insideScoring)),
    outsideScoring: avg(allStats.map((s) => s.outsideScoring)),
    athleticism: avg(allStats.map((s) => s.athleticism)),
    playmaking: avg(allStats.map((s) => s.playmaking)),
    rebounding: avg(allStats.map((s) => s.rebounding)),
    defending: avg(allStats.map((s) => s.defending)),
  };
}

export function LineupRadarChart({
  lineup1,
  lineup2,
  lineup1Name = "Lineup 1",
  lineup2Name = "Lineup 2",
}: LineupRadarChartProps) {
  const lineup1Stats = calculateLineupStats(lineup1);
  const lineup2Stats = lineup2 ? calculateLineupStats(lineup2) : undefined;

  const chartData: ChartDataPoint[] = CATEGORIES.map((cat) => ({
    category: cat.label,
    fullLabel: cat.fullLabel,
    lineup1: lineup1Stats[cat.key as keyof RadarChartData],
    lineup2: lineup2Stats?.[cat.key as keyof RadarChartData],
  }));

  // Single lineup config
  const singleChartConfig = {
    lineup1: {
      label: lineup1Name,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // Comparison config
  const comparisonChartConfig = {
    lineup1: {
      label: lineup1Name,
      color: "var(--chart-1)",
    },
    lineup2: {
      label: lineup2Name,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const chartConfig = lineup2 ? comparisonChartConfig : singleChartConfig;
  const isComparison = !!lineup2;

  if (lineup1.length === 0 && (!lineup2 || lineup2.length === 0)) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Team Ratings</CardTitle>
          <CardDescription>
            Add players to see team statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No players added yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>
          {isComparison ? "Lineup Comparison" : "Team Ratings"}
        </CardTitle>
        <CardDescription>
          {isComparison
            ? `Comparing ${lineup1.length} vs ${lineup2?.length} players`
            : `Average ratings for ${lineup1.length} player${lineup1.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: isComparison ? -40 : 0,
              bottom: isComparison ? -10 : 0,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip lineup1Name={lineup1Name} lineup2Name={lineup2Name} />}
            />
            <PolarAngleAxis
              dataKey="category"
              tick={<CustomTick chartData={chartData} />}
              tickSize={15}
            />
            <PolarGrid />
            <Radar
              dataKey="lineup1"
              fill="var(--color-lineup1)"
              fillOpacity={0.7}
              stroke="var(--color-lineup1)"
              strokeWidth={2}
              dot={{ fill: "var(--color-lineup1)", r: 4 }}
            />
            {isComparison && (
              <Radar
                dataKey="lineup2"
                fill="var(--color-lineup2)"
                fillOpacity={0.7}
                stroke="var(--color-lineup2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-lineup2)", r: 4 }}
              />
            )}
            {isComparison && (
              <ChartLegend
                className="mt-8"
                content={<ChartLegendContent />}
              />
            )}
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
