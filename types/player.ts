import type { Id } from "@/convex/_generated/dataModel";

export type TeamType = "curr" | "class" | "allt";

export interface PlayerAttributes {
  // Shooting (14 attributes)
  closeShot?: number;
  drivingLayup?: number;
  drivingDunk?: number;
  standingDunk?: number;
  postHook?: number;
  postFade?: number;
  postControl?: number;
  midRangeShot?: number;
  threePointShot?: number;
  freeThrow?: number;
  shotIQ?: number;
  offensiveConsistency?: number;
  drawFoul?: number;
  hands?: number;

  // Playmaking (7 attributes)
  passAccuracy?: number;
  ballHandle?: number;
  speedWithBall?: number;
  passIQ?: number;
  passVision?: number;
  passing?: number;
  postMoves?: number;

  // Defense (8 attributes)
  interiorDefense?: number;
  perimeterDefense?: number;
  steal?: number;
  block?: number;
  defensiveConsistency?: number;
  defensiveRebound?: number;
  lateralQuickness?: number;
  helpDefenseIQ?: number;

  // Athleticism (6 attributes)
  speed?: number;
  acceleration?: number;
  vertical?: number;
  strength?: number;
  stamina?: number;
  hustle?: number;

  // Additional attributes that might exist
  offensiveRebound?: number;
  [key: string]: number | undefined;
}

export interface Badge {
  name: string;
  tier: string;
  category?: string;
}

export interface PlayerBadges {
  total?: number;
  legendary?: number;
  hallOfFame?: number;
  gold?: number;
  silver?: number;
  bronze?: number;
  list?: Badge[];
}

export interface Player {
  _id: Id<"players">;
  _creationTime: number;
  name: string;
  slug: string;
  team: string;
  teamType: TeamType;
  overall: number;
  positions?: string[];

  // Physical
  height?: string;
  weight?: string;
  wingspan?: string;
  archetype?: string;
  jerseyNumber?: string;
  age?: number;

  // Images
  playerImage?: string;
  teamImg?: string;

  // Attributes
  attributes?: PlayerAttributes;

  // Badges
  badges?: PlayerBadges;

  // Metadata
  lastUpdated?: string;
  createdAt?: string;
}

export interface RadarChartData {
  overall: number;
  insideScoring: number;
  outsideScoring: number;
  athleticism: number;
  playmaking: number;
  rebounding: number;
  defending: number;
}

export interface TopStat {
  name: string;
  value: number;
  label: string;
}

export interface PlayerWithRadar extends Player {
  radarData: RadarChartData;
  topStats: TopStat[];
}
