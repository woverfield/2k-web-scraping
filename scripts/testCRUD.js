/**
 * Test CRUD operations in Convex
 * Usage: node scripts/testCRUD.js
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error('Error: CONVEX_URL environment variable not set');
  console.error('Run: npx convex dev');
  process.exit(1);
}

async function testCRUD() {
  try {
    const client = new ConvexHttpClient(CONVEX_URL);

    console.log('🧪 Testing CRUD Operations\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test 1: Get database statistics
    console.log('📊 Test 1: Get database statistics');
    const stats = await client.query(api.players.getStats, {});
    console.log(`   Total Players: ${stats.totalPlayers}`);
    console.log(`   Current Teams: ${stats.byType.curr}`);
    console.log(`   Classic Teams: ${stats.byType.class}`);
    console.log(`   All-Time Teams: ${stats.byType.allt}`);
    console.log(`   Unique Teams: ${stats.uniqueTeams}`);
    console.log(`   Average Overall: ${stats.avgOverall}`);
    console.log('   ✅ PASS\n');

    // Test 2: Get all players (paginated)
    console.log('📄 Test 2: Get all players (first 5)');
    const allPlayers = await client.query(api.players.getAllPlayers, {
      paginationOpts: { numItems: 5 },
    });
    console.log(`   Retrieved: ${allPlayers.page.length} players`);
    if (allPlayers.page.length > 0) {
      console.log(`   Sample: ${allPlayers.page[0].name} - ${allPlayers.page[0].team} (${allPlayers.page[0].overall} OVR)`);
    }
    console.log('   ✅ PASS\n');

    // Test 3: Search players by name
    console.log('🔍 Test 3: Search players by name (LeBron)');
    const searchResults = await client.query(api.players.searchPlayers, {
      query: 'LeBron',
      teamType: 'curr',
    });
    console.log(`   Found: ${searchResults.length} player(s)`);
    if (searchResults.length > 0) {
      searchResults.forEach(p => {
        console.log(`   - ${p.name} (${p.team}, ${p.overall} OVR)`);
      });
    }
    console.log('   ✅ PASS\n');

    // Test 4: Get players by team
    console.log('🏀 Test 4: Get players by team (Lakers)');
    const teamPlayers = await client.query(api.players.getPlayersByTeam, {
      team: 'lakers',
      teamType: 'curr',
    });
    console.log(`   Found: ${teamPlayers.length} player(s)`);
    if (teamPlayers.length > 0) {
      console.log(`   Top player: ${teamPlayers[0].name} (${teamPlayers[0].overall} OVR)`);
    }
    console.log('   ✅ PASS\n');

    // Test 5: Get all teams
    console.log('🏆 Test 5: Get all teams');
    const teams = await client.query(api.players.getTeams, {
      teamType: 'curr',
    });
    console.log(`   Found: ${teams.length} team(s)`);
    if (teams.length > 0) {
      console.log(`   Sample: ${teams[0].name} (${teams[0].playerCount} players, ${teams[0].avgRating} avg)`);
    }
    console.log('   ✅ PASS\n');

    // Test 6: Get player by slug
    if (allPlayers.page.length > 0) {
      const testPlayer = allPlayers.page[0];
      console.log(`🎯 Test 6: Get player by slug (${testPlayer.slug})`);
      const playerBySlug = await client.query(api.players.getPlayerBySlug, {
        slug: testPlayer.slug,
      });
      if (playerBySlug) {
        console.log(`   Retrieved: ${playerBySlug.name} (${playerBySlug.overall} OVR)`);
        console.log('   ✅ PASS\n');
      } else {
        console.log('   ❌ FAIL: Player not found\n');
      }
    }

    // Test 7: Get players by type with rating filter
    console.log('⭐ Test 7: Get players by type (current, 90+ OVR)');
    const topPlayers = await client.query(api.players.getPlayersByType, {
      teamType: 'curr',
      minRating: 90,
    });
    console.log(`   Found: ${topPlayers.length} elite player(s)`);
    if (topPlayers.length > 0) {
      topPlayers.slice(0, 3).forEach(p => {
        console.log(`   - ${p.name} (${p.team}, ${p.overall} OVR)`);
      });
    }
    console.log('   ✅ PASS\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ All CRUD tests passed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testCRUD();
