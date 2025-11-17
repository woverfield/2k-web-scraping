"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeBar } from "@/components/ui/attribute-bar";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { formatAttributeName, getAttributeCategory } from "@/lib/player-stats";
import type { Player, PlayerAttributes } from "@/types/player";

export interface AttributeGridProps {
  player: Player;
  className?: string;
}

/**
 * Groups attributes by category for better organization
 */
function groupAttributesByCategory(attributes: PlayerAttributes) {
  const categories: Record<string, Array<{ name: string; value: number }>> = {
    Shooting: [],
    Playmaking: [],
    Defense: [],
    Athleticism: [],
    Other: [],
  };

  // Map all attributes to their categories
  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === "number") {
      const rawCategory = getAttributeCategory(key);
      // Capitalize first letter to match our categories object
      const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

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

export function AttributeGrid({ player, className }: AttributeGridProps) {
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
                  {attributes.map((attr, index) => (
                    <AttributeBar
                      key={attr.name}
                      label={attr.name}
                      value={attr.value}
                      maxValue={99}
                      animated
                      delay={categoryIndex * 0.1 + index * 0.03}
                    />
                  ))}
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
