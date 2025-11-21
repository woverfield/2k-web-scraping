"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { MasonryRoot, MasonryItem } from "@/components/ui/masonry";
import { FlipCard } from "@/components/playground/flip-card";
import type { Player } from "@/types/player";

export interface TeamRosterProps {
  players: Player[];
  teamType: "curr" | "class" | "allt";
  className?: string;
}

export function TeamRoster({ players, teamType, className }: TeamRosterProps) {
  const [sortBy, setSortBy] = React.useState<"overall" | "name" | "position">(
    "overall"
  );
  const [positionFilter, setPositionFilter] = React.useState<string>("all");

  // Get unique positions
  const positions = React.useMemo(() => {
    const posSet = new Set<string>();
    players.forEach((player) => {
      if (player.positions) {
        player.positions.forEach((pos) => posSet.add(pos));
      }
    });
    return Array.from(posSet).sort();
  }, [players]);

  // Filter and sort players
  const sortedPlayers = React.useMemo(() => {
    let filtered = [...players];

    // Filter by position
    if (positionFilter !== "all") {
      filtered = filtered.filter((p) =>
        p.positions?.includes(positionFilter)
      );
    }

    // Sort
    if (sortBy === "overall") {
      filtered.sort((a, b) => b.overall - a.overall);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "position") {
      filtered.sort((a, b) => {
        const posA = a.positions?.[0] || "";
        const posB = b.positions?.[0] || "";
        return posA.localeCompare(posB);
      });
    }

    return filtered;
  }, [players, sortBy, positionFilter]);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Team Roster ({sortedPlayers.length} Players)</CardTitle>

            <div className="flex flex-wrap gap-2">
              {/* Position Filter */}
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Sort by Rating</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="position">Sort by Position</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {sortedPlayers.length > 0 ? (
            <MasonryRoot
              key={`${sortBy}-${positionFilter}`}
              columnWidth={160}
              gap={{ column: 12, row: 12 }}
              itemHeight={240}
              overscan={3}
              linear
              defaultWidth={1200}
              defaultHeight={800}
              fallback={
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {sortedPlayers.slice(0, 15).map((player) => (
                    <div key={player._id} className="h-60 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              }
            >
              {sortedPlayers.map((player) => (
                <MasonryItem key={player._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <FlipCard player={player} />
                  </motion.div>
                </MasonryItem>
              ))}
            </MasonryRoot>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No players found for this position
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
