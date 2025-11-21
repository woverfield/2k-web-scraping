"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { PositionAverages } from "@/types/player";

/**
 * Custom hook to fetch position-based average statistics
 * @param position - The position to get averages for (PG, SG, SF, PF, C)
 * @returns Position averages data including player count, avg overall, and attribute averages
 */
export function usePositionAverages(position: string | undefined): PositionAverages | undefined {
  const positionAverages = useQuery(
    api.players.getPositionAverages,
    position ? { position } : "skip"
  );

  return positionAverages;
}
