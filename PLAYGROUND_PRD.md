# NBA 2K API Playground - Product Requirements Document

**Version:** 1.4 (Final)
**Last Updated:** 2025-11-17
**Status:** In Development
**Timeline:** 2-3 weeks (MVP)

---

## 1. Overview

### Purpose
Transform the NBA 2K API from a pure backend service into an **interactive, premium experience** that feels like a Pokédex meets a video game character selection screen—where exploring NBA 2K player data is fun, satisfying, and visually captivating.

### Vision
Create a platform that evokes:
- 🎮 **Pokédex vibes** - The satisfying feeling of browsing and discovering a complete catalog
- 🏀 **Character select energy** - The excitement of exploring options in a video game roster
- 📚 **Encyclopedia depth** - Comprehensive, well-organized information at your fingertips
- ✨ **Premium polish** - Smooth animations, responsive interactions, intentional design

### Goals
- Create individual **player detail pages** with comprehensive attribute visualizations
- Create **team detail pages** to explore rosters by current/classic/all-time teams
- Build a searchable/filterable **playground** for exploring the player database
- Enhance documentation with interactive "Try it Live" functionality
- Deliver a **clean, animated, user-friendly** experience for basketball fans
- Maintain the existing API functionality while adding user-facing features

---

## 2. MVP Scope (2-3 Weeks)

### In Scope
✅ **Player detail pages** (`/players/[slug]`) with full attributes, radar charts, badges
✅ **Team detail pages** (`/teams/[teamSlug]?type=curr|class|allt`) with roster grids
✅ Comprehensive attribute display with 2K color scheme
✅ Radar chart visualizations for key stats
✅ Top 3 stat rankings per player
✅ Badges breakdown display
✅ Basic **playground** with search/filter panel
✅ **Teams browser** - browse all current/classic/all-time teams
✅ Interactive documentation with hover previews
✅ "Try it Live" buttons in docs that populate playground
✅ Smooth animations and micro-interactions

### Out of Scope (Post-MVP)
❌ Player comparison tool (deferred to Phase 5)
❌ Team builder with drag-drop (future Phase 6)
❌ User accounts and saved comparisons
❌ Historical data/trends over seasons

---

## 3. Design System

### Color Scheme (2K Rating System)
```css
.highest { color: #0a0; }  /* 90-99 - Elite */
.high    { color: #070; }  /* 80-89 - Very Good */
.medium  { color: #c90; }  /* 70-79 - Average */
.low     { color: #d40; }  /* 60-69 - Below Average */
.lowest  { color: #900; }  /* 0-59 - Poor */
```

### Rating Thresholds
- **Highest**: 90-99 (Elite) - `#0a0`
- **High**: 80-89 (Very Good) - `#070`
- **Medium**: 70-79 (Average) - `#c90`
- **Low**: 60-69 (Below Average) - `#d40`
- **Lowest**: 0-59 (Poor) - `#900`

### UX/Animation Principles

**Core Philosophy**: Premium, intentional, satisfying, **blazing fast**

**Performance First**
- ⚡ **Feels instant** - User interactions respond in < 100ms
- ⚡ **Optimistic UI** - Show immediate feedback, fetch data in background
- ⚡ **Zero perceived lag** - Interactions feel snappy and responsive
- ⚡ **Smooth 60fps** - All animations run at 60fps minimum
- ⚡ **No layout shift** - Content loads without jumping
- ⚡ **Prefetch on hover** - Load data before user clicks

**Page Transitions**
- Fade in on mount (300ms ease-out)
- Slide up content sections staggered (50ms delay between)
- No jarring jumps—everything flows
- **Instant route changes** - Use Next.js prefetching

**Hover Effects**
- **Cards**: Lift (translateY: -4px) + subtle glow/shadow
- **Buttons**: Scale (1.02) + brightness increase
- **Stats bars**: Highlight + pulse animation
- **Duration**: 200ms for responsiveness
- **Prefetch**: Hover triggers data prefetch for faster clicks

**Loading States**
- **NO spinners** - use skeleton screens instead
- Shimmer effect on loading cards
- Progressive content reveal (not all at once)
- **Instant skeleton render** - Show layout immediately
- **Stale-while-revalidate** - Show cached data instantly, update in background

**Micro-interactions**
- Badges **pop in** with spring animation when scrolled into view
- Stats bars **animate fill** on page load (staggered)
- Button clicks have **ripple effect** (instant visual feedback)
- Smooth scroll to sections (native smooth scroll)
- Cursor changes intentionally (pointer on interactive elements)
- **Touch feedback** - Immediate visual response on tap (mobile)

**Responsive Behavior**
- Fluid grid layouts (not fixed breakpoints)
- Touch-friendly targets on mobile (min 44px)
- Smooth transitions between layouts
- Mobile: Bottom sheet for filters (not sidebar)
- **Touch gestures** - Swipe to dismiss, pull to refresh
- **Native feel** - Feels like a native app on mobile

**Consistency**
- All animations use same easing curve (ease-out or spring)
- Color transitions: 150ms
- Layout transitions: 200-300ms
- Hover states: 200ms
- **User input response**: < 100ms (critical threshold)
- Every interaction provides **immediate** visual feedback

**Speed Optimizations**
- **React Server Components** - Reduce client-side JS
- **Streaming SSR** - Send content as it's ready
- **Image optimization** - Next.js Image with blur placeholders
- **Code splitting** - Load only what's needed
- **Convex reactivity** - Real-time updates without polling
- **Memoization** - Cache expensive calculations
- **Virtual scrolling** - For large lists (if needed)

### Component Library
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts for radar charts and visualizations
- **Styling**: Tailwind CSS + Framer Motion (for advanced animations)
- **Hover Previews**: @aceternity/link-preview for documentation
- **Icons**: lucide-react (already installed)

---

## 4. Feature Specifications

### 4.1 Player Detail Pages (`/players/[slug]`)

#### Route Structure
```
/players/lebron-james
/players/stephen-curry
```

#### Page Layout

**Header Section**
- Player name (h1)
- Team logo and name
- Position(s)
- Overall rating (large, color-coded)
- Jersey number
- Height, weight, age

