const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

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

export const getCompanyProfile = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}`);
};

export const getMarketQuote = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/quote`);
};

export const getHistoricalPrices = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/history`);
};

export const getFinancialStatements = async (ticker: string) => {
  // Using income endpoint to simulate financials fetch
  return await fetchAPI(`/companies/${ticker}/income`);
};

export const getPeerComparison = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/peers`);
};

export const getShareholding = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/shareholding`);
};

export const getCorporateActions = async (ticker: string) => {
  return await fetchAPI(`/companies/${ticker}/corporate-actions`);
};
