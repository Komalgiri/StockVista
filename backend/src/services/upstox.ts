import axios from 'axios';

const UPSTOX_BASE_URL = 'https://api.upstox.com/v2';
const ACCESS_TOKEN = process.env.UPSTOX_ACCESS_TOKEN;

// Create an Axios instance
const upstoxClient = axios.create({
  baseURL: UPSTOX_BASE_URL,
  headers: {
    'Accept': 'application/json',
  }
});

// Interceptor to add auth
upstoxClient.interceptors.request.use(config => {
  if (ACCESS_TOKEN) {
    config.headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }
  return config;
});

/**
 * Validates Upstox Credentials
 */
export const checkCredentials = () => {
  if (!ACCESS_TOKEN) {
    throw new Error("Upstox ACCESS_TOKEN is missing in environment variables. Live integration cannot proceed.");
  }
};

/**
 * Fetch Market Quote
 * Upstox Market Quote API provides LTP, Open, High, Low, Close, Volume, etc.
 * Note: Instrument key must be passed (e.g. NSE_EQ|INE002A01018)
 */
export const getMarketQuote = async (instrumentKey: string) => {
  checkCredentials();
  try {
    const response = await upstoxClient.get(`/market-quote/quotes`, {
      params: { instrument_key: instrumentKey }
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(`Upstox API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Fetch Historical Prices
 */
export const getHistoricalData = async (instrumentKey: string, interval: string, toDate: string, fromDate: string) => {
  checkCredentials();
  try {
    const response = await upstoxClient.get(`/historical-candle/${instrumentKey}/${interval}/${toDate}/${fromDate}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(`Upstox API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Note on Upstox Limitations:
 * Upstox Developer API primarily provides trading data (OHLC, LTP, Volume).
 * It DOES NOT provide:
 * - Fundamental ratios (P/E, P/B, EPS, Dividend Yield)
 * - Financial Statements (Income, Balance Sheet, Cash Flow)
 * - Shareholding patterns
 * - Peer comparison
 * - Corporate actions / Documents
 */
