/**
 * Test scraping a single player to debug selectors
 */
import { chromium } from 'playwright';
import { PLAYER_SELECTORS, SCRAPER_OPTIONS } from './config.js';
import { writeFile } from 'fs/promises';

async function testSinglePlayer() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const playerUrl = 'https://www.2kratings.com/lebron-james';

  console.log('Loading player page:', playerUrl);
  await page.goto(playerUrl, { waitUntil: SCRAPER_OPTIONS.waitUntil });

  // Wait a bit for content to load
  await page.waitForTimeout(2000);

  console.log('\n=== Testing Current Selectors ===\n');

  // Test the existing playerScraper logic
  const playerDetails = await page.evaluate((selectors) => {
    const details = {};

    const getText = (selector) => {
      const el = document.querySelector(selector);
      return el ? el.textContent.trim() : '';
    };

    const getAttrValue = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const value = el.textContent.trim();
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Test all selectors
    details.build = getText(selectors.build);
    details.position = getText(selectors.position);
    details.height = getText(selectors.height);
    details.weight = getText(selectors.weight);
    details.wingspan = getText(selectors.wingspan);

    const imgEl = document.querySelector(selectors.image);
    details.playerImage = imgEl ? imgEl.src : '';

    // Test a few attributes
    details.closeShot = getAttrValue(selectors.attributes.closeShot);
    details.midRange = getAttrValue(selectors.attributes.midRange);
    details.threePoint = getAttrValue(selectors.attributes.threePoint);

    return details;
  }, PLAYER_SELECTORS);

  console.log('Results from current selectors:');
  console.log(JSON.stringify(playerDetails, null, 2));

  console.log('\n=== Let me find what actually exists ===\n');

  // Now let's find what's actually on the page
  const actualContent = await page.evaluate(() => {
    const result = {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim()
    };

    // Try to find position/height/weight anywhere on page
    result.vitalsText = [];
    const allElements = document.querySelectorAll('*');
    for (let el of allElements) {
      const text = el.textContent?.trim();
      if (text && text.length < 100 && text.length > 0) {
        if (text.match(/^\d+'\d+"$/) ||  // height pattern
            text.match(/^\d+\s*lbs?$/i) || // weight pattern
            text.match(/^(PG|SG|SF|PF|C)$/i)) { // position
          result.vitalsText.push({
            text,
            tag: el.tagName,
            className: typeof el.className === 'string' ? el.className : ''
          });
        }
      }
    }

    return result;
  });

  console.log('Actual page content:');
  console.log(JSON.stringify(actualContent, null, 2));

  await writeFile('player-debug.json', JSON.stringify({ playerDetails, actualContent }, null, 2));
  console.log('\nSaved full debug output to player-debug.json');

  await browser.close();
}

testSinglePlayer();
