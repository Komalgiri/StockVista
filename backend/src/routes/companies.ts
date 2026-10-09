import { Router, Request, Response, NextFunction } from 'express';
import { getMarketQuote, getHistoricalData } from '../services/upstox';
import NodeCache from 'node-cache';

const router = Router();
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Wrap async routes
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Fallback format wrapper
const respond = (res: Response, data: unknown, source: string = 'upstox') => {
  res.json({
    success: true,
    data,
    meta: {
      source,
      lastUpdated: new Date().toISOString(),
      delayed: source === 'mock' ? true : false
    }
  });
};

// Cache Middleware
const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  
  if (cachedResponse) {
    return res.json(cachedResponse);
  } else {
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body);
      return originalJson(body);
    };
    next();
  }
};

// 1. Company Profile
router.get('/:isin', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { isin } = req.params;
  // Upstox does not provide rich company profiles via a simple endpoint.
  // We return a mock/fallback for identity since it's required for the UI to function gracefully.
  respond(res, {
    name: isin === 'RELIANCE' ? "Reliance Industries Ltd." : "Unknown Company",
    ticker: isin,
    exchange: "NSE",
    sector: "Energy / Telecommunications",
    isin: isin,
    industry: "Oil Refining & Marketing"
  }, 'mock');
}));

// 2. Quote
router.get('/:isin/quote', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { isin } = req.params;
  try {
    // Attempt real Upstox fetch if credentials exist
    const instrumentKey = `NSE_EQ|${isin}`; // Simplistic mapping, real mapping requires instrument CSV parsing
    const quote = await getMarketQuote(instrumentKey);
    const data = quote.data[instrumentKey];
    
    respond(res, {
      currentPrice: data.last_price,
      dayChange: data.last_price - data.ohlc.close,
      dayChangePercent: ((data.last_price - data.ohlc.close) / data.ohlc.close) * 100,
      open: data.ohlc.open,
      high: data.ohlc.high,
      low: data.ohlc.low,
      previousClose: data.ohlc.close,
      volume: data.volume,
      weekHigh52: data.lower_circuit_limit, // placeholders if 52w not directly available
      weekLow52: data.upper_circuit_limit,
      marketCap: null // Upstox doesn't provide MCAP in quotes
    }, 'upstox');
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('missing')) {
      // Configuration Error / Graceful fallback for demo
      respond(res, {
        currentPrice: 2914.40,
        dayChange: 34.65,
        dayChangePercent: 1.21,
        open: 2880.00,
        high: 2920.00,
        low: 2875.00,
        previousClose: 2879.85,
        volume: 4540000,
        weekHigh52: 3024.90,
        weekLow52: 2220.30,
        marketCap: "19,71,840 Cr"
      }, 'mock (missing credentials)');
    } else {
      throw error;
    }
  }
}));

// 3. Historical Chart
router.get('/:isin/history', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { isin } = req.params;
  try {
    // Need instrument key mapping and date calculations in reality
    const instrumentKey = `NSE_EQ|${isin}`;
    const toDate = '2024-03-26';
    const fromDate = '2023-03-26';
    const history = await getHistoricalData(instrumentKey, 'day', toDate, fromDate);
    
    const formatted = history.data.candles.map((candle: number[]) => ({
      date: (candle[0] as unknown as string).substring(0, 10),
      price: candle[4]
    })).reverse();
    
    respond(res, formatted, 'upstox');
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('missing')) {
      respond(res, [
        { date: "2023-04-01", price: 2300 },
        { date: "2023-07-01", price: 2500 },
        { date: "2023-10-01", price: 2450 },
        { date: "2024-01-01", price: 2700 },
        { date: "2024-03-26", price: 2914.4 }
      ], 'mock (missing credentials)');
    } else {
      throw error;
    }
  }
}));

// 4. Ratios - Unavailable in Upstox
router.get('/:isin/ratios', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  // Upstox does not provide fundamentals.
  respond(res, null, 'unavailable');
}));

// 5. Financials - Unavailable in Upstox
router.get('/:isin/income', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));
router.get('/:isin/balance-sheet', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));
router.get('/:isin/cash-flow', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));

// 6. Ownership & Peers - Unavailable in Upstox
router.get('/:isin/shareholding', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));
router.get('/:isin/peers', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));

// 7. Corporate Actions & Documents - Unavailable
router.get('/:isin/corporate-actions', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));
router.get('/:isin/documents', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));

export default router;
