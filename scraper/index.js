#!/usr/bin/env node

/**
 * CLI Entry Point for NBA 2K Ratings Scraper
 * Usage: node index.js [options]
 */

import { scrape } from './scraper.js';
import { logProgress, logError } from './utils.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    teamTypes: [],
    skipDetails: false,
    output: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;

      case '--all':
        options.teamTypes = ['curr', 'class', 'allt'];
        break;

      case '--type':
      case '-t':
        const type = args[++i];
        if (type && ['curr', 'class', 'allt'].includes(type)) {
          options.teamTypes.push(type);
        } else {
          console.error(`Invalid team type: ${type}. Must be curr, class, or allt`);
          process.exit(1);
        }
        break;

      case '--basic':
      case '-b':
        options.skipDetails = true;
        break;

      case '--output':
      case '-o':
        options.output = args[++i];
        break;

      default:
        console.error(`Unknown option: ${arg}`);
        options.help = true;
    }
  }

  // Default to all types if none specified
  if (options.teamTypes.length === 0 && !options.help) {
    options.teamTypes = ['curr', 'class', 'allt'];
  }

  return options;
}

/**
 * Display help message
 */
function displayHelp() {
  console.log(`
NBA 2K Player Ratings Scraper
==============================

Usage: node index.js [options]

Options:
  --all                   Scrape all team types (current, classic, all-time)
  --type, -t <type>       Scrape specific team type (curr, class, allt)
                          Can be used multiple times: -t curr -t class
  --basic, -b             Basic mode - skip detailed player data (faster)
  --output, -o <file>     Save output to JSON file instead of stdout
  --help, -h              Display this help message

Examples:
  node index.js --all                    # Scrape all teams with full details
  node index.js --type curr              # Scrape only current teams
  node index.js -t curr -t class         # Scrape current and classic teams
  node index.js --all --basic            # Scrape all teams (basic mode, faster)
  node index.js --all -o players.json    # Save results to file

Team Types:
  curr   - Current NBA teams (2024-25 season)
  class  - Classic NBA teams (historical)
  allt   - All-Time NBA teams (legends)

Output:
  By default, results are printed to stdout as JSON.
  Use --output to save to a file instead.
  `);
}

/**
 * Save results to file
 */
async function saveToFile(data, filepath) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await writeFile(filepath, jsonData, 'utf8');
    logProgress(`Results saved to: ${filepath}`);
  } catch (error) {
    logError('Failed to save results to file', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    displayHelp();
    process.exit(0);
  }

  logProgress('NBA 2K Player Ratings Scraper');
  logProgress('==============================\n');

  try {
    // Run scraper
    const results = await scrape({
      teamTypes: options.teamTypes,
      skipDetails: options.skipDetails
    });

    // Output results
    if (options.output) {
      // Save to file
      await saveToFile(results, options.output);
    } else {
      // Print to stdout
      console.log(JSON.stringify(results, null, 2));
    }

    // Exit successfully
    process.exit(0);
  } catch (error) {
    logError('Scraping failed', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
