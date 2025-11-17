import type { TeamType } from "./player";

export type SortBy = "overall" | "name" | "team";
export type SortOrder = "asc" | "desc";

export interface PlaygroundFilters {
  searchQuery?: string;
  team?: string;
  teamType?: TeamType;
  positions?: string[];
  minRating?: number;
  maxRating?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

export interface AttributeRangeFilter {
  min: number;
  max: number;
}

export interface AdvancedFilters {
  shooting?: AttributeRangeFilter;
  playmaking?: AttributeRangeFilter;
  defense?: AttributeRangeFilter;
  athleticism?: AttributeRangeFilter;
}
