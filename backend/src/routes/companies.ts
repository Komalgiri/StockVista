import { Router, Request, Response, NextFunction } from 'express';
import { getMarketQuote, getHistoricalData, getCompanyProfile } from '../services/yahoo';
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
  const isin = req.params.isin as string;
  try {
    const profile = await getCompanyProfile(isin);
    if (profile) {
      respond(res, profile, 'yahoo-finance');
      return;
    }
  } catch (error) {
    console.error('Yahoo profile fetch failed', error);
  }
  
  respond(res, {
    name: isin,
    ticker: isin,
    exchange: "NSE",
    sector: "Unknown",
    isin: isin,
    industry: "Unknown"
  }, 'mock');
}));

// 2. Quote
router.get('/:isin/quote', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const isin = req.params.isin as string;
  try {
    const data = await getMarketQuote(isin);
    if (data) {
      respond(res, {
        currentPrice: data.price,
        dayChange: data.dayChange,
        dayChangePercent: data.dayChangePercent,
        open: data.open,
        high: data.high,
        low: data.low,
        previousClose: data.close,
        volume: data.volume,
        weekHigh52: data.weekHigh52,
        weekLow52: data.weekLow52,
        marketCap: data.marketCap
      }, 'yahoo-finance');
      return;
    }
  } catch (error) {
    console.error('Yahoo quote fetch failed', error);
  }

  // Graceful fallback mock
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
  }, 'mock');
}));

// 3. Historical Chart
router.get('/:isin/history', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const isin = req.params.isin as string;
  try {
    const history = await getHistoricalData(isin, '1y');
    if (history && history.length > 0) {
      respond(res, history, 'yahoo-finance');
      return;
    }
  } catch (error) {
    console.error('Yahoo history fetch failed', error);
  }

  // Mock array fallback
  respond(res, [
    { date: "2023-04-01", price: 2300 },
    { date: "2023-07-01", price: 2500 },
    { date: "2023-10-01", price: 2450 },
    { date: "2024-01-01", price: 2700 },
    { date: "2024-03-26", price: 2914.4 }
  ], 'mock');
}));

import { getScreenerRatios, getScreenerIncome, getScreenerBalanceSheet, getScreenerCashFlow, getScreenerShareholding, getScreenerPeers, getScreenerDocuments } from '../services/screener';

// 4. Ratios
router.get('/:isin/ratios', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const isin = req.params.isin as string;
  const data = await getScreenerRatios(isin);
  respond(res, data, 'screener.in');
}));

// 5. Financials
router.get('/:isin/income', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => { 
  const data = await getScreenerIncome(req.params.isin as string);
  respond(res, data, 'screener.in'); 
}));

router.get('/:isin/balance-sheet', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => { 
  const data = await getScreenerBalanceSheet(req.params.isin as string);
  respond(res, data, 'screener.in'); 
}));

router.get('/:isin/cash-flow', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => { 
  const data = await getScreenerCashFlow(req.params.isin as string);
  respond(res, data, 'screener.in'); 
}));

// 6. Ownership & Peers
router.get('/:isin/shareholding', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => { 
  const data = await getScreenerShareholding(req.params.isin as string);
  respond(res, data, 'screener.in'); 
}));

router.get('/:isin/peers', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => { 
  const data = await getScreenerPeers(req.params.isin as string);
  respond(res, data, 'screener.in'); 
}));

// 7. Corporate Actions & Documents
router.get('/:isin/corporate-actions', asyncHandler(async (req: Request, res: Response) => { respond(res, null, 'unavailable'); }));

router.get('/:isin/documents', cacheMiddleware, asyncHandler(async (req: Request, res: Response) => { 
  const data = await getScreenerDocuments(req.params.isin as string);
  respond(res, data, 'screener.in'); 
}));

export default router;
