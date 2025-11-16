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

        // Extract height (e.g., "6 feet 9 inches")
        const heightMatch = text.match(/(\d+)\s*feet\s*(\d+)\s*inches/);
        if (heightMatch) {
          details.height = `${heightMatch[1]}'${heightMatch[2]}"`;
        }

        // Extract weight (e.g., "weighs 250 pounds")
        const weightMatch = text.match(/weighs.*?(\d+)\s*pounds/);
        if (weightMatch) {
          details.weight = `${weightMatch[1]} lbs`;
        }

        // Extract wingspan (e.g., "wingspan of 7 feet")
        const wingspanMatch = text.match(/wingspan.*?(\d+)\s*feet(?:\s*(\d+)\s*inches)?/);
        if (wingspanMatch) {
          const feet = wingspanMatch[1];
          const inches = wingspanMatch[2] || '0';
          details.wingspan = `${feet}'${inches}"`;
        }

        // Extract build (e.g., "Physical Post Point Forward Build")
        const buildMatch = text.match(/(\w+\s+\w+(?:\s+\w+)?)\s+Build/);
        if (buildMatch) {
          details.build = buildMatch[1];
        }
      }

      // Extract position from links
      const positionLinks = Array.from(document.querySelectorAll('a[href*="/lists/"]'));
      const positions = [];
      for (const link of positionLinks) {
        const text = link.textContent.trim();
        if (text.match(/^(PG|SG|SF|PF|C|Point Guard|Shooting Guard|Small Forward|Power Forward|Center)$/i)) {
          if (!positions.includes(text)) positions.push(text);
        }
      }
      details.position = positions.join('/');

      // Extract player image
      const playerImgEl = document.querySelector('a[data-lightbox="player"] img');
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
          .replace(/-/g, '');

        if (key && key.length > 1) {
          attributes[key] = value;
        }
      }

      details.attributes = attributes;

      // Extract badges
      const badges = {};
      const badgeCountEl = document.querySelector('.badge-count');
      if (badgeCountEl) {
        badges.total = parseInt(badgeCountEl.textContent.trim()) || 0;
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
