const yahooFinance = require('yahoo-finance2').default;

// Helper to format Indian symbols for Yahoo Finance.
// e.g. RELIANCE → RELIANCE.NS, ^NSEI → ^NSEI (index, no suffix needed)
const getYahooSymbol = (isinOrTicker: string) => {
  // Already has a Yahoo suffix (e.g. .NS, .BO) or is a Yahoo index symbol (^NSEI, ^BSESN)
  if (isinOrTicker.includes('.') || isinOrTicker.startsWith('^')) {
    return isinOrTicker.toUpperCase();
  }
  // Default: National Stock Exchange (.NS)
  return `${isinOrTicker.toUpperCase()}.NS`;
};

export async function getCompanyProfile(isin: string) {
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
    console.error("Yahoo Finance Profile Error:", error);
    return null;
  }
}

export async function getMarketQuote(isin: string) {
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
    console.error("Yahoo Finance Quote Error:", error);
    return null;
  }
}

export async function getHistoricalData(isin: string, range: string = '1y') {
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
    console.error("Yahoo Finance Historical Error:", error);
    return null;
  }
}
