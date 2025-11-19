"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { getAttributeColor } from "@/lib/rating-colors";
import { BarChart3, PieChart, Users, Award, TrendingUp, Zap } from "lucide-react";

export interface TeamStatsProps {
  positionDistribution: Record<string, number>;
  playerCount: number;
  className?: string;
}

export interface TeamAttributeAveragesProps {
  attributeAverages: Record<string, { sum: number; count: number; avg: number }>;
  className?: string;
}

export interface TeamBadgeDistributionProps {
  badgeStats: Record<string, { HOF: number; Gold: number; Silver: number; Bronze: number }>;
  className?: string;
}

export interface TeamRatingDistributionProps {
  players: Array<{ overall: number }>;
  className?: string;
}

export function TeamStats({
  positionDistribution,
  playerCount,
  className,
}: TeamStatsProps) {
  // Calculate position percentages
  const positionData = React.useMemo(() => {
    return Object.entries(positionDistribution)
      .map(([position, count]) => ({
        position,
        count,
        percentage: ((count / playerCount) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [positionDistribution, playerCount]);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Position Distribution</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {positionData.map((pos) => (
              <div key={pos.position} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{pos.position}</span>
                  <span className="text-muted-foreground">
                    {pos.count} ({pos.percentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${pos.percentage}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}

            {positionData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No position data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Team Attribute Averages Component
 * Shows the team's average ratings across key attribute categories
 */
export function TeamAttributeAverages({
  attributeAverages,
  className,
}: TeamAttributeAveragesProps) {
  // Group and calculate category averages
  const categoryAverages = React.useMemo(() => {
    const categories: Record<string, { sum: number; count: number }> = {
      "Outside Scoring": { sum: 0, count: 0 },
      "Inside Scoring": { sum: 0, count: 0 },
      "Playmaking": { sum: 0, count: 0 },
      "Defense": { sum: 0, count: 0 },
      "Athleticism": { sum: 0, count: 0 },
      "Rebounding": { sum: 0, count: 0 },
    };

    // Map attribute keys to categories
    const categoryMap: Record<string, string> = {
      outsideScoring: "Outside Scoring",
      insideScoring: "Inside Scoring",
      playmaking: "Playmaking",
      defending: "Defense",
      athleticism: "Athleticism",
      rebounding: "Rebounding",
    };

    Object.entries(attributeAverages).forEach(([key, stat]) => {
      const [category] = key.split(".");
      const mappedCategory = categoryMap[category];
      if (mappedCategory && categories[mappedCategory]) {
        categories[mappedCategory].sum += stat.avg;
        categories[mappedCategory].count += 1;
      }
    });

    return Object.entries(categories)
      .map(([name, data]) => ({
        name,
        avg: data.count > 0 ? Math.round(data.sum / data.count) : 0,
      }))
      .filter((cat) => cat.avg > 0)
      .sort((a, b) => b.avg - a.avg);
  }, [attributeAverages]);

  if (categoryAverages.length === 0) {
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
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Team Attributes</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {categoryAverages.map((cat, index) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span
                    className="font-semibold tabular-nums"
                    style={{ color: getAttributeColor(cat.avg) }}
                  >
                    {cat.avg}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getAttributeColor(cat.avg) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.avg}%` }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Badge tier colors
 */
const BADGE_TIER_COLORS = {
  HOF: {
    bg: "badge-amethyst",
    text: "text-white",
    label: "HOF",
  },
  Gold: {
    bg: "badge-gold",
    text: "text-white",
    label: "Gold",
  },
  Silver: {
    bg: "badge-silver",
    text: "text-white",
    label: "Silver",
  },
  Bronze: {
    bg: "bg-[#c90]",
    text: "text-white",
    label: "Bronze",
  },
} as const;

/**
 * Team Badge Distribution Component
 * Shows total badge counts by tier across the team
 */
export function TeamBadgeDistribution({
  badgeStats,
  className,
}: TeamBadgeDistributionProps) {
  // Calculate total badges by tier
  const tierTotals = React.useMemo(() => {
    const totals = { HOF: 0, Gold: 0, Silver: 0, Bronze: 0 };

    Object.values(badgeStats).forEach((badge) => {
      totals.HOF += badge.HOF;
      totals.Gold += badge.Gold;
      totals.Silver += badge.Silver;
      totals.Bronze += badge.Bronze;
    });

    return totals;
  }, [badgeStats]);

  // Get top badges (most common HOF/Gold badges)
  const topBadges = React.useMemo(() => {
    return Object.entries(badgeStats)
      .map(([name, counts]) => ({
        name,
        total: counts.HOF * 4 + counts.Gold * 3 + counts.Silver * 2 + counts.Bronze,
        hof: counts.HOF,
        gold: counts.Gold,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [badgeStats]);

  const totalBadges = tierTotals.HOF + tierTotals.Gold + tierTotals.Silver + tierTotals.Bronze;

  if (totalBadges === 0) {
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
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Team Badges</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tier Summary */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(tierTotals) as [keyof typeof BADGE_TIER_COLORS, number][]).map(
              ([tier, count]) => (
                <div key={tier} className="text-center">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-full py-1.5 rounded-md text-sm font-bold",
                      BADGE_TIER_COLORS[tier].bg,
                      BADGE_TIER_COLORS[tier].text
                    )}
                  >
                    {count}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {BADGE_TIER_COLORS[tier].label}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Top Badges */}
          {topBadges.length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Top Badges
              </p>
              <div className="space-y-1.5">
                {topBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="truncate flex-1">{badge.name}</span>
                    <div className="flex items-center gap-1 ml-2">
                      {badge.hof > 0 && (
                        <span className="text-purple-500 font-medium">
                          {badge.hof}
                        </span>
                      )}
                      {badge.gold > 0 && (
                        <span className="text-yellow-500 font-medium">
                          {badge.gold}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Team Rating Distribution Component
 * Shows how many players fall into each rating tier
 */
export function TeamRatingDistribution({
  players,
  className,
}: TeamRatingDistributionProps) {
  // Calculate rating tiers
  const ratingTiers = React.useMemo(() => {
    const tiers = [
      { label: "90+", min: 90, max: 100, count: 0, color: "bg-purple-500" },
      { label: "85-89", min: 85, max: 89, count: 0, color: "bg-blue-500" },
      { label: "80-84", min: 80, max: 84, count: 0, color: "bg-green-500" },
      { label: "75-79", min: 75, max: 79, count: 0, color: "bg-yellow-500" },
      { label: "<75", min: 0, max: 74, count: 0, color: "bg-gray-500" },
    ];

    players.forEach((player) => {
      const tier = tiers.find(
        (t) => player.overall >= t.min && player.overall <= t.max
      );
      if (tier) {
        tier.count++;
      }
    });

    return tiers;
  }, [players]);

  const maxCount = Math.max(...ratingTiers.map((t) => t.count));

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Rating Distribution</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {ratingTiers.map((tier, index) => (
              <div key={tier.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{tier.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {tier.count} {tier.count === 1 ? "player" : "players"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", tier.color)}
                    initial={{ width: 0 }}
                    animate={{
                      width: maxCount > 0 ? `${(tier.count / maxCount) * 100}%` : "0%",
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
