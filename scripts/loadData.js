/**
 * Load scraped data into Convex
 * Usage: node scripts/loadData.js <path-to-json-file>
 */

import { readFile } from 'fs/promises';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error('Error: CONVEX_URL environment variable not set');
  console.error('Run: npx convex dev');
  process.exit(1);
}

async function loadData(filePath, clearExisting = false) {
  try {
    console.log('Loading data from:', filePath);
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Extract players array from the JSON structure
    const players = jsonData.players || jsonData;

    if (!Array.isArray(players)) {
      throw new Error('Invalid JSON format: expected array of players');
    }

    console.log(`Found ${players.length} players to import`);
    console.log(`Clear existing data: ${clearExisting ? 'YES' : 'NO'}`);

    // Initialize Convex client
    const client = new ConvexHttpClient(CONVEX_URL);

    console.log('\nStarting import...');

    // Call the internal mutation
    const result = await client.mutation(api.migrate.importPlayers, {
      players,
      clearExisting,
    });

    console.log('\n✅ Import complete!');
    console.log('───────────────────────────────');
    console.log(`Total processed: ${result.total}`);
    console.log(`Imported (new): ${result.imported}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Errors: ${result.errors}`);
    console.log(`Duration: ${result.duration}`);
    console.log('───────────────────────────────');

    // Get final stats
    const status = await client.mutation(api.migrate.getMigrationStatus, {});
    console.log('\n📊 Database Status:');
    console.log(`Total Players: ${status.totalPlayers}`);
    console.log(`Current Teams: ${status.byType.curr}`);
    console.log(`Classic Teams: ${status.byType.class}`);
    console.log(`All-Time Teams: ${status.byType.allt}`);
    console.log(`Unique Teams: ${status.uniqueTeams}`);
    console.log(`Last Updated: ${status.lastUpdated}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const filePath = args[0];
const clearFlag = args.includes('--clear');

if (!filePath) {
  console.log('Usage: node scripts/loadData.js <path-to-json> [--clear]');
  console.log('');
  console.log('Options:');
  console.log('  --clear    Clear existing data before import');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/loadData.js test-output.json');
  console.log('  node scripts/loadData.js players.json --clear');
  process.exit(1);
}

loadData(filePath, clearFlag);
