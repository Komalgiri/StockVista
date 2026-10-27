import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companiesRouter from './routes/companies';
import { CompanyService } from './db';
import { syncMasterCatalog } from './scripts/sync-catalog';
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
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      totalCompaniesIndexed: CompanyService.getTotalCount()
    }
  });
});

// ─── Dynamic Company Search (NSE & BSE) ───────────────────────────────────────
// Fast indexed search across 5,500+ companies by Name, NSE Symbol, or BSE Code.
app.get('/api/search', (req: express.Request, res: express.Response) => {
  const query = (req.query.q as string || '').trim();

  if (!query || query.length < 1) {
    return res.json({ success: true, data: [], meta: { total: 0 } });
  }

  const results = CompanyService.search(query, 12).map(c => ({
    name: c.name,
    ticker: c.symbol_nse || c.ticker,
    symbol_nse: c.symbol_nse,
    scrip_bse: c.scrip_bse,
    exchange: c.exchange,
    sector: c.sector,
    industry: c.industry
  }));

  res.json({
    success: true,
    data: results,
    meta: {
      total: results.length,
      source: 'sqlite-db',
      universeSize: CompanyService.getTotalCount()
    }
  });
});

// ─── Sector Directory Endpoints ───────────────────────────────────────────────
app.get('/api/sectors', (req: express.Request, res: express.Response) => {
  const sectors = CompanyService.getSectors();
  res.json({
    success: true,
    data: sectors,
    meta: {
      totalSectors: sectors.length,
      totalCompanies: CompanyService.getTotalCount()
    }
  });
});

app.get('/api/sectors/:sector', (req: express.Request, res: express.Response) => {
  const sector = req.params.sector as string;
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '50', 10);
  const offset = (Math.max(1, page) - 1) * limit;

  const { companies, total } = CompanyService.getCompaniesBySector(sector, limit, offset);

  res.json({
    success: true,
    data: {
      sector,
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// ─── Data Coverage & Diagnostics Report ───────────────────────────────────────
app.get('/api/coverage', (req: express.Request, res: express.Response) => {
  const report = CompanyService.getCoverageReport();
  res.json({
    success: true,
    data: report
  });
});

// ─── Trigger Manual Sync ──────────────────────────────────────────────────────
app.post('/api/sync-catalog', async (req: express.Request, res: express.Response) => {
  try {
    const result = await syncMasterCatalog();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// Genuinely fetched indices cache (initially null until genuinely fetched from live exchange feeds)
let lastKnownIndices: {
  nifty50: { value: number; change: number; changePercent: number } | null;
  sensex: { value: number; change: number; changePercent: number } | null;
} = {
  nifty50: null,
  sensex: null,
};

// ─── Live Market Indices ──────────────────────────────────────────────────────
app.get('/api/indices', async (req: express.Request, res: express.Response) => {
  const cacheKey = 'market-indices';
  const cached = indicesCache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached, meta: { source: 'cache' } });
  }

  try {
    const [niftyRaw, sensexRaw] = await Promise.allSettled([
      getMarketQuote('^NSEI'),
      getMarketQuote('^BSESN'),
    ]);

    const nifty = niftyRaw.status === 'fulfilled' && niftyRaw.value ? niftyRaw.value : null;
    const sensex = sensexRaw.status === 'fulfilled' && sensexRaw.value ? sensexRaw.value : null;

    if (nifty || sensex) {
      const payload = {
        nifty50: nifty ? {
          value: nifty.price,
          change: nifty.dayChange,
          changePercent: nifty.dayChangePercent,
        } : lastKnownIndices.nifty50,
        sensex: sensex ? {
          value: sensex.price,
          change: sensex.dayChange,
          changePercent: sensex.dayChangePercent,
        } : lastKnownIndices.sensex,
      };

      lastKnownIndices = payload;
      indicesCache.set(cacheKey, payload, 180); // 3-minute cache
      return res.json({ success: true, data: payload, meta: { source: 'yahoo-finance' } });
    }

    if (lastKnownIndices.nifty50 || lastKnownIndices.sensex) {
      indicesCache.set(cacheKey, lastKnownIndices, 300);
      return res.json({ success: true, data: lastKnownIndices, meta: { source: 'last-verified-cache' } });
    }

    return res.json({
      success: true,
      data: { nifty50: null, sensex: null },
      meta: { source: 'unavailable' }
    });
  } catch (error) {
    if (lastKnownIndices.nifty50 || lastKnownIndices.sensex) {
      return res.json({ success: true, data: lastKnownIndices, meta: { source: 'last-verified-cache' } });
    }
    return res.json({
      success: true,
      data: { nifty50: null, sensex: null },
      meta: { source: 'unavailable' }
    });
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

app.listen(PORT, async () => {
  const total = CompanyService.getTotalCount();
  console.log(`✅ Opp Code Stock Vision backend running on http://localhost:${PORT}`);
  console.log(`   Database loaded: ${total} NSE & BSE companies indexed in SQLite.`);

  // Auto-sync if DB is empty
  if (total === 0) {
    console.log(`⚠️ Database is empty. Triggering automated master catalog sync...`);
    try {
      await syncMasterCatalog();
    } catch (err) {
      console.error('Initial catalog sync failed:', err);
    }
  }
});
