# Backend API Documentation

## Overview
This Express backend acts as a service layer connecting the StockVista frontend to the Upstox Developer API. 
All responses share a common structure:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "source": "upstox | mock | unavailable",
    "lastUpdated": "ISO_DATE",
    "delayed": boolean
  }
}
```

## Endpoints

### 1. `GET /api/health`
Returns backend health status.

### 2. `GET /api/search?q=`
Search companies by query. (Currently stubbed)

### 3. `GET /api/companies/:isin`
**Provider Support:** Limited (Mocked identity fallback)
Returns basic company identity (name, sector, exchange). Upstox API does not natively expose rich fundamental descriptions in quotes.

### 4. `GET /api/companies/:isin/quote`
**Provider Support:** Yes (Upstox Market Quote API)
Returns current price, OHLC, day change, volume.
*Note: Market Cap and 52W metrics require separate data tier or are limited.*

### 5. `GET /api/companies/:isin/history?range=1M`
**Provider Support:** Yes (Upstox Historical Candle API)
Returns an array of daily historical prices `{ date, price }`.

### 6. Fundamentals Endpoints
* `GET /api/companies/:isin/ratios`
* `GET /api/companies/:isin/income`
* `GET /api/companies/:isin/balance-sheet`
* `GET /api/companies/:isin/cash-flow`
* `GET /api/companies/:isin/shareholding`
* `GET /api/companies/:isin/peers`
* `GET /api/companies/:isin/corporate-actions`
* `GET /api/companies/:isin/documents`

**Provider Support:** **No**
Upstox Developer API focuses on trading, OHLC data, and market quotes. It does not provide historical financial statements, fundamental ratios, holding distributions, peers, or corporate action PDFs.
**Behavior:** These endpoints return `null` and a meta source of `"unavailable"`.

## Credentials & Configuration
To run live Upstox requests, set `UPSTOX_ACCESS_TOKEN` in `.env`.
If missing, the backend safely falls back to documented graceful missing-configuration states and mocked UI placeholders.