**Attributes Section** (All 35+ Attributes)

**Layout**: Bento grid / Masonry card layout (Pinterest-style)
- Cards stack vertically on mobile, multi-column on desktop (2-3 cols)
- Each category is a **card** with glassmorphism/subtle border
- Attributes **animate in** staggered when scrolled into view
- Cards have subtle hover effects (lift slightly)

**Each Attribute Display:**
- Attribute name (left-aligned)
- Numeric value (right-aligned, color-coded)
- Animated progress bar below (fills on page load)
- Bar uses 2K color scheme (highest/high/medium/low/lowest)

**Attribute Categories (4 Cards):**

**Card 1: Shooting** (14 attributes)
- Close Shot, Driving Layup, Driving Dunk, Standing Dunk
- Post Hook, Post Fade, Post Control
- Mid-Range Shot, Three-Point Shot, Free Throw
- Shot IQ, Offensive Consistency
- Draw Foul, Hands

**Card 2: Playmaking** (7 attributes)
- Pass Accuracy, Ball Handle, Speed with Ball
- Pass IQ, Pass Vision
- Passing (general)
- Post Moves

**Card 3: Defense** (8 attributes)
- Interior Defense, Perimeter Defense
- Steal, Block
- Defensive Consistency, Defensive Rebound
- Lateral Quickness
- Help Defense IQ

**Card 4: Athleticism** (6 attributes)
- Speed, Acceleration, Vertical
- Strength, Stamina
- Hustle

**Visual Style:**
- Use shadcn `Card` component with custom styling
- Subtle background gradient per category
- Section headers with icons (🏀 Shooting, 🎯 Playmaking, 🛡️ Defense, ⚡ Athleticism)
- Spacing: `gap-4` on desktop, `gap-3` on mobile

**Visualization Section**
- Radar chart showing **7 key stats** (matching 2kratings.com):
  - **Overall** - Player's overall rating (no calculation)
  - **Inside Scoring** - avg(closeShot, drivingLayup, drivingDunk, standingDunk, postHook, postFade, postControl)
  - **Outside Scoring** - avg(midRangeShot, threePointShot)
  - **Athleticism** - avg(speed, acceleration, vertical, strength)
  - **Playmaking** - avg(passAccuracy, ballHandle, speedWithBall, passIQ, passVision)
  - **Rebounding** - avg(defensiveRebound, offensiveRebound) *if available, else just defensiveRebound*
  - **Defending** - avg(interiorDefense, perimeterDefense, steal, block, lateralQuickness, helpDefenseIQ)

**Top 3 Stats Section**
- Display player's 3 highest attribute ratings
- Show attribute name, value, and color-coded badge
- Example: "Three-Point Shot: 98", "Ball Handle: 95", "Speed: 92"

**Badges Section**
- Grid display of all player badges
- Badge name and tier (Bronze, Silver, Gold, Hall of Fame)
- Group by category (Finishing, Shooting, Playmaking, Defense/Rebounding)

**Comparisons** (Contextual)
- Position average comparison
- League average comparison
- Team rank for key stats

**Error States**
- **Player not found (404)**:
  - Hero section: "Player Not Found"
  - Message: "We couldn't find a player with that name."
  - Suggestions: Show 3 similar players based on slug similarity
  - CTA: "Browse All Players" → `/playground`
- **Data loading error**:
  - Show skeleton → Error message after 5s timeout
  - "Unable to load player data. Please try again."
  - Retry button

**SEO & Meta Tags**
- Dynamic meta tags per player:
  - Title: `{playerName} - NBA 2K Ratings | Overall: {overall}`
  - Description: `View {playerName}'s complete NBA 2K player card with {overall} overall rating. Explore all attributes, badges, and stats for {team}.`
  - OG Image: Player's image (or fallback to team logo)
  - Twitter Card: Summary with large image
- Canonical URL: `/players/{slug}`
- Structured data: JSON-LD for Person schema

### 4.2 Team Detail Pages (`/teams/[teamSlug]`)

#### Route Structure
```
/teams/lakers?type=curr        # Current Lakers roster
/teams/lakers?type=class       # Classic Lakers (e.g., 2010 Championship team)
/teams/lakers?type=allt        # All-Time Lakers (legends)
/teams/warriors?type=curr      # Current Warriors
```

#### Team Type Definitions
- **`curr`** (Current) - 2024-25 NBA season rosters
- **`class`** (Classic) - Historic teams from past seasons
- **`allt`** (All-Time) - Franchise all-time greats collections

#### Page Layout

**Header Section**
- Team logo (large, prominent)
- Team name (h1)
- Team type badge (pill badge: "Current" | "Classic" | "All-Time")
- Quick stats bar:
  - Total players on roster
  - Average overall rating (color-coded)
  - Highest rated player preview

**Team Stats Overview**
Display aggregate team statistics:
- **Overall Distribution**
  - Visual bar showing rating distribution (90+, 80-89, 70-79, etc.)
  - Percentage breakdown

- **Position Breakdown**
  - Count of players per position (PG: 3, SG: 2, etc.)
  - Visual position chart

- **Top 5 Players**
  - Mini player cards with overall ratings
  - Quick links to player detail pages

- **Team Strengths** (Radar Chart)
  - Average team stats across 7 categories (matching player radar):
    - Overall (team average overall rating)
    - Inside Scoring (team avg of all player inside scoring values)
    - Outside Scoring (team avg)
    - Athleticism (team avg)
    - Playmaking (team avg)
    - Rebounding (team avg)
    - Defending (team avg)

**Full Roster Section**
- **Grid layout** of all team players (same card design as playground)
- **Sortable** by:
  - Overall rating (default, desc)
  - Name (A-Z)
  - Position
- **Filterable** by position (PG, SG, SF, PF, C)
- Each card shows:
  - Player image
  - Name
  - Position(s)
  - Overall rating (color-coded)
  - Top 3 attributes preview
  - Click → goes to player detail page

**Team Comparison** (Optional for MVP)
- Compare to league average
- Compare to other team types (e.g., Current Lakers vs All-Time Lakers)

#### Navigation
- Breadcrumb: Home → Teams → Lakers (Current)
- "Switch Team Type" toggle (Current / Classic / All-Time)
- "Browse All Teams" link back to teams list

