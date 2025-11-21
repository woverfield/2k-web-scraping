"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, GripVertical, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRatingClasses } from "@/lib/rating-colors";
import type { Player, TeamType } from "@/types/player";
import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";

interface PlayerSearchPanelProps {
  teamType: TeamType;
  onTeamTypeChange: (type: TeamType) => void;
  onPlayerClick: (player: Player) => void;
  onPlayerInfoClick?: (player: Player) => void;
  selectedSlugs: string[];
}

interface DraggablePlayerCardProps {
  player: Player;
  onClick: () => void;
  onInfoClick?: () => void;
  isSelected: boolean;
}

function DraggablePlayerCard({ player, onClick, onInfoClick, isSelected }: DraggablePlayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `search-${player._id}`,
    data: { player },
  });

  // Don't apply transform here - let DragOverlay handle the visual
  const style = {
    opacity: isDragging ? 0.3 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    // If there's an info click handler, use it; otherwise add to lineup
    if (onInfoClick) {
      onInfoClick();
    } else {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-1.5 py-2 px-1 rounded-md border transition-all group cursor-grab active:cursor-grabbing",
        "hover:bg-accent hover:border-primary/50 hover:shadow-sm",
        "max-w-full min-w-0",
        isSelected
          ? "bg-primary/10 border-primary opacity-50"
          : "bg-background border-border"
      )}
      onClick={handleClick}
    >
      {/* Drag Handle Icon */}
      <div className="text-muted-foreground group-hover:text-foreground shrink-0">
        <GripVertical className="h-3.5 w-3.5" />
      </div>

      {/* Player Image */}
      <div className="relative h-10 w-10 shrink-0 rounded overflow-hidden bg-muted">
        {player.playerImage ? (
          <Image
            src={player.playerImage}
            alt={player.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs truncate">{player.name}</p>
        <div className="flex items-center gap-1">
          {player.positions?.slice(0, 2).map((pos) => (
            <Badge key={pos} variant="secondary" className="text-[9px] px-1 py-0 h-4">
              {pos}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overall Rating */}
      <div
        className={cn(
          "px-1.5 py-0.5 rounded-sm shrink-0",
          getRatingClasses(player.overall).bg,
          getRatingClasses(player.overall).shadow
        )}
      >
        <span className="text-xs font-bold tabular-nums text-white">
          {player.overall}
        </span>
      </div>
    </div>
  );
}

export function PlayerSearchPanel({
  teamType,
  onTeamTypeChange,
  onPlayerClick,
  onPlayerInfoClick,
  selectedSlugs,
}: PlayerSearchPanelProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [offset, setOffset] = React.useState(0);
  const [accumulatedPlayers, setAccumulatedPlayers] = React.useState<Player[]>([]);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const scrollViewportRef = React.useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 50;

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0); // Reset offset when search changes
      setAccumulatedPlayers([]); // Clear accumulated players
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset when team type changes
  React.useEffect(() => {
    setOffset(0);
    setAccumulatedPlayers([]);
  }, [teamType]);

  // Fetch players with pagination
  const playersResult = useQuery(
    api.players.getAllFiltered,
    {
      search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
      teamType,
      minOverall: debouncedSearch.length < 2 ? 85 : undefined,
      sortBy: "overall-desc",
      limit: PAGE_SIZE,
      offset: offset,
    }
  );

  // Accumulate players when new data arrives
  React.useEffect(() => {
    if (playersResult?.players) {
      if (offset === 0) {
        // First load or reset - replace all
        setAccumulatedPlayers(playersResult.players);
      } else {
        // Append new players
        setAccumulatedPlayers((prev) => {
          const existingIds = new Set(prev.map(p => p._id));
          const newPlayers = playersResult.players.filter(p => !existingIds.has(p._id));
          return [...prev, ...newPlayers];
        });
      }
    }
  }, [playersResult?.players, offset]);

  const players = accumulatedPlayers;
  const hasMore = playersResult?.hasMore || false;

  // Intersection Observer for infinite scroll
  React.useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && playersResult !== undefined) {
          setOffset((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, playersResult]);

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="p-3 space-y-3 border-b min-w-0 shrink-0">
        <h2 className="text-sm font-semibold">Add Players</h2>

        {/* Team Type Tabs */}
        <Tabs value={teamType} onValueChange={(v) => onTeamTypeChange(v as TeamType)}>
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="curr" className="text-xs">Current</TabsTrigger>
            <TabsTrigger value="class" className="text-xs">Classic</TabsTrigger>
            <TabsTrigger value="allt" className="text-xs">All-Time</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Player List */}
      <ScrollArea className="flex-1 min-h-0 min-w-0">
        <div className="px-2 py-2 space-y-1 min-w-0" ref={scrollViewportRef}>
          {playersResult === undefined && offset === 0 ? (
            // Loading state
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-md bg-muted animate-pulse"
              />
            ))
          ) : players.length === 0 ? (
            // Empty state
            <p className="text-xs text-muted-foreground text-center py-6">
              {debouncedSearch.length >= 2
                ? `No players found for "${debouncedSearch}"`
                : "No players available"}
            </p>
          ) : (
            <>
              {/* Player cards */}
              {players.map((player) => (
                <DraggablePlayerCard
                  key={player._id}
                  player={player}
                  onClick={() => onPlayerClick(player)}
                  onInfoClick={onPlayerInfoClick ? () => onPlayerInfoClick(player) : undefined}
                  isSelected={selectedSlugs.includes(`${player.slug}:${player.team || ''}`)}
                />
              ))}

              {/* Load more trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="h-4 flex items-center justify-center py-4">
                  <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                </div>
              )}
            </>
          )}

          {/* Hint when typing */}
          {search.length > 0 && search.length < 2 && (
            <p className="text-[10px] text-muted-foreground text-center py-3">
              Type at least 2 characters to search
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
