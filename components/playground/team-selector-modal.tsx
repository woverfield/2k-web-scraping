"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, X, Check } from "lucide-react";

interface Team {
  name: string;
  logo: string;
  playerCount?: number;
  avgRating?: number;
}

interface TeamSelectorModalProps {
  teams: Team[];
  selectedTeams: string[];
  onToggleTeam: (team: string) => void;
  onClearTeams: () => void;
}

export function TeamSelectorModal({
  teams,
  selectedTeams,
  onToggleTeam,
  onClearTeams,
}: TeamSelectorModalProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTeams = React.useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const query = searchQuery.toLowerCase();
    return teams.filter((team) =>
      team.name.toLowerCase().includes(query)
    );
  }, [teams, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">
            {selectedTeams.length === 0
              ? "Select teams..."
              : selectedTeams.length === 1
              ? selectedTeams[0]
              : `${selectedTeams.length} teams selected`}
          </span>
          {selectedTeams.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedTeams.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Teams</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Selected Teams */}
        {selectedTeams.length > 0 && (
          <div className="flex flex-wrap gap-2 py-2">
            {selectedTeams.map((team) => (
              <Badge
                key={team}
                variant="default"
                className="cursor-pointer gap-1"
                onClick={() => onToggleTeam(team)}
              >
                {team}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearTeams}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Teams Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-2 gap-2 py-2">
            {filteredTeams.map((team) => {
              const isSelected = selectedTeams.includes(team.name);
              return (
                <button
                  key={team.name}
                  onClick={() => onToggleTeam(team.name)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    "hover:bg-accent hover:border-primary/50",
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "bg-background border-border"
                  )}
                >
                  {/* Team Logo */}
                  <div className="relative h-10 w-10 shrink-0">
                    {team.logo ? (
                      <Image
                        src={team.logo}
                        alt={team.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="h-full w-full rounded bg-muted" />
                    )}
                  </div>

                  {/* Team Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{team.name}</p>
                    {team.playerCount && (
                      <p className="text-xs text-muted-foreground">
                        {team.playerCount} players
                      </p>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {filteredTeams.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No teams found
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
