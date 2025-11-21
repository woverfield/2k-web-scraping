import type { Player, RadarChartData, TopStat } from "@/types/player";
import { normalizeAttributes } from "@/lib/attribute-normalizer";

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
  // Normalize attributes to handle legacy data with old attribute names
  const attrs = player.attributes ? normalizeAttributes(player.attributes) : {};

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

  // Normalize attributes to handle legacy data
  const normalizedAttrs = normalizeAttributes(attrs);

  // Convert attributes object to array of [name, value] pairs
  const attrArray = Object.entries(normalizedAttrs)
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
 * Get attribute category for grouping (matches radar chart categories)
 * @param attributeName - Attribute name in camelCase
 * @returns Category name
 */
export function getAttributeCategory(
  attributeName: string
): "outsideScoring" | "insideScoring" | "playmaking" | "athleticism" | "defending" | "rebounding" | "other" {
  const outsideScoring = [
    "closeShot",
    "midRangeShot",
    "threePointShot",
    "freeThrow",
    "shotIQ",
    "offensiveConsistency",
  ];

  const insideScoring = [
    "drivingLayup",
    "standingDunk",
    "drivingDunk",
    "postHook",
    "postFade",
    "postControl",
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

  const athleticism = [
    "speed",
    "acceleration",
    "agility",
    "vertical",
    "strength",
    "stamina",
    "hustle",
    "durability",
  ];

  const defending = [
    "interiorDefense",
    "perimeterDefense",
    "steal",
    "block",
    "helpDefenseIQ",
    "passPerception",
    "defensiveConsistency",
    "lateralQuickness",
  ];

  const rebounding = [
    "offensiveRebound",
    "defensiveRebound",
  ];

  if (outsideScoring.includes(attributeName)) return "outsideScoring";
  if (insideScoring.includes(attributeName)) return "insideScoring";
  if (playmaking.includes(attributeName)) return "playmaking";
  if (athleticism.includes(attributeName)) return "athleticism";
  if (defending.includes(attributeName)) return "defending";
  if (rebounding.includes(attributeName)) return "rebounding";
  return "other";
}

/**
 * Get the primary position from a player's positions array
 * @param positions - Array of positions (e.g., ["PG", "SG"])
 * @returns Primary position (first in array), or undefined if no positions
 */
export function getPrimaryPosition(positions: string[] | undefined): string | undefined {
  return positions && positions.length > 0 ? positions[0] : undefined;
}

/**
 * Validate if a position code is valid
 * @param position - Position code to validate
 * @returns true if position is valid (PG, SG, SF, PF, C)
 */
export function isValidPosition(position: string | undefined): boolean {
  if (!position) return false;
  const validPositions = ["PG", "SG", "SF", "PF", "C"];
  return validPositions.includes(position.toUpperCase());
}
