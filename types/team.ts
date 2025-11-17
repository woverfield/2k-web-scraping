import type { Player, RadarChartData, TeamType } from "./player";

export interface Team {
  team: string;
  teamType: TeamType;
  teamImg?: string;
  playerCount: number;
  avgOverall: number;
}

export interface TeamDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface PositionBreakdown {
  position: string;
  count: number;
}

export interface TeamStats {
  team: string;
  teamType: TeamType;
  teamImg?: string;
  playerCount: number;
  avgOverall: number;
  highestRated?: Player;
  distribution: TeamDistribution[];
  positionBreakdown: PositionBreakdown[];
  topPlayers: Player[];
}

export interface TeamRadarData extends RadarChartData {}
