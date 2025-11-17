/**
 * Scrape All Team Types
 * Runs the scraper for current, classic, and all-time teams sequentially
 */

import { runScraper } from './runScraper.js';

async function scrapeAll() {
  console.log('='.repeat(60));
  console.log('Starting full scrape: Current, Classic, and All-Time teams');
  console.log('='.repeat(60));
  console.log('');

  const results = {
    curr: null,
    class: null,
    allt: null
  };

  try {
    // Scrape current teams
    console.log('📊 STEP 1/3: Scraping current NBA teams...');
    results.curr = await runScraper({ teamType: 'curr' });
    console.log('✅ Current teams complete\n');

    // Scrape classic teams
    console.log('📊 STEP 2/3: Scraping classic NBA teams...');
    results.class = await runScraper({ teamType: 'class' });
    console.log('✅ Classic teams complete\n');

    // Scrape all-time teams
    console.log('📊 STEP 3/3: Scraping all-time NBA teams...');
    results.allt = await runScraper({ teamType: 'allt' });
    console.log('✅ All-time teams complete\n');

    // Summary
    console.log('='.repeat(60));
    console.log('SCRAPING COMPLETE - SUMMARY');
    console.log('='.repeat(60));

    const totalPlayers =
      results.curr.playersScraped +
      results.class.playersScraped +
      results.allt.playersScraped;

    const totalAdded =
      results.curr.playersAdded +
      results.class.playersAdded +
      results.allt.playersAdded;

    const totalUpdated =
      results.curr.playersUpdated +
      results.class.playersUpdated +
      results.allt.playersUpdated;

    const totalErrors =
      results.curr.errors.length +
      results.class.errors.length +
      results.allt.errors.length;

    console.log(`Current teams:   ${results.curr.playersScraped} players (${results.curr.teamsScraped} teams)`);
    console.log(`Classic teams:   ${results.class.playersScraped} players (${results.class.teamsScraped} teams)`);
    console.log(`All-time teams:  ${results.allt.playersScraped} players (${results.allt.teamsScraped} teams)`);
    console.log('');
    console.log(`Total players:   ${totalPlayers}`);
    console.log(`Total added:     ${totalAdded}`);
    console.log(`Total updated:   ${totalUpdated}`);
    console.log(`Total errors:    ${totalErrors}`);
    console.log('='.repeat(60));

    const allSuccess = results.curr.success && results.class.success && results.allt.success;
    process.exit(allSuccess ? 0 : 1);

  } catch (error) {
    console.error('❌ Fatal error during scraping:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAll();
}

export { scrapeAll };
