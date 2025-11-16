/**
 * Inspect actual HTML structure of player page
 */
import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';

async function inspectPlayerPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Test with LeBron James
  await page.goto('https://www.2kratings.com/lebron-james', {
    waitUntil: 'networkidle'
  });

  // Wait a bit for any dynamic content
  await page.waitForTimeout(3000);

  // Get the full HTML
  const html = await page.content();
  await writeFile('player-page.html', html);
  console.log('Saved HTML to player-page.html');

  // Try to find any text that looks like attributes
  const allText = await page.$$eval('*', els =>
    els.map(el => ({
      tag: el.tagName,
      class: el.className,
      text: el.textContent?.trim().substring(0, 50)
    })).filter(item =>
      item.text && (
        item.text.includes('Shot') ||
        item.text.includes('Dunk') ||
        item.text.includes('Position') ||
        item.text.includes('Height') ||
        item.text.includes('PG') ||
        item.text.includes('SF') ||
        item.text.includes('PF')
      )
    )
  );

  console.log('\nFound elements with relevant text:');
  console.log(JSON.stringify(allText.slice(0, 20), null, 2));

  await browser.close();
}

inspectPlayerPage();
