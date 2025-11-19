/**
 * URL state management utilities for the lineup builder
 */

import type { TeamType } from "@/types/player";

// Player entry with slug, team type, and team name
export interface LineupPlayer {
  slug: string;
  teamType: TeamType;
  team?: string; // Team name to distinguish same player on different teams
}

export interface LineupState {
  lineup1: LineupPlayer[]; // Array of player entries with team type
  lineup2?: LineupPlayer[]; // Optional second lineup for comparison
  filterTeamType: TeamType; // Current filter for search panel
}

/**
 * Parse a player entry from URL format (slug:type:team or slug:type or just slug)
 */
function parsePlayerEntry(entry: string): LineupPlayer | null {
  if (!entry) return null;
  const parts = entry.split(":");
  const slug = parts[0];
  if (!slug) return null;
  const teamType = (parts[1] && ["curr", "class", "allt"].includes(parts[1]) ? parts[1] : "curr") as TeamType;
  const team = parts[2] ? decodeURIComponent(parts[2]) : undefined;
  return { slug, teamType, team };
}

/**
 * Format a player entry for URL (slug:type:team)
 */
function formatPlayerEntry(player: LineupPlayer): string {
  let result = player.slug;
  if (player.teamType !== "curr" || player.team) {
    result += `:${player.teamType}`;
    if (player.team) {
      result += `:${encodeURIComponent(player.team)}`;
    }
  }
  return result;
}

/**
 * Parse URL search params into lineup state
 */
export function parseLineupFromURL(searchParams: URLSearchParams): LineupState {
  const state: LineupState = {
    lineup1: [],
    filterTeamType: "curr",
  };

  const lineup1 = searchParams.get("lineup1");
  if (lineup1) {
    state.lineup1 = lineup1
      .split(",")
      .map(parsePlayerEntry)
      .filter((p): p is LineupPlayer => p !== null);
  }

  const lineup2 = searchParams.get("lineup2");
  if (lineup2) {
    state.lineup2 = lineup2
      .split(",")
      .map(parsePlayerEntry)
      .filter((p): p is LineupPlayer => p !== null);
  }

  const teamType = searchParams.get("type") as TeamType;
  if (teamType && ["curr", "class", "allt"].includes(teamType)) {
    state.filterTeamType = teamType;
  }

  return state;
}

/**
 * Convert lineup state to URL search params
 */
export function lineupToURLParams(state: LineupState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.lineup1.length > 0) {
    params.set("lineup1", state.lineup1.map(formatPlayerEntry).join(","));
  }

  if (state.lineup2 && state.lineup2.length > 0) {
    params.set("lineup2", state.lineup2.map(formatPlayerEntry).join(","));
  }

  if (state.filterTeamType !== "curr") {
    params.set("type", state.filterTeamType);
  }

  return params;
}

/**
 * Generate a shareable URL for the current lineup state
 */
export function generateShareableURL(state: LineupState, baseURL: string): string {
  const params = lineupToURLParams(state);
  const queryString = params.toString();
  return queryString ? `${baseURL}?${queryString}` : baseURL;
}
