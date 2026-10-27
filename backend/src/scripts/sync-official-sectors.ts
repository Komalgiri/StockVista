import axios from 'axios';
import { db } from '../db';

// Official Sector Normalization from NSE Nifty Indices Master
function mapNiftyIndustryToSector(industry: string): { sector: string; industry: string } {
  const ind = industry.trim();
  const upper = ind.toUpperCase();

  if (upper.includes('FINANCIAL') || upper.includes('BANK') || upper.includes('CAPITAL') || upper.includes('INSURANCE')) {
    return { sector: 'Financial Services', industry: ind };
  }
  if (upper.includes('CAPITAL GOODS') || upper.includes('ENGINEERING') || upper.includes('INDUSTRIAL')) {
    return { sector: 'Capital Goods', industry: ind };
  }
  if (upper.includes('CONSTRUCTION MATERIALS') || upper.includes('CEMENT')) {
    return { sector: 'Construction & Real Estate', industry: ind };
  }
  if (upper.includes('POWER') || upper.includes('ENERGY') || upper.includes('OIL') || upper.includes('GAS') || upper.includes('UTILITIES')) {
    return { sector: 'Energy & Power', industry: ind };
  }
  if (upper.includes('FAST MOVING') || upper.includes('FMCG') || upper.includes('BEVERAGE') || upper.includes('FOOD') || upper.includes('TOBACCO')) {
    return { sector: 'FMCG', industry: ind };
  }
  if (upper.includes('CHEMICAL')) {
    return { sector: 'Chemicals', industry: ind };
  }
  if (upper.includes('HEALTHCARE') || upper.includes('PHARMA') || upper.includes('HOSPITAL') || upper.includes('BIOTECH')) {
    return { sector: 'Healthcare', industry: ind };
  }
  if (upper.includes('METALS') || upper.includes('MINING') || upper.includes('STEEL')) {
    return { sector: 'Metals & Mining', industry: ind };
  }
  if (upper.includes('CONSUMER DURABLES') || upper.includes('CONSUMER SERVICES')) {
    return { sector: 'Consumer Discretionary', industry: ind };
  }
  if (upper.includes('REALTY') || upper.includes('CONSTRUCTION') || upper.includes('INFRASTRUCTURE')) {
    return { sector: 'Construction & Real Estate', industry: ind };
  }
  if (upper.includes('INFORMATION TECHNOLOGY') || upper.includes('IT') || upper.includes('SOFTWARE') || upper.includes('TECH')) {
    return { sector: 'Technology', industry: ind };
  }
  if (upper.includes('AUTOMOBILE') || upper.includes('AUTO') || upper.includes('TYRES')) {
    return { sector: 'Automobile', industry: ind };
  }
  if (upper.includes('TEXTILE') || upper.includes('APPAREL')) {
    return { sector: 'Textiles & Apparel', industry: ind };
  }
  if (upper.includes('TELECOM')) {
    return { sector: 'Telecommunication', industry: ind };
  }
  if (upper.includes('MEDIA') || upper.includes('ENTERTAINMENT') || upper.includes('PUBLICATION')) {
    return { sector: 'Media & Entertainment', industry: ind };
  }
  if (upper.includes('SERVICES') || upper.includes('LOGISTICS') || upper.includes('TRANSPORT')) {
    return { sector: 'Services', industry: ind };
  }
  if (upper.includes('FOREST') || upper.includes('PAPER')) {
    return { sector: 'Materials', industry: ind };
  }

  return { sector: ind, industry: ind };
}

export async function syncOfficialNiftySectors() {
  console.log('🔄 Ingesting Official NSE / Nifty Indices Classification Master...');

  const urls = [
    'https://niftyindices.com/IndexConstituent/ind_niftytotalmarket_list.csv',
    'https://niftyindices.com/IndexConstituent/ind_niftymicrocap250_list.csv'
  ];

  const updateStmt = db.prepare(`
    UPDATE companies 
    SET sector = @sector, 
        industry = @industry,
        updated_at = CURRENT_TIMESTAMP
    WHERE (isin = @isin OR UPPER(ticker) = @symbol OR UPPER(symbol_nse) = @symbol)
      AND (sector = 'Unclassified' OR sector IS NULL OR sector = '')
  `);

  const selectStmt = db.prepare(`
    SELECT ticker, sector FROM companies 
    WHERE isin = @isin OR UPPER(ticker) = @symbol OR UPPER(symbol_nse) = @symbol
  `);

  let updatedCount = 0;
  let alreadyVerifiedCount = 0;
  let notFoundCount = 0;

  for (const url of urls) {
    try {
      console.log(`📥 Downloading ${url}...`);
      const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 });
      const lines = (res.data as string).split('\n');

      // Header: Company Name,Industry,Symbol,Series,ISIN Code
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 5) {
          const rawIndustry = parts[1].trim();
          const symbol = parts[2].trim().toUpperCase();
          const isin = parts[4].trim();

          if (!symbol || !rawIndustry) continue;

          const existing = selectStmt.get({ isin, symbol }) as { ticker: string; sector: string } | undefined;
          if (existing) {
            if (existing.sector === 'Unclassified' || !existing.sector) {
              const mapped = mapNiftyIndustryToSector(rawIndustry);
              const info = updateStmt.run({
                sector: mapped.sector,
                industry: mapped.industry,
                isin,
                symbol
              });
              if (info.changes > 0) {
                updatedCount += info.changes;
              }
            } else {
              alreadyVerifiedCount++;
            }
          } else {
            notFoundCount++;
          }
        }
      }
    } catch (err: any) {
      console.error(`⚠️ Error fetching ${url}:`, err.message);
    }
  }

  // Also normalize legacy sector names across the entire table
  db.exec(`
    UPDATE companies 
    SET sector = 'Construction & Real Estate' 
    WHERE sector IN ('Construction Materials', 'Construction', 'Real Estate');

    UPDATE companies 
    SET sector = 'Energy & Power' 
    WHERE sector IN ('Energy', 'Power');

    UPDATE companies 
    SET sector = 'Chemicals' 
    WHERE sector = 'Specialty Chemicals';
  `);

  console.log(`\n🎉 Ingestion Complete!`);
  console.log(`✅ Newly Verified & Classified: ${updatedCount} companies`);
  console.log(`ℹ️ Already Verified previously: ${alreadyVerifiedCount} companies`);
  
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN sector != 'Unclassified' THEN 1 ELSE 0 END) as verified,
      SUM(CASE WHEN sector = 'Unclassified' THEN 1 ELSE 0 END) as unclassified
    FROM companies
  `).get() as { total: number; verified: number; unclassified: number };

  console.log(`\n📊 Updated Database Telemetry:`);
  console.log(`Total Companies: ${stats.total}`);
  console.log(`Verified Classified: ${stats.verified} (${((stats.verified / stats.total) * 100).toFixed(1)}%)`);
  console.log(`Unclassified Remaining: ${stats.unclassified} (${((stats.unclassified / stats.total) * 100).toFixed(1)}%)`);
}

if (require.main === module) {
  syncOfficialNiftySectors()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
