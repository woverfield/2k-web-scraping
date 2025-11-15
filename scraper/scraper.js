/**
 * Main Scraper Orchestrator
 * Coordinates team and player scraping with error handling and progress tracking
 */

import { TEAM_TYPES } from './config.js';
import { initBrowser, createPage, closeBrowser, logProgress, logError, calculateStats } from './utils.js';
import { scrapeAllTeams } from './teamScraper.js';
import { scrapePlayersDetails } from './playerScraper.js';

/**
 * Main Scraper class
 */
export class Scraper {
  constructor(options = {}) {
    this.options = {
      skipDetails: options.skipDetails || false, // Skip detailed player scraping for faster results
      teamTypes: options.teamTypes || ['curr', 'class', 'allt'], // Which team types to scrape
      ...options
    };

    this.browser = null;
    this.page = null;
    this.results = {
      players: [],
      stats: {},
      errors: []
    };
  }

  /**
   * Initialize browser and page
   */
  async init() {
    logProgress('Initializing scraper...');
    this.browser = await initBrowser();
    this.page = await createPage(this.browser);
    logProgress('Browser initialized');
  }

  /**
   * Scrape a single team type
   * @param {string} teamType - Team type to scrape (curr, class, or allt)
   * @returns {Promise<Array>} Array of player objects
   */
  async scrapeTeamType(teamType) {
    if (!TEAM_TYPES[teamType]) {
      throw new Error(`Invalid team type: ${teamType}. Must be one of: curr, class, allt`);
    }

    const config = TEAM_TYPES[teamType];
    logProgress(`\n${'='.repeat(60)}`);
    logProgress(`Starting scrape for ${config.name} teams (${teamType})`);
    logProgress(`${'='.repeat(60)}\n`);

    try {
      // Phase 1: Scrape all teams and basic player data
      logProgress('Phase 1: Scraping team rosters...');
      const basicPlayers = await scrapeAllTeams(this.page, teamType);

      logProgress(`\nPhase 1 complete: ${basicPlayers.length} players found`);

      // Phase 2: Scrape detailed player data (optional)
      if (this.options.skipDetails) {
        logProgress('\nSkipping Phase 2 (detailed player data) - running in basic mode');
        return basicPlayers.map(p => this.formatPlayer(p));
      }

      logProgress('\nPhase 2: Scraping detailed player data...');
      const enhancedPlayers = await scrapePlayersDetails(this.page, basicPlayers, this.options.skipDetails);

      logProgress(`\nPhase 2 complete: ${enhancedPlayers.length} players enhanced`);

      return enhancedPlayers;
    } catch (error) {
      logError(`Failed to scrape ${teamType} teams`, error);
      this.results.errors.push({
        teamType,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return [];
    }
  }

  /**
   * Scrape all configured team types
   * @returns {Promise<Array>} Array of all player objects
   */
  async scrapeAll() {
    const startTime = Date.now();
    const allPlayers = [];

    logProgress(`\nScraping ${this.options.teamTypes.length} team type(s): ${this.options.teamTypes.join(', ')}`);

    for (const teamType of this.options.teamTypes) {
      const players = await this.scrapeTeamType(teamType);
      allPlayers.push(...players);

      logProgress(`\nRunning total: ${allPlayers.length} players scraped`);
    }

    // Calculate statistics
    this.results.stats = calculateStats(allPlayers, startTime);
    this.results.players = allPlayers;

    logProgress(`\n${'='.repeat(60)}`);
    logProgress('Scraping Complete!');
    logProgress(`${'='.repeat(60)}`);
    logProgress(`Total Players: ${this.results.stats.totalPlayers}`);
    logProgress(`Duration: ${this.results.stats.duration}s`);
    logProgress(`Rate: ${this.results.stats.playersPerSecond} players/second`);

    if (this.results.errors.length > 0) {
      logProgress(`\nErrors encountered: ${this.results.errors.length}`);
    }

    return allPlayers;
  }

  /**
   * Format player object for output
   * @param {Object} player - Player object
   * @returns {Object} Formatted player object
   */
  formatPlayer(player) {
    // Remove playerMisc field as data is now in structured fields
    const { playerMisc, ...rest } = player;
    return rest;
  }

  /**
   * Get results with metadata
   * @returns {Object} Results object with players, stats, and errors
   */
  getResults() {
    return {
      players: this.results.players.map(p => this.formatPlayer(p)),
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalPlayers: this.results.stats.totalPlayers,
        duration: this.results.stats.duration,
        teamTypes: this.options.teamTypes,
        skipDetails: this.options.skipDetails
      },
      stats: this.results.stats,
      errors: this.results.errors
    };
  }

  /**
   * Close browser and cleanup
   */
  async close() {
    logProgress('\nClosing browser...');
    await closeBrowser(this.browser);
    logProgress('Browser closed');
  }

  /**
   * Run complete scraping process
   * @returns {Promise<Object>} Results object
   */
  async run() {
    try {
      await this.init();
      await this.scrapeAll();
      return this.getResults();
    } finally {
      await this.close();
    }
  }
}

/**
 * Convenience function to scrape with options
 * @param {Object} options - Scraper options
 * @returns {Promise<Object>} Results object
 */
export async function scrape(options = {}) {
  const scraper = new Scraper(options);
  return await scraper.run();
}
