/**
 * 2K Rating Color Scheme
 * Matches the official NBA 2K rating system colors
 */

export const RATING_COLORS = {
  HIGHEST: "#0a0", // 90-99 - Elite (bright green)
  HIGH: "#070", // 80-89 - Very Good (green)
  MEDIUM: "#c90", // 70-79 - Average (orange)
  LOW: "#d40", // 60-69 - Below Average (dark orange)
  LOWEST: "#900", // 0-59 - Poor (dark red)
} as const;

export const RATING_TIERS = {
  HIGHEST: "Elite",
  HIGH: "Very Good",
  MEDIUM: "Average",
  LOW: "Below Average",
  LOWEST: "Poor",
} as const;

export type RatingTier = keyof typeof RATING_TIERS;

/**
 * Get the color for a rating value
 * @param rating - Rating value (0-100)
 * @returns Hex color code
 */
export function getRatingColor(rating: number): string {
  if (rating >= 90) return RATING_COLORS.HIGHEST;
  if (rating >= 80) return RATING_COLORS.HIGH;
  if (rating >= 70) return RATING_COLORS.MEDIUM;
  if (rating >= 60) return RATING_COLORS.LOW;
  return RATING_COLORS.LOWEST;
}

/**
 * Get the tier name for a rating value
 * @param rating - Rating value (0-100)
 * @returns Tier name (Elite, Very Good, etc.)
 */
export function getRatingTier(rating: number): string {
  if (rating >= 90) return RATING_TIERS.HIGHEST;
  if (rating >= 80) return RATING_TIERS.HIGH;
  if (rating >= 70) return RATING_TIERS.MEDIUM;
  if (rating >= 60) return RATING_TIERS.LOW;
  return RATING_TIERS.LOWEST;
}

/**
 * Get the tier key for a rating value
 * @param rating - Rating value (0-100)
 * @returns Tier key (HIGHEST, HIGH, etc.)
 */
export function getRatingTierKey(rating: number): RatingTier {
  if (rating >= 90) return "HIGHEST";
  if (rating >= 80) return "HIGH";
  if (rating >= 70) return "MEDIUM";
  if (rating >= 60) return "LOW";
  return "LOWEST";
}

/**
 * Get Tailwind CSS classes for rating badge styling
 * @param rating - Rating value (0-100)
 * @returns Object with bg and text color classes
 */
export function getRatingClasses(rating: number) {
  const tier = getRatingTierKey(rating);

  const classes = {
    HIGHEST: {
      bg: "bg-green-500/20 dark:bg-green-400/20",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-500/30",
    },
    HIGH: {
      bg: "bg-green-600/20 dark:bg-green-500/20",
      text: "text-green-800 dark:text-green-500",
      border: "border-green-600/30",
    },
    MEDIUM: {
      bg: "bg-orange-500/20 dark:bg-orange-400/20",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-500/30",
    },
    LOW: {
      bg: "bg-orange-600/20 dark:bg-orange-500/20",
      text: "text-orange-800 dark:text-orange-500",
      border: "border-orange-600/30",
    },
    LOWEST: {
      bg: "bg-red-600/20 dark:bg-red-500/20",
      text: "text-red-800 dark:text-red-500",
      border: "border-red-600/30",
    },
  };

  return classes[tier];
}
