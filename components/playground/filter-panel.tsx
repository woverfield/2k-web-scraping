"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TeamSelectorModal } from "@/components/playground/team-selector-modal";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { TeamType } from "@/types/player";

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

interface Team {
  name: string;
  logo: string;
  playerCount?: number;
  avgRating?: number;
}

interface FilterPanelProps {
  search: string;
  setSearch: (value: string) => void;
  teamType: TeamType;
  setTeamType: (value: TeamType) => void;
  teams: Team[];
  selectedTeams: string[];
  toggleTeam: (team: string) => void;
  clearTeams: () => void;
  selectedPositions: string[];
  togglePosition: (position: string) => void;
  overallRange: [number, number];
  setOverallRange: (value: [number, number]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  showHeader?: boolean;
}

export const FilterPanel = React.memo(function FilterPanel({
  search,
  setSearch,
  teamType,
  setTeamType,
  teams,
  selectedTeams,
  toggleTeam,
  clearTeams,
  selectedPositions,
  togglePosition,
  overallRange,
  setOverallRange,
  sortBy,
  setSortBy,
  hasActiveFilters,
  clearFilters,
  showHeader = true,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="space-y-2">
        <label htmlFor="player-search" className="text-sm font-medium">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="player-search"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search for players by name"
          />
        </div>
      </div>

      {/* Team Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Team Type</label>
        <Tabs value={teamType} onValueChange={(v) => setTeamType(v as TeamType)}>
          <TabsList className="grid w-full grid-cols-3" aria-label="Select team type">
            <TabsTrigger value="curr">Current</TabsTrigger>
            <TabsTrigger value="class">Classic</TabsTrigger>
            <TabsTrigger value="allt">All-Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Teams Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Teams</label>
        <TeamSelectorModal
          teams={teams}
          selectedTeams={selectedTeams}
          onToggleTeam={toggleTeam}
          onClearTeams={clearTeams}
        />
      </div>

      {/* Positions */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Position</label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by position">
          {POSITIONS.map((position) => (
            <Badge
              key={position}
              variant={selectedPositions.includes(position) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => togglePosition(position)}
              role="checkbox"
              aria-checked={selectedPositions.includes(position)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePosition(position);
                }
              }}
            >
              {position}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overall Rating */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="overall-rating-slider" className="text-sm font-medium">Overall Rating</label>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {overallRange[0]} - {overallRange[1]}
          </span>
        </div>
        <Slider
          id="overall-rating-slider"
          min={0}
          max={99}
          step={1}
          value={overallRange}
          onValueChange={(value) => setOverallRange(value as [number, number])}
          className="w-full"
          aria-label="Filter by overall rating range"
        />
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label htmlFor="sort-by" className="text-sm font-medium">Sort By</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Sort players by"
        >
          <option value="overall-desc">Highest Overall</option>
          <option value="overall-asc">Lowest Overall</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
});
