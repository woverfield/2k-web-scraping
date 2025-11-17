import type { Player, RadarChartData, TopStat } from "@/types/player";

/**
 * Calculate average of an array of numbers, filtering out null/undefined
 * @param values - Array of numbers (may contain null/undefined)
 * @returns Rounded average, or 0 if no valid values
 */
export function avg(values: (number | undefined | null)[]): number {
  const valid = values.filter(
    (v): v is number => v !== undefined && v !== null && !isNaN(v)
  );
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((sum, v) => sum + v, 0) / valid.length);
}

/**
 * Calculate 7-point radar chart data for a player
 * Matches 2kratings.com radar chart structure
 * @param player - Player object with attributes
 * @returns RadarChartData with 7 calculated values
 */
export function calculateRadarStats(player: Player): RadarChartData {
  const attrs = player.attributes || {};

  return {
    overall: player.overall,
    insideScoring: avg([
      attrs.closeShot,
      attrs.drivingLayup,
      attrs.drivingDunk,
      attrs.standingDunk,
      attrs.postHook,
      attrs.postFade,
      attrs.postControl,
    ]),
    outsideScoring: avg([attrs.midRangeShot, attrs.threePointShot]),
    athleticism: avg([
      attrs.speed,
      attrs.acceleration,
      attrs.vertical,
      attrs.strength,
    ]),
    playmaking: avg([
      attrs.passAccuracy,
      attrs.ballHandle,
      attrs.speedWithBall,
      attrs.passIQ,
      attrs.passVision,
    ]),
    rebounding: avg(
      [attrs.defensiveRebound, attrs.offensiveRebound].filter(
        (v): v is number => v !== undefined && v !== null
      )
    ),
    defending: avg([
      attrs.interiorDefense,
      attrs.perimeterDefense,
      attrs.steal,
      attrs.block,
      attrs.lateralQuickness,
      attrs.helpDefenseIQ,
    ]),
  };
}

/**
 * Get a player's top 3 highest attributes
 * @param player - Player object with attributes
 * @returns Array of top 3 stats with names, values, and formatted labels
 */
export function getTopThreeStats(player: Player): TopStat[] {
  const attrs = player.attributes;
  if (!attrs) return [];

  // Convert attributes object to array of [name, value] pairs
  const attrArray = Object.entries(attrs)
    .filter(([_, value]) => typeof value === "number" && !isNaN(value))
    .map(([name, value]) => ({
      name,
      value: value as number,
      label: formatAttributeName(name),
    }));

  // Sort by value descending and take top 3
  return attrArray.sort((a, b) => b.value - a.value).slice(0, 3);
}

/**
 * Format camelCase attribute names to readable labels
 * @param name - Attribute name in camelCase
 * @returns Formatted label
 */
export function formatAttributeName(name: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    threePointShot: "Three-Point Shot",
    midRangeShot: "Mid-Range Shot",
    freeThrow: "Free Throw",
    shotIQ: "Shot IQ",
    passIQ: "Pass IQ",
    helpDefenseIQ: "Help Defense IQ",
    speedWithBall: "Speed With Ball",
  };

  if (specialCases[name]) return specialCases[name];

  // Convert camelCase to Title Case with spaces
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Get attribute category for grouping
 * @param attributeName - Attribute name in camelCase
 * @returns Category name
 */
export function getAttributeCategory(
  attributeName: string
): "shooting" | "playmaking" | "defense" | "athleticism" | "other" {
  const shooting = [
    "closeShot",
    "drivingLayup",
    "drivingDunk",
    "standingDunk",
    "postHook",
    "postFade",
    "postControl",
    "midRangeShot",
    "threePointShot",
    "freeThrow",
    "shotIQ",
    "offensiveConsistency",
    "drawFoul",
    "hands",
  ];

  const playmaking = [
    "passAccuracy",
    "ballHandle",
    "speedWithBall",
    "passIQ",
    "passVision",
    "passing",
    "postMoves",
  ];

  const defense = [
    "interiorDefense",
    "perimeterDefense",
    "steal",
    "block",
    "defensiveConsistency",
    "defensiveRebound",
    "lateralQuickness",
    "helpDefenseIQ",
  ];

  const athleticism = [
    "speed",
    "acceleration",
    "vertical",
    "strength",
    "stamina",
    "hustle",
  ];

  if (shooting.includes(attributeName)) return "shooting";
  if (playmaking.includes(attributeName)) return "playmaking";
  if (defense.includes(attributeName)) return "defense";
  if (athleticism.includes(attributeName)) return "athleticism";
  return "other";
}
