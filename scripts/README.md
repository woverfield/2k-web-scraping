# Scripts Directory

This directory contains utility scripts for development, testing, and maintenance.

## Production Scripts

### `runScraper.js`
**Purpose:** Wrapper script to run the modular player scraper
**Usage:**
```bash
node scripts/runScraper.js [curr|class|allt|all] [team_name]
```
**Status:** ✅ Active - Used in production

### `normalize-player-data.ts`
**Purpose:** Migrate player attributes to normalized format
**Usage:**
```bash
npm run normalize          # Live migration
npm run normalize:dry-run  # Preview changes
```
**Status:** ✅ Active - Production migration tool

## Development & Testing Scripts

### `performanceTest.js`
**Purpose:** Measure API endpoint response times
**Usage:**
```bash
TEST_API_KEY=your_key node scripts/performanceTest.js
```
**Status:** ✅ Active - Development tool

### `test-normalization.ts`
**Purpose:** Test attribute normalization module
**Usage:**
```bash
npx tsx scripts/test-normalization.ts
```
**Status:** ✅ Active - Testing tool

## Deprecated / Utility Scripts

### `loadData.js`
**Purpose:** Legacy script for loading data into Convex
**Status:** ⚠️ Deprecated - Use `runScraper.js` instead

### `scrapeAll.js`
**Purpose:** Legacy all-in-one scraper
**Status:** ⚠️ Deprecated - Use modular scraper in `/scraper` directory

### `testCRUD.js`
**Purpose:** Test Convex CRUD operations
**Status:** ℹ️ Development only - Not needed for production

### `mergePlayers.js`
**Purpose:** Utility to merge duplicate player records
**Status:** ℹ️ Utility - Run manually if needed

### `verifyData.js`
**Purpose:** Verify data integrity in database
**Status:** ℹ️ Utility - Run manually for data validation

## Note

Legacy scripts in the `/legacy` directory are completely deprecated and kept only for reference. Do not use them.
