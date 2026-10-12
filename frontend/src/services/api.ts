const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
}

export interface IndexQuote {
  value: number;
  change: number;
  changePercent: number;
}

export interface MarketIndices {
  nifty50: IndexQuote | null;
  sensex: IndexQuote | null;
}

async function fetchAPI(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export interface CompanyProfile {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  isin: string;
  description?: string;
  website?: string | null;
  bseCode?: string | null;
  bseUrl?: string | null;
  nseUrl?: string | null;
}

export interface AnalysisData {
  pros: string[];
  cons: string[];
}

export const getCompanyProfile = async (ticker: string): Promise<CompanyProfile | null> => {
  return await fetchAPI(`/companies/${ticker}`);
};

export const getMarketQuote = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/quote`);
};

export const getHistoricalPrices = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/history`);
};

export const getFinancialStatements = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/income`);
};

export const getBalanceSheet = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/balance-sheet`);
};

export const getCashFlow = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/cash-flow`);
};

export const getPeerComparison = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/peers`);
};

export const getShareholding = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/shareholding`);
};

export const getRatios = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/ratios`);
};

export const getCorporateActions = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/corporate-actions`);
};

export const getDocuments = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/documents`);
};

export const getAnalysis = async (ticker: string): Promise<AnalysisData | null> => {
  return await fetchAPI(`/companies/${ticker}/analysis`);
};

// Fetches live NIFTY 50 and SENSEX from the backend (1-min cached).
export const getMarketIndices = async (): Promise<MarketIndices | null> => {
  return await fetchAPI('/indices');
};

// Searches the 80+ company catalog by name, ticker, or sector.
export const searchCompanies = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];
  const results = await fetchAPI(`/search?q=${encodeURIComponent(query)}`);
  return results ?? [];
};

