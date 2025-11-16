/**
 * Player Detail Scraper
 * Scrapes comprehensive player data from individual player pages
 * Updated to work with actual 2kratings.com HTML structure
 */

import { SCRAPER_OPTIONS } from './config.js';
import { normalizeUrl, logProgress, logError, delay, slugify } from './utils.js';

/**
 * Scrape detailed player data from individual player page
 * @param {Page} page - Playwright page instance
 * @param {Object} basicPlayer - Basic player data from roster scrape
 * @returns {Promise<Object|null>} Enhanced player object with detailed attributes
 */
export async function scrapePlayerDetails(page, basicPlayer) {
  if (!basicPlayer.playerUrl) {
    logError(`No player URL for ${basicPlayer.name}, skipping detailed scrape`);
    return enhanceBasicPlayer(basicPlayer);
  }

  const playerUrl = normalizeUrl(basicPlayer.playerUrl);

  try {
    await page.goto(playerUrl, { waitUntil: SCRAPER_OPTIONS.waitUntil });

    // Scrape all player details using the ACTUAL HTML structure
    const playerDetails = await page.evaluate(() => {
      const details = {};

      // Extract physical stats and build from paragraph text
      const paragraphs = Array.from(document.querySelectorAll('p'));
      for (const p of paragraphs) {
        const text = p.textContent;

        // Extract height - try both formats
        // Format 1: "6 feet 9 inches" (current teams)
        let heightMatch = text.match(/(\d+)\s*feet\s*(\d+)\s*inches/);
        if (heightMatch) {
          details.height = `${heightMatch[1]}'${heightMatch[2]}"`;
        } else {
          // Format 2: "Height: 6'7" (201cm)" (classic/all-time teams)
          heightMatch = text.match(/Height:\s*(\d+)'(\d+)"/);
          if (heightMatch) {
            details.height = `${heightMatch[1]}'${heightMatch[2]}"`;
          }
        }

        // Extract weight - try both formats
        // Format 1: "weighs 250 pounds" (current teams)
        let weightMatch = text.match(/weighs.*?(\d+)\s*pounds/);
        if (weightMatch) {
          details.weight = `${weightMatch[1]} lbs`;
        } else {
          // Format 2: "Weight: 200lbs (90kg)" (classic/all-time teams)
          weightMatch = text.match(/Weight:\s*(\d+)lbs/);
          if (weightMatch) {
            details.weight = `${weightMatch[1]} lbs`;
          }
        }

        // Extract wingspan - try both formats
        // Format 1: "wingspan of 7 feet" (current teams)
        let wingspanMatch = text.match(/wingspan.*?(\d+)\s*feet(?:\s*(\d+)\s*inches)?/);
        if (wingspanMatch) {
          const feet = wingspanMatch[1];
          const inches = wingspanMatch[2] || '0';
          details.wingspan = `${feet}'${inches}"`;
        } else {
          // Format 2: "Wingspan: 6'10" (208cm)" (classic/all-time teams)
          wingspanMatch = text.match(/Wingspan:\s*(\d+)'(\d+)"/);
          if (wingspanMatch) {
            details.wingspan = `${wingspanMatch[1]}'${wingspanMatch[2]}"`;
          }
        }

        // Extract build (e.g., "Physical Post Point Forward Build")
        const buildMatch = text.match(/(\w+\s+\w+(?:\s+\w+)?)\s+Build/);
        if (buildMatch) {
          details.build = buildMatch[1];
        }

        // Extract position from paragraph (e.g., "Position: SF / SG")
        if (text.includes('Position:')) {
          const positionMatch = text.match(/Position:\s*(.+)/);
          if (positionMatch) {
            const positionStr = positionMatch[1].trim();
            // Parse into array for filtering: "SF / SG" -> ["SF", "SG"]
            details.positions = positionStr.split('/').map(p => p.trim());
          }
        }
      }

      // Extract player image - try multiple selectors for different page layouts
      let playerImgEl = document.querySelector('a[data-lightbox="player"] img');
      if (!playerImgEl) {
        // Classic/all-time teams use a different structure
        playerImgEl = document.querySelector('.profile-photo-bg img');
      }
      if (!playerImgEl) {
        // Fallback: find image with alt containing "NBA 2K"
        playerImgEl = document.querySelector('img[alt*="NBA 2K"]');
      }
      if (playerImgEl) {
        details.playerImage = playerImgEl.dataset.src || playerImgEl.src || '';
      }

      // Extract all attributes from list items
      const attributes = {};
      const attributeListItems = document.querySelectorAll('li.mb-1');

      for (const li of attributeListItems) {
        const span = li.querySelector('.attribute-box');
        if (!span) continue;

        const value = parseInt(span.textContent.trim());
        if (isNaN(value)) continue;

        // Get attribute name (text after the span)
        let attributeName = li.textContent.replace(span.textContent, '').trim();
        // Remove trailing whitespace and help icons
        attributeName = attributeName.split('\n')[0].trim();

        // Convert attribute name to camelCase key
        const key = attributeName
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
          .replace(/^(.)/, (_, c) => c.toLowerCase())
          .replace(/-/g, '')
          .replace(/^\d+/, ''); // Remove leading digits

        if (key && key.length > 1) {
          attributes[key] = value;
        }
      }

      details.attributes = attributes;

      // Extract badges
      const badges = {};
      const badgeElements = document.querySelectorAll('.badge-count');

      badgeElements.forEach(el => {
        const title = el.getAttribute('data-original-title') || '';
        const value = parseInt(el.textContent.trim()) || 0;

        if (title.includes('Total')) badges.total = value;
        else if (title.includes('Legendary')) badges.legendary = value;
        else if (title.includes('Hall of Fame')) badges.hallOfFame = value;
        else if (title.includes('Gold')) badges.gold = value;
        else if (title.includes('Silver')) badges.silver = value;
        else if (title.includes('Bronze')) badges.bronze = value;
      });

      // Extract individual badge details
      const badgeList = [];
      const badgeCards = document.querySelectorAll('.badge-card');

      for (const card of badgeCards) {
        const nameEl = card.querySelector('h4.text-white');
        const categoryEl = card.querySelector('.badge-pill');
        const imgEl = card.querySelector('img[data-src*="badge.png"], img[src*="badge.png"]');

        if (nameEl && imgEl) {
          const name = nameEl.textContent.trim();
          const category = categoryEl ? categoryEl.textContent.trim() : '';
          const imgSrc = imgEl.getAttribute('data-src') || imgEl.src || '';

          // Extract tier from image filename
          let tier = '';
          if (imgSrc.includes('-legendary-badge.png')) tier = 'Legendary';
          else if (imgSrc.includes('-hof-badge.png')) tier = 'Hall of Fame';
          else if (imgSrc.includes('-gold-badge.png')) tier = 'Gold';
          else if (imgSrc.includes('-silver-badge.png')) tier = 'Silver';
          else if (imgSrc.includes('-bronze-badge.png')) tier = 'Bronze';

          if (name && tier) {
            badgeList.push({ name, tier, category });
          }
        }
      }

      if (badgeList.length > 0) {
        badges.list = badgeList;
      }

      details.badges = badges;

      return details;
    });

    // Merge with basic player data
    const enhancedPlayer = {
      ...basicPlayer,
      position: playerDetails.position || basicPlayer.position,
      height: playerDetails.height,
      weight: playerDetails.weight,
      wingspan: playerDetails.wingspan,
      build: playerDetails.build,
      playerImage: playerDetails.playerImage,
      attributes: playerDetails.attributes,
      badges: playerDetails.badges,
      lastUpdated: new Date().toISOString()
    };

    return enhancedPlayer;

  } catch (error) {
    logError(`Failed to scrape detailed data for ${basicPlayer.name}: ${error.message}`);
    return enhanceBasicPlayer(basicPlayer);
  }
}

/**
 * Fallback when detailed scraping fails
 * @param {Object} basicPlayer - Basic player data
 * @returns {Object} Enhanced basic player with defaults
 */
function enhanceBasicPlayer(basicPlayer) {
  return {
    ...basicPlayer,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Scrape detailed player data for multiple players
 * @param {Page} page - Playwright page instance
 * @param {Array} basicPlayers - Array of basic player objects
 * @param {number} concurrency - Number of players to scrape concurrently (default: 1)
 * @returns {Promise<Array>} Array of enhanced player objects
 */
export async function scrapePlayersDetails(page, basicPlayers, concurrency = 1) {
  const enhancedPlayers = [];
  const total = basicPlayers.length;

  for (let i = 0; i < total; i++) {
    const player = basicPlayers[i];

    // Log progress every 10 players
    if ((i + 1) % 10 === 0) {
      logProgress(`Processing player ${i + 1}/${total}: ${player.name}`);
    }

    const enhancedPlayer = await scrapePlayerDetails(page, player);
    enhancedPlayers.push(enhancedPlayer);

    // Add delay between players to avoid rate limiting
    if (i < total - 1) {
      await delay(SCRAPER_OPTIONS.delayBetweenPlayers);
    }
  }

  return enhancedPlayers;
}
