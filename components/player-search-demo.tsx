"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { api } from "../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { FlipCard } from "@/components/playground/flip-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MasonryRoot, MasonryItem } from "@/components/ui/masonry";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Card dimensions for column calculation
const CARD_WIDTH = 160;
const GAP = 12;

export function PlayerSearchDemo() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  // Calculate columns based on container width
  const [columns, setColumns] = React.useState(6);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const calculateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cols = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
        setColumns(Math.max(1, cols));
      }
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);

  // Items to show - 2 rows for featured, 3 rows for search
  const featuredCount = columns * 2;
  const searchCount = columns * 3;

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
    ? searchResults?.slice(0, searchCount)
    : featuredPlayers?.slice(0, featuredCount);

  const isSearching = debouncedQuery.trim().length >= 2;
  const isLoading = isSearching && searchResults === undefined;
  const showFeatured = !isSearching && featuredPlayers && featuredPlayers.length > 0;

  return (
    <div className="w-full" ref={containerRef}>
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
          <MasonryRoot
            columnWidth={160}
            gap={{ column: 12, row: 12 }}
            itemHeight={240}
            overscan={2}
            linear
            defaultWidth={1200}
            defaultHeight={800}
          >
            {players?.map((player) => (
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
        )}

        {/* Featured Players (when no search) */}
        {showFeatured && (
          <div>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Top Rated Players
            </p>
            <MasonryRoot
              columnWidth={160}
              gap={{ column: 12, row: 12 }}
              itemHeight={240}
              overscan={2}
              linear
              defaultWidth={1200}
              defaultHeight={800}
            >
              {players?.map((player) => (
                <MasonryItem key={player._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <FlipCard player={player} />
                  </motion.div>
                </MasonryItem>
              ))}
            </MasonryRoot>
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
