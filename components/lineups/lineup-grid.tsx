"use client";

import * as React from "react";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { LineupSlot } from "./lineup-slot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { Player } from "@/types/player";

interface LineupGridProps {
  players: (Player | undefined)[];
  onPlayersChange: (players: (Player | undefined)[]) => void;
  onPlayerDrop: (player: Player) => void;
  onPlayerClick?: (player: Player) => void;
  maxPlayers?: number;
  title?: string;
  onTitleChange?: (newTitle: string) => void;
  color?: string;
  horizontal?: boolean;
  lineupId?: string;
}

export function LineupGrid({
  players,
  onPlayersChange,
  onPlayerDrop,
  onPlayerClick,
  maxPlayers = 5,
  title = "Lineup",
  onTitleChange,
  color = "var(--chart-1)",
  horizontal = false,
  lineupId = "lineup1",
}: LineupGridProps) {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Count actual players (non-undefined)
  const playerCount = players.filter(p => p !== undefined).length;

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    if (onTitleChange) {
      setIsEditingTitle(true);
      setEditedTitle(title);
    }
  };

  const handleTitleSave = () => {
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setEditedTitle(title);
    }
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = undefined;
    onPlayersChange(newPlayers);
  };

  const handleClearAll = () => {
    onPlayersChange(Array(5).fill(undefined));
  };

  // Create sortable IDs - must match the IDs used in LineupSlot
  const sortableIds = players
    .filter((p): p is Player => p !== undefined)
    .map((p) => `${lineupId}-${p._id}`);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="font-semibold bg-transparent border-b border-primary focus:outline-none focus:border-primary px-1 -ml-1"
              maxLength={20}
            />
          ) : (
            <h3
              className={cn(
                "font-semibold",
                onTitleChange && "cursor-pointer hover:text-primary transition-colors"
              )}
              onClick={handleTitleClick}
            >
              {title}
            </h3>
          )}
          <span className="text-sm text-muted-foreground">
            ({playerCount}/{maxPlayers})
          </span>
        </div>
        {playerCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Grid */}
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        <div
          className={cn(
            "grid gap-3",
            horizontal
              ? "grid-cols-5"
              : players.length === 0
              ? "grid-cols-1"
              : players.length <= 2
              ? "grid-cols-2"
              : players.length <= 3
              ? "grid-cols-3"
              : players.length <= 4
              ? "grid-cols-2 md:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          )}
        >
          <AnimatePresence mode="popLayout">
            {Array.from({ length: maxPlayers }).map((_, index) => {
              const player = players[index];
              return (
                <motion.div
                  key={player ? player._id : `${lineupId}-empty-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 }
                  }}
                >
                  {player ? (
                    <LineupSlot
                      player={player}
                      index={index}
                      onRemove={() => handleRemovePlayer(index)}
                      onPlayerClick={onPlayerClick}
                      compact={horizontal}
                      lineupId={lineupId}
                    />
                  ) : (
                    <LineupSlot
                      index={index}
                      isEmpty
                      compact={horizontal}
                      lineupId={lineupId}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}
