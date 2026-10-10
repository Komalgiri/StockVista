import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companiesRouter from './routes/companies';
import { NSE_CATALOG } from './data/nse-catalog';
import { getMarketQuote } from './services/yahoo';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const indicesCache = new NodeCache({ stdTTL: 60 }); // 1-minute TTL for index data

app.use(cors());
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ─── Company Search ───────────────────────────────────────────────────────────
// Searches the 80+ company catalog by name or ticker. Case-insensitive fuzzy match.
app.get('/api/search', (req: express.Request, res: express.Response) => {
  const query = (req.query.q as string || '').trim().toLowerCase();

  if (!query || query.length < 1) {
    return res.json({ success: true, data: [], meta: { total: 0 } });
  }

  const results = NSE_CATALOG
    .filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.ticker.toLowerCase().includes(query) ||
      c.sector.toLowerCase().includes(query)
    )
    .slice(0, 10) // Cap at 10 results for fast response
    .map(c => ({
      name: c.name,
      ticker: c.ticker,
      exchange: c.exchange,
      sector: c.sector
    }));

  res.json({ success: true, data: results, meta: { total: results.length, source: 'nse-catalog' } });
});

// ─── Live Market Indices ──────────────────────────────────────────────────────
// Fetches live NIFTY 50 and SENSEX from Yahoo Finance.
// Both are listed on Yahoo as ^NSEI and ^BSESN respectively.
app.get('/api/indices', async (req: express.Request, res: express.Response) => {
  const cacheKey = 'market-indices';
  const cached = indicesCache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached, meta: { source: 'cache' } });
  }

  try {
    // Fetch NIFTY 50 and SENSEX in parallel using yahoo symbols
    const [niftyRaw, sensexRaw] = await Promise.allSettled([
      getMarketQuote('^NSEI'),
      getMarketQuote('^BSESN'),
    ]);

    const nifty = niftyRaw.status === 'fulfilled' && niftyRaw.value ? niftyRaw.value : null;
    const sensex = sensexRaw.status === 'fulfilled' && sensexRaw.value ? sensexRaw.value : null;

    const payload = {
      nifty50: nifty ? {
        value: nifty.price,
        change: nifty.dayChange,
        changePercent: nifty.dayChangePercent,
      } : null,
      sensex: sensex ? {
        value: sensex.price,
        change: sensex.dayChange,
        changePercent: sensex.dayChangePercent,
      } : null,
    };

    indicesCache.set(cacheKey, payload);
    res.json({ success: true, data: payload, meta: { source: 'yahoo-finance' } });
  } catch (error) {
    console.error('Indices fetch failed:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch market indices.' } });
  }
});

// ─── Company Routes ───────────────────────────────────────────────────────────
app.use('/api/companies', companiesRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ StockVista backend running on http://localhost:${PORT}`);
  console.log(`   NSE catalog loaded: ${NSE_CATALOG.length} companies`);
});
