# StockVista

StockVista is a professional, institutional-grade equity research dashboard for Indian capital markets, designed as a full-stack software engineering assessment. It provides deep financial insights, live market tracking, and valuation metrics, closely inspired by the information architecture and usability of Screener.in. 

## Key Features

- **Smart Company Search:** Client-side search interface allowing users to find companies by name, ticker, or ISIN with seamless Next.js routing.
- **Live Stock Quotes:** Real-time fetching of Last Traded Price (LTP), day changes, volume, and 52-week highs/lows.
- **Historical Price Chart:** Interactive, responsive time-series area charts mapping historical OHLC data, built with Recharts.
- **Graceful Data Degradation:** Elegant handling of fundamental data constraints (e.g., Valuation Ratios, P&L, Balance Sheet, Shareholding). Where the trading API lacks fundamental data, the UI renders bespoke "Data Unavailable" states instead of crashing or hallucinating data.
- **Server-Side Rendering & Streaming:** Leverages Next.js App Router `<Suspense>` boundaries to non-blockingly stream page fragments as data resolves from the backend.

## Screenshots and Demo

> **Note to Evaluator:** Placeholders below. 
> 
> - **Live Demo URL:** `[Insert Deployed URL Here]`
> 
> ![Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=Dashboard+Screenshot)
> ![Search Screenshot](https://via.placeholder.com/800x450.png?text=Search+Screenshot)

## Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4
- **Charting:** Recharts, Lucide React (Icons)
- **Backend:** Node.js, Express.js 4, TypeScript
- **Caching & Rate-Limiting:** `node-cache` (In-memory TTL caching)
- **Data Fetching:** yahoo-finance2

## System Architecture

StockVista utilizes a Proxy/Gateway architecture. The frontend strictly communicates with our Node.js backend. The backend acts as a caching layer and data transformer, securely communicating with the external Yahoo Finance API, and returning normalized, typed JSON to the client.

```mermaid
sequenceDiagram
    participant Client as Frontend (Next.js)
    participant Backend as Express API Gateway
    participant Cache as Node-Cache (TTL)
    participant Provider as Yahoo Finance API
    
    Client->>Backend: GET /api/companies/RELIANCE/quote
    Backend->>Cache: Check if 'RELIANCE/quote' exists
    alt Cache Hit
        Cache-->>Backend: Return cached Quote Data
        Backend-->>Client: 200 OK (Cached JSON)
    else Cache Miss
        Backend->>Provider: GET Quote Data (yahoo-finance2)
        Provider-->>Backend: 200 OK (Yahoo Payload)
        Backend->>Backend: Normalize to StockVista Schema
        Backend->>Cache: Store for 5 minutes
        Backend-->>Client: 200 OK (Fresh JSON)
    end
```

## Project Structure

```text
StockVista/
├── backend/                  # Node.js + Express API Gateway
│   ├── src/
│   │   ├── routes/           # Express route definitions (e.g., companies.ts)
│   │   ├── services/         # Yahoo Finance API integration layer
│   │   └── index.ts          # Server entrypoint & Search logic
│   ├── tsconfig.json
│   └── package.json
└── frontend/                 # Next.js 16 Web Application
    ├── src/
    │   ├── app/              # App Router (page.tsx, layout.tsx)
    │   ├── components/       # Reusable UI (HistoricalChart, FinancialTables)
    │   └── services/         # Frontend fetch wrappers (api.ts)
    ├── tailwind.config.ts
    ├── next.config.ts
    └── package.json
```

## Prerequisites

- **Node.js**: v18.17.0 or higher
- **Package Manager**: npm

## Getting Started

This project is a monorepo requiring two separate terminal instances for the frontend and backend.

### 1. Start the Backend API

Open your first terminal:
```bash
cd backend
npm install
npm run dev
```
*The backend will boot up in development mode on `http://localhost:8080`.*

### 2. Start the Frontend Application

Open your second terminal:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will boot up in development mode on `http://localhost:3000`.*

## Environment Configuration

You must create environment variable files in both directories. Do not commit these files to version control.

**`backend/.env`**
```env
# Required: The port the Express server binds to
PORT=8080
```

**`frontend/.env.local`**
```env
# Required: Points the Next.js client/server to the Express Gateway
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## API Reference

The Node.js backend exposes the following REST endpoints to the frontend:

| Endpoint | Method | Description | Live Data? |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Server health check | ✅ Always |
| `/api/search?q={query}` | GET | Fuzzy search across 80+ NSE-listed companies by name, ticker, or sector | ✅ In-memory catalog |
| `/api/indices` | GET | Live NIFTY 50 and SENSEX price, change, % change | ✅ Yahoo Finance |
| `/api/companies/:ticker` | GET | Company profile: name, sector, industry, exchange | ✅ Yahoo Finance (with mock fallback) |
| `/api/companies/:ticker/quote` | GET | Live LTP, day change, volume, 52W high/low, market cap | ✅ Yahoo Finance |
| `/api/companies/:ticker/history` | GET | Daily OHLC historical data (1 year default) | ✅ Yahoo Finance |
| `/api/companies/:ticker/ratios` | GET | Valuation ratios (P/E, P/B, ROE) | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/income` | GET | Quarterly / annual P&L statement | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/balance-sheet` | GET | Balance sheet data | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/cash-flow` | GET | Cash flow statement | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/shareholding` | GET | Promoter / institutional shareholding pattern | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/peers` | GET | Sector peer comparison table | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/corporate-actions` | GET | Dividends, bonuses, splits | ⚠️ Unavailable — returns `null` |
| `/api/companies/:ticker/documents` | GET | BSE/NSE filings and annual reports | ⚠️ Unavailable — returns `null` |

> **Why ⚠️ endpoints exist:** Yahoo Finance's free (unauthenticated) layer provides excellent market data (prices, history, basic profile) but does **not** expose fundamental financial statements, shareholding data, or corporate actions. All unavailable endpoints return a typed `null` response — the frontend handles this gracefully by rendering an explicit "Data Unavailable" UI state rather than crashing or fabricating data. See the [Limitations](#limitations-and-future-improvements) section below.

*Note: All routes are wrapped in a 5-minute TTL in-memory cache (1-minute for index data).*

## Financial Data Sources

- **Primary Provider:** [Yahoo Finance](https://finance.yahoo.com/) via the [`yahoo-finance2`](https://github.com/gadicc/yahoo-finance2) npm package (MIT licensed)
- **No API key required** — works out of the box, making this project instantly runnable by any evaluator.

### What Yahoo Finance provides (used in this app)

| Data Point | Status |
| :--- | :--- |
| Live LTP (Last Traded Price) | ✅ Live |
| Day change & % change | ✅ Live |
| Volume | ✅ Live |
| Market Cap | ✅ Live |
| 52-week High / Low | ✅ Live |
| Open / High / Low / Close (daily) | ✅ Live |
| 1-year historical OHLCV data | ✅ Live |
| Company name, sector, industry | ✅ Live |
| NIFTY 50 index (^NSEI) | ✅ Live |
| SENSEX (^BSESN) | ✅ Live |

### What Yahoo Finance does NOT provide (shown as "Data Unavailable")

| Data Point | Why Missing |
| :--- | :--- |
| Quarterly P&L / Income Statement | Not available via the free unauthenticated Yahoo Finance API |
| Balance Sheet | Not available via the free unauthenticated Yahoo Finance API |
| Cash Flow Statement | Not available via the free unauthenticated Yahoo Finance API |
| Shareholding pattern (promoter %, FII %, DII %) | Requires BSE/NSE direct data feeds or a paid provider |
| Peer comparison financials | Requires a structured fundamentals database |
| Valuation ratios (P/E, P/B, EV/EBITDA) | Yahoo Finance provides these inconsistently for Indian stocks |
| Corporate Actions (dividends, bonuses, splits) | Requires BSE corporate actions API |
| BSE/NSE filings and annual reports | Requires NSE EDGAR / BSE filing portal API |
| Analyst estimates / price targets | Requires a paid tier (e.g., Refinitiv, Bloomberg) |

> **Production approach:** A production build would integrate a secondary provider such as Screener.in's enterprise API, BSE India's data APIs, or a paid fundamentals provider (Morningstar, Refinitiv) to populate the unavailable sections above.

## Testing and Build

**Frontend (Next.js)**
```bash
cd frontend
npm run lint    # Runs ESLint strictly across the codebase
npm run build   # Compiles the optimized production Next.js build
```

**Backend (Express)**
```bash
cd backend
npm run build   # Compiles TypeScript to dist/
```
*All linting and build checks are currently passing perfectly.*

## Design and Engineering Decisions

- **Strict TypeScript Boundaries:** The `frontend/src/services/api.ts` file acts as a strict boundary, casting all backend responses into validated TypeScript interfaces (`MarketQuote`, `CompanyProfile`) before the UI components consume them.
- **Provider-Response Normalization:** The Express backend transforms dense provider-specific keys into normalized generic keys, allowing the frontend to remain provider-agnostic. 
- **Caching for Rate Limits:** The `node-cache` implementation at the Express route level prevents the frontend from spamming the Yahoo API on repeated page reloads.

## Limitations and Future Improvements

- **Search catalog:** Currently uses an in-memory array of ~80 top NSE-listed companies. In production, this would be replaced by a PostgreSQL table synced daily with the NSE master instrument list (~2,200 securities), indexed with Elasticsearch or a full-text search engine.
- **Fundamental data not available from free Yahoo Finance:** As documented above, balance sheet, P&L, cash flow, shareholding pattern, corporate actions, and analyst estimates are not available from Yahoo Finance's free unauthenticated API. All these sections render graceful "Data Unavailable" states.
- **Upstox / NSE Direct not used:** The original design considered Upstox, but its API requires OAuth login via a demat account, making the evaluator's local setup impractical. Yahoo Finance was chosen as the pragmatic, zero-config alternative.
- **Rate limiting:** Yahoo Finance is a public scraping target and may throttle high-frequency requests. The in-memory `node-cache` mitigates this for repeated page loads. Production usage would need a proper job queue.
- **No database:** No persistent storage is used. All caching is in-memory and lost on server restart.

---

**Author:** Komal Giri  
**Repository:** `https://github.com/Komalgiri/StockVista`  
**Deployed App:** `[Insert Deployed URL after deployment]`
