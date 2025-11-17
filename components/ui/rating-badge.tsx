import * as React from "react";
import { cn } from "@/lib/utils";
import { getRatingClasses, getRatingTier } from "@/lib/rating-colors";
import { Badge } from "@/components/ui/badge";

export interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showTier?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-lg px-4 py-2 font-semibold",
};

export function RatingBadge({
  rating,
  size = "md",
  showTier = false,
  className,
}: RatingBadgeProps) {
  const colors = getRatingClasses(rating);
  const tier = showTier ? getRatingTier(rating) : null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "border transition-colors duration-150 rounded-sm px-2 py-0.5",
        colors.bg,
        colors.text,
        colors.border,
        colors.shadow,
        sizeClasses[size],
        className
      )}
    >
      <span className="font-bold tabular-nums">{rating}</span>
      {tier && <span className="ml-1.5 font-normal opacity-80">· {tier}</span>}
    </Badge>
  );
}
