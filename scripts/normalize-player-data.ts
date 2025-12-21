/**
 * Data Migration Script: Normalize Player Attributes
 *
 * This script normalizes all player attributes in the database to use
 * standardized attribute names. It updates existing records that have
 * legacy attribute names like "layup" → "drivingLayup" and
 * "overallDurability" → "durability".
 *
 * Usage:
 *   npx tsx scripts/normalize-player-data.ts
 *
 * Options:
 *   --dry-run: Preview changes without applying them
 *   --team-type=curr|class|allt: Only normalize specific team type
 */

import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Attribute name mapping (same as in scraper)
const ATTRIBUTE_NAME_MAP: Record<string, string> = {
  'layup': 'drivingLayup',
  'overallDurability': 'durability',
};

/**
 * Normalize attribute name - handles both legacy names and PascalCase
 */
function normalizeAttributeName(name: string): string {
  // First check direct mapping
  if (ATTRIBUTE_NAME_MAP[name]) {
    return ATTRIBUTE_NAME_MAP[name];
  }

  // Handle PascalCase -> camelCase conversion
  // E.g., "DefensiveRebound" -> "defensiveRebound"
  if (name && name[0] === name[0].toUpperCase()) {
    const camelCase = name[0].toLowerCase() + name.slice(1);
    // Check if the camelCase version exists in our map
    return ATTRIBUTE_NAME_MAP[camelCase] || camelCase;
  }

  return name;
}

interface MigrationStats {
  totalPlayers: number;
  playersNeedingMigration: number;
  playersMigrated: number;
  attributesNormalized: number;
  errors: number;
}

/**
 * Normalize a player's attributes object
 */
function normalizePlayerAttributes(attributes: Record<string, any>): {
  normalized: Record<string, any>;
  changed: boolean;
  changedKeys: string[];
} {
  const normalized: Record<string, any> = {};
  let changed = false;
  const changedKeys: string[] = [];

  for (const [key, value] of Object.entries(attributes)) {
    const normalizedKey = normalizeAttributeName(key);

    if (normalizedKey !== key) {
      changed = true;
      changedKeys.push(`${key} → ${normalizedKey}`);
    }

    normalized[normalizedKey] = value;
  }

  return { normalized, changed, changedKeys };
}

/**
 * Main migration function
 */
async function migratePlayerData(options: {
  dryRun?: boolean;
  teamType?: 'curr' | 'class' | 'allt';
}) {
  const deploymentUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!deploymentUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_CONVEX_URL environment variable.\n" +
      "Make sure you have a .env.local file with your Convex deployment URL."
    );
  }

  console.log("🔄 Starting player attribute normalization...");
  console.log(`📊 Mode: ${options.dryRun ? 'DRY RUN (preview only)' : 'LIVE MIGRATION'}`);
  if (options.teamType) {
    console.log(`🎯 Team Type Filter: ${options.teamType}`);
  }
  console.log("");

  const client = new ConvexHttpClient(deploymentUrl);

  const stats: MigrationStats = {
    totalPlayers: 0,
    playersNeedingMigration: 0,
    playersMigrated: 0,
    attributesNormalized: 0,
    errors: 0,
  };

  try {
    // Fetch all players (or filtered by team type)
    console.log("📥 Fetching players from database...");

    let allPlayers: any[];

    if (options.teamType) {
      allPlayers = await client.query(api.players.getPlayersByType, {
        teamType: options.teamType,
      });
    } else {
      // Fetch all team types
      const [currPlayers, classPlayers, alltPlayers] = await Promise.all([
        client.query(api.players.getPlayersByType, { teamType: 'curr' }),
        client.query(api.players.getPlayersByType, { teamType: 'class' }),
        client.query(api.players.getPlayersByType, { teamType: 'allt' }),
      ]);
      allPlayers = [...currPlayers, ...classPlayers, ...alltPlayers];
    }

    stats.totalPlayers = allPlayers.length;
    console.log(`✅ Found ${stats.totalPlayers} players\n`);

    // Process each player
    for (const player of allPlayers) {
      if (!player.attributes) continue;

      const { normalized, changed, changedKeys } = normalizePlayerAttributes(player.attributes);

      if (changed) {
        stats.playersNeedingMigration++;
        stats.attributesNormalized += changedKeys.length;

        console.log(`🔍 Player: ${player.name} (${player.team})`);
        console.log(`   Team Type: ${player.teamType}`);
        console.log(`   Changes:`);
        changedKeys.forEach(change => {
          console.log(`   - ${change}`);
        });

        if (!options.dryRun) {
          try {
            const adminKey = process.env.ADMIN_API_KEY;
            if (!adminKey) {
              throw new Error("Missing ADMIN_API_KEY environment variable");
            }
            // Update the player in the database
            await client.mutation(api.players.adminUpdatePlayer, {
              adminKey,
              id: player._id as Id<"players">,
              attributes: normalized,
            });
            stats.playersMigrated++;
            console.log(`   ✅ Updated\n`);
          } catch (error) {
            stats.errors++;
            console.error(`   ❌ Error updating: ${error}\n`);
          }
        } else {
          console.log(`   📋 Would update (dry run)\n`);
        }
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total Players Scanned:       ${stats.totalPlayers}`);
    console.log(`Players Needing Migration:   ${stats.playersNeedingMigration}`);
    console.log(`Attributes Normalized:       ${stats.attributesNormalized}`);

    if (!options.dryRun) {
      console.log(`Players Successfully Updated: ${stats.playersMigrated}`);
      console.log(`Errors:                      ${stats.errors}`);
    } else {
      console.log(`\n⚠️  DRY RUN MODE - No changes were made to the database`);
      console.log(`Run without --dry-run to apply these changes`);
    }
    console.log("=".repeat(60) + "\n");

    if (stats.playersNeedingMigration === 0) {
      console.log("✨ All player data is already normalized!");
    } else if (!options.dryRun && stats.errors === 0) {
      console.log("✅ Migration completed successfully!");
    } else if (!options.dryRun && stats.errors > 0) {
      console.log("⚠️  Migration completed with errors. Check logs above.");
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: {
  dryRun?: boolean;
  teamType?: 'curr' | 'class' | 'allt';
} = {};

for (const arg of args) {
  if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg.startsWith('--team-type=')) {
    const teamType = arg.split('=')[1] as 'curr' | 'class' | 'allt';
    if (['curr', 'class', 'allt'].includes(teamType)) {
      options.teamType = teamType;
    } else {
      console.error(`Invalid team type: ${teamType}`);
      console.error(`Valid options: curr, class, allt`);
      process.exit(1);
    }
  }
}

// Run migration
migratePlayerData(options);
