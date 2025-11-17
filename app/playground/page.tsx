"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LoadingCard } from "@/components/ui/loading-card";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { getRatingClasses } from "@/lib/rating-colors";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamType, Player } from "@/types/player";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { parseFiltersFromURL, filtersToURLParams, type PlaygroundFilters } from "@/lib/playground-url";
import { FilterPanel } from "@/components/playground/filter-panel";
import { FilterSheet } from "@/components/playground/filter-sheet";

const ITEMS_PER_PAGE = 24;

export default function PlaygroundPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse initial state from URL
  const initialFilters = React.useMemo(
    () => parseFiltersFromURL(searchParams),
    [searchParams]
  );

  // Filter state
  const [search, setSearch] = React.useState(initialFilters.search || "");
  const [teamType, setTeamType] = React.useState<TeamType>(initialFilters.teamType || "curr");
  const [selectedTeams, setSelectedTeams] = React.useState<string[]>(initialFilters.teams || []);
  const [selectedPositions, setSelectedPositions] = React.useState<string[]>(
    initialFilters.positions || []
  );
  const [overallRange, setOverallRange] = React.useState<[number, number]>([
    initialFilters.minOverall ?? 0,
    initialFilters.maxOverall ?? 99,
  ]);
  const [sortBy, setSortBy] = React.useState(initialFilters.sortBy || "overall-desc");
  const [page, setPage] = React.useState(initialFilters.page || 1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch available teams for current team type
  const teamsData = useQuery(api.teams.getAllTeams, { teamType });
  const availableTeams = React.useMemo(
    () => (teamsData || []).map((t) => t.name).sort(),
    [teamsData]
  );

  // Calculate offset for pagination
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Fetch filtered players
  const result = useQuery(api.players.getAllFiltered, {
    search: debouncedSearch || undefined,
    teamType,
    teams: selectedTeams.length > 0 ? selectedTeams : undefined,
    positions: selectedPositions.length > 0 ? selectedPositions : undefined,
    minOverall: overallRange[0],
    maxOverall: overallRange[1],
    sortBy: sortBy as any,
    limit: ITEMS_PER_PAGE,
    offset,
  });

  const players = result?.players || [];
  const totalCount = result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Sync filters to URL (debounced)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const filters: PlaygroundFilters = {
        search: debouncedSearch || undefined,
        teamType,
        teams: selectedTeams.length > 0 ? selectedTeams : undefined,
        positions: selectedPositions.length > 0 ? selectedPositions : undefined,
        minOverall: overallRange[0] !== 0 ? overallRange[0] : undefined,
        maxOverall: overallRange[1] !== 99 ? overallRange[1] : undefined,
        sortBy: sortBy !== "overall-desc" ? sortBy : undefined,
        page: page !== 1 ? page : undefined,
      };

      const params = filtersToURLParams(filters);
      const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newURL, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearch, teamType, selectedTeams, selectedPositions, overallRange, sortBy, page, pathname, router]);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, teamType, selectedTeams, selectedPositions, overallRange, sortBy]);

  // Clear selected teams when teamType changes
  React.useEffect(() => {
    setSelectedTeams([]);
  }, [teamType]);

  // Toggle position filter
  const togglePosition = (position: string) => {
    setSelectedPositions((prev) =>
      prev.includes(position)
        ? prev.filter((p) => p !== position)
        : [...prev, position]
    );
  };

  // Toggle team filter
  const toggleTeam = (team: string) => {
    setSelectedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setTeamType("curr");
    setSelectedTeams([]);
    setSelectedPositions([]);
    setOverallRange([0, 99]);
    setSortBy("overall-desc");
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    selectedTeams.length > 0 ||
    selectedPositions.length > 0 ||
    overallRange[0] !== 0 ||
    overallRange[1] !== 99;

  const activeFilterCount =
    (search ? 1 : 0) +
    selectedTeams.length +
    selectedPositions.length +
    (overallRange[0] !== 0 || overallRange[1] !== 99 ? 1 : 0);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="mb-8 space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight">Player Playground</h1>
        <p className="text-lg text-muted-foreground">
          Explore and filter {totalCount.toLocaleString()} NBA 2K players
        </p>
      </motion.div>

      {/* Mobile Filter Sheet */}
      <FilterSheet activeFilterCount={activeFilterCount}>
        <FilterPanel
          search={search}
          setSearch={setSearch}
          teamType={teamType}
          setTeamType={setTeamType}
          availableTeams={availableTeams}
          selectedTeams={selectedTeams}
          toggleTeam={toggleTeam}
          selectedPositions={selectedPositions}
          togglePosition={togglePosition}
          overallRange={overallRange}
          setOverallRange={setOverallRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          showHeader={false}
        />
      </FilterSheet>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Desktop Filter Panel - Sidebar */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="hidden lg:block lg:col-span-1"
        >
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <FilterPanel
                search={search}
                setSearch={setSearch}
                teamType={teamType}
                setTeamType={setTeamType}
                availableTeams={availableTeams}
                selectedTeams={selectedTeams}
                toggleTeam={toggleTeam}
                selectedPositions={selectedPositions}
                togglePosition={togglePosition}
                overallRange={overallRange}
                setOverallRange={setOverallRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                showHeader={true}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Player Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results count and pagination info */}
          {result !== undefined && totalCount > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing {offset + 1}-{Math.min(offset + ITEMS_PER_PAGE, totalCount)} of{" "}
                {totalCount.toLocaleString()} players
              </p>
              {totalPages > 1 && (
                <p>
                  Page {page} of {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Loading state */}
          {result === undefined ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <LoadingCard key={i} variant="player" />
              ))}
            </div>
          ) : players.length === 0 ? (
            /* Empty state */
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground">
                No players found matching your filters
              </p>
              <Button onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            /* Player grid */
            <>
              <motion.div
                key={page}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {players.map((player) => (
                  <motion.div key={player._id} variants={staggerItem}>
                    <Link
                      href={`/players/${player.slug}?type=${player.teamType}&ref=playground`}
                      prefetch={true}
                    >
                      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Player Image */}
                            <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                              {player.playerImage ? (
                                <Image
                                  src={player.playerImage}
                                  alt={player.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <User className="h-10 w-10 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Player Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{player.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {player.team}
                              </p>

                              {/* Positions */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {player.positions?.slice(0, 2).map((pos, idx) => (
                                  <Badge key={`${pos}-${idx}`} variant="secondary" className="text-xs">
                                    {pos}
                                  </Badge>
                                ))}
                              </div>

                              {/* Overall */}
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
                                <span className="text-xs text-muted-foreground ml-2">OVR</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
