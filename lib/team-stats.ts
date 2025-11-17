import type { Player } from "@/types/player";
import type {
  TeamDistribution,
  PositionBreakdown,
  TeamRadarData,
} from "@/types/team";
import { calculateRadarStats, avg } from "./player-stats";

/**
 * Calculate team radar chart data (average of all player radars)
 * @param players - Array of players on the team
 * @returns TeamRadarData with team averages
 */
export function calculateTeamRadarStats(players: Player[]): TeamRadarData {
  if (players.length === 0) {
    return {
      overall: 0,
      insideScoring: 0,
      outsideScoring: 0,
      athleticism: 0,
      playmaking: 0,
      rebounding: 0,
      defending: 0,
    };
  }

  const playerRadarStats = players.map((p) => calculateRadarStats(p));

  return {
    overall: avg(playerRadarStats.map((s) => s.overall)),
    insideScoring: avg(playerRadarStats.map((s) => s.insideScoring)),
    outsideScoring: avg(playerRadarStats.map((s) => s.outsideScoring)),
    athleticism: avg(playerRadarStats.map((s) => s.athleticism)),
    playmaking: avg(playerRadarStats.map((s) => s.playmaking)),
    rebounding: avg(playerRadarStats.map((s) => s.rebounding)),
    defending: avg(playerRadarStats.map((s) => s.defending)),
  };
}

/**
 * Get rating distribution for team
 * @param players - Array of players on the team
 * @returns Array of distribution buckets with counts and percentages
 */
export function getTeamDistribution(players: Player[]): TeamDistribution[] {
  const total = players.length;
  if (total === 0) return [];

  const buckets = {
    "90+": 0,
    "80-89": 0,
    "70-79": 0,
    "60-69": 0,
    "<60": 0,
  };

  players.forEach((p) => {
    const rating = p.overall;
    if (rating >= 90) buckets["90+"]++;
    else if (rating >= 80) buckets["80-89"]++;
    else if (rating >= 70) buckets["70-79"]++;
    else if (rating >= 60) buckets["60-69"]++;
    else buckets["<60"]++;
  });

  return Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

/**
 * Get position breakdown for team
 * @param players - Array of players on the team
 * @returns Array of position counts
 */
export function getPositionBreakdown(players: Player[]): PositionBreakdown[] {
  const positions = new Map<string, number>();

  players.forEach((p) => {
    if (!p.positions || p.positions.length === 0) {
      // If no position specified, count as "Unknown"
      positions.set("Unknown", (positions.get("Unknown") || 0) + 1);
      return;
    }

    // Count primary position (first in array)
    const primary = p.positions[0];
    positions.set(primary, (positions.get(primary) || 0) + 1);
  });

  // Convert to array and sort by standard position order
  const positionOrder = ["PG", "SG", "SF", "PF", "C", "Unknown"];

  return Array.from(positions.entries())
    .map(([position, count]) => ({ position, count }))
    .sort((a, b) => {
      const aIndex = positionOrder.indexOf(a.position);
      const bIndex = positionOrder.indexOf(b.position);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}

/**
 * Get top N players from team sorted by overall rating
 * @param players - Array of players on the team
 * @param limit - Number of top players to return (default 5)
 * @returns Array of top players
 */
export function getTopPlayers(players: Player[], limit = 5): Player[] {
  return [...players]
    .sort((a, b) => b.overall - a.overall)
    .slice(0, limit);
}
