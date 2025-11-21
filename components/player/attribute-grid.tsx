"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeBar } from "@/components/ui/attribute-bar";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { formatAttributeName, getAttributeCategory } from "@/lib/player-stats";
import type { Player, PlayerAttributes, PositionAverages } from "@/types/player";

export interface AttributeGridProps {
  player: Player;
  className?: string;
  positionAverages?: PositionAverages;
}

/**
 * Groups attributes by category for better organization (matches radar chart categories)
 */
function groupAttributesByCategory(attributes: PlayerAttributes) {
  const categories: Record<string, Array<{ name: string; value: number }>> = {
    "Outside Scoring": [],
    "Inside Scoring": [],
    "Playmaking": [],
    "Athleticism": [],
    "Defending": [],
    "Rebounding": [],
    "Other": [],
  };

  // Category name mapping from camelCase to display names
  const categoryMap: Record<string, string> = {
    outsideScoring: "Outside Scoring",
    insideScoring: "Inside Scoring",
    playmaking: "Playmaking",
    athleticism: "Athleticism",
    defending: "Defending",
    rebounding: "Rebounding",
    other: "Other",
  };

  // Map all attributes to their categories
  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === "number") {
      const rawCategory = getAttributeCategory(key);
      const category = categoryMap[rawCategory] || "Other";

      if (categories[category]) {
        categories[category].push({
          name: formatAttributeName(key),
          value,
        });
      }
    }
  });

  // Remove empty categories
  return Object.entries(categories).filter(([_, attrs]) => attrs.length > 0);
}

export function AttributeGrid({ player, className, positionAverages }: AttributeGridProps) {
  const groupedAttributes = React.useMemo(() => {
    if (!player.attributes) return [];
    return groupAttributesByCategory(player.attributes);
  }, [player.attributes]);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <CardTitle>All Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          {groupedAttributes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attribute data available for this player
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedAttributes.map(([category, attributes], categoryIndex) => (
              <motion.div
                key={category}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-2"
              >
                {/* Category Header */}
                <h3 className="text-base font-semibold tracking-tight">
                  {category}
                </h3>

                {/* Attributes in this category */}
                <div className="space-y-2">
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
                        delay={categoryIndex * 0.1 + index * 0.03}
                        positionAverage={positionAvg}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