**Error States**
- **Team not found (404)**:
  - "Team Not Found"
  - "This team doesn't exist or has been removed."
  - Show all teams grid as alternative
- **Empty roster**:
  - "No players found for this team."
  - CTA: "Browse Other Teams"

**SEO & Meta Tags**
- Dynamic meta tags per team:
  - Title: `{teamName} {teamType} Roster - NBA 2K Ratings`
  - Description: `Explore the {teamName} {teamType} roster in NBA 2K. {playerCount} players, {avgRating} average rating. View full stats and player cards.`
  - OG Image: Team logo
- Canonical URL: `/teams/{teamSlug}?type={type}`

### 4.3 Teams Browser (`/teams`)

#### Page Layout

**Header**
- Title: "NBA 2K Teams"
- Team type filter tabs:
  - All (default)
  - Current Teams
  - Classic Teams
  - All-Time Teams

**Teams Grid**
- Card-based grid layout (4-5 columns on desktop)
- Each team card shows:
  - Team logo
  - Team name
  - Team type badge
  - Player count
  - Average overall rating (color-coded)
  - "View Roster" button → team detail page

**Sorting Options**
- Name (A-Z / Z-A)
- Average Rating (high to low / low to high)
- Player Count

**Search**
- Text search to filter teams by name

**Error States**
- **No teams found** (after search/filter):
  - "No teams match your search"
  - Show "Clear filters" button
  - Suggest: "Try searching for a different team"

**SEO & Meta Tags**
- Static meta tags:
  - Title: `NBA 2K Teams - Browse All Current, Classic & All-Time Rosters`
  - Description: `Explore all NBA 2K team rosters. Browse current teams, classic squads, and all-time legends with complete player stats and ratings.`

### 4.4 Playground Interface (`/playground`)

#### Filter Panel (Desktop: Left Sidebar | Mobile: Bottom Sheet)

**Desktop (≥768px)**
- Fixed left sidebar (300px width)
- Scrollable if content exceeds viewport height
- Always visible

**Mobile (<768px)**
- **Bottom sheet component** (slides up from bottom)
- **Trigger**: Floating "Filters" button (bottom-right, fixed position)
  - Shows filter count badge if active filters applied
  - Icon: Filter/Funnel icon
- **Behavior**:
  - Tap button → Sheet slides up (300ms ease-out)
  - Covers 75% of screen height
  - Backdrop overlay (semi-transparent black, tap to dismiss)
  - Drag handle at top of sheet (swipe down to dismiss)
  - Scrollable content inside sheet
- **Dismiss**:
  - Swipe down on handle
  - Tap backdrop
  - Tap "Apply Filters" button at bottom of sheet
- Use Radix UI Dialog/Sheet primitive or Vaul library

**Filter Content (Same for Desktop & Mobile):**

**Search**
- Text input for player name search
- Real-time filtering as user types (debounced 300ms)

**Filters**
- **Team** (multi-select dropdown)
  - All 30 NBA teams
  - Current teams only

- **Position** (multi-select)
  - PG, SG, SF, PF, C

- **Overall Rating** (range slider)
  - Min-Max slider (0-100)
  - Default: 0-100

- **Attribute Filters** (expandable sections)
  - Shooting rating range
  - Playmaking rating range
  - Defense rating range
  - Athleticism rating range

**Sort Options**
- Overall Rating (high to low / low to high)
- Name (A-Z / Z-A)
- Team
- Position

#### Results Grid (Main Area)

**Player Cards**
- Grid layout (3-4 columns on desktop)
- Each card shows:
  - Player headshot/image
  - Name
  - Team logo
  - Overall rating (color-coded)
  - Position
  - Top 3 attributes (mini display)
  - Click to view detail page

**Pagination**
- 24 players per page
- Page navigation controls
- "Load More" option

#### URL State Management
- Filters reflected in URL params
- Shareable URLs with active filters
- Example: `/playground?team=lakers&position=PG&minRating=85`

**Error States**
- **No players found** (after filtering):
  - Empty state illustration
  - "No players match your filters"
  - Show active filters with "Clear all" button
  - Suggest: "Try adjusting your filters or browse all players"
- **Search returns 0 results**:
  - "No players found for '{searchQuery}'"
  - Show 3 similar players (fuzzy search)
  - "Clear search" button

**SEO & Meta Tags**
- Static meta tags (base):
  - Title: `NBA 2K Player Playground - Search & Filter Player Ratings`
  - Description: `Interactive player database for NBA 2K. Search, filter, and explore thousands of player cards with detailed ratings, attributes, and badges.`
- Dynamic with filters (if shared):
  - Title: `{filterDescription} - NBA 2K Playground`
  - Example: `Lakers Point Guards (85+ Overall) - NBA 2K Playground`

### 4.5 Navigation Hierarchy

```
┌─────────────────────────────────────────┐
│              Home (/)                   │
│         API landing page                │
└────────┬────────────────────────────────┘
         │
         ├─> /playground
         │   └─> Browse all players
         │       └─> Click player → /players/[slug]
         │
         ├─> /teams
         │   └─> Browse all teams (curr/class/allt)
         │       └─> Click team → /teams/[teamSlug]?type=curr
         │           └─> Click player → /players/[slug]
         │
         ├─> /players/[slug]
         │   └─> Individual player detail
         │       └─> Breadcrumb back to team or playground
         │
         └─> /docs
             └─> API documentation
                 └─> "Try it Live" → /playground?filters
```

**Key User Flows:**

1. **Explore by Team**
   - Home → Teams Browser → Team Detail (Lakers) → Player Detail (LeBron)

2. **Explore by Player**
   - Home → Playground → Filter → Player Detail

3. **Documentation to Interactive**
   - Home → Docs → "Try it Live" → Playground (pre-filtered)

4. **Direct Access**
   - Share link: `/players/lebron-james` (direct to player)
   - Share link: `/teams/lakers?type=allt` (direct to All-Time Lakers)

### 4.6 Interactive Documentation

#### Current Docs Enhancement
- Keep existing documentation pages
- Add interactive elements alongside static docs

