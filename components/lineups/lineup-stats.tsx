"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { calculateRadarStats, avg } from "@/lib/player-stats";
import { getAttributeColor } from "@/lib/rating-colors";
import type { Player, RadarChartData } from "@/types/player";

interface LineupStatsProps {
  lineup1: Player[];
  lineup2?: Player[];
  lineup1Name?: string;
  lineup2Name?: string;
}

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const STAT_CATEGORIES = [
  { key: "overall", label: "Overall", icon: "star" },
  { key: "insideScoring", label: "Inside", icon: "target" },
  { key: "outsideScoring", label: "Outside", icon: "crosshair" },
  { key: "playmaking", label: "Playmaking", icon: "share" },
  { key: "athleticism", label: "Athleticism", icon: "zap" },
  { key: "defending", label: "Defending", icon: "shield" },
  { key: "rebounding", label: "Rebounding", icon: "refresh" },
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

function getPositionCoverage(players: Player[]): Set<string> {
  const covered = new Set<string>();
  players.forEach((player) => {
    player.positions?.forEach((pos) => covered.add(pos));
  });
  return covered;
}

export function LineupStats({
  lineup1,
  lineup2,
  lineup1Name = "Lineup 1",
  lineup2Name = "Lineup 2",
}: LineupStatsProps) {
  const lineup1Stats = calculateLineupStats(lineup1);
  const lineup2Stats = lineup2 ? calculateLineupStats(lineup2) : undefined;

  const lineup1Positions = getPositionCoverage(lineup1);
  const lineup2Positions = lineup2 ? getPositionCoverage(lineup2) : undefined;

  const isComparison = !!lineup2;

  return (
    <div className="space-y-4">
      {/* Position Coverage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Position Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-4",
            isComparison ? "grid-cols-2" : "grid-cols-1"
          )}>
            {/* Lineup 1 Positions */}
            <div className="space-y-2">
              {isComparison && (
                <p className="text-xs text-muted-foreground font-medium">
                  {lineup1Name}
                </p>
              )}
              <div className="flex gap-2">
                {POSITIONS.map((pos) => {
                  const isCovered = lineup1Positions.has(pos);
                  return (
                    <Badge
                      key={pos}
                      variant={isCovered ? "default" : "outline"}
                      className={cn(
                        "flex-1 justify-center",
                        !isCovered && "text-muted-foreground"
                      )}
                    >
                      {pos}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Lineup 2 Positions */}
            {isComparison && lineup2Positions && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {lineup2Name}
                </p>
                <div className="flex gap-2">
                  {POSITIONS.map((pos) => {
                    const isCovered = lineup2Positions.has(pos);
                    return (
                      <Badge
                        key={pos}
                        variant={isCovered ? "default" : "outline"}
                        className={cn(
                          "flex-1 justify-center",
                          !isCovered && "text-muted-foreground"
                        )}
                      >
                        {pos}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Averages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Category Averages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {STAT_CATEGORIES.map((cat) => {
            const value1 = lineup1Stats[cat.key as keyof RadarChartData];
            const value2 = lineup2Stats?.[cat.key as keyof RadarChartData];
            const winner =
              isComparison && value1 !== value2
                ? value1 > (value2 || 0)
                  ? 1
                  : 2
                : null;

            return (
              <div key={cat.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        winner === 1 && "text-primary",
                        !isComparison && getAttributeColor(value1)
                      )}
                    >
                      {value1}
                    </span>
                    {isComparison && value2 !== undefined && (
                      <>
                        <span className="text-muted-foreground">/</span>
                        <span
                          className={cn(
                            "text-sm font-bold tabular-nums",
                            winner === 2 && "text-primary"
                          )}
                        >
                          {value2}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-1">
                  <Progress
                    value={value1}
                    className="h-2"
                    style={
                      {
                        "--progress-background": isComparison
                          ? "var(--chart-1)"
                          : getAttributeColor(value1),
                      } as React.CSSProperties
                    }
                  />
                  {isComparison && value2 !== undefined && (
                    <Progress
                      value={value2}
                      className="h-2"
                      style={
                        {
                          "--progress-background": "var(--chart-2)",
                        } as React.CSSProperties
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
