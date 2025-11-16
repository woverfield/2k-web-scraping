/**
 * Test the new player scraper with a single player
 */
import { chromium } from 'playwright';
import { scrapePlayerDetails } from './playerScraper.js';

async function testNewScraper() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const testPlayer = {
    name: 'LeBron James',
    playerUrl: 'https://www.2kratings.com/lebron-james',
    team: 'Los Angeles Lakers',
    teamType: 'curr',
    overall: 94
  };

  console.log('Testing new scraper with:', testPlayer.name);
  console.log('=====================================\n');

  const result = await scrapePlayerDetails(page, testPlayer);

  console.log('Result:');
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
}

testNewScraper();
