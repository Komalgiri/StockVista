import { Suspense } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { MarketTicker } from '@/components/MarketTicker';
import { CompanyHeader } from '@/components/CompanyHeader';
import { KeyMetricsBar } from '@/components/KeyMetricsBar';
import { HistoricalChart } from '@/components/HistoricalChart';
import { ValuationGrid } from '@/components/ValuationGrid';
import { CorporateMetadata } from '@/components/CorporateMetadata';
import { FinancialTables } from '@/components/FinancialTables';
import { PeerComparison } from '@/components/PeerComparison';
import { Shareholding } from '@/components/Shareholding';
import { DocumentsList } from '@/components/DocumentsList';
import { AnalysisBox } from '@/components/AnalysisBox';
import { Bell, User } from 'lucide-react';
import { 
  getCompanyProfile,
  getMarketQuote,
  getFinancialStatements, 
  getBalanceSheet,
  getCashFlow,
  getHistoricalPrices,
  getShareholding,
  getPeerComparison,
  getRatios,
  getDocuments,
  getAnalysis
} from '@/services/api';
export const instant = false;

async function DashboardData({ ticker }: { ticker: string }) {
  const [
    profile, 
    quote, 
    financials, 
    balanceSheet, 
    cashFlow,
    historicalPrices, 
    shareholding, 
    peers, 
    ratios, 
    documents,
    analysis
  ] = await Promise.all([
    getCompanyProfile(ticker),
    getMarketQuote(ticker),
    getFinancialStatements(ticker),
    getBalanceSheet(ticker),
    getCashFlow(ticker),
    getHistoricalPrices(ticker),
    getShareholding(ticker),
    getPeerComparison(ticker),
    getRatios(ticker),
    getDocuments(ticker),
    getAnalysis(ticker)
  ]);

  if (!profile) {
    return (
      <div className="p-8 text-center border border-border-hairline rounded-lg bg-surface-canvas my-6">
        <h2 className="text-lg font-bold text-text-primary mb-2">Company profile not found</h2>
        <p className="text-[13px] text-text-secondary mb-4">We could not retrieve security data for ticker &quot;{ticker}&quot;.</p>
        <Link href="/" className="inline-block bg-primary text-on-primary text-[12px] font-semibold px-4 py-2 rounded-md">
          Return to Company Search
        </Link>
      </div>
    );
  }

  const parseRatio = (val?: string) => {
    if (!val) return 0;
    const parsed = parseFloat(val.replace(/[^0-9.-]+/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const currentPrice = quote?.currentPrice || parseRatio(ratios?.['Current Price']) || 0;

  return (
    <>
      <div id="overview">
        <CompanyHeader 
          name={profile.name}
          ticker={profile.ticker}
          exchange={profile.exchange}
          sector={profile.sector}
          currentPrice={currentPrice}
          dayChange={quote?.dayChange || 0}
          dayChangePercent={quote?.dayChangePercent || 0}
          volume={quote?.volume || 0}
          prevClose={quote?.previousClose || currentPrice}
          industry={profile.industry}
          description={profile.description}
          website={profile.website}
          bseCode={profile.bseCode}
          bseUrl={profile.bseUrl}
          nseUrl={profile.nseUrl}
        />
      </div>
      
      <div id="ratios">
        <KeyMetricsBar 
          marketCap={quote?.marketCap}
          currentPrice={currentPrice}
          peRatio={parseRatio(ratios?.['Stock P/E'])} 
          weekHigh52={quote?.weekHigh52 || 0}
          weekLow52={quote?.weekLow52 || 0}
          bookValue={parseRatio(ratios?.['Book Value'])}
          faceValue={parseRatio(ratios?.['Face Value'])}
          dividendYield={ratios?.['Dividend Yield']}
          roce={ratios?.['ROCE']}
          roe={ratios?.['ROE']}
          ratios={ratios}
        />
      </div>

      <div className="sticky top-14 bg-white/95 backdrop-blur-md z-10 flex gap-2 sm:gap-4 mb-6 font-geist font-semibold text-[13px] overflow-x-auto pt-2 pb-1 border-b border-slate-200 scrollbar-none">
        <a href="#overview" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-950 border-b-2 border-[#c2410c] font-bold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" /> Overview
        </a>
        <a href="#chart" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Chart</a>
        {analysis && (analysis.pros.length > 0 || analysis.cons.length > 0) && (
          <a href="#analysis" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Pros &amp; Cons</a>
        )}
        <a href="#valuation" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Valuation</a>
        <a href="#financials" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Financials</a>
        <a href="#peers" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Peers</a>
        <a href="#shareholding" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Shareholding</a>
        <a href="#documents" className="flex items-center gap-1.5 pb-2.5 px-1 text-slate-500 hover:text-slate-950 transition-colors whitespace-nowrap">Documents</a>
      </div>
      
      <div className="flex flex-col gap-6 pb-12">
        {historicalPrices && historicalPrices.length > 0 && (
          <section id="chart">
            <HistoricalChart data={historicalPrices} />
          </section>
        )}

        {analysis && (analysis.pros.length > 0 || analysis.cons.length > 0) && (
          <section id="analysis">
            <AnalysisBox analysis={analysis} />
          </section>
        )}

        <section id="valuation" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <ValuationGrid ratios={ratios} />
          </div>
          <div className="xl:col-span-4">
            <CorporateMetadata profile={profile} ratios={ratios} />
          </div>
        </section>

        <section id="financials">
          <FinancialTables 
            income={financials} 
            balanceSheet={balanceSheet} 
            cashFlow={cashFlow} 
          />
        </section>

        <section id="peers">
          <PeerComparison peers={peers} />
        </section>

        <section id="shareholding">
          <Shareholding shareholding={shareholding} />
        </section>

        <section id="documents">
          <DocumentsList documents={documents} />
        </section>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6 mt-4">
      <div className="h-40 bg-surface-subtle rounded-md w-full border border-border-hairline"></div>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-8 w-24 bg-surface-subtle rounded border border-border-hairline"></div>)}
      </div>
      <div className="h-80 bg-surface-subtle rounded-md border border-border-hairline w-full"></div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 h-64 bg-surface-subtle rounded-md border border-border-hairline"></div>
        <div className="xl:col-span-4 h-64 bg-surface-subtle rounded-md border border-border-hairline"></div>
      </div>
    </div>
  );
}

export default async function CompanyPage(props: { params: Promise<{ ticker: string }> }) {
  const params = await props.params;
  const ticker = params.ticker || 'RELIANCE';

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-primary">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-border-hairline px-4 md:px-6 flex items-center justify-between sticky top-0 bg-background z-10">
          <div className="flex-1 max-w-lg hidden md:block">
            <HeaderSearch />
          </div>
          <div className="md:hidden">
            <span className="font-geist font-semibold text-primary text-lg">StockVista</span>
          </div>
          <div className="flex items-center gap-5 ml-auto md:ml-0 text-text-secondary">
            <MarketTicker />
            <Bell size={18} className="cursor-pointer hover:text-primary transition-colors" />
            <div className="w-7 h-7 rounded-full bg-surface-dim border border-border-strong flex items-center justify-center text-primary cursor-pointer hover:bg-surface-subtle transition-colors">
              <User size={14} />
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:px-6 md:pt-2 max-w-[1400px] mx-auto w-full">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardData ticker={ticker} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
