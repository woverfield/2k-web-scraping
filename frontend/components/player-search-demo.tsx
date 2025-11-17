"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlayerSearchDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search players
  const allPlayers = useQuery(
    api.players.searchPlayers,
    debouncedQuery.trim().length >= 2
      ? { query: debouncedQuery }
      : "skip"
  );

  // Limit to first 5 results for display
  const players = allPlayers?.slice(0, 5);

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Try searching for 'LeBron' or 'Curry'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {debouncedQuery.trim().length >= 2 && (
        <div className="mt-4 space-y-2">
          {players === undefined ? (
            <div className="text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : players.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No players found. Try another search term.
            </div>
          ) : (
            players.map((player) => (
              <Card key={player._id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  {player.playerImage && (
                    <img
                      src={player.playerImage}
                      alt={player.name}
                      className="h-16 w-16 rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{player.name}</h4>
                      <Badge variant="secondary" className="shrink-0">
                        {player.overall}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {player.team} • {player.positions?.join(", ") || "N/A"}
                    </p>
                  </div>
                  {player.teamImg && (
                    <img
                      src={player.teamImg}
                      alt={player.team}
                      className="h-12 w-12 object-contain opacity-50"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {debouncedQuery.trim().length > 0 && debouncedQuery.trim().length < 2 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}
