import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/stockvista.db');

// Ensure data folder exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticker TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    symbol_nse TEXT,
    scrip_bse TEXT,
    isin TEXT,
    exchange TEXT NOT NULL DEFAULT 'NSE',
    sector TEXT DEFAULT 'Diversified',
    industry TEXT DEFAULT 'Diversified Business',
    market_cap_category TEXT DEFAULT 'Small Cap',
    face_value REAL DEFAULT 10,
    series TEXT DEFAULT 'EQ',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_companies_ticker ON companies(ticker);
  CREATE INDEX IF NOT EXISTS idx_companies_symbol_nse ON companies(symbol_nse);
  CREATE INDEX IF NOT EXISTS idx_companies_scrip_bse ON companies(scrip_bse);
  CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
  CREATE INDEX IF NOT EXISTS idx_companies_sector ON companies(sector);
  CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

  CREATE TABLE IF NOT EXISTS financial_cache (
    ticker TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS market_quotes_cache (
    ticker TEXT PRIMARY KEY,
    quote_data TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
  );
`);

export interface CompanyRecord {
  id?: number;
  ticker: string;
  name: string;
  symbol_nse?: string | null;
  scrip_bse?: string | null;
  isin?: string | null;
  exchange: string;
  sector: string;
  industry: string;
  market_cap_category?: string;
  face_value?: number;
  series?: string;
  is_active?: number;
}

// Prepared Statements
const stmts = {
  getCompanyByTicker: db.prepare<{ val: string }, CompanyRecord>(`
    SELECT * FROM companies 
    WHERE UPPER(ticker) = UPPER(@val) 
       OR UPPER(symbol_nse) = UPPER(@val) 
       OR scrip_bse = @val 
    LIMIT 1
  `),
  
  searchCompanies: db.prepare<{ exact: string; prefix: string; query: string; limit: number }, CompanyRecord>(`
    SELECT * FROM companies 
    WHERE UPPER(ticker) = @exact 
       OR UPPER(symbol_nse) = @exact 
       OR scrip_bse = @exact 
       OR UPPER(ticker) LIKE @prefix 
       OR UPPER(symbol_nse) LIKE @prefix 
       OR scrip_bse LIKE @prefix 
       OR UPPER(name) LIKE @query
    ORDER BY 
      CASE 
        WHEN UPPER(ticker) = @exact THEN 1
        WHEN UPPER(symbol_nse) = @exact THEN 2
        WHEN scrip_bse = @exact THEN 3
        WHEN UPPER(ticker) LIKE @prefix THEN 4
        WHEN UPPER(symbol_nse) LIKE @prefix THEN 5
        WHEN scrip_bse LIKE @prefix THEN 6
        ELSE 7
      END,
      name ASC
    LIMIT @limit
  `),

  countCompanies: db.prepare<[], { count: number }>(`
    SELECT COUNT(*) as count FROM companies
  `),

  getAllSectors: db.prepare<[], { sector: string; count: number }>(`
    SELECT sector, COUNT(*) as count 
    FROM companies 
    WHERE sector IS NOT NULL AND sector != ''
    GROUP BY sector 
    ORDER BY count DESC
  `),

  getCompaniesBySector: db.prepare<{ sector: string; limit: number; offset: number }, CompanyRecord>(`
    SELECT * FROM companies 
    WHERE LOWER(sector) = LOWER(@sector)
    ORDER BY name ASC 
    LIMIT @limit OFFSET @offset
  `),

  countCompaniesBySector: db.prepare<string, { count: number }>(`
    SELECT COUNT(*) as count FROM companies WHERE LOWER(sector) = LOWER(?)
  `),

  insertCompany: db.prepare(`
    INSERT OR REPLACE INTO companies (
      ticker, name, symbol_nse, scrip_bse, isin, exchange, sector, industry, market_cap_category, face_value, series, is_active, updated_at
    ) VALUES (
      @ticker, @name, @symbol_nse, @scrip_bse, @isin, @exchange, @sector, @industry, @market_cap_category, @face_value, @series, 1, CURRENT_TIMESTAMP
    )
  `),

  updateCompanySectorIndustry: db.prepare(`
    UPDATE companies 
    SET sector = ?, industry = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE UPPER(ticker) = UPPER(?)
  `),

  // Financial Cache
  getFinancialCache: db.prepare<string, { data: string; expires_at: string }>(`
    SELECT data, expires_at FROM financial_cache WHERE UPPER(ticker) = UPPER(?)
  `),

  setFinancialCache: db.prepare(`
    INSERT OR REPLACE INTO financial_cache (ticker, data, updated_at, expires_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, ?)
  `),

  // Market Quotes Cache
  getMarketQuoteCache: db.prepare<string, { quote_data: string; expires_at: string }>(`
    SELECT quote_data, expires_at FROM market_quotes_cache WHERE UPPER(ticker) = UPPER(?)
  `),

  setMarketQuoteCache: db.prepare(`
    INSERT OR REPLACE INTO market_quotes_cache (ticker, quote_data, updated_at, expires_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, ?)
  `),

  // Coverage statistics
  getFinancialCacheCount: db.prepare<[], { count: number }>(`
    SELECT COUNT(*) as count FROM financial_cache
  `),

  getMarketQuoteCacheCount: db.prepare<[], { count: number }>(`
    SELECT COUNT(*) as count FROM market_quotes_cache
  `),

  getExchangeBreakdown: db.prepare<[], { exchange: string; count: number }>(`
    SELECT exchange, COUNT(*) as count FROM companies GROUP BY exchange ORDER BY count DESC
  `)
};

export const CompanyService = {
  getCompany(tickerOrCode: string): CompanyRecord | null {
    if (!tickerOrCode) return null;
    return stmts.getCompanyByTicker.get({ val: tickerOrCode.trim() }) || null;
  },

  search(query: string, limit = 15): CompanyRecord[] {
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return [];

    let target = trimmed;
    if (trimmed === 'ZOMATO') target = 'ETERNAL';

    return stmts.searchCompanies.all({
      exact: target,
      prefix: `${target}%`,
      query: `%${target}%`,
      limit
    });
  },

  getTotalCount(): number {
    return stmts.countCompanies.get()?.count || 0;
  },

  getSectors(): { sector: string; count: number }[] {
    return stmts.getAllSectors.all();
  },

  getCompaniesBySector(sector: string, limit = 50, offset = 0): { companies: CompanyRecord[]; total: number } {
    const total = stmts.countCompaniesBySector.get(sector)?.count || 0;
    const companies = stmts.getCompaniesBySector.all({ sector, limit, offset });
    return { companies, total };
  },

  saveCompanies(companies: CompanyRecord[]) {
    const insertTx = db.transaction((list: CompanyRecord[]) => {
      for (const comp of list) {
        stmts.insertCompany.run(comp);
      }
    });
    insertTx(companies);
  },

  updateSectorIndustry(ticker: string, sector: string, industry: string) {
    if (sector && industry) {
      stmts.updateCompanySectorIndustry.run(sector, industry, ticker);
    }
  },

  getFinancialCache(ticker: string) {
    const record = stmts.getFinancialCache.get(ticker);
    if (!record) return null;
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return null; // Expired
    }
    try {
      return JSON.parse(record.data);
    } catch {
      return null;
    }
  },

  setFinancialCache(ticker: string, data: any, ttlMinutes = 1440) { // 24 hours default
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    stmts.setFinancialCache.run(ticker.toUpperCase(), JSON.stringify(data), expiresAt);
  },

  getMarketQuoteCache(ticker: string) {
    const record = stmts.getMarketQuoteCache.get(ticker);
    if (!record) return null;
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return null; // Expired
    }
    try {
      return JSON.parse(record.quote_data);
    } catch {
      return null;
    }
  },

  setMarketQuoteCache(ticker: string, quote: any, ttlMinutes = 5) { // 5 minutes for quotes
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    stmts.setMarketQuoteCache.run(ticker.toUpperCase(), JSON.stringify(quote), expiresAt);
  },

  getCoverageReport() {
    const totalCompanies = stmts.countCompanies.get()?.count || 0;
    const cachedFinancials = stmts.getFinancialCacheCount.get()?.count || 0;
    const cachedQuotes = stmts.getMarketQuoteCacheCount.get()?.count || 0;
    const exchangeBreakdown = stmts.getExchangeBreakdown.all();
    const sectors = stmts.getAllSectors.all();

    return {
      totalCompanies,
      cachedFinancials,
      cachedQuotes,
      coveragePercent: totalCompanies > 0 ? ((cachedFinancials / totalCompanies) * 100).toFixed(2) + '%' : '0%',
      exchangeBreakdown,
      sectorsCount: sectors.length,
      topSectors: sectors.slice(0, 10),
      generatedAt: new Date().toISOString()
    };
  }
};
