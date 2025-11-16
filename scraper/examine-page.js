/**
 * Save screenshot and examine HTML structure of player page
 */
import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';

async function examinePage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const playerUrl = 'https://www.2kratings.com/lebron-james';

  console.log('Loading:', playerUrl);
  await page.goto(playerUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'player-page.png', fullPage: true });
  console.log('Screenshot saved to player-page.png');

  // Get full HTML
  const html = await page.content();
  await writeFile('player-page.html', html);
  console.log('HTML saved to player-page.html');

  // Try to find attribute/rating patterns
  const ratings = await page.evaluate(() => {
    const results = [];

    // Look for any numbers that could be ratings (0-99)
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.match(/^\d{1,2}$/)) {
        const num = parseInt(text);
        if (num >= 25 && num <= 99) {
          results.push({
            value: text,
            tag: el.tagName,
            className: typeof el.className === 'string' ? el.className : '',
            parent: el.parentElement?.tagName
          });
        }
      }
    });

    return results.slice(0, 20); // First 20 matches
  });

  console.log('\nFound potential attribute values (25-99):');
  console.log(JSON.stringify(ratings, null, 2));

  console.log('\n👁️  Check player-page.png to see the page visually');
  console.log('📄 Check player-page.html to see the HTML structure\n');

  await browser.close();
}

examinePage();
