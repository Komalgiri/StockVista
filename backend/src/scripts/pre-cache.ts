import { CompanyService, db } from '../db';
import { getCompleteScreenerBundle } from '../services/screener';

// High-Priority / Liquid Index Stocks for Pre-Caching
const MARQUEE_STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
  'BHARTIARTL', 'BAJFINANCE', 'LICI', 'LT', 'HCLTECH', 'KOTAKBANK', 'AXISBANK',
  'ASIANPAINT', 'TITAN', 'MARUTI', 'SUNPHARMA', 'TATAMOTORS', 'ULTRACEMCO', 'NTPC',
  'ONGC', 'POWERGRID', 'M&M', 'ADANIENT', 'ADANIPORTS', 'COALINDIA', 'BAJAJFINSV',
  'DIVISLAB', 'WIPRO', 'TECHM', 'DRREDDY', 'CIPLA', 'GRASIM', 'BRITANNIA', 'EICHERMOT',
  'NESTLEIND', 'TATACONSUM', 'APOLLOHOSP', 'HEROMOTOCO', 'HINDALCO', 'JSWSTEEL',
  'TATASTEEL', 'INDUSINDBK', 'BPCL', 'SBILIFE', 'HDFCLIFE', 'DIXON', 'ZOMATO'
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runPreCacheWorker(maxCount = 50, delayMs = 1500) {
  console.log('🚀 Starting StockVista Background Financial Pre-Cache Worker...');
  console.log(`🎯 Target: Up to ${maxCount} prominent equities (Interval: ${delayMs}ms)`);

  const initialReport = CompanyService.getCoverageReport();
  console.log(`📊 Initial Status: ${initialReport.cachedFinancials} / ${initialReport.totalCompanies} companies cached.`);

  // 1. Gather Candidate Tickers
  const candidates: string[] = [];
  for (const sym of MARQUEE_STOCKS) {
    if (!candidates.includes(sym)) candidates.push(sym);
  }

  // Also query other NSE/BSE companies from SQLite to fill up to maxCount
  const additional = db.prepare<[number], { ticker: string; symbol_nse: string | null }>(`
    SELECT ticker, symbol_nse FROM companies 
    WHERE series = 'EQ' AND (exchange = 'NSE & BSE' OR exchange = 'NSE')
    LIMIT ?
  `).all(maxCount);

  for (const row of additional) {
    const sym = row.symbol_nse || row.ticker;
    if (sym && !candidates.includes(sym) && candidates.length < maxCount) {
      candidates.push(sym);
    }
  }

  console.log(`📋 Selected ${candidates.length} candidate companies for pre-caching.\n`);

  let newlyCached = 0;
  let alreadyCached = 0;
  let failed = 0;

  for (let i = 0; i < candidates.length; i++) {
    const ticker = candidates[i].toUpperCase();
    const prefix = `[${i + 1}/${candidates.length}]`;

    // Check if already in SQLite disk cache
    const existing = CompanyService.getFinancialCache(ticker);
    if (existing) {
      console.log(`${prefix} ⚡ ${ticker}: Already cached in SQLite. Skipping.`);
      alreadyCached++;
      continue;
    }

    // Scrape complete multi-category bundle
    const startTime = Date.now();
    try {
      const bundle = await getCompleteScreenerBundle(ticker);
      if (bundle && bundle.income) {
        if (bundle.details?.sector && bundle.details?.industry) {
          CompanyService.updateSectorIndustry(ticker, bundle.details.sector, bundle.details.industry);
        }
        // Persist to SQLite (90 days quarterly persistence)
        CompanyService.setFinancialCache(ticker, bundle, 129600);
        const duration = Date.now() - startTime;
        console.log(`${prefix} ✅ ${ticker}: Successfully cached in SQLite (${duration}ms). Sector: ${bundle.details?.sector || 'Unclassified'}`);
        newlyCached++;
      } else {
        console.log(`${prefix} ⚠️  ${ticker}: Genuinely unannounced / not available on exchange.`);
        failed++;
      }
    } catch (err: any) {
      console.error(`${prefix} ❌ ${ticker}: Ingestion failed - ${err.message}`);
      failed++;
    }

    // Polite delay between requests to protect IP from rate limiting
    if (i < candidates.length - 1) {
      await sleep(delayMs);
    }
  }

  const finalReport = CompanyService.getCoverageReport();
  console.log('\n======================================================');
  console.log('🎉 Background Pre-Caching Worker Run Complete!');
  console.log(`   Newly Ingested:    ${newlyCached}`);
  console.log(`   Previously Cached: ${alreadyCached}`);
  console.log(`   Unavailable/Skip:  ${failed}`);
  console.log(`   Total in DB Cache: ${finalReport.cachedFinancials} / ${finalReport.totalCompanies} (${finalReport.coveragePercent})`);
  console.log('======================================================\n');

  return finalReport;
}

// Allow direct execution: tsx src/scripts/pre-cache.ts
if (require.main === module) {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit='));
  const count = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50;

  runPreCacheWorker(count, 1500)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Pre-cache worker failed:', err);
      process.exit(1);
    });
}
