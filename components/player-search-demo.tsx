"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { PlayerCard } from "@/components/player-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function PlayerSearchDemo() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search players
  const searchResults = useQuery(
    api.players.searchPlayers,
    debouncedQuery.trim().length >= 2
      ? { query: debouncedQuery }
      : "skip"
  );

  // Get featured/top players when no search
  const featuredPlayers = useQuery(
    api.players.getPlayersByType,
    debouncedQuery.trim().length < 2
      ? { teamType: "curr", minRating: 90 }
      : "skip"
  );

  // Use search results or featured players
  const players = debouncedQuery.trim().length >= 2
    ? searchResults?.slice(0, 12)
    : featuredPlayers?.slice(0, 8);

  const isSearching = debouncedQuery.trim().length >= 2;
  const isLoading = isSearching && searchResults === undefined;
  const showFeatured = !isSearching && featuredPlayers && featuredPlayers.length > 0;

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for any player..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 h-12 text-base"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results Grid */}
      <div className="mt-8">
        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {/* No Results */}
        {isSearching && searchResults && searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No players found for "{debouncedQuery}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try a different search term
            </p>
          </div>
        )}

        {/* Search Results */}
        {isSearching && searchResults && searchResults.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {players?.map((player) => (
                <motion.div
                  key={player._id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <PlayerCard
                    player={player}
                    href={`/players/${player.slug}?type=${player.teamType}&team=${encodeURIComponent(player.team)}`}
                    size="sm"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Featured Players (when no search) */}
        {showFeatured && (
          <div>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Top Rated Players
            </p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {players?.map((player) => (
                <motion.div key={player._id} variants={staggerItem}>
                  <PlayerCard
                    player={player}
                    href={`/players/${player.slug}?type=${player.teamType}&team=${encodeURIComponent(player.team)}`}
                    size="sm"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Hint when typing */}
        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Type at least 2 characters to search
          </p>
        )}
      </div>
    </div>
  );
}
