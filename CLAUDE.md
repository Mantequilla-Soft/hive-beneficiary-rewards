# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 dashboard with two main features:

1. **Beneficiary Rewards Tracker** (`/`) - Tracks how much HBD, HIVE, and Hive Power a beneficiary account has earned
2. **Voting Activity Analyzer** (`/voting`) - Analyzes voting patterns to see which accounts a user votes for or who votes for them

Both features fetch data from the Hive Condenser API and provide time-based analysis (1 day, 7 days, or 30 days).

## Development Commands

### Package Manager
This project uses **pnpm** (not npm). The `.npmrc` is configured for pnpm 10+ with:
- `node-linker=hoisted`
- `strict-peer-dependencies=false`
- `auto-install-peers=true`

### Common Commands
- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint

### Vercel Deployment
The project has a custom install command in `vercel.json`:
```
rm -rf node_modules pnpm-lock.yaml && pnpm install --no-frozen-lockfile
```
This is necessary due to dependency version conflicts that were resolved in recent commits.

## Architecture

### Data Flow
1. **Client** (`app/page.tsx`) - User enters account name and time range
2. **API Route** (`app/api/beneficiary-rewards/route.ts`) - Fetches data from Hive blockchain
3. **Display Components** - Render summary cards and detailed table

### API Route (`app/api/beneficiary-rewards/route.ts`)
This is the core of the application. It:
- Accepts `account` (Hive username) and `days` (1, 7, or 30) as query parameters
- Makes RPC calls to `https://api.hive.blog` using the Condenser API
- Paginates through account history using `get_account_history` (1000 items per batch)
- Filters for `comment_benefactor_reward` operations only
- Converts VESTS to HP using `get_dynamic_global_properties`
- Gets HIVE/HBD price from `get_ticker` (internal market)
- Aggregates rewards by day
- Returns totals + daily breakdown with USD values

**Important**: The API uses Next.js caching with `next: { revalidate: 60 }` (1 minute cache).

### Asset Parsing
The `parseAsset` function handles two formats from Hive API:
1. Object format: `{ amount: "1234", nai: "@@000000013", precision: 3 }`
2. String format: `"1.234 HBD"`

### Component Structure
- `app/page.tsx` - Main page (client component with state management)
- `components/dashboard-header.tsx` - Title and description
- `components/account-input.tsx` - Account name input field
- `components/time-range-selector.tsx` - Radio buttons for time range
- `components/summary-cards.tsx` - Five summary cards showing totals
- `components/rewards-table.tsx` - Daily breakdown table
- `components/help-section.tsx` - Information about beneficiary rewards
- `components/footer.tsx` - Footer with links
- `components/ui/*` - shadcn/ui components

### Styling
- Tailwind CSS 4.x with custom animations
- Theme support via `next-themes` (dark/light mode)
- Animations defined in globals.css: `fade-in`, `slide-up`, `scale-in`
- Responsive design with mobile-first breakpoints (sm, md, lg)

## TypeScript Configuration

- Path alias: `@/*` maps to project root
- `ignoreBuildErrors: true` in `next.config.mjs` (intended for rapid prototyping)
- Strict mode enabled in tsconfig.json

## Key Dependencies

- **Next.js 16.0.10** - React framework with App Router
- **shadcn/ui** - UI component library (Radix UI primitives)
- **Tailwind CSS 4.x** - Styling
- **Recharts 2.15.4** - Charting library (currently unused but available)
- **date-fns 4.1.0** - Date formatting utilities
- **lucide-react** - Icon library

## Hive Blockchain Integration

### API Endpoints Used
All calls go to `https://api.hive.blog` using JSON-RPC 2.0:

1. `condenser_api.get_account_history`
   - Fetches operations for an account
   - Parameters: `[account, start, limit]`
   - Returns array of `[seq, transaction]` tuples
   - Filter for `comment_benefactor_reward` operations

2. `condenser_api.get_dynamic_global_properties`
   - Gets blockchain state
   - Used to calculate HP from VESTS
   - Formula: `HP = VESTS × (total_vesting_fund_hive / total_vesting_shares)`

3. `condenser_api.get_ticker`
   - Gets HIVE/HBD market price
   - Returns `{ latest: "0.xxx" }` (price in HBD)

### Operation Structure
`comment_benefactor_reward` operations contain:
- `hbd_payout` - HBD amount
- `hive_payout` - HIVE amount
- `vesting_payout` - HP in VESTS (needs conversion)

4. `condenser_api.get_reward_fund`
   - Gets reward pool data for vote value calculations
   - Parameters: `["post"]`
   - Returns reward fund with `reward_balance` and `recent_claims`
   - Used to convert rshares to HBD value

### Voting Activity Page

#### Route: `/voting`
A separate page that analyzes voting patterns for any Hive account.

#### API Route (`app/api/voting-activity/route.ts`)
- Accepts `account`, `days` (1, 7, or 30), and `direction` (given/received) as query parameters
- Paginates through account history filtering for `vote` operations
- **Direction "given"**: Shows accounts that the searched account voted FOR (voter === account)
- **Direction "received"**: Shows accounts that voted FOR the searched account (author === account)
- Aggregates by account, counting votes and calculating average weight
- Returns totals + per-account breakdown

#### Vote Operation Structure
Vote operations contain:
- `voter` - Account that cast the vote
- `author` - Author of the post being voted on
- `permlink` - Post identifier
- `weight` - Vote weight (0-10000, representing 0-100%)

#### Vote Value Calculation (rshares)
Vote operations don't directly contain value data. The current implementation:
- Aggregates vote count and average weight per account
- **Note**: Actual vote value calculation requires fetching post data to get rshares
- rshares conversion formula: `(rshares / recent_claims) × reward_balance`
- This is a planned enhancement (currently shows estimated value as 0)

#### Components
- `components/voting-direction-selector.tsx` - Toggle between "Votes Given" and "Votes Received"
- `components/voting-summary-cards.tsx` - Shows totals (votes, accounts, avg weight, value)
- `components/voting-table.tsx` - Paginated table of accounts (50 per page)
  - Sortable by vote count (default)
  - Links to accounts on PeakD
  - Client-side pagination

#### Page Structure (`app/voting/page.tsx`)
- Similar layout to beneficiary rewards page
- Account input + time range selector + direction toggle
- Summary cards showing overall metrics
- Table showing per-account breakdown with pagination
- Navigation back to main page

## Working with This Codebase

### Adding New Features
1. Client-side state lives in `app/page.tsx`
2. API logic goes in `app/api/beneficiary-rewards/route.ts`
3. UI components should be added to `components/`
4. Use shadcn/ui patterns for new components

### Testing API Changes
API routes can be tested directly:
```
# Beneficiary rewards
http://localhost:3000/api/beneficiary-rewards?account=spk.beneficiary&days=7

# Voting activity
http://localhost:3000/api/voting-activity?account=ranchorelaxo&days=7&direction=given
http://localhost:3000/api/voting-activity?account=ranchorelaxo&days=7&direction=received
```

### Common Tasks
- **Add new Hive API call**: Add to `hiveRpc` function in route.ts
- **Change time ranges**: Update `daysMap` in page.tsx and route validation
- **Modify calculations**: Edit aggregation logic in route.ts (lines 145-167)
- **Add UI components**: Use `pnpm dlx shadcn@latest add <component>`

## Important Notes

- TypeScript build errors are currently ignored (`ignoreBuildErrors: true`)
- The project uses React 19.2.0 (latest)
- Images are unoptimized (`images: { unoptimized: true }`)
- No testing setup currently configured
- Uses App Router (not Pages Router)
