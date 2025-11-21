"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttributeBar } from "@/components/ui/attribute-bar";
import { RatingBadge } from "@/components/ui/rating-badge";
import { cn } from "@/lib/utils";
import { formatAttributeName, getAttributeCategory, getPrimaryPosition } from "@/lib/player-stats";
import { usePositionAverages } from "@/hooks/use-position-averages";
import { User, X } from "lucide-react";
import type { Player, PlayerAttributes, PlayerBadges } from "@/types/player";
import Image from "next/image";

interface PlayerInfoModalProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Badge tier colors following NBA 2K MyTeam style
 */
const TIER_COLORS = {
  HOF: {
    bg: "badge-amethyst",
    text: "text-white",
    border: "border-purple-600",
    label: "Hall of Fame",
  },
  Gold: {
    bg: "badge-gold",
    text: "text-white",
    border: "border-yellow-600",
    label: "Gold",
  },
  Silver: {
    bg: "badge-silver",
    text: "text-white",
    border: "border-slate-500",
    label: "Silver",
  },
  Bronze: {
    bg: "bg-[#c90]",
    text: "text-white",
    border: "border-[#c90]",
    label: "Bronze",
  },
} as const;

type BadgeTier = keyof typeof TIER_COLORS;

/**
 * Groups attributes by category
 */
function groupAttributesByCategory(attributes: PlayerAttributes) {
  const categories: Record<string, Array<{ name: string; value: number }>> = {
    "Outside Scoring": [],
    "Inside Scoring": [],
    "Playmaking": [],
    "Athleticism": [],
    "Defending": [],
    "Rebounding": [],
  };

  const categoryMap: Record<string, string> = {
    outsideScoring: "Outside Scoring",
    insideScoring: "Inside Scoring",
    playmaking: "Playmaking",
    athleticism: "Athleticism",
    defending: "Defending",
    rebounding: "Rebounding",
  };

  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === "number") {
      const rawCategory = getAttributeCategory(key);
      const category = categoryMap[rawCategory];
      if (category && categories[category]) {
        categories[category].push({
          name: formatAttributeName(key),
          value,
        });
      }
    }
  });

  return Object.entries(categories).filter(([_, attrs]) => attrs.length > 0);
}


/**
 * Organize badges by tier
 */
function organizeBadgesByTier(badges: PlayerBadges) {
  const byTier: Record<BadgeTier, Array<{ name: string; category: string }>> = {
    HOF: [],
    Gold: [],
    Silver: [],
    Bronze: [],
  };

  if (badges.list && Array.isArray(badges.list)) {
    const seen = new Set<string>();

    badges.list.forEach((badge) => {
      const key = badge.name.toLowerCase().trim();
      if (seen.has(key)) return;
      seen.add(key);

      const tierUpper = badge.tier.toUpperCase();
      let tierKey: BadgeTier;

      if (tierUpper === "HOF" || tierUpper === "HALL OF FAME") {
        tierKey = "HOF";
      } else if (tierUpper === "GOLD") {
        tierKey = "Gold";
      } else if (tierUpper === "SILVER") {
        tierKey = "Silver";
      } else {
        tierKey = "Bronze";
      }

      byTier[tierKey].push({
        name: badge.name,
        category: badge.category || "Uncategorized",
      });
    });
  }

  return byTier;
}

