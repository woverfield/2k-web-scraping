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
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelKey="fullLabel"
                />
              }
            />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="lineup1"
              fill="var(--color-lineup1)"
              fillOpacity={isComparison ? 0.5 : 0.6}
              dot={
                !isComparison
                  ? {
                      r: 4,
                      fillOpacity: 1,
                    }
                  : undefined
              }
            />
            {isComparison && (
              <Radar
                dataKey="lineup2"
                fill="var(--color-lineup2)"
                fillOpacity={0.4}
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
