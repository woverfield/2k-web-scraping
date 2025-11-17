"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { BarChart3, PieChart, Users } from "lucide-react";

export interface TeamStatsProps {
  positionDistribution: Record<string, number>;
  playerCount: number;
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
