"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAttributeColor } from "@/lib/rating-colors";
import { progressFill } from "@/lib/animations";

export interface AttributeBarProps {
  label: string;
  value: number;
  maxValue?: number;
  animated?: boolean;
  delay?: number;
  className?: string;
  positionAverage?: number; // Position average for comparison
}

export function AttributeBar({
  label,
  value,
  maxValue = 100,
  animated = true,
  delay = 0,
  className,
  positionAverage,
}: AttributeBarProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const percentage = Math.min((value / maxValue) * 100, 100);
  const color = getAttributeColor(value);

  // Calculate position average percentage if provided
  const avgPercentage = positionAverage !== undefined
    ? Math.min((positionAverage / maxValue) * 100, 100)
    : undefined;

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
      <div
        className="relative h-1.5 w-full overflow-visible rounded-full bg-muted"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {animated ? (
          <motion.div
            className="h-full rounded-full origin-left"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
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

        {/* Position Average Line Marker */}
        {avgPercentage !== undefined && (
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 pointer-events-none bg-slate-600 dark:bg-white"
            style={{
              left: `${avgPercentage}%`,
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: isHovered ? 0.9 : 0.4 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tooltip */}
            {isHovered && (
              <motion.div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded whitespace-nowrap pointer-events-none"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                Avg: {positionAverage}
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-slate-100" />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
