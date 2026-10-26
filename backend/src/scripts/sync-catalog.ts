import axios from 'axios';
import { CompanyService, CompanyRecord } from '../db';
import { NSE_CATALOG } from '../data/nse-catalog';

// Helper for sector classification heuristics
function classifySectorAndIndustry(name: string, symbol: string): { sector: string; industry: string } {
  const upper = (name + ' ' + symbol).toUpperCase();

  if (/\b(BANK|FINANCE|FINANCIAL|CAPITAL|HOLDINGS|INVESTMENT|SECURITIES|INSURANCE|WEALTH|ASSET|LEASING|HOUSING FIN)\b/.test(upper)) {
    let industry = 'Financial Services';
    if (upper.includes('BANK')) industry = upper.includes('STATE') ? 'Public Sector Bank' : 'Private Sector Bank';
    else if (upper.includes('HOUSING')) industry = 'Housing Finance';
    else if (upper.includes('INSURANCE')) industry = 'Insurance';
    else if (upper.includes('SECURITIES') || upper.includes('CAPITAL')) industry = 'Capital Markets & Broking';
    return { sector: 'Financial Services', industry };
  }

  if (/\b(PHARMA|DRUGS|LABORATORIES|HEALTHCARE|HOSPITAL|BIOTECH|REMEDIES|MEDICARE|LIFE SCIENCES)\b/.test(upper)) {
    let industry = 'Pharmaceuticals';
    if (upper.includes('HOSPITAL') || upper.includes('HEALTHCARE')) industry = 'Healthcare Services & Hospitals';
    else if (upper.includes('BIOTECH')) industry = 'Biotechnology';
    return { sector: 'Healthcare', industry };
  }

  if (/\b(SOFTWARE|TECHNOLOGIES|TECH|INFOTECH|DIGITAL|SYSTEMS|CYBER|DATA|SOLUTIONS|TELECOM|COMMUNICATION)\b/.test(upper)) {
    if (upper.includes('TELECOM') || upper.includes('COMMUNICATION')) {
      return { sector: 'Telecommunication', industry: 'Telecom Services & Equipment' };
    }
    return { sector: 'Technology', industry: 'IT Services & Software' };
  }

  if (/\b(MOTORS|AUTOMOTIVE|AUTO|TYRES|FORGINGS|BATTERIES|SCOOTERS|EV)\b/.test(upper)) {
    let industry = 'Auto Components';
    if (upper.includes('MOTORS') || upper.includes('SCOOTERS')) industry = 'Automobile Manufacturers';
    else if (upper.includes('TYRES')) industry = 'Tyres & Rubber';
    return { sector: 'Automobile', industry };
  }

  if (/\b(PETROLEUM|OIL|GAS|POWER|ENERGY|SOLAR|THERMAL|RENEWABLE|ELECTRICALS|HYDRO)\b/.test(upper)) {
    let industry = 'Energy & Power';
    if (upper.includes('OIL') || upper.includes('GAS') || upper.includes('PETROLEUM')) industry = 'Oil, Gas & Consumable Fuels';
    else if (upper.includes('SOLAR') || upper.includes('RENEWABLE')) industry = 'Renewable Energy';
    else if (upper.includes('POWER')) industry = 'Power Generation & Distribution';
    return { sector: 'Energy & Power', industry };
  }

  if (/\b(CHEMICALS|FERTILIZERS|PETROCHEM|PESTICIDES|ORGANICS|SPECIALTY)\b/.test(upper)) {
    return { sector: 'Chemicals', industry: upper.includes('FERTILIZER') ? 'Agrochemicals & Fertilizers' : 'Specialty Chemicals' };
  }

  if (/\b(STEEL|IRON|METALS|MINING|ALUMINIUM|ZINC|COPPER|MINERALS)\b/.test(upper)) {
    return { sector: 'Metals & Mining', industry: upper.includes('STEEL') ? 'Iron & Steel' : 'Metals & Minerals' };
  }

  if (/\b(FOODS|FOOD|BEVERAGES|SUGAR|DAIRY|TEA|COFFEE|BREWERIES|AGRO|EDIBLE|CONSUMER|PRODUCTS|FMCG)\b/.test(upper)) {
    let industry = 'Packaged Foods & Consumer Goods';
    if (upper.includes('SUGAR')) industry = 'Sugar & Bio-energy';
    else if (upper.includes('TEA') || upper.includes('COFFEE')) industry = 'Tea & Beverages';
    return { sector: 'FMCG', industry };
  }

  if (/\b(REALTY|ESTATE|INFRASTRUCTURE|INFRA|CONSTRUCTIONS|PROJECTS|CEMENT|CERAMICS|PIPES|BUILDING)\b/.test(upper)) {
    let industry = 'Real Estate & Infrastructure';
    if (upper.includes('CEMENT')) industry = 'Cement & Construction Materials';
    else if (upper.includes('REALTY') || upper.includes('ESTATE')) industry = 'Real Estate Development';
    return { sector: 'Construction & Real Estate', industry };
  }

  if (/\b(TEXTILES|SPINNING|COTTON|SYNTHETICS|GARMENTS|SILK|APPAREL|FASHION|RETAIL)\b/.test(upper)) {
    return { sector: 'Textiles & Apparel', industry: upper.includes('RETAIL') ? 'Retail & Fashion' : 'Textile Manufacturing' };
  }

  if (/\b(MEDIA|ENTERTAINMENT|FILMS|BROADCASTING|NETWORK|COMMUNICATIONS|PRINT|NEWS)\b/.test(upper)) {
    return { sector: 'Media & Entertainment', industry: 'Media & Broadcasting' };
  }

  if (/\b(HOTELS|RESORTS|HOSPITALITY|RESTAURANTS|TOURISM|TRAVEL)\b/.test(upper)) {
    return { sector: 'Hospitality & Tourism', industry: 'Hotels & Restaurants' };
  }

  if (/\b(LOGISTICS|SHIPPING|TRANSPORT|CARGO|AIRWAYS|CONTAINER|EXPRESS)\b/.test(upper)) {
    return { sector: 'Logistics & Transport', industry: 'Freight & Logistics Services' };
  }

  return { sector: 'Unclassified', industry: 'Unclassified' };
}

