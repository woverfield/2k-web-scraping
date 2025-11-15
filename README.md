# nba2k-api

Enhanced web scraper for NBA 2K player ratings from [2kratings.com](https://www.2kratings.com/).

This project scrapes comprehensive NBA 2K player data including ratings, attributes, badges, and team information. The scraped data will be used to build a public REST API for the basketball gaming community.

## Features

- Scrapes all team types: Current, Classic, and All-Time teams
- Extracts detailed player attributes (30+ data points)
- Badge system with tier levels
- Configurable scraping modes (basic or detailed)
- Progress tracking and statistics
- Clean JSON output

## Requirements

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Playwright](https://playwright.dev/)

## Installation

1. Install dependencies:
```bash
cd scraper
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Usage

### Quick Start

Scrape all teams (basic mode - faster):
```bash
node scraper/index.js --all --basic --output players.json
```

### Command Line Options

```
node scraper/index.js [options]

Options:
  --all                   Scrape all team types (current, classic, all-time)
  --type, -t <type>       Scrape specific team type (curr, class, allt)
                          Can be used multiple times: -t curr -t class
  --basic, -b             Basic mode - skip detailed player data (faster)
  --output, -o <file>     Save output to JSON file instead of stdout
  --help, -h              Display help message
```

### Examples

```bash
# Scrape all teams with full details
node scraper/index.js --all

# Scrape only current teams
node scraper/index.js --type curr

# Scrape current and classic teams
node scraper/index.js -t curr -t class

# Scrape all teams (basic mode, faster)
node scraper/index.js --all --basic

# Save results to file
node scraper/index.js --all -o players.json
```

### Team Types

- `curr` - Current NBA teams (2024-25 season)
- `class` - Classic NBA teams (historical)
- `allt` - All-Time NBA teams (legends)

## Output Format

The scraper outputs JSON with the following structure:

```json
{
  "players": [
    {
      "name": "Player Name",
      "slug": "player-name",
      "playerUrl": "https://www.2kratings.com/player-name",
      "team": "Team Name",
      "teamType": "curr",
      "overall": 88,
      "teamImg": "https://www.2kratings.com/team-logo.svg",
      "position": "PG",
      "height": "6'3\"",
      "weight": "",
      "wingspan": "",
      "build": "",
      "playerImage": "",
      "attributes": {
        "shooting": {},
        "finishing": {},
        "playmaking": {},
        "defense": {},
        "athleticism": {},
        "rebounding": {},
        "special": {}
      },
      "badges": {
        "total": 0,
        "hallOfFame": 0,
        "gold": 0,
        "silver": 0,
        "bronze": 0,
        "list": []
      },
      "lastUpdated": "2025-11-15T...",
      "createdAt": "2025-11-15T..."
    }
  ],
  "metadata": {
    "scrapedAt": "2025-11-15T...",
    "totalPlayers": 1056,
    "duration": "73.00",
    "teamTypes": ["curr"],
    "skipDetails": true
  },
  "stats": {
    "totalPlayers": 1056,
    "duration": "73.00",
    "playersPerSecond": "14.46"
  },
  "errors": []
}
```

## Performance

- **Basic Mode**: ~14-15 players/second (~1000 players in ~70 seconds)
- **Detailed Mode**: Significantly slower (scrapes individual player pages)

## Project Structure

```
.
├── scraper/              # Enhanced scraper (current)
│   ├── config.js        # Configuration (URLs, selectors)
│   ├── utils.js         # Utility functions
│   ├── teamScraper.js   # Team roster scraping
│   ├── playerScraper.js # Individual player scraping
│   ├── scraper.js       # Main orchestrator
│   └── index.js         # CLI entry point
│
├── legacy/              # Old scripts (for reference)
│   ├── allt.js         # All-time teams
│   ├── class.js        # Classic teams
│   └── curr.js         # Current teams
│
└── README.md           # This file
```

## Contributing

This project is currently in active development. Contributions will be welcome after the initial release.

## License

MIT

## Acknowledgments

- Data sourced from [2kratings.com](https://www.2kratings.com/)
- Built for the basketball gaming community
