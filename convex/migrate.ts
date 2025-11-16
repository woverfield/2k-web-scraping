/**
 * Data Migration Script
 * Imports scraped player data from JSON into Convex database
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Import players from scraped JSON data
 * This is a public mutation that can be called from scripts
 */
export const importPlayers = mutation({
  args: {
    players: v.array(v.any()),
    clearExisting: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    // Clear existing data if requested
    if (args.clearExisting) {
      const existing = await ctx.db.query("players").collect();
      for (const player of existing) {
        await ctx.db.delete(player._id);
      }
      console.log(`Cleared ${existing.length} existing players`);
    }

    // Helper function to create slug from name
    const slugify = (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    // Import players
    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const playerData of args.players) {
      try {
        // Generate slug if not present
        const slug = playerData.slug || slugify(playerData.name);

        // Check if player exists (by slug, team, and teamType)
        const existing = await ctx.db
          .query("players")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .filter((q) => q.eq(q.field("teamType"), playerData.teamType))
          .filter((q) => q.eq(q.field("team"), playerData.team))
          .first();

        if (existing) {
          // Update existing player
          await ctx.db.patch(existing._id, {
            ...playerData,
            slug,
            lastUpdated: new Date().toISOString(),
          });
          updated++;
        } else {
          // Insert new player
          await ctx.db.insert("players", {
            ...playerData,
            slug,
            createdAt: playerData.createdAt || new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          });
          imported++;
        }
      } catch (error) {
        console.error(`Failed to import player: ${playerData.name}`, error);
        errors++;
      }
    }

    const duration = Date.now() - startTime;

    return {
      success: true,
      imported,
      updated,
      errors,
      total: args.players.length,
      duration: `${(duration / 1000).toFixed(2)}s`,
    };
  },
});

/**
 * Get migration status - shows current database state
 */
export const getMigrationStatus = mutation({
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();

    const byType = {
      curr: players.filter((p) => p.teamType === "curr").length,
      class: players.filter((p) => p.teamType === "class").length,
      allt: players.filter((p) => p.teamType === "allt").length,
    };

    const uniqueTeams = new Set(players.map((p) => p.team)).size;

    return {
      totalPlayers: players.length,
      byType,
      uniqueTeams,
      lastUpdated: players.length > 0
        ? players.reduce((latest, p) =>
            p.lastUpdated > latest ? p.lastUpdated : latest,
            players[0].lastUpdated
          )
        : null,
    };
  },
});
