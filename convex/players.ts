/**
 * Player Mutations and Queries
 * CRUD operations for NBA 2K player data
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Insert a single player into the database
 */
export const insertPlayer = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    playerUrl: v.optional(v.string()),
    team: v.string(),
    teamType: v.union(v.literal("curr"), v.literal("class"), v.literal("allt")),
    overall: v.number(),
    positions: v.optional(v.array(v.string())),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    wingspan: v.optional(v.string()),
    build: v.optional(v.string()),
    playerImage: v.optional(v.string()),
    teamImg: v.optional(v.string()),
    attributes: v.optional(v.any()),
    badges: v.optional(v.any()),
    lastUpdated: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const playerId = await ctx.db.insert("players", args);
    return playerId;
  },
});

/**
 * Helper function to upsert a player
 */
async function upsertPlayerHelper(ctx: any, args: any) {
  // Check if player exists by slug and team type
  const existing = await ctx.db
    .query("players")
    .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
    .filter((q: any) => q.eq(q.field("teamType"), args.teamType))
    .filter((q: any) => q.eq(q.field("team"), args.team))
    .first();

  if (existing) {
    // Update existing player
    await ctx.db.patch(existing._id, {
      ...args,
      lastUpdated: new Date().toISOString(),
    });
    return { _id: existing._id, action: "updated" };
  } else {
    // Insert new player
    const playerId = await ctx.db.insert("players", {
      ...args,
      createdAt: args.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
    return { _id: playerId, action: "inserted" };
  }
}

/**
 * Upsert a player - update if exists (by slug), insert if new
 */
export const upsertPlayer = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    playerUrl: v.optional(v.string()),
    team: v.string(),
    teamType: v.union(v.literal("curr"), v.literal("class"), v.literal("allt")),
    overall: v.number(),
    positions: v.optional(v.array(v.string())),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    wingspan: v.optional(v.string()),
    build: v.optional(v.string()),
    playerImage: v.optional(v.string()),
    teamImg: v.optional(v.string()),
    attributes: v.optional(v.any()),
    badges: v.optional(v.any()),
    lastUpdated: v.string(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await upsertPlayerHelper(ctx, args);
  },
});

/**
 * Bulk upsert players - efficient batch operation
 */
export const bulkUpsertPlayers = mutation({
  args: {
    players: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const results = {
      inserted: 0,
      updated: 0,
      errors: 0,
    };

    for (const player of args.players) {
      try {
        const result = await upsertPlayerHelper(ctx, player);
        if (result.action === "inserted") {
          results.inserted++;
        } else {
          results.updated++;
        }
      } catch (error) {
        console.error(`Failed to upsert player: ${player.name}`, error);
        results.errors++;
      }
    }

    return results;
  },
});

/**
 * Delete a player by ID
 */
export const deletePlayer = mutation({
  args: { id: v.id("players") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Delete all players (use with caution!)
 */
export const deleteAllPlayers = mutation({
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    for (const player of players) {
      await ctx.db.delete(player._id);
    }
    return { deleted: players.length };
  },
});

/**
 * Update player positions array (for migration)
 */
export const updatePlayerPositions = mutation({
  args: {
    playerId: v.id("players"),
    positions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      positions: args.positions,
    });
    return { success: true };
  },
});

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all players with pagination
 */
export const getAllPlayers = query({
  args: {
    paginationOpts: v.optional(v.object({ numItems: v.number(), cursor: v.union(v.string(), v.null()) })),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("players")
      .order("desc")
      .paginate(args.paginationOpts || { numItems: 50, cursor: null });

    return results;
  },
});

/**
 * Get player by ID
 */
export const getPlayerById = query({
  args: { id: v.id("players") },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.id);
    return player;
  },
});

/**
 * Get player by slug
 */