#### Hover Previews
- Use @aceternity/link-preview for endpoint hover previews
- Show example JSON responses on hover
- Display parameter options

#### "Try it Live" Buttons
- Add CTA buttons to documentation examples
- Clicking opens playground with pre-populated filters
- Example: "See all Lakers players" → `/playground?team=lakers`

#### Example Sections
- GET `/players` → "Explore all players in playground"
- GET `/players/search?q=lebron` → "Try search in playground"
- GET `/players/slug/lebron-james` → "View LeBron's detail page"

### 4.7 Landing Page Updates (`/`)

**Current state**: Good foundation with features, demo, code examples

**Updates to align with playground vision**:

**Hero Section**
- Update tagline to emphasize both API and interactive experience
- Add two CTAs:
  - Primary: "Get API Key" (existing)
  - Secondary: "Explore Players" → `/playground` (new!)
  - Tertiary: "Browse Teams" → `/teams` (new!)

**Features Section**
- Add new feature cards:
  - ✨ **Interactive Playground** - "Explore our database with visual filters, player cards, and team rosters"
  - ✨ **Team Pages** - "Browse current, classic, and all-time team rosters with aggregate stats"
  - ✨ **Player Detail Pages** - "Deep-dive into 35+ attributes, badges, and radar chart visualizations"

**Try it Live Section** (existing demo)
- Keep current search demo
- Add link below: "Explore all players in the playground →"
- Add link: "Browse all teams →"

**New Section: "More Than Just an API"**
- Showcase the interactive experience
- Screenshots/previews of:
  - Playground filters
  - Player detail page
  - Team roster page
- Emphasize: "Use our API or explore directly in your browser"

**Performance callout**
- Update "Fast Performance" card to mention:
  - "< 100ms interaction response time"
  - "Feels instant and responsive"
  - "Built with performance-first philosophy"

### 4.8 Dashboard Updates (`/dashboard`)

**Current state**: Shows API key stats, recent requests, usage

**Updates to integrate playground**:

**Quick Actions Section** (new!)
- Add prominent buttons at top:
  - "Explore Playground" → `/playground`
  - "Browse Teams" → `/teams`
  - "View Documentation" → `/docs`

**API Usage Stats** (existing)
- Keep current stats display
- No changes needed

**Recent Requests** (existing)
- Add deep links to playground when applicable:
  - Request to `/players?team=lakers` → Show "View in playground" link
  - Request to `/players/slug/lebron-james` → "View player detail" link

**Getting Started Section**
- Update to mention playground:
  - "Try the playground to see example responses"
  - "Explore teams visually before querying the API"

**New Section: "Explore Your Data"**
- Visual cards linking to:
  - Playground (with preview)
  - Teams browser (with preview)
  - Documentation (with preview)

---

## 5. Technical Implementation

### 5.1 Dependencies to Add

```bash
# Charts and visualizations
npm install recharts

# Hover preview effects
npm install @aceternity/link-preview

# Animation library
npm install framer-motion

# Additional shadcn components
npx shadcn@latest add slider
npx shadcn@latest add accordion
npx shadcn@latest add skeleton  # For loading states
npx shadcn@latest add breadcrumb  # For navigation
npx shadcn@latest add badge  # For team type pills
```

### 5.2 New Files to Create

**Pages**
- `app/players/[slug]/page.tsx` - Player detail page
- `app/teams/page.tsx` - Teams browser
- `app/teams/[teamSlug]/page.tsx` - Team detail page
- `app/playground/page.tsx` - Playground interface

**Components - Player Detail**
- `components/player-detail/player-header.tsx`
- `components/player-detail/attribute-grid.tsx`
- `components/player-detail/radar-chart.tsx`
- `components/player-detail/top-stats.tsx`
- `components/player-detail/badges-grid.tsx`

**Components - Team Pages**
- `components/team-detail/team-header.tsx`
- `components/team-detail/team-stats-overview.tsx`
- `components/team-detail/team-radar-chart.tsx`
- `components/team-detail/roster-grid.tsx`
- `components/teams/team-card.tsx`
- `components/teams/team-type-tabs.tsx`

**Components - Playground**
- `components/playground/filter-panel.tsx`
- `components/playground/player-grid.tsx`
- `components/playground/player-card.tsx`

**Components - Shared UI**
- `components/ui/rating-badge.tsx` - Color-coded rating display
- `components/ui/attribute-bar.tsx` - Progress bar with color coding
- `components/ui/stat-card.tsx` - Reusable stat display card
- `components/ui/loading-card.tsx` - Skeleton loading card
- `components/ui/animated-container.tsx` - Wrapper for fade/slide animations

**Utilities**
- `lib/rating-colors.ts` - Color scheme logic and thresholds
- `lib/player-stats.ts` - Stat calculation utilities (averages, top 3, etc.)
- `lib/team-stats.ts` - Team aggregate calculations
- `lib/animations.ts` - Shared animation variants for Framer Motion

**Types**
- `types/player.ts` - Extended player type definitions
- `types/team.ts` - Team type definitions
- `types/filters.ts` - Filter state types

### 5.3 Convex Queries Needed

**Already Available (from existing code):**
- ✅ `players.getPlayerBySlug({ slug, teamType? })` - Get player detail
- ✅ `players.searchPlayers({ query, teamType? })` - Search players by name
- ✅ `players.getPlayersByTeam({ team, teamType? })` - Get team roster
- ✅ `players.getTeams({ teamType? })` - Get all teams with stats

**New Queries to Add:**

```typescript
// Enhanced filtered player search for playground
players.getAllFiltered({
  searchQuery?: string,
  team?: string,
  teamType?: 'curr' | 'class' | 'allt',
  positions?: string[],  // ['PG', 'SG']
  minRating?: number,
  maxRating?: number,
  sortBy?: 'overall' | 'name' | 'team',
  sortOrder?: 'asc' | 'desc',
  limit?: number,
  offset?: number
})

// Get league-wide position averages
players.getPositionAverages({
  position: string,  // 'PG', 'SG', etc.
  teamType?: 'curr' | 'class' | 'allt'
})

// Get team aggregate stats
players.getTeamStats({
  team: string,
  teamType: 'curr' | 'class' | 'allt'
})

// Get top players across league
players.getTopPlayers({
  limit: number,  // e.g., 10
  teamType?: 'curr' | 'class' | 'allt'
})
```

