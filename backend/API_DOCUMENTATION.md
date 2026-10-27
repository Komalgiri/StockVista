# Opp Code Stock Vision — Backend REST API Documentation

**Product:** Opp Code Stock Vision  
**Company Attribution:** Powered by OPP Code Vision Technology  
**Base URL:** `http://localhost:8080/api` (Local) / Configured deployment gateway  

---

## Architecture Overview

The Opp Code Stock Vision Express backend acts as a resilient, institutional-grade equity research gateway connecting the frontend interface to multi-source market providers:
1. **SQLite Master Database (`data/stockvista.db`):** 5,588 active equities indexed across NSE and BSE with compound indexing for sub-1ms search and sector filtering.
2. **Screener.in Scraper Service (`src/services/screener.ts`):** Single-request multi-category extraction parsing 10-year annual statements, quarterly results, balance sheets, cash flows, shareholding distributions, peer comparisons, and regulatory documents.
3. **Yahoo Finance Service (`src/services/yahoo.ts`):** Live market quotes, real-time index benchmarks (^NSEI, ^BSESN), and genuine daily OHLCV trading bars.
4. **2-Tier Caching Architecture:** In-memory NodeCache TTL (fast L1) paired with persistent SQLite tables (L2 disk cache with 90-day persistence for quarterly filings).
5. **Zero-Fabrication Guarantee:** When genuine exchange records or historical OHLCV data are unavailable, endpoints return an explicit `null` or `[]` with metadata status `"unavailable"`. No synthetic splines, artificial prices, or simulated data are ever generated.

---

## Response Contract

Every endpoint conforms to a standardized JSON response format:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "source": "sqlite-disk-cache | yahoo-finance | screener.in-ratios | db-catalog | unavailable",
    "lastUpdated": "2026-10-27T12:00:00.000Z",
    "delayed": false
  }
}
```

---

## REST Endpoints

### 1. System & Catalog Diagnostics
* `GET /api/health` — System status, current server time, and total indexed securities count.
* `GET /api/coverage` — Audited data coverage telemetry: total securities (5,588), BSE-only, NSE-only, dual-listed counts, classified vs. unclassified sector breakdown, category counts across cached bundles, and documented provider limitations.
* `POST /api/sync-catalog` — Triggers background synchronization of NSE and BSE equity master instruments.

### 2. Search & Sector Navigation
* `GET /api/search?q=:query` — High-speed indexed search across 5,588+ companies by Name, NSE symbol, or BSE 6-digit scrip code.
* `GET /api/sectors` — Returns all distinct economic sectors and active company counts.
* `GET /api/sectors/:sector?page=1&limit=50` — Paginated list of equities classified within the specified verified sector.

### 3. Market Indices
* `GET /api/indices` — Live NIFTY 50 and SENSEX benchmark quotes from Yahoo Finance with 3-minute in-memory caching. Returns genuine values or explicit unavailable state when upstream feeds are unreachable.

### 4. Company Profile & Market Data
* `GET /api/companies/:isin` — Company identity, verified BSE/NSE exchange identifiers, sector, industry, corporate description, and official exchange filing links.
* `GET /api/companies/:isin/quote` — Real-time quote (LTP, day change, % change, open, high, low, previous close, volume, 52-week range). Falls back safely to verified Screener ratios if Yahoo is rate-limited; strictly zero fabricated volume or high/low figures.
* `GET /api/companies/:isin/history` — Genuine 1-year daily OHLCV historical time series from Yahoo Finance or SQLite cache. Returns `[]` with status `"unavailable"` when market records do not exist.

### 5. Multi-Category Fundamental Statements
* `GET /api/companies/:isin/ratios` — Valuation multiples (P/E, Book Value, ROCE, ROE, Market Cap, Dividend Yield, Face Value).
* `GET /api/companies/:isin/income` — Consecutive quarterly results and 10-year annual consolidated Profit & Loss statement.
* `GET /api/companies/:isin/balance-sheet` — Consolidated balance sheet (equity capital, reserves, borrowings, total assets).
* `GET /api/companies/:isin/cash-flow` — Operating, investing, and financing cash flow series.
* `GET /api/companies/:isin/shareholding` — Historical quarterly promoter, FII, DII, and public ownership percentages.
* `GET /api/companies/:isin/peers` — Industry peer group valuation matrix.
* `GET /api/companies/:isin/documents` — Categorized regulatory documents (Annual reports, investor presentations, concall transcripts, credit ratings).
* `GET /api/companies/:isin/analysis` — Algorithmic pros and cons (strengths and limitations).
* `POST /api/companies/:isin/refresh` — Bypasses cache and triggers forced live ingestion from upstream providers.