export const getPlayerBySlug = query({
  args: {
    slug: v.string(),
    teamType: v.optional(v.union(v.literal("curr"), v.literal("class"), v.literal("allt"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("players")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug));

    let players = await query.collect();

    // Filter by team type if specified
    if (args.teamType) {
      players = players.filter((p) => p.teamType === args.teamType);
    }

    // Return first match
    return players.length > 0 ? players[0] : null;
  },
});

/**
 * Search players by name
 */
export const searchPlayers = query({
  args: {
    query: v.string(),
    teamType: v.optional(v.union(v.literal("curr"), v.literal("class"), v.literal("allt"))),
  },
  handler: async (ctx, args) => {
    let players = await ctx.db.query("players").collect();

    // Filter by team type if specified
    if (args.teamType) {
      players = players.filter((p) => p.teamType === args.teamType);
    }

    // Search by name (case-insensitive)
    const searchQuery = args.query.toLowerCase();
    players = players.filter((p) =>
      p.name.toLowerCase().includes(searchQuery)
    );

    // Limit results to 100
    return players.slice(0, 100);
  },
});

/**
 * Get players by team
 */
export const getPlayersByTeam = query({
  args: {
    team: v.string(),
    teamType: v.optional(v.union(v.literal("curr"), v.literal("class"), v.literal("allt"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("players")
      .withIndex("by_team", (q) => q.eq("team", args.team));

    let players = await query.collect();

    // Filter by team type if specified
    if (args.teamType) {
      players = players.filter((p) => p.teamType === args.teamType);
    }

    // Sort by overall rating (descending)
    players.sort((a, b) => b.overall - a.overall);

    return players;
  },
});

/**
 * Get players by team type
 */
export const getPlayersByType = query({
  args: {
    teamType: v.union(v.literal("curr"), v.literal("class"), v.literal("allt")),
    minRating: v.optional(v.number()),
    maxRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let players = await ctx.db
      .query("players")
      .withIndex("by_teamType", (q) => q.eq("teamType", args.teamType))
      .collect();

    // Filter by rating range if specified
    if (args.minRating !== undefined) {
      players = players.filter((p) => p.overall >= args.minRating!);
    }
    if (args.maxRating !== undefined) {
      players = players.filter((p) => p.overall <= args.maxRating!);
    }

    return players;
  },
});

/**
 * Get all teams (unique team names with player counts)
 */
export const getTeams = query({
  args: {
    teamType: v.optional(v.union(v.literal("curr"), v.literal("class"), v.literal("allt"))),
  },
  handler: async (ctx, args) => {
    let players = await ctx.db.query("players").collect();

    // Filter by team type if specified
    if (args.teamType) {
      players = players.filter((p) => p.teamType === args.teamType);
    }

    // Group by team
    const teamsMap = new Map<string, { name: string; type: string; playerCount: number; avgRating: number; logo: string }>();

    for (const player of players) {
      const key = `${player.team}-${player.teamType}`;
      if (!teamsMap.has(key)) {
        teamsMap.set(key, {
          name: player.team,
          type: player.teamType,
          playerCount: 0,
          avgRating: 0,
          logo: player.teamImg || "",
        });
      }

      const team = teamsMap.get(key)!;
      team.playerCount++;
      team.avgRating += player.overall;
    }

    // Calculate average ratings
    const teams = Array.from(teamsMap.values()).map((team) => ({
      ...team,
      avgRating: Math.round(team.avgRating / team.playerCount),
    }));

    // Sort by name
    teams.sort((a, b) => a.name.localeCompare(b.name));

    return teams;
  },
});

/**
 * Get database statistics
 */
export const getStats = query({
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();

    const stats = {
      totalPlayers: players.length,
      byType: {
        curr: players.filter((p) => p.teamType === "curr").length,
        class: players.filter((p) => p.teamType === "class").length,
        allt: players.filter((p) => p.teamType === "allt").length,
      },
      uniqueTeams: new Set(players.map((p) => p.team)).size,
      avgOverall: players.length > 0
        ? Math.round(players.reduce((sum, p) => sum + p.overall, 0) / players.length)
        : 0,
      lastUpdated: players.length > 0
        ? players.reduce((latest, p) => (p.lastUpdated > latest ? p.lastUpdated : latest), players[0].lastUpdated)
        : null,
    };

    return stats;
  },
});
