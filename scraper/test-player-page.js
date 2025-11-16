/**
 * Test script to check a single player page and validate selectors
 */
import { chromium } from 'playwright';

async function testPlayerPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Test with LeBron James
  await page.goto('https://www.2kratings.com/lebron-james', {
    waitUntil: 'domcontentloaded'
  });

  console.log('=== Player Page Structure ===\n');

  // Test position selector
  const position = await page.$eval('.player-vitals .vitals-item:first-child .value', el => el.textContent.trim()).catch(() => null);
  console.log('Position:', position);

  // Test height selector
  const height = await page.$eval('.player-vitals .vitals-item:nth-child(2) .value', el => el.textContent.trim()).catch(() => null);
  console.log('Height:', height);

  // Test weight selector
  const weight = await page.$eval('.player-vitals .vitals-item:nth-child(3) .value', el => el.textContent.trim()).catch(() => null);
  console.log('Weight:', weight);

  // Test wingspan
  const wingspan = await page.$eval('.player-vitals .vitals-item:nth-child(4) .value', el => el.textContent.trim()).catch(() => null);
  console.log('Wingspan:', wingspan);

  // Test build
  const build = await page.$eval('.player-vitals .vitals-item:nth-child(5) .value', el => el.textContent.trim()).catch(() => null);
  console.log('Build:', build);

  // Test player image
  const playerImage = await page.$eval('.player-image img', el => el.src).catch(() => null);
  console.log('Player Image:', playerImage);

  console.log('\n=== Attributes ===\n');

  // Test attributes - they appear to be in rows
  const attributes = await page.$$eval('.player-attributes .attribute-row', (rows) => {
    return rows.map(row => ({
      name: row.querySelector('.attribute-name')?.textContent.trim(),
      value: row.querySelector('.attribute-value')?.textContent.trim()
    }));
  }).catch(() => []);

  console.log('Found', attributes.length, 'attributes');
  console.log('Sample attributes:', attributes.slice(0, 5));

  console.log('\n=== Badges ===\n');

  // Test badges
  const badges = await page.$$eval('.badge-item', (items) => {
    return items.map(item => ({
      name: item.querySelector('.badge-name')?.textContent.trim(),
      tier: item.querySelector('.badge-tier')?.textContent.trim()
    }));
  }).catch(() => []);

  console.log('Found', badges.length, 'badges');
  console.log('Sample badges:', badges.slice(0, 5));

  await browser.close();
}

testPlayerPage();
