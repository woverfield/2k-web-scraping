"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, ChevronDown, Users, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamType } from "@/types/player";
import Image from "next/image";

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

interface Team {
  name: string;
  logo: string;
  playerCount?: number;
  avgRating?: number;
}

interface FilterBarProps {
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
}

export const FilterBar = React.memo(function FilterBar({
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
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b -mx-4 px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-9"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={() => setSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Team Type Tabs */}
        <Tabs value={teamType} onValueChange={(v) => setTeamType(v as TeamType)}>
          <TabsList className="h-9">
            <TabsTrigger value="curr" className="text-xs px-3">Current</TabsTrigger>
            <TabsTrigger value="class" className="text-xs px-3">Classic</TabsTrigger>
            <TabsTrigger value="allt" className="text-xs px-3">All-Time</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Teams Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Teams
              {selectedTeams.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {selectedTeams.length}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Select Teams</p>
                {selectedTeams.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearTeams} className="h-auto p-1 text-xs">
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-64">
              <div className="p-2 space-y-1">
                {teams.map((team) => (
                  <button
                    key={team.name}
                    onClick={() => toggleTeam(team.name)}
                    className={cn(
                      "flex items-center gap-2 w-full p-2 rounded-md text-sm transition-colors",
                      selectedTeams.includes(team.name)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {team.logo && (
                      <div className="relative h-6 w-6 shrink-0">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <span className="truncate flex-1 text-left">{team.name}</span>
                    {team.playerCount && (
                      <span className="text-xs text-muted-foreground">{team.playerCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Positions Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Position
              {selectedPositions.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {selectedPositions.length}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="space-y-2">
              <p className="text-sm font-medium mb-2">Positions</p>
              <div className="flex flex-wrap gap-2">
                {POSITIONS.map((position) => (
                  <Badge
                    key={position}
                    variant={selectedPositions.includes(position) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePosition(position)}
                  >
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Overall Range Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Rating
              {(overallRange[0] !== 0 || overallRange[1] !== 99) && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {overallRange[0]}-{overallRange[1]}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Overall Rating</p>
                <span className="text-sm text-muted-foreground">
                  {overallRange[0]} - {overallRange[1]}
                </span>
              </div>
              <Slider
                min={0}
                max={99}
                step={1}
                value={overallRange}
                onValueChange={(value) => setOverallRange(value as [number, number])}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall-desc">Highest OVR</SelectItem>
            <SelectItem value="overall-asc">Lowest OVR</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {(selectedTeams.length > 0 || selectedPositions.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {selectedTeams.map((team) => (
            <Badge
              key={team}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {team}
              <button
                onClick={() => toggleTeam(team)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedPositions.map((pos) => (
            <Badge
              key={pos}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {pos}
              <button
                onClick={() => togglePosition(pos)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
});