export function PlayerInfoModal({ player, open, onOpenChange }: PlayerInfoModalProps) {
  const [selectedTier, setSelectedTier] = React.useState<BadgeTier | "All">("All");

  // Get position averages for comparison
  const primaryPosition = player ? getPrimaryPosition(player.positions) : undefined;
  const positionAverages = usePositionAverages(primaryPosition);

  // Reset tier filter when player changes
  React.useEffect(() => {
    setSelectedTier("All");
  }, [player]);

  if (!player) return null;

  const groupedAttributes = player.attributes
    ? groupAttributesByCategory(player.attributes)
    : [];

  const badgesByTier = player.badges
    ? organizeBadgesByTier(player.badges)
    : { HOF: [], Gold: [], Silver: [], Bronze: [] };

  const tierCounts = {
    HOF: badgesByTier.HOF.length,
    Gold: badgesByTier.Gold.length,
    Silver: badgesByTier.Silver.length,
    Bronze: badgesByTier.Bronze.length,
  };

  const totalBadges = Object.values(tierCounts).reduce((sum, count) => sum + count, 0);

  // Filter badges based on selected tier
  const filteredBadges = selectedTier === "All"
    ? badgesByTier
    : { [selectedTier]: badgesByTier[selectedTier] } as Record<BadgeTier, Array<{ name: string; category: string }>>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="p-4 pr-12 pb-0 space-y-0">
          <div className="flex items-start gap-4">
            {/* Player Image */}
            <div className="relative h-28 w-28 shrink-0 rounded-lg overflow-hidden bg-muted">
              {player.playerImage ? (
                <Image
                  src={player.playerImage}
                  alt={player.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-14 w-14 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <DialogTitle className="text-xl font-bold truncate">
                    {player.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {player.team}
                  </p>
                </div>
                <RatingBadge rating={player.overall} size="lg" showTier />
              </div>

              {/* Positions & Archetype */}
              <div className="flex flex-wrap items-center gap-2">
                {player.positions?.map((pos) => (
                  <Badge key={pos} variant="secondary" className="text-xs">
                    {pos}
                  </Badge>
                ))}
                {player.archetype && (
                  <Badge variant="secondary" className="text-xs">
                    {player.archetype}
                  </Badge>
                )}
                {player.build && (
                  <Badge variant="secondary" className="text-xs">
                    {player.build}
                  </Badge>
                )}
              </div>

              {/* Physical Attributes */}
              {(player.height || player.weight) && (
                <p className="text-xs text-muted-foreground">
                  {[player.height, player.weight].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>

        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-280px)]">
          <div className="p-4 space-y-6">
            {/* Attributes Section */}
            {groupedAttributes.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-3">All Attributes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedAttributes.map(([category, attributes], categoryIndex) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">
                        {category}
                      </h4>
                      <div className="space-y-1.5">
                        {attributes.map((attr, index) => {
                          // Find the camelCase key for this attribute
                          const attrKey = Object.keys(player.attributes || {}).find(
                            key => formatAttributeName(key) === attr.name
                          );
                          const positionAvg = attrKey && typeof positionAverages?.attributes[attrKey] === 'number'
                            ? positionAverages.attributes[attrKey]
                            : undefined;

                          return (
                            <AttributeBar
                              key={attr.name}
                              label={attr.name}
                              value={attr.value}
                              maxValue={99}
                              animated
                              delay={categoryIndex * 0.05 + index * 0.02}
                              positionAverage={positionAvg}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Badges Section */}
            {totalBadges > 0 && (
              <section>
                <h3 className="text-sm font-semibold mb-3">Badges</h3>

                {/* Tier Filter Buttons */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Button
                    variant={selectedTier === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTier("All")}
                    className="h-7 text-xs font-medium"
                  >
                    All
                    <span className="ml-1 opacity-70">({totalBadges})</span>
                  </Button>

                  {(Object.keys(TIER_COLORS) as BadgeTier[]).map((tier) => {
                    const count = tierCounts[tier];
                    if (count === 0) return null;

                    const colors = TIER_COLORS[tier];
                    const isSelected = selectedTier === tier;

                    return (
                      <Button
                        key={tier}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTier(tier)}
                        className={cn(
                          "h-7 text-xs font-medium transition-all",
                          isSelected
                            ? tier === "Bronze"
                              ? "!bg-[#c90] !text-white !border-[#c90]"
                              : cn(colors.bg, colors.text, colors.border)
                            : "opacity-60 hover:opacity-100"
                        )}
                      >
                        {tier === "HOF" ? "HOF" : tier}
                        <span className="ml-1 opacity-70">({count})</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Badge Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(filteredBadges).map(([tier, badges]) =>
                    badges.map((badge) => {
                      const tierColors = TIER_COLORS[tier as BadgeTier];
                      return (
                        <Badge
                          key={`${tier}-${badge.name}`}
                          variant="outline"
                          className={cn(
                            "text-xs transition-all",
                            tierColors.bg,
                            tierColors.text,
                            tierColors.border
                          )}
                        >
                          {badge.name}
                        </Badge>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {/* Empty State */}
            {groupedAttributes.length === 0 && totalBadges === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No detailed stats available for this player
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
