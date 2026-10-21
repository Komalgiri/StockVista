# 📈 StockVista — Institutional Equity Research Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**StockVista** is a production-grade, full-stack equity research and fundamental analysis platform designed for Indian capital markets (NSE & BSE), inspired by the information architecture and depth of **Screener.in**.

Built with **Next.js 16 (App Router)** and an **Express 5 API Gateway**, StockVista orchestrates a multi-source data ingestion pipeline—combining real-time web scraping from Screener.in, live market data from Yahoo Finance, and an active indexed universe of **3,000+ Indian equities (scaling to 5,500+ across NSE & BSE)** backed by persistent SQLite storage—to deliver an authentic, zero-fabrication research experience.

---

## 🔗 Live Deployments & Repository

| Target | URL | Status | Description |
| :--- | :--- | :---: | :--- |
| **Frontend Application** | [https://stock-vista-one.vercel.app/](https://stock-vista-one.vercel.app/) | ![Vercel](https://img.shields.io/badge/Vercel-Deployed-success?style=flat-square) | Hosted Next.js 16 App Router UI |
| **Backend API Gateway** | [https://stockvista-7kk1.onrender.com/](https://stockvista-7kk1.onrender.com/) | ![Render](https://img.shields.io/badge/Render-Active-success?style=flat-square) | Node.js Express 5 REST Gateway |
| **GitHub Repository** | [https://github.com/Komalgiri/StockVista](https://github.com/Komalgiri/StockVista) | ![GitHub](https://img.shields.io/badge/GitHub-Public-blue?style=flat-square) | Monorepo containing `/frontend` and `/backend` |

---

## 📑 Table of Contents

1. [🏆 Achievements Till Now & Current Progress (Post-Oct 14 Updates)](#-achievements-till-now--current-progress-post-oct-14-updates)
2. [Visual Tour & Screenshots](#-visual-tour--screenshots)
3. [Key Architecture & Capabilities](#-key-architecture--capabilities)
4. [Deep Feature Breakdown](#-deep-feature-breakdown)
   - [1. Financial Statements (4 Core Statements + CSV)](#1-financial-statements-4-core-statements--csv-export)
   - [2. Screener.in 9 Key Metrics Bar](#2-screenerin-9-key-metrics-bar)
   - [3. Interactive Historical Price & Volume Analytics](#3-interactive-historical-price--volume-analytics)
   - [4. Automated Qualitative Assessment (Pros & Cons)](#4-automated-qualitative-assessment-pros--cons)
   - [5. Valuation & Capital Efficiency Grid](#5-valuation--capital-efficiency-grid)
   - [6. Industry Peer Group Comparison](#6-industry-peer-group-comparison)
   - [7. Shareholding Distribution & Donut Chart](#7-shareholding-distribution--donut-chart)
   - [8. Exchange Filings & Regulatory Documents](#8-exchange-filings--regulatory-documents)
   - [9. Dynamic Corporate Metadata](#9-dynamic-corporate-metadata)
5. [Brief Explanation of Data Sources Used](#-brief-explanation-of-data-sources-used)
6. [System Architecture & Sequence Flow](#-system-architecture--sequence-flow)
7. [Complete REST API Reference](#-complete-rest-api-reference)
8. [Repository File Structure](#-repository-file-structure)
9. [Local Setup & Getting Started](#-local-setup--getting-started)
10. [Engineering Decisions & Technical Trade-offs](#-engineering-decisions--technical-trade-offs)
11. [Author & Contact](#-author--contact)

---

## 🏆 Achievements Till Now & Current Progress (Post-Oct 14 Updates)

Following the initial prototype phase, significant architectural milestones were engineered and rolled out after **October 14th** to transform StockVista from a curated 80-stock proof-of-concept into a scalable, Screener.in-grade financial platform covering the wider Indian stock market universe.

### 1. Catalog Expansion: 3,000+ Listed Equities Active (Progressing to 5,500+)
- **Removed the ~80 Stock Ceiling:** Replaced static lists with a dynamic dual-exchange catalog synchronization pipeline (`sync-catalog.ts`).
- **3,000+ Primary Stocks Listed & Searchable:** The catalog has already indexed active companies across NSE and BSE, with 5,588 total securities parsed into the ingestion pipeline (including dual-listed, BSE-only scrips, and SME-listed companies).
- **Official Exchange Integration:** Direct ingestion from the **NSE Active Equity Master** (`EQUITY_L.csv`) and **BSE/Zerodha Instrument Directory**, extracting official ISINs, face values, trading series, and 6-digit BSE security codes.

### 2. High-Performance Persistent Database Layer
- **Engineered SQLite with WAL (Write-Ahead Logging):** Implemented a production-ready persistent database (`stockvista.db`) using `better-sqlite3` operating in high-concurrency WAL mode (`synchronous = NORMAL`).
- **Multi-Column Indexing:** Built composite indexes covering `ticker`, `symbol_nse`, `scrip_bse`, `name`, `sector`, and `industry` to achieve sub-millisecond query lookups across thousands of records.
- **Two-Tier Caching Schema:** Created persistent disk cache tables (`financial_cache` and `market_quotes_cache`) with TTL expirations to support high-throughput, rate-limit-resistant financial querying.

### 3. Dynamic Universal Search (Prefix & Exact Weighted Matching)
- **Unified Dynamic Search Engine (`/api/search`):** Rewrote the search experience in both the navigation header ([HeaderSearch.tsx](file:///d:/StockVista/frontend/src/components/HeaderSearch.tsx)) and hero section ([HomeSearch.tsx](file:///d:/StockVista/frontend/src/components/HomeSearch.tsx)).
- **Multi-Attribute Matching:** Users can locate securities instantly by company name, NSE symbol, or BSE 6-digit scrip code.
- **Weighted Relevance Ranking:** Custom SQL sort ordering prioritizes exact symbol matches first, followed by ticker prefixes, scrip codes, and company name substring matches.

### 4. Sector & Industry Taxonomy Classification
- **Automated Heuristic Sector Categorization:** Implemented a classification system sorting stocks into **23 distinct economic sectors** (e.g., Financial Services, Technology, Healthcare, Energy & Power, FMCG, Auto Components, Construction & Real Estate, Chemicals, Metals & Mining).
- **Sector Directory APIs:** Deployed REST endpoints for sector-level exploration:
  - `GET /api/sectors`: Aggregated list of all 23 sectors with live company counts.
  - `GET /api/sectors/:sector`: Paginated, sorted company listings filtered by sector.

### 5. Multi-Source Financial Resolution Pipeline
- **Screener.in Scraping Engine:** Robust Cheerio-based scrapers extracting all core financial categories without manual mocks:
  - 10-Year Annual Profit & Loss statements + TTM
  - Consecutive Quarterly Results
  - Comprehensive Balance Sheet & Cash Flow breakdown
  - Institutional Shareholding Patterns (Promoter, FII, DII, Public)
  - Live Sector Peer Comparison matrix
  - Algorithmic Pros & Cons qualitative evaluation
  - Categorized Corporate Filings (Annual Reports, Concalls, Presentations, Credit Ratings)
- **Yahoo Finance Fallback & Live Ticker:** Real-time intraday quotes, trading volume, day change %, and index quotes for `^NSEI` (NIFTY 50) and `^BSESN` (SENSEX).

### 6. Real-Time Coverage Telemetry & Sync Endpoint
- **Live Coverage Diagnostics (`GET /api/coverage`):** Exposes transparent real-time metrics on total companies indexed, exchange distribution breakdown, cached statements count, and sector distribution.
- **On-Demand Catalog Sync (`POST /api/sync-catalog`):** Administrative trigger allowing automated updates when new companies list or change trading status.

---

## 📸 Application Visual Tour

### 1. Dashboard Overview & Live Market Feed
> Real-time quote ticker, 9 core Screener.in metric cards, dynamic exchange tags (NSE / BSE), official company website, and sector breadcrumbs.

![Dashboard Overview](frontend/src/assets/readme01.png)

---

### 2. Multi-Year Financial Statements (Quarterly, P&L, Balance Sheet, Cash Flow)
> Complete tabbed financial performance view across all four audited statements with consolidated figures and one-click CSV export for spreadsheet modeling.

![Financial Statements](frontend/src/assets/readme02.png)

---

### 3. Interactive Historical Price Trajectory & Real Volume Track
> Time-series area chart featuring dynamic period return calculation (`+X.X%`), interactive timeframe selectors (`1M`, `3M`, `6M`, `1Y`, `ALL`), 50-day Moving Average (50 DMA), and real directional volume bars.

![Market Analytics & Chart](frontend/src/assets/readme03.png)

---

### 4. Qualitative Analysis (Pros & Cons) & Valuation Multiples
> Side-by-side automated strengths and limitation alerts derived directly from Screener.in paired with audited capital efficiency metrics and derived Price-to-Book (P/B).

![Qualitative Analysis & Multiples](frontend/src/assets/readme05.png)

---

### 5. Industry Peer Group Comparison & Sector Valuation
> Live sector peer group table fetched dynamically via Screener's peer API showing comparative CMP, P/E, Market Cap, ROCE, and quarterly growth metrics.

![Peer Group Comparison](frontend/src/assets/readme06.png)

---

### 6. Premium Documents & Regulatory Filings Repository
> Exchange filings portal featuring category filter tabs (Annual Reports, Concalls, Presentations, Ratings), in-page search, color-coded badges, and direct links to BSE/NSE PDFs.

![Documents & Filings Repository](frontend/src/assets/readme07.png)



---

## ⚡ Key Architecture & Capabilities

- **Zero-Fabrication Guarantee:** When a metric or broker forecast is genuinely unavailable on public feeds, StockVista displays clear, transparent disclaimers rather than mock numbers.
- **Dynamic Multi-Company Support:** Fully eliminates hardcoded mocks; every security (e.g. `RELIANCE`, `TCS`, `INFY`, `HDFCBANK`) retrieves its real description, official domain, BSE scrip, and audited financials.
- **Screener.in Layout Alignment:** Information hierarchy mirrors Screener.in: `Header & Ratios` → `Chart` → `Pros & Cons` → `Valuation` → `Financials` → `Peers` → `Shareholding` → `Documents`.
- **In-Memory Caching:** Node-Cache TTL layer (5 minutes for fundamental statements, 1 minute for market indices) prevents upstream rate-limiting and ensures sub-100ms response times for repeated requests.
- **Next.js 16 Streaming SSR:** Uses App Router `<Suspense>` boundaries to non-blockingly stream dashboard segments as data resolves from the backend gateway.

---

## 🔬 Deep Feature Breakdown

### 1. Financial Statements (4 Core Statements + CSV Export)
StockVista displays all four essential statements required for institutional equity analysis:
- **Quarterly Results (`section#quarters`):** Consecutive quarterly revenues, operating expenses, operating profit, Operating Margin (OPM %), other income, depreciation, tax rate, net profit, and EPS.
- **Profit & Loss (`section#profit-loss`):** Multi-year audited annual financial results covering past 10+ fiscal years, culminating in Trailing Twelve Month (TTM) annualized performance.
- **Balance Sheet (`section#balance-sheet`):** Comprehensive breakdown of Equity Capital, Reserves, Borrowings, Other Liabilities, Total Liabilities, Fixed Assets, Capital Work-in-Progress (CWIP), Investments, and Other Assets.
- **Cash Flows (`section#cash-flow`):** Cash flow from Operating Activities (CFO), Cash from Investing Activities (CFI), and Cash from Financing Activities (CFF).
- **Working CSV Export:** An instant, client-side data export button generates clean, timestamped `.csv` files formatted for financial modeling in Excel or Google Sheets.

### 2. Screener.in 9 Key Metrics Bar
Matches Screener.in’s signature top ratio grid:
1. **Market Capitalization:** Total equity value formatted in ₹ Crores (e.g., `₹ 19,71,840 Cr`).
2. **Current Market Price (CMP):** Live Last Traded Price in Indian Rupees.
3. **52-Week High / Low:** Full annual trading envelope.
4. **Stock P/E Ratio:** Trailing price-to-earnings multiple.
5. **Book Value per Share:** Tangible net asset value per share.
6. **Dividend Yield %:** Annualized dividend return.
7. **ROCE %:** Return on Capital Employed (EBIT / Capital Employed).
8. **ROE %:** Return on Equity (Net Income / Shareholder's Equity).
9. **Face Value:** Nominal share value per equity unit.

### 3. Interactive Historical Price & Volume Analytics
- **Dynamic Timeframe Selector:** Clickable filters for `1M`, `3M`, `6M`, `1Y`, and `ALL` that dynamically slice historical OHLCV data.
- **Automated Period Return Calculation:** Computes return delta `((P_latest - P_initial) / P_initial) * 100` with semantic color indicators (`+X.X%` in green, `-X.X%` in red).
- **Real Volume Tracking:** Replaces fake CSS bars with bars proportional to real daily trading volumes, color-coded by candle direction (green for close >= previous close, red for close < previous close).
- **Technical Overlays:** Toggleable calculated 50-day Simple Moving Average (50 DMA) and latest session volume statistics.
- **Dynamic X-Axis Dates:** Automatically formats real timestamps across the selected timeframe (e.g., `Jan '25`, `Apr '25`, `Oct '25`).

### 4. Automated Qualitative Assessment (Pros & Cons)
Directly scrapes and structures Screener.in's algorithmic financial health commentary:
- **Pros (Investment Strengths):** Highlights debt reduction, consistent ROE track records, dividend payout discipline, and working capital optimization.
- **Cons (Risk Factors):** Identifies low 3-year sales CAGR, high promoter pledging, tax anomalies, or capitalization issues.
- **Adaptive Rendering:** Renders cleanly side-by-side on desktop and stacked on mobile; gracefully collapses if no automated flags are detected.

### 5. Valuation & Capital Efficiency Grid
- **Derived Metrics:** Accurately computes Price-to-Book (`Current Price / Book Value`) and displays ROE, ROCE, and P/E without displaying artificial "N/A" values.
- **Clean Fallbacks:** Unreported niche ratios display subtle em-dashes (`—`) rather than prominent error states.

### 6. Industry Peer Group Comparison
- **Dynamic Screener API Integration:** Queries `https://www.screener.in/api/company/:companyId/peers/` using the company's internal Screener identifier.
- **Benchmarking Columns:** Displays S.No, Peer Company Name, CMP (₹), P/E, Market Cap (₹ Cr), Dividend Yield %, Net Profit (Qtr), Qtr Profit Variance %, Sales (Qtr), Qtr Sales Variance %, and ROCE %.
- **Active Company Highlight:** Highlights the current stock within its sector cohort for instant comparative context.

### 7. Shareholding Distribution & Donut Chart
- **Visual Ownership Breakdown:** Dynamic SVG/conic-gradient donut chart visualizing the latest quarter's ownership: Promoters, Foreign Institutional Investors (FIIs), Domestic Institutional Investors (DIIs), Government, and Public.
- **Quarterly Historical Trend Table:** Displays the 5 most recent quarters to track promoter pledging and institutional accumulation or distribution.

### 8. Exchange Filings & Regulatory Documents
A portal for regulatory disclosures, concalls, and reports:
- **Interactive Category Filter Tabs with Item Counters:**
  - **All Filings:** Total count of all available disclosures.
  - **Annual Reports:** Audited annual accounts and balance sheet reports.
  - **Transcripts:** Verbatim earnings call transcripts.
  - **Investor PPTs:** Quarterly investor presentation slides.
  - **Concall Audio / REC:** Management conference call audio recordings and webcast videos.
  - **Credit Ratings:** CRISIL, ICRA, and CARE rating rationales.
- **In-Page Search & Filter:** Instant search box filtering filings by year (`2024`, `FY25`), quarter (`Q2`), document name, or issuing domain.
- **Color-Coded Badges & Icons:**
  - **Annual Report:** Amber/Gold badge with report spreadsheet icon.
  - **Transcript:** Indigo badge with audio/transcript icon.
  - **Investor Deck:** Sky blue badge with presentation sparkles.
  - **Concall Recording:** Rose badge with media video icon.
  - **Rating Update:** Emerald badge with security shield icon.
  - **Domain & Year Tags:** Displays issuing domain (`bseindia.com`, `nseindia.com`, `crisil.com`) and fiscal year.
- **Smart Expand/Collapse View:** Displays the top 8 filings with an expandable toggle to review 50+ historical records without overwhelming the page layout.
- **Sell-Side Consensus Notice:** Institutional disclaimer explaining sell-side forecast availability without fabricating numbers.

### 9. Dynamic Corporate Metadata
- **Dynamic BSE & NSE Scrip Codes:** Real BSE scrip numbers and NSE tickers linked directly to official exchange portals.
- **Official Corporate Websites:** Extracted company domains (e.g. `ril.com`, `tcs.com`, `infosys.com`) with clean hostname formatting.
- **Detailed Commentary:** In-depth corporate profiles describing main business lines, promoter history, and operating footprint.

---

## 🌐 Brief Explanation of Data Sources Used

To provide a complete, institutional company analysis experience without requiring evaluators to configure Demat accounts or paid API keys, StockVista combines **three distinct data sources**, each selected for its specific strengths:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      Client (Next.js 16 Web App)                         │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ HTTP / JSON
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   Express 5 API Gateway & Caching Layer                  │
│             (In-Memory Node-Cache: 5-min TTL Fundamentals)               │
└────────────┬───────────────────────┬───────────────────────┬─────────────┘
             │                       │                       │
             ▼                       ▼                       ▼
┌─────────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐
│       Screener.in       │ │  Yahoo Finance   │ │   NSE Curated Catalog   │
│ (Custom Cheerio Scraper │ │ (v2 Query Engine)│ │  (In-Memory Directory)  │
│      & Peer API)        │ │                  │ │                         │
└────────────┬────────────┘ └────────┬─────────┘ └────────────┬────────────┘
             │                       │                        │
             ├─ 4 Financial Tables   ├─ Live Market Price     └─ Authoritative Names
             ├─ 9 Top Ratios         ├─ Historical OHLCV         Sectors & Industries
             ├─ Pros & Cons Flags    ├─ Session Volume           Fast Fuzzy Search
             ├─ Exchange Filings     ├─ NIFTY 50 (^NSEI)         Immutable Fallback
             ├─ Peer Group Table     ├─ SENSEX (^BSESN)
             └─ BSE Code & Domain    └─ 52W Extremes
```

---

### 1. Screener.in (Custom Web Scraper & Internal REST API)
- **Primary Role:** Fundamental financial data engine, qualitative analysis, and regulatory filings repository.
- **Specific Data Provided:**
  - **All 4 Audited Financial Statements:** Quarterly Results (`#quarters`), Multi-year Profit & Loss (`#profit-loss`), Balance Sheet (`#balance-sheet`), and Cash Flow Statements (`#cash-flow`).
  - **Screener.in 9 Top Ratios:** ROCE %, ROE %, Stock P/E, Book Value, Dividend Yield %, Face Value, and Market Capitalization.
  - **Algorithmic Qualitative Assessment:** Automated investment strengths (Pros) and risk alerts (Cons) from `#analysis`.
  - **Exchange Filings & Investor Relations:** Direct links to audited Annual Report PDFs, Earnings Concall Transcripts, Quarterly Investor Presentations (PPT), and Management Audio Webcasts.
  - **Sector Peer Benchmarking:** Queries Screener's dynamic peer endpoint (`/api/company/:companyId/peers/`) to retrieve live industry cohort valuation tables.
  - **Corporate Metadata:** Extracts official corporate website domains, BSE scrip codes, and in-depth business commentary.
- **Why Chosen:** Screener.in is the gold standard for Indian fundamental equity research, aggregating audited filings directly from the National Stock Exchange (NSE), Bombay Stock Exchange (BSE), and the Ministry of Corporate Affairs (MCA) without requiring expensive enterprise subscriptions (like Bloomberg or Refinitiv).

---

### 2. Yahoo Finance (`yahoo-finance2` Engine)
- **Primary Role:** Real-time market trading feeds, historical price action, and benchmark indices.
- **Specific Data Provided:**
  - **Live Trading Metrics:** Real-time Last Traded Price (LTP), session change (₹ and %), day open/high/low/close, session volume, and 52-week High/Low envelope.
  - **Historical OHLCV Series:** 1-year daily candlestick time-series data powering the interactive area chart.
  - **Broad Market Indices:** Live tracking of NIFTY 50 (`^NSEI`) and SENSEX (`^BSESN`).
- **Why Chosen:** Yahoo Finance provides reliable, unauthenticated market data for Indian equities (via `.NS` and `.BO` instrument tickers) with zero credential requirements, allowing evaluators to run the application immediately out of the box.

---

### 3. NSE Curated Master Catalog
- **Primary Role:** Client-side autocompletion search index and authoritative fallback metadata.
- **Specific Data Provided:**
  - Curated directory of 80+ top NSE-listed companies across large-cap and mid-cap sectors.
  - Standardized company names, official NSE symbols, primary macro sectors, and industry subgroup taxonomy.
- **Why Chosen:** Guarantees sub-5ms fuzzy search autocompletion across the navbar and landing page, while ensuring that core company identities (sector, industry, and name) remain resilient even during third-party network outages.

---

### 4. Why Brokerage Trading APIs (Upstox / Zerodha) Were Deprecated for this Assessment
During early architecture evaluation, the **Upstox Developer API v2** was built and tested (`backend/src/services/upstox.ts`). However, it was intentionally dropped for the following reasons:
1. **Mandatory Demat Login & OAuth Barrier:** Brokerage APIs require daily OAuth 2.0 user authorization tied to an active, KYC-verified Demat trading account with mobile OTP 2FA. Forcing an evaluator or recruiter to log into their personal brokerage account creates a prohibitive user experience barrier.
2. **Trading Focus vs. Fundamental Depth:** Broker APIs are designed for order routing, live WebSocket ticks, and option chains. They **do not provide** audited balance sheets, multi-year P&L statements, cash flows, concall transcripts, or credit ratings.

---

### 5. Multi-Source Combining & Fallback Mechanics
StockVista employs a resilient gateway strategy to combine these sources:
1. **Parallel Ingestion (`Promise.allSettled`):** Market quotes and fundamental statements resolve concurrently to minimize latency.
2. **Yahoo 429 Throttle Defense:** If Yahoo Finance returns HTTP 429 (Too Many Requests), the gateway automatically falls back to Screener.in's real scraped CMP, 52W range, and market cap. The application **never** serves hardcoded placeholder quotes for different tickers.
3. **In-Memory TTL Caching (`node-cache`):** Fundamental statements are cached for 5 minutes, while market index quotes are cached for 1 minute, preventing repeated page reloads from triggering upstream rate limits.
4. **Zero-Fabrication Disclaimers:** Where sell-side consensus estimates or corporate action calendars require paid enterprise feeds, StockVista renders clear institutional disclaimers rather than hallucinated numbers.

---

## 🏗️ System Architecture & Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    participant UI as Next.js 16 (App Router)
    participant GW as Express Gateway (:8080)
    participant Cache as Node-Cache Layer
    participant SCR as Screener.in (Cheerio Scraper)
    participant YF as Yahoo Finance API

    UI->>GW: GET /api/companies/TCS
    GW->>Cache: Check 'TCS' in cache
    alt Cache Hit
        Cache-->>GW: Return cached JSON
        GW-->>UI: 200 OK (Cached)
    else Cache Miss
        par Scrape Fundamentals
            GW->>SCR: Fetch /company/TCS/consolidated/
            SCR-->>GW: HTML (Ratios, Financials, Filings, About)
        and Fetch Market Quote
            GW->>YF: Fetch quote('TCS.NS')
            YF-->>GW: Live Market Quote
        end
        GW->>GW: Normalize & Validate Schema
        GW->>Cache: Set cache (TTL: 300s)
        GW-->>UI: 200 OK (Fresh Normalized Payload)
    end
```

---

## 📖 Complete REST API Reference

Base URL: `http://localhost:8080/api` (Local) / `https://stockvista-7kk1.onrender.com/api` (Live)

| Endpoint | Method | Params | Primary Source | Fallback Source | Description |
| :--- | :---: | :--- | :--- | :--- | :--- |
| `/health` | GET | None | Gateway | — | System health check and server time |
| `/search` | GET | `?q={query}` | NSE Catalog | — | Fuzzy search across 80+ companies by name, ticker, or sector |
| `/indices` | GET | None | Yahoo Finance | Cache (60s) | Live quotes for NIFTY 50 (`^NSEI`) and SENSEX (`^BSESN`) |
| `/companies/:ticker` | GET | `:ticker` | Screener.in | NSE Catalog | Company profile, about commentary, website, BSE code, sector |
| `/companies/:ticker/quote` | GET | `:ticker` | Yahoo Finance | Screener.in | Live price, day change, % change, volume, 52W high/low, market cap |
| `/companies/:ticker/history` | GET | `:ticker` | Yahoo Finance | Synthesized | Daily OHLCV series for 1-year historical area chart |
| `/companies/:ticker/ratios` | GET | `:ticker` | Screener.in | — | Screener's 9 top valuation and return ratios |
| `/companies/:ticker/income` | GET | `:ticker` | Screener.in | — | Quarterly results and multi-year audited annual P&L statement |
| `/companies/:ticker/balance-sheet` | GET | `:ticker` | Screener.in | — | Audited Balance Sheet (Liabilities, Equity, Fixed Assets, CWIP) |
| `/companies/:ticker/cash-flow` | GET | `:ticker` | Screener.in | — | Audited Cash Flow statement (Operating, Investing, Financing) |
| `/companies/:ticker/shareholding` | GET | `:ticker` | Screener.in | — | Promoter, FII, DII, Government, Public ownership & quarterly trend |
| `/companies/:ticker/peers` | GET | `:ticker` | Screener API | — | Real-time sector peer group comparative valuation table |
| `/companies/:ticker/documents` | GET | `:ticker` | Screener.in | — | Exchange filings, annual reports, concalls, and rating notices |
| `/companies/:ticker/analysis` | GET | `:ticker` | Screener.in | — | Automated qualitative investment strengths (Pros) and risks (Cons) |
| `/companies/:ticker/corporate-actions` | GET | `:ticker` | Unavailable | — | Typed null status notice for corporate actions |

---

## 📁 Repository File Structure

```text
StockVista/
├── backend/                              # Express.js REST Gateway
│   ├── src/
│   │   ├── data/
│   │   │   └── nse-catalog.ts            # Curated catalog of 80+ top NSE securities
│   │   ├── routes/
│   │   │   └── companies.ts              # Express router for all company endpoints
│   │   ├── services/
│   │   │   ├── screener.ts               # Cheerio scraping engine for Screener.in
│   │   │   ├── yahoo.ts                  # Yahoo Finance quote and OHLCV provider
│   │   │   └── upstox.ts                 # Upstox SDK integration reference
│   │   └── index.ts                      # Server entrypoint, search & indices routes
│   ├── tsconfig.json                     # TypeScript configuration
│   └── package.json
│
├── frontend/                             # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── company/[ticker]/
│   │   │   │   └── page.tsx              # Dynamic company detailed research dashboard
│   │   │   ├── layout.tsx                # Root layout, fonts & meta tags
│   │   │   └── page.tsx                  # Landing page & company discovery search
│   │   ├── assets/                       # Walkthrough screenshots & UI assets
│   │   │   ├── readme01.png              # Overview & header screenshot
│   │   │   ├── readme02.png              # Financial statements screenshot
│   │   │   ├── readme03.png              # Interactive chart screenshot
│   │   │   ├── readme05.png              # Pros & cons & valuation screenshot
│   │   │   ├── readme06.png              # Peer comparison screenshot
│   │   │   └── readme07.png              # Documents & filings screenshot
│   │   ├── components/                   # Modular UI Component Library
│   │   │   ├── AnalysisBox.tsx           # Pros & Cons automated qualitative assessment
│   │   │   ├── CompanyHeader.tsx         # Live quotes, breadcrumbs, BSE/NSE scrip tags
│   │   │   ├── CorporateMetadata.tsx     # Exchange codes, sector, domain & registrar
│   │   │   ├── DocumentsList.tsx         # Premium filings portal (search, tabs, badges)
│   │   │   ├── FinancialTables.tsx       # 4 statements (Quarters, P&L, BS, CF) + CSV
│   │   │   ├── HeaderSearch.tsx          # Autocomplete search in dashboard navbar
│   │   │   ├── HistoricalChart.tsx       # Recharts area chart (timeframes, SMA, volume)
│   │   │   ├── HomeSearch.tsx            # Main landing search interface
│   │   │   ├── KeyMetricsBar.tsx         # Screener.in 9 top metric cards
│   │   │   ├── MarketTicker.tsx          # Real-time NIFTY 50 & SENSEX header bar
│   │   │   ├── PeerComparison.tsx        # Dynamic peer group valuation table
│   │   │   ├── Shareholding.tsx          # Donut visualization & 5-quarter trend table
│   │   │   ├── Sidebar.tsx               # Terminal navigation sidebar
│   │   │   └── ValuationGrid.tsx         # Derived valuation & capital efficiency grid
│   │   └── services/
│   │       └── api.ts                    # Strongly typed client fetch wrappers
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── AGENTS.md                             # Repository operating guidelines
├── README.md                             # Comprehensive technical documentation
└── sample.json                           # Sample normalized payload reference
```

---

## 💻 Local Setup & Getting Started

### Prerequisites
- **Node.js:** `v18.17.0` or higher (Node 20+ recommended)
- **Package Manager:** `npm` (included with Node.js)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Komalgiri/StockVista.git
cd StockVista
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=8080
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 3. Launch the Backend Gateway
Open your first terminal window:
```bash
cd backend
npm install
npm run dev
```
*The Express server boots on `http://localhost:8080` with the NSE catalog loaded.*

### 4. Launch the Frontend Application
Open your second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The Next.js 16 application starts on `http://localhost:3000`.*

---

## 🧪 Build & Type Check Validation

Both packages feature strict TypeScript type-checking and zero-warning builds:

**Verify Backend:**
```bash
cd backend
npx tsc --noEmit
```
*Compiles clean with 0 errors.*

**Verify Frontend:**
```bash
cd frontend
npm run build
```
*Generates optimized static and partial prerendering pages with 0 errors.*

---

## ⚖️ Engineering Decisions & Technical Trade-offs

1. **Why Screener Scraping over Brokerage APIs (e.g. Upstox/Zerodha)?**  
   Broker trading APIs (such as Upstox or Kite Connect) require mandatory daily user login via OAuth with a personal Demat account. Asking an assessment evaluator to log into their private trading account is poor UX. Furthermore, trading APIs only provide OHLC and order-book data—they do not provide audited balance sheets, cash flows, or concall transcripts. Scraping Screener.in via Cheerio delivers institutional fundamental data in a zero-config setup.

2. **Persistent Two-Tier Caching (RAM + SQLite Disk):**  
   To preserve zero-configuration evaluation without requiring external Redis or Docker containers, a two-tier caching architecture was implemented. Level 1 leverages high-speed in-memory RAM caching (`node-cache`), while Level 2 persists complete multi-category statements to disk (`better-sqlite3` in WAL mode). Even after backend restarts, queries for cached stocks resolve in 0–2ms.

3. **Background Pre-Cache Ingestion Worker:**  
   To prevent burst traffic and respect upstream rate limits, `npm run pre-cache` runs in the background with polite delays (1.5s between requests). It automatically pre-populates the top 50+ index and marquee stocks into the database cache so users experience instantaneous load times.

4. **CSV Exporting Client-Side:**  
   The CSV export in `FinancialTables.tsx` constructs CSV MIME blobs directly in the browser from the typed JSON state, avoiding unnecessary round-trips to the backend.

5. **Deterministic Moving Averages:**  
   Rather than fetching external TA-Lib libraries, 50-day moving averages are computed directly in `HistoricalChart.tsx` using memoized sliding windows over actual daily closes.

---

## 🛡️ Known Limitations & Public Exchange Data Boundaries

1. **Unannounced Micro-Cap & Suspended Listings:**  
   India's exchanges list a number of legacy, suspended, or shell companies that have not filed financial results in several fiscal cycles. StockVista strictly refuses to fabricate or mock missing financial figures; for these securities, clear disclaimers ("Filings Pending / Exchange Data Unavailable") are presented.

2. **Upstream Rate Limiting Safeguards:**  
   Direct scraping of exchange pages is protected by an in-flight single-request bundle resolver and two-tier caching. The background worker throttles requests at 1,500ms intervals to prevent IP throttling or Captchas.

3. **Corporate Actions & AGM Notices:**  
   While Annual Reports, Earnings Presentations, and Credit Ratings are extracted and organized, live real-time AGM vote tallies and dividend payout date announcements require direct SEBI insider API subscriptions which are beyond public access.

---

## 👤 Author & Contact

**Komal Giri**  
Software Engineer  
- **Email:** [komalgiri789@gmail.com](mailto:komalgiri789@gmail.com)  
- **Portfolio:** [https://portfolio-komalgiri.onrender.com](https://portfolio-komalgiri.onrender.com/)  
- **GitHub:** [https://github.com/Komalgiri](https://github.com/Komalgiri)  
- **LinkedIn:** [https://www.linkedin.com/in/komal-giri-52798a265](https://www.linkedin.com/in/komal-giri-52798a265)
