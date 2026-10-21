const yahooFinance = require('yahoo-finance2').default;

// Suppress known noisy notices from yahoo-finance2
try {
  if (typeof yahooFinance.suppressNotices === 'function') {
    yahooFinance.suppressNotices(['yahooSurvey']);
  }
  if (typeof yahooFinance.setGlobalConfig === 'function') {
    yahooFinance.setGlobalConfig({
      validation: { logErrors: false }
    });
  }
} catch (_) {}

// Circuit breaker state: suppress external calls when rate-limited (HTTP 429)
let circuitBreakerUntil = 0;
const COOLDOWN_DURATION_MS = 15 * 60 * 1000; // 15-minute cooldown

export function isYahooRateLimited(): boolean {
  return Date.now() < circuitBreakerUntil;
}

function handleYahooFailure(error: any, context: string) {
  const errMsg = (error?.message || '') + ' ' + (error?.toString() || '');
  const is429 = error?.code === 429 || 
                error?.status === 429 || 
                errMsg.includes('429') || 
                errMsg.includes('Too Many Requests');

  if (is429) {
    circuitBreakerUntil = Date.now() + COOLDOWN_DURATION_MS;
    console.warn(`⚠️ [YahooFinance] Rate limit (429 Too Many Requests) hit during ${context}. Pausing Yahoo requests for 15 minutes; automatically serving local/Screener fallbacks.`);
  } else if (!isYahooRateLimited()) {
    console.warn(`⚠️ [YahooFinance ${context}] Fetch failed: ${error?.message || error}`);
  }
}

// Helper to format Indian symbols for Yahoo Finance.
// e.g. RELIANCE → RELIANCE.NS, ^NSEI → ^NSEI (index, no suffix needed)
const getYahooSymbol = (isinOrTicker: string) => {
  // Already has a Yahoo suffix (e.g. .NS, .BO) or is a Yahoo index symbol (^NSEI, ^BSESN)
  if (isinOrTicker.includes('.') || isinOrTicker.startsWith('^')) {
    return isinOrTicker.toUpperCase();
  }
  // If it's a 6-digit BSE Scrip code (e.g. 500008, 500112), route to Bombay Stock Exchange (.BO)
  if (/^\d{6}$/.test(isinOrTicker.trim())) {
    return `${isinOrTicker.trim()}.BO`;
  }
  // Default: National Stock Exchange (.NS)
  return `${isinOrTicker.toUpperCase()}.NS`;
};

export async function getCompanyProfile(isin: string) {
  if (isYahooRateLimited()) return null;

  try {
    const symbol = getYahooSymbol(isin);
    const profile: any = await yahooFinance.quoteSummary(symbol, { modules: ['summaryProfile', 'price'] });
    
    if (!profile) return null;
    
    return {
      name: profile.price?.longName || profile.price?.shortName || isin,
      ticker: isin,
      exchange: "NSE",
      sector: profile.summaryProfile?.sector || "Unknown",
      isin: isin,
      industry: profile.summaryProfile?.industry || "Unknown"
    };
  } catch (error) {
    handleYahooFailure(error, `Profile(${isin})`);
    return null;
  }
}

export async function getMarketQuote(isin: string) {
  if (isYahooRateLimited()) return null;

  try {
    const symbol = getYahooSymbol(isin);
    const quote: any = await yahooFinance.quote(symbol);
    
    if (!quote) return null;
    
    return {
      price: quote.regularMarketPrice,
      dayChange: quote.regularMarketChange,
      dayChangePercent: quote.regularMarketChangePercent,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      close: quote.regularMarketPreviousClose,
      volume: quote.regularMarketVolume,
      weekHigh52: quote.fiftyTwoWeekHigh,
      weekLow52: quote.fiftyTwoWeekLow,
      marketCap: quote.marketCap,
    };
  } catch (error) {
    handleYahooFailure(error, `Quote(${isin})`);
    return null;
  }
}

export async function getHistoricalData(isin: string, range: string = '1y') {
  if (isYahooRateLimited()) return null;

  try {
    const symbol = getYahooSymbol(isin);
    const period1 = new Date();
    
    // Map our '1y' string to actual dates
    if (range === '1mo') period1.setMonth(period1.getMonth() - 1);
    else if (range === '6mo') period1.setMonth(period1.getMonth() - 6);
    else if (range === '1y') period1.setFullYear(period1.getFullYear() - 1);
    else if (range === '5y') period1.setFullYear(period1.getFullYear() - 5);
    else period1.setFullYear(period1.getFullYear() - 1);

    const queryOptions = { period1, interval: '1d' as const };
    const result: any[] = await yahooFinance.historical(symbol, queryOptions);
    
    return result.map((day: any) => ({
      date: day.date.toISOString().split('T')[0],
      price: day.close,
      open: day.open,
      high: day.high,
      low: day.low,
      volume: day.volume
    }));
  } catch (error) {
    handleYahooFailure(error, `Historical(${isin})`);
    return null;
  }
}