export async function syncMasterCatalog() {
  console.log('🔄 Starting Full NSE & BSE Stock Master Catalog Synchronization...');

  // Map of curated catalog
  const curatedMap = new Map<string, { sector: string; industry: string }>();
  for (const item of NSE_CATALOG) {
    curatedMap.set(item.ticker.toUpperCase(), { sector: item.sector, industry: item.industry });
  }

  // 1. Fetch NSE Equity Master
  console.log('📥 Fetching National Stock Exchange (NSE) active equities...');
  const nseRes = await axios.get('https://archives.nseindia.com/content/equities/EQUITY_L.csv', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    timeout: 30000
  });

  const nseLines = (nseRes.data as string).split('\n');
  const catalogMap = new Map<string, CompanyRecord>();

  for (let i = 1; i < nseLines.length; i++) {
    const line = nseLines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length >= 8) {
      const symbol = parts[0].trim().toUpperCase();
      const name = parts[1].trim().replace(/^"|"$/g, '');
      const series = parts[2].trim();
      const isin = parts[6].trim();
      const faceValue = parseFloat(parts[7].trim()) || 10;

      const curated = curatedMap.get(symbol);
      const classified = curated || classifySectorAndIndustry(name, symbol);

      // Determine cap category heuristic based on curated list
      let market_cap_category = 'Small Cap';
      if (curated) market_cap_category = 'Large Cap';
      else if (series === 'SM' || series === 'ST') market_cap_category = 'SME';

      catalogMap.set(symbol, {
        ticker: symbol,
        name,
        symbol_nse: symbol,
        scrip_bse: null,
        isin,
        exchange: 'NSE',
        sector: classified.sector,
        industry: classified.industry,
        market_cap_category,
        face_value: faceValue,
        series,
        is_active: 1
      });
    }
  }

  console.log(`✅ Loaded ${catalogMap.size} NSE listed companies.`);

  // 2. Fetch Kite Master for BSE Equities
  console.log('📥 Fetching Bombay Stock Exchange (BSE) active securities...');
  const kiteRes = await axios.get('https://api.kite.trade/instruments', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 45000
  });

  const kiteLines = (kiteRes.data as string).split('\n');
  let bseEquitiesCount = 0;
  let dualListedCount = 0;
  let bseOnlyCount = 0;

  for (let i = 1; i < kiteLines.length; i++) {
    const line = kiteLines[i].trim();
    if (!line) continue;
    const parts = line.split(',');

    // Columns: instrument_token[0], exchange_token[1], tradingsymbol[2], name[3], ... segment[10], exchange[11]
    if (parts.length >= 12 && parts[10] === 'BSE' && parts[9] === 'EQ') {
      const scripCode = parts[1].trim();
      const bseSym = parts[2].trim().toUpperCase();
      const name = parts[3].trim().replace(/^"|"$/g, '');

      // Valid 6-digit BSE equity code
      if (/^5\d{5}$/.test(scripCode)) {
        bseEquitiesCount++;

        // Case A: Matching company already on NSE
        if (catalogMap.has(bseSym)) {
          const existing = catalogMap.get(bseSym)!;
          existing.scrip_bse = scripCode;
          existing.exchange = 'NSE & BSE';
          if (name && name.toUpperCase().includes('ZOMATO') && !existing.name.toUpperCase().includes('ZOMATO')) {
            existing.name = `${existing.name} (Zomato)`;
          }
          dualListedCount++;
        } else {
          // Case B: BSE-only company
          bseOnlyCount++;
          const classified = classifySectorAndIndustry(name || bseSym, bseSym);

          catalogMap.set(scripCode, {
            ticker: scripCode,
            name: name || `${bseSym} Ltd.`,
            symbol_nse: null,
            scrip_bse: scripCode,
            isin: null,
            exchange: 'BSE',
            sector: classified.sector,
            industry: classified.industry,
            market_cap_category: 'Small Cap',
            face_value: 10,
            series: 'EQ',
            is_active: 1
          });
        }
      }
    }
  }

  console.log(`✅ BSE equities analyzed: ${bseEquitiesCount}`);
  console.log(`   - Dual-listed (NSE & BSE): ${dualListedCount}`);
  console.log(`   - BSE-only listed: ${bseOnlyCount}`);
  console.log(`   - Total catalog size: ${catalogMap.size}`);

  // 3. Batch insert into SQLite
  console.log('💾 Writing catalog records into persistent SQLite database...');
  const companiesList = Array.from(catalogMap.values());
  CompanyService.saveCompanies(companiesList);

  const totalInDb = CompanyService.getTotalCount();
  const sectors = CompanyService.getSectors();

  console.log(`\n🎉 Master catalog synchronization COMPLETE!`);
  console.log(`   Total companies in database: ${totalInDb}`);
  console.log(`   Sectors indexed: ${sectors.length}`);
  console.log(`   Top sectors:`);
  sectors.slice(0, 8).forEach(s => console.log(`     - ${s.sector}: ${s.count} companies`));

  return { total: totalInDb, sectors: sectors.length };
}

// Allow direct CLI execution: tsx src/scripts/sync-catalog.ts
if (require.main === module) {
  syncMasterCatalog()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Sync failed:', err);
      process.exit(1);
    });
}
