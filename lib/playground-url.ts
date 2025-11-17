/**
 * URL state management utilities for the playground
 */

import type { TeamType } from "@/types/player";

export interface PlaygroundFilters {
  search?: string;
  teamType?: TeamType;
  teams?: string[];
  positions?: string[];
  minOverall?: number;
  maxOverall?: number;
  sortBy?: string;
  page?: number;
}

/**
 * Parse URL search params into filter state
 */
export function parseFiltersFromURL(searchParams: URLSearchParams): PlaygroundFilters {
  const filters: PlaygroundFilters = {};

  const search = searchParams.get("search");
  if (search) filters.search = search;

  const teamType = searchParams.get("teamType") as TeamType;
  if (teamType && ["curr", "class", "allt"].includes(teamType)) {
    filters.teamType = teamType;
  }

  const teams = searchParams.get("teams");
  if (teams) filters.teams = teams.split(",").filter(Boolean);

  const positions = searchParams.get("positions");
  if (positions) filters.positions = positions.split(",").filter(Boolean);

  const minOverall = searchParams.get("minOverall");
  if (minOverall) filters.minOverall = Number(minOverall);

  const maxOverall = searchParams.get("maxOverall");
  if (maxOverall) filters.maxOverall = Number(maxOverall);

  const sortBy = searchParams.get("sortBy");
  if (sortBy) filters.sortBy = sortBy;

  const page = searchParams.get("page");
  if (page) filters.page = Number(page);

  return filters;
}

/**
 * Convert filter state to URL search params
 */
export function filtersToURLParams(filters: PlaygroundFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.teamType) {
    params.set("teamType", filters.teamType);
  }

  if (filters.teams && filters.teams.length > 0) {
    params.set("teams", filters.teams.join(","));
  }

  if (filters.positions && filters.positions.length > 0) {
    params.set("positions", filters.positions.join(","));
  }

  if (filters.minOverall !== undefined && filters.minOverall !== 0) {
    params.set("minOverall", String(filters.minOverall));
  }

  if (filters.maxOverall !== undefined && filters.maxOverall !== 99) {
    params.set("maxOverall", String(filters.maxOverall));
  }

  if (filters.sortBy && filters.sortBy !== "overall-desc") {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.page && filters.page !== 1) {
    params.set("page", String(filters.page));
  }

  return params;
}
