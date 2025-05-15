# 2k Data Web Scraping

These are web scraping scripts to get NBA 2K player data from https://www.2kratings.com/ for use in [Blacktop Blitz](https://github.com/woverfield/blacktop-blitz).

## Requirements

- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)

Install Playwright in this directory:
```bash
npm install playwright
```

## Usage

Each script (`allt.js`, `class.js`, `curr.js`) will open a visible browser window, scrape the data, and output a clean JSON array of players to stdout.

Example:
```bash
node allt.js > alltplayers.json
node class.js > classplayers.json
node curr.js > currplayers.json
```

You can then use these files in your Blacktop Blitz project.
