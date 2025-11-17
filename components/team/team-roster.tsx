"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { getRatingClasses } from "@/lib/rating-colors";
import { ArrowUpDown, User } from "lucide-react";
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
          <motion.div
            key={`${sortBy}-${positionFilter}`}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sortedPlayers.map((player, index) => (
              <motion.div key={player._id} variants={staggerItem}>
                <a
                  href={`/players/${player.slug}?type=${teamType}&ref=team`}
                  className="block"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Player Image */}
                        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                          {player.playerImage ? (
                            <Image
                              src={player.playerImage}
                              alt={player.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{player.name}</p>

                          {/* Position & Archetype */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {player.positions &&
                              player.positions.slice(0, 2).map((pos) => (
                                <Badge
                                  key={pos}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {pos}
                                </Badge>
                              ))}
                          </div>

                          {/* Overall Rating */}
                          <div className="mt-2">
                            <div
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm",
                                getRatingClasses(player.overall).bg,
                                getRatingClasses(player.overall).shadow
                              )}
                            >
                              <span className="text-xl font-bold tabular-nums text-white">
                                {player.overall}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              OVR
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Archetype/Build */}
                      {(player.archetype || player.build) && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground truncate">
                            {player.archetype || player.build}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {sortedPlayers.length === 0 && (
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