**Query Optimizations:**
- Use Convex indexes: `by_team`, `by_teamType`, `by_overall`, `by_slug`
- Implement pagination for large result sets
- Cache commonly accessed data (top players, team stats)

### 5.4 Next.js Configuration

Update `next.config.ts` for image domains:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'microlink.io', // for @aceternity/link-preview
    },
    {
      protocol: 'https',
      hostname: 'www.2kratings.com', // for player images and team logos
    },
    {
      protocol: 'https',
      hostname: '2kratings.com', // fallback
    },
  ],
}
```

### 5.5 Data Structure Reference

**Player Object (from Convex schema):**
```typescript
{
  _id: Id<"players">,
  name: string,
  slug: string,
  team: string,
  teamType: "curr" | "class" | "allt",
  overall: number,
  positions?: string[],  // ["PG", "SG"]

  // Physical
  height?: string,       // "6'9""
  weight?: string,       // "250 lbs"
  wingspan?: string,     // "7'0""
  archetype?: string,    // "Speedy Blow-By Ace"

  // Images
  playerImage?: string,
  teamImg?: string,

  // Attributes (camelCase keys)
  attributes?: {
    closeShot?: number,
    drivingLayup?: number,
    threePointShot?: number,
    ballHandle?: number,
    // ... 35+ total attributes
  },

  // Badges
  badges?: {
    total?: number,
    legendary?: number,
    hallOfFame?: number,
    gold?: number,
    silver?: number,
    bronze?: number,
    list?: Array<{
      name: string,
      tier: string,
      category?: string
    }>
  },

  lastUpdated: string,
  createdAt: string
}
```

**Team Type Mapping:**
- `curr` → "Current" (2024-25 season)
- `class` → "Classic" (historic teams)
- `allt` → "All-Time" (franchise legends)

---

## 6. Implementation Phases

### Phase 1: Foundation & Setup (Days 1-2)
- [ ] Install dependencies (recharts, framer-motion, @aceternity/link-preview)
- [ ] Install shadcn components (slider, accordion, skeleton, breadcrumb, badge)
- [ ] Configure Next.js for image domains (2kratings.com)
- [ ] Create color scheme constants (`lib/rating-colors.ts`)
- [ ] Create animation utilities (`lib/animations.ts`)
- [ ] Create base UI components:
  - [ ] `rating-badge.tsx` - Color-coded rating display
  - [ ] `attribute-bar.tsx` - Animated progress bar
  - [ ] `stat-card.tsx` - Reusable stat container
  - [ ] `loading-card.tsx` - Skeleton loading state
  - [ ] `animated-container.tsx` - Fade/slide wrapper
- [ ] Set up TypeScript types (`types/player.ts`, `types/team.ts`, `types/filters.ts`)

### Phase 2: Player Detail Pages (Days 3-7)
- [ ] Create dynamic route `/players/[slug]`
- [ ] Implement player detail components:
  - [ ] `player-header.tsx` - Name, team, overall, physical stats
  - [ ] `attribute-grid.tsx` - All 35+ attributes with animated bars
  - [ ] `radar-chart.tsx` - 6-category visualization
  - [ ] `top-stats.tsx` - Top 3 attributes display
  - [ ] `badges-grid.tsx` - Badge breakdown by tier/category
- [ ] Add page animations (fade in, stagger sections)
- [ ] Add breadcrumb navigation
- [ ] Test with real player data

### Phase 3: Team Pages (Days 8-11)
- [ ] Create Convex queries:
  - [ ] `getTeamStats()` - Team aggregate calculations
  - [ ] Update `getTeams()` if needed
- [ ] Create `/teams` page - Teams browser
  - [ ] `team-card.tsx` - Team grid card
  - [ ] `team-type-tabs.tsx` - Filter by curr/class/allt
  - [ ] Search and sort functionality
- [ ] Create `/teams/[teamSlug]` page - Team detail
  - [ ] `team-header.tsx` - Logo, name, type badge, quick stats
  - [ ] `team-stats-overview.tsx` - Distribution, position breakdown
  - [ ] `team-radar-chart.tsx` - Team aggregate radar
  - [ ] `roster-grid.tsx` - Full roster with player cards
  - [ ] Team type switcher
- [ ] Add animations and transitions
- [ ] Test navigation flow

### Phase 4: Playground (Days 12-16)
- [ ] Create Convex query `getAllFiltered()` with all filter options
- [ ] Create `/playground` page
- [ ] Build filter panel component:
  - [ ] Search input (real-time)
  - [ ] Team multi-select
  - [ ] Team type toggle (curr/class/allt)
  - [ ] Position multi-select
  - [ ] Overall rating slider
  - [ ] Attribute range filters (expandable)
  - [ ] Sort options dropdown
- [ ] Implement player grid:
  - [ ] `player-card.tsx` - Hover effects, click to detail
  - [ ] Pagination controls
  - [ ] Empty state
- [ ] Add URL state management (sync filters with URL params)
- [ ] Mobile: Convert sidebar to bottom sheet
- [ ] Loading states with skeletons
- [ ] Test filter combinations

### Phase 5: Interactive Documentation & Existing Pages (Days 17-19)

**Documentation Enhancements**
- [ ] Add @aceternity/link-preview to existing docs
- [ ] Create "Try it Live" button component
- [ ] Link documentation examples to playground:
  - [ ] GET `/players` → Playground
  - [ ] GET `/players/search` → Playground with search
  - [ ] GET `/teams` → Teams browser
  - [ ] Individual endpoints → Direct pages
- [ ] Add hover previews on API endpoints
- [ ] Test all interactive elements

**Landing Page Updates (`/`)**
- [ ] Update hero section:
  - [ ] Revise tagline to emphasize interactive experience
  - [ ] Add "Explore Players" CTA → `/playground`
  - [ ] Add "Browse Teams" CTA → `/teams`
- [ ] Add feature cards:
  - [ ] Interactive Playground card
  - [ ] Team Pages card
  - [ ] Player Detail Pages card
- [ ] Update "Fast Performance" card with < 100ms mention
- [ ] Add links in "Try it Live" section to playground/teams
- [ ] Create new "More Than Just an API" section:
  - [ ] Add playground screenshot/preview
  - [ ] Add player detail screenshot/preview
  - [ ] Add team page screenshot/preview

**Dashboard Updates (`/dashboard`)**
- [ ] Add "Quick Actions" section at top:
  - [ ] "Explore Playground" button
  - [ ] "Browse Teams" button
  - [ ] "View Documentation" button
- [ ] Update "Recent Requests" with deep links:
  - [ ] Link team queries to playground
  - [ ] Link player queries to detail pages
- [ ] Update "Getting Started" text to mention playground
- [ ] Add "Explore Your Data" section with visual cards

### Phase 6: Polish & Testing (Days 20-21)
- [ ] Performance optimization:
  - [ ] **Measure with Lighthouse** (target: 90+ performance score)
  - [ ] Code splitting for heavy components (recharts, framer-motion)
  - [ ] Image optimization (WebP, blur placeholders, lazy loading)
  - [ ] Query caching and prefetching strategy
  - [ ] **Debounce search input** (300ms)
  - [ ] **Memoize expensive calculations** (radar chart data, top stats)
  - [ ] **Virtual scrolling** if lists exceed 100 items
  - [ ] **Bundle size analysis** - Remove unused code
  - [ ] **React DevTools Profiler** - Identify slow renders
  - [ ] **Implement Suspense boundaries** for smoother loading
- [ ] Interaction speed audit:
  - [ ] Verify all clicks respond < 100ms
  - [ ] Test filter changes feel instant
  - [ ] Ensure animations run at 60fps
  - [ ] No layout shifts (CLS = 0)
- [ ] Mobile responsiveness audit:
  - [ ] Test on real devices (iOS Safari, Chrome Android)
  - [ ] Touch targets min 44px
  - [ ] Bottom sheet swipe gestures
  - [ ] No horizontal scroll
- [ ] Animation polish:
  - [ ] Consistent timing across all transitions
  - [ ] Spring physics feel natural
  - [ ] No jank or stuttering
- [ ] Accessibility:
  - [ ] Keyboard navigation (Tab, Enter, Escape)
  - [ ] ARIA labels on interactive elements
  - [ ] Focus states visible and clear
  - [ ] Screen reader friendly
  - [ ] Color contrast ratios pass WCAG AA
- [ ] Cross-browser testing:
  - [ ] Chrome, Safari, Firefox, Edge
  - [ ] iOS Safari, Chrome Android
- [ ] Final UX review:
  - [ ] Does it feel fast and responsive?
  - [ ] Does it evoke Pokédex/character select vibes?
  - [ ] Are interactions satisfying?
  - [ ] Is navigation intuitive?

---

## 7. Success Metrics

### MVP Launch Criteria
✅ All player detail pages accessible via `/players/[slug]`
✅ All team detail pages accessible via `/teams/[teamSlug]?type=curr|class|allt`
✅ Teams browser at `/teams` with filtering
✅ All 35+ player attributes displayed with color coding
✅ Radar charts render correctly (player & team)
✅ Playground filters work and update URL
✅ Search returns accurate results
✅ Smooth animations and micro-interactions
✅ Skeleton loading states (no spinners)
✅ Navigation hierarchy works (breadcrumbs, links)
✅ Documentation links to playground correctly
✅ Mobile responsive design (bottom sheet filters)
✅ No performance regressions on API endpoints

### Performance Targets

**Critical User Interaction Thresholds**
- ⚡ **Button/link click response**: < 100ms (feels instant)
- ⚡ **Filter change**: < 100ms (immediate visual feedback)
- ⚡ **Search input**: < 50ms (real-time feel)
- ⚡ **Hover effects**: < 16ms (60fps = instant)
- ⚡ **Touch feedback**: < 50ms (native feel)

**Page Load Performance**
- Player detail page load: < 1s (target), < 2s (max)
- Team detail page load: < 1s (target), < 2s (max)
- Playground initial load: < 1.5s
- Teams browser: < 1s
- **Time to Interactive (TTI)**: < 2s on 3G
- **First Contentful Paint (FCP)**: < 500ms
- **Largest Contentful Paint (LCP)**: < 1s

**Data Fetching**
- Playground filter response: < 200ms (with optimistic UI)
- Search results: < 300ms
- Prefetched page load: < 100ms (feels instant)

**Rendering Performance**
- Radar chart render: < 300ms
- Skeleton → Content transition: < 200ms
- Page transitions: 300ms (smooth, no jank)
- **All animations**: 60fps minimum (no frame drops)
- List rendering: < 100ms for 24 items

**Interaction Responsiveness**
- Filter toggle: Instant (optimistic update)
- Sort change: Instant (optimistic update)
- Card hover: < 16ms (1 frame at 60fps)
- Navigation: Instant (prefetched)

---

## 8. Post-MVP Features (Future Phases)

### Phase 5: Player Comparison Tool
- Side-by-side attribute comparison (2-4 players)
- Difference highlighting
- Radar chart overlays
- Shareable comparison URLs

### Phase 6: Team Builder
- Drag-and-drop interface
- Build 5-player lineups
- Team chemistry visualization
- Aggregate team stats
- Save and share lineups

### Phase 7: Advanced Features
- Historical data (season-over-season trends)
- User accounts
- Saved favorite players
- Custom comparison sets
- Export data as CSV/JSON

---

## 9. Design Mockup Notes

### Player Detail Page Layout
```
┌─────────────────────────────────────────┐
│  [Player Name]           Overall: 96    │
│  Lakers | SF/PG          ⭐⭐⭐⭐⭐      │
│  6'9" | 250 lbs | #23                   │
├─────────────────────────────────────────┤
│                                         │
│  SHOOTING (14 attributes)               │
│  Close Shot        ████████░░  85       │
│  Driving Layup     █████████░  90       │
│  Three-Point Shot  ██████████  98       │
│  ...                                    │
│                                         │
│  PLAYMAKING (7 attributes)              │
│  Ball Handle       █████████░  95       │
│  ...                                    │
│                                         │
├─────────────────────────────────────────┤
│  [Radar Chart Visualization]            │
├─────────────────────────────────────────┤
│  TOP 3 STATS                            │
│  🏆 Three-Point: 98  🥈 Ball Handle: 95 │
│  🥉 Speed: 92                           │
├─────────────────────────────────────────┤
│  BADGES                                 │
│  [Badge Grid]                           │
└─────────────────────────────────────────┘
```

### Playground Layout
```
┌──────────┬────────────────────────────┐
│ FILTERS  │  [Player Grid]             │
│          │  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│ Search   │  │ 1 │ │ 2 │ │ 3 │ │ 4 │  │
│ ▼        │  └───┘ └───┘ └───┘ └───┘  │
│          │  ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│ Team     │  │ 5 │ │ 6 │ │ 7 │ │ 8 │  │
│ ☐ Lakers │  └───┘ └───┘ └───┘ └───┘  │
│ ☐ Warriors│                           │
│          │  [Pagination]              │
│ Position │                            │
│ ☐ PG     │                            │
│ ☐ SG     │                            │
│          │                            │
│ Rating   │                            │
│ 0 ═══ 100│                            │
└──────────┴────────────────────────────┘
```

### Teams Browser Layout
```
┌─────────────────────────────────────────┐
│  NBA 2K Teams                           │
│  [All] [Current] [Classic] [All-Time]   │
├─────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Lakers │ │Warriors│ │ Celtics│      │
│  │  [🏀]  │ │  [🏀]  │ │  [🏀]  │      │
│  │ Current│ │ Current│ │All-Time│      │
│  │ 15 players│14 players│17 players│   │
│  │ Avg: 82│ │ Avg: 84│ │ Avg: 95│     │
│  └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────┘
```

### Team Detail Layout
```
┌─────────────────────────────────────────┐
│    [Lakers Logo]                        │
│    Los Angeles Lakers                   │
│    [Current Team]                       │
│    15 Players | Avg: 82 | Top: LeBron  │
├─────────────────────────────────────────┤
│  TEAM STATS                             │
│  ┌──────────────┬──────────────┐        │
│  │ Rating Dist  │ Positions    │        │
│  │ 90+: 2       │ PG: 3        │        │
│  │ 80-89: 5     │ SG: 2        │        │
│  │ 70-79: 8     │ SF: 4        │        │
│  └──────────────┴──────────────┘        │
│                                         │
│  TOP 5 PLAYERS                          │
│  [LeBron] [AD] [Russ] [Austin] [Troy]  │
│                                         │
│  [Team Radar Chart]                     │
├─────────────────────────────────────────┤
│  FULL ROSTER                            │
│  Sort: [Overall ▼]  Filter: [All Pos]  │
│                                         │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │        │
│  └───┘ └───┘ └───┘ └───┘ └───┘        │
└─────────────────────────────────────────┘
```

---

## 10. Open Questions & Decisions

### Resolved
✅ MVP scope defined (no comparison tool initially)
✅ Team detail pages added to MVP
✅ Color scheme confirmed (2K's rating colors: #0a0, #070, #c90, #d40, #900)
✅ All attributes should be displayed (35+ total)
✅ Radar charts confirmed for visualization (6 key categories)
✅ @aceternity/link-preview for hover effects
✅ Player images available (scraped from 2kratings.com)
✅ Team logos available (scraped from 2kratings.com)
✅ Badge data available (with tiers and categories)
✅ Team types confirmed (curr/class/allt)
✅ Animation philosophy: Premium, intentional, Framer Motion
✅ Loading states: Skeleton screens, no spinners

### Decisions Made
- Use Framer Motion for advanced animations
- Skeleton screens instead of loading spinners
- Mobile filters use bottom sheet (not sidebar)
- All animations use consistent easing (ease-out or spring)
- Breadcrumb navigation for user orientation
- URL state management for shareable filters

---

## 11. Notes & Adjustments

**2025-11-17 (v1.0)**: Initial PRD created
- MVP scope excludes comparison tool (deferred to Phase 5)
- Team builder concept saved for Phase 6
- Focus on individual player pages and basic playground
- Documentation enhancement with interactive elements

**2025-11-17 (v1.1)**: Major expansion and refinement
- ✨ Added **team detail pages** to MVP (`/teams/[teamSlug]`)
- ✨ Added **teams browser** to MVP (`/teams`)
- ✨ Added comprehensive **UX/Animation Principles** section
- ✨ Added **Navigation Hierarchy** with user flows
- 🎨 Defined Pokédex/character select vision
- 📊 Confirmed all data is available (images, badges, team types)
- 🔧 Added Framer Motion for animations
- 🔧 Added skeleton components for loading states
- 📅 Extended timeline to 21 days (3 weeks) with 6 phases
- 📝 Updated all mockups to include team pages
- ✅ Resolved all open questions about data availability

**2025-11-17 (v1.2)**: Performance-first refinement
- ⚡ **"Blazing fast" as core philosophy** - interactions respond in < 100ms
- ⚡ Added **Performance First** principles section
- ⚡ Defined aggressive performance targets:
  - Button clicks: < 100ms
  - Search input: < 50ms
  - Hover: < 16ms (60fps)
  - Page loads: < 1s target, < 2s max
- ⚡ Added performance optimization techniques:
  - Optimistic UI updates
  - Prefetch on hover
  - Stale-while-revalidate caching
  - React Server Components
  - Code splitting
  - Virtual scrolling
- ⚡ Expanded Phase 6 with comprehensive performance audit
- ⚡ Added Core Web Vitals targets (LCP < 1s, CLS = 0)
- 🎯 Emphasis: App must feel **instant and responsive to touch**

**2025-11-17 (v1.3)**: Existing pages integration
- 📄 Added **Landing Page Updates** section (4.7)
  - New CTAs for playground and teams
  - New feature cards highlighting interactive experience
  - "More Than Just an API" section with screenshots
  - Performance callouts updated
- 📄 Added **Dashboard Updates** section (4.8)
  - Quick Actions for playground/teams/docs
  - Deep links from recent requests
  - "Explore Your Data" section
- 📄 Updated **Phase 5** to include landing and dashboard updates
- 🔗 Ensured cohesive experience across API docs, landing, dashboard, and interactive features
- 🎯 Vision: Seamless integration between API and visual exploration

**2025-11-17 (v1.4 - FINAL)**: Gap resolution & polish
- 📊 **Updated radar chart to 7 points** (matching 2kratings.com):
  - Overall, Inside Scoring, Outside Scoring, Athleticism, Playmaking, **Rebounding**, Defending
  - Added **Appendix B** with complete calculation formulas and TypeScript pseudocode
- 🎨 **Replaced accordion with bento grid** for attributes:
  - Pinterest-style masonry card layout
  - 4 cards (Shooting, Playmaking, Defense, Athleticism)
  - Glassmorphism styling, staggered animations, subtle hover effects
  - Icons per category (🏀🎯🛡️⚡)
- 📱 **Detailed mobile bottom sheet spec**:
  - Floating button trigger with filter count badge
  - 75% screen coverage, backdrop overlay, drag handle
  - Dismiss via swipe/tap/apply button
  - Recommended: Vaul library or Radix Dialog
- ❌ **Added error states** for all pages:
  - Player/team not found (404) with suggestions
  - Empty search results with fuzzy matching
  - Data loading errors with retry
- 🔍 **Added SEO & meta tags** for all pages:
  - Dynamic titles/descriptions per player/team
  - OG images, Twitter cards
  - JSON-LD structured data for players
  - Canonical URLs
- ✅ **PRD is now production-ready** - All gaps resolved, ready for Phase 1 implementation

---

## Appendix: 2K Attribute Reference

### Complete Attribute List (35+ total)

**Shooting (14)**
1. Close Shot
2. Driving Layup
3. Driving Dunk
4. Standing Dunk
5. Post Hook
6. Post Fade
7. Post Control
8. Mid-Range Shot
9. Three-Point Shot
10. Free Throw
11. Shot IQ
12. Offensive Consistency
13. Draw Foul
14. Hands

**Playmaking (7)**
1. Pass Accuracy
2. Ball Handle
3. Speed with Ball
4. Pass IQ
5. Pass Vision
6. Passing
7. Post Moves

**Defense (8)**
1. Interior Defense
2. Perimeter Defense
3. Steal
4. Block
5. Defensive Consistency
6. Defensive Rebound
7. Lateral Quickness
8. Help Defense IQ

**Athleticism (6)**
1. Speed
2. Acceleration
3. Vertical
4. Strength
5. Stamina
6. Hustle

**Additional Stats**
- Overall Rating
- Potential (for younger players)
- Height
- Weight
- Wingspan
- Jersey Number
- Position(s)
- Team
- Age

---

## Appendix B: Radar Chart Calculation Reference

### 7-Point Radar Chart (Matching 2kratings.com)

**1. Overall**
- Source: `player.overall` (no calculation needed)
- Range: 0-100

**2. Inside Scoring**
```typescript
insideScoring = average([
  closeShot,
  drivingLayup,
  drivingDunk,
  standingDunk,
  postHook,
  postFade,
  postControl
])
```
- Includes all close-range and post scoring
- Range: 0-100

**3. Outside Scoring**
```typescript
outsideScoring = average([
  midRangeShot,
  threePointShot
])
```
- Only perimeter shooting
- Range: 0-100

**4. Athleticism**
```typescript
athleticism = average([
  speed,
  acceleration,
  vertical,
  strength
])
```
- Pure athletic attributes
- Note: Excludes stamina/hustle (endurance vs explosiveness)
- Range: 0-100

**5. Playmaking**
```typescript
playmaking = average([
  passAccuracy,
  ballHandle,
  speedWithBall,
  passIQ,
  passVision
])
```
- Passing and ball-handling combined
- Range: 0-100

**6. Rebounding**
```typescript
rebounding = average([
  defensiveRebound,
  offensiveRebound  // if available
])
```
- If `offensiveRebound` not in data, use just `defensiveRebound`
- Range: 0-100

**7. Defending**
```typescript
defending = average([
  interiorDefense,
  perimeterDefense,
  steal,
  block,
  lateralQuickness,
  helpDefenseIQ
])
```
- All defensive attributes combined
- Range: 0-100

### Helper Function Pseudocode

```typescript
function calculateRadarStats(player: Player) {
  const attrs = player.attributes || {};

  return {
    overall: player.overall,
    insideScoring: avg([
      attrs.closeShot, attrs.drivingLayup, attrs.drivingDunk,
      attrs.standingDunk, attrs.postHook, attrs.postFade, attrs.postControl
    ]),
    outsideScoring: avg([attrs.midRangeShot, attrs.threePointShot]),
    athleticism: avg([attrs.speed, attrs.acceleration, attrs.vertical, attrs.strength]),
    playmaking: avg([
      attrs.passAccuracy, attrs.ballHandle, attrs.speedWithBall,
      attrs.passIQ, attrs.passVision
    ]),
    rebounding: avg([attrs.defensiveRebound, attrs.offensiveRebound].filter(Boolean)),
    defending: avg([
      attrs.interiorDefense, attrs.perimeterDefense, attrs.steal,
      attrs.block, attrs.lateralQuickness, attrs.helpDefenseIQ
    ])
  };
}

function avg(values: number[]): number {
  const valid = values.filter(v => v !== undefined && v !== null);
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((sum, v) => sum + v, 0) / valid.length);
}
```

### Team Radar Chart

For team pages, calculate the same 7 values but average across all players on the roster:

```typescript
function calculateTeamRadarStats(players: Player[]) {
  const playerRadarStats = players.map(p => calculateRadarStats(p));

  return {
    overall: avg(playerRadarStats.map(s => s.overall)),
    insideScoring: avg(playerRadarStats.map(s => s.insideScoring)),
    outsideScoring: avg(playerRadarStats.map(s => s.outsideScoring)),
    athleticism: avg(playerRadarStats.map(s => s.athleticism)),
    playmaking: avg(playerRadarStats.map(s => s.playmaking)),
    rebounding: avg(playerRadarStats.map(s => s.rebounding)),
    defending: avg(playerRadarStats.map(s => s.defending))
  };
}
```
