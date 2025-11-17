"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getRatingColor } from "@/lib/rating-colors";
import { progressFill } from "@/lib/animations";

export interface AttributeBarProps {
  label: string;
  value: number;
  maxValue?: number;
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function AttributeBar({
  label,
  value,
  maxValue = 100,
  animated = true,
  delay = 0,
  className,
}: AttributeBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const color = getRatingColor(value);

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label and Value Row */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground/80">{label}</span>
        <span
          className="font-semibold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {animated ? (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            variants={progressFill}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.6,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ) : (
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        )}
      </div>
    </div>
  );
}
