"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRatingClasses } from "@/lib/rating-colors";
import { X, User, Plus, RefreshCw } from "lucide-react";
import type { Player } from "@/types/player";
import Image from "next/image";

interface LineupSlotProps {
  player?: Player;
  index: number;
  onRemove?: () => void;
  onPlayerClick?: (player: Player) => void;
  isEmpty?: boolean;
  compact?: boolean;
  lineupId?: string;
}

export function LineupSlot({ player, index, onRemove, onPlayerClick, isEmpty, compact = false, lineupId = "lineup1" }: LineupSlotProps) {
  // Early return for empty slots
  if (!player) {
    return (
      <DroppableEmptySlot index={index} compact={compact} lineupId={lineupId} />
    );
  }

  return (
    <FilledSlot
      player={player}
      index={index}
      onRemove={onRemove}
      onPlayerClick={onPlayerClick}
      compact={compact}
      lineupId={lineupId}
    />
  );
}

function FilledSlot({
  player,
  index,
  onRemove,
  onPlayerClick,
  compact,
  lineupId
}: {
  player: Player;
  index: number;
  onRemove?: () => void;
  onPlayerClick?: (player: Player) => void;
  compact: boolean;
  lineupId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${lineupId}-${player._id}`,
    data: { player, index, lineupId },
  });

  // Also make filled slots droppable for replacement
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `${lineupId}-slot-${index}`,
    data: { index, lineupId, player },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Combine refs
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 z-50"
      )}
    >
      <Card
        className={cn(
          "relative transition-all",
          isDragging && "shadow-xl",
          isOver && "ring-2 ring-primary ring-offset-2",
          onPlayerClick && "cursor-pointer hover:shadow-lg hover:border-primary/50 hover:bg-accent/50"
        )}
        onClick={() => onPlayerClick?.(player)}
      >
        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10",
            compact ? "h-5 w-5" : "h-6 w-6"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <X className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
        </Button>

        <CardContent className={compact ? "p-2" : "p-4"}>
          <div className="flex flex-col items-center text-center">
            {/* Player Image */}
            <div className={cn(
              "relative rounded-full overflow-hidden bg-muted",
              compact ? "h-16 w-16 mb-1.5" : "h-24 w-24 mb-3"
            )}>
              {player.playerImage ? (
                <Image
                  src={player.playerImage}
                  alt={player.name}
                  fill
                  sizes={compact ? "64px" : "96px"}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className={compact ? "h-8 w-8" : "h-12 w-12"} />
                </div>
              )}
            </div>

            {/* Overall Rating */}
            <div
              className={cn(
                "rounded-md",
                compact ? "px-1.5 py-0.5 mb-1" : "px-3 py-1 mb-2",
                getRatingClasses(player.overall).bg,
                getRatingClasses(player.overall).shadow
              )}
            >
              <span className={cn(
                "font-bold tabular-nums text-white",
                compact ? "text-lg" : "text-2xl"
              )}>
                {player.overall}
              </span>
            </div>

            {/* Player Name */}
            <p className={cn(
              "font-semibold truncate w-full",
              compact ? "text-[10px]" : "text-sm"
            )}>
              {player.name}
            </p>

            {/* Positions - only show in compact mode */}
            {compact && player.positions && (
              <div className="flex gap-0.5 mt-1 justify-center">
                {player.positions?.slice(0, 2).map((pos) => (
                  <Badge key={pos} variant="secondary" className="text-[8px] px-1 py-0 h-3">
                    {pos}
                  </Badge>
                ))}
              </div>
            )}

            {/* Team - only show in non-compact mode */}
            {!compact && (
              <p className="text-xs text-muted-foreground truncate w-full">
                {player.team}
              </p>
            )}

            {/* Positions - non-compact mode */}
            {!compact && (
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {player.positions?.slice(0, 2).map((pos) => (
                  <Badge key={pos} variant="secondary" className="text-xs">
                    {pos}
                  </Badge>
                ))}
              </div>
            )}

            {/* Archetype/Build - only in non-compact mode */}
            {!compact && (player.archetype || player.build) && (
              <p className="text-[10px] text-muted-foreground mt-2 truncate w-full">
                {player.archetype || player.build}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DroppableEmptySlot({ index, compact = false, lineupId = "lineup1" }: { index: number; compact?: boolean; lineupId?: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${lineupId}-slot-${index}`,
    data: { index, lineupId },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all",
        compact ? "p-3 min-h-[120px] gap-1" : "p-8 min-h-[200px] gap-2",
        isOver
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}
    >
      <Plus className={cn(
        isOver ? "text-primary" : "text-muted-foreground",
        compact ? "h-5 w-5" : "h-8 w-8"
      )} />
      <p className={cn(
        "text-muted-foreground text-center",
        compact ? "text-[10px]" : "text-sm"
      )}>
        {isOver ? "Drop" : compact ? "Add" : "Drag or click to add"}
      </p>
    </div>
  );
}
