/**
 * Debug script to check team selector
 */
import { chromium } from 'playwright';

async function debugTeamSelector() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.2kratings.com/current-teams', {
    waitUntil: 'domcontentloaded'
  });

  // Current selector
  const teams1 = await page.$$eval('td:first-child a', (links) => {
    return links.map(link => ({
      text: link.textContent.trim(),
      href: link.getAttribute('href')
    }));
  });

  console.log('Current selector (td:first-child a):', teams1.length, 'teams');
  console.log('First 5:', teams1.slice(0, 5));
  console.log('Last 5:', teams1.slice(-5));

  // Try alternative selector - only from table body
  const teams2 = await page.$$eval('tbody td:first-child a', (links) => {
    return links.map(link => ({
      text: link.textContent.trim(),
      href: link.getAttribute('href')
    }));
  });

  console.log('\nAlternative (tbody td:first-child a):', teams2.length, 'teams');

  // Try unique filter
  const unique = [...new Map(teams1.map(t => [t.text, t])).values()];
  console.log('\nUnique teams:', unique.length);

  await browser.close();
}

debugTeamSelector();
