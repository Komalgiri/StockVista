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
import { CorporateActions } from '@/components/CorporateActions';
import { DocumentsList } from '@/components/DocumentsList';
import { Bell, User } from 'lucide-react';
import { 
  getCompanyProfile,
  getMarketQuote,
  getFinancialStatements, 
  getBalanceSheet,
  getHistoricalPrices,
  getShareholding,
  getPeerComparison,
  getRatios,
  getCorporateActions
} from '@/services/api';

export const instant = false;

async function DashboardData({ ticker }: { ticker: string }) {
  const [profile, quote, financials, balanceSheet, historicalPrices, shareholding, peers, ratios, actions] = await Promise.all([
    getCompanyProfile(ticker),
    getMarketQuote(ticker),
    getFinancialStatements(ticker),
    getBalanceSheet(ticker),
    getHistoricalPrices(ticker),
    getShareholding(ticker),
    getPeerComparison(ticker),
    getRatios(ticker),
    getCorporateActions(ticker)
  ]);

  if (!profile) return <div>Failed to load company profile.</div>;

  return (
    <>
      <CompanyHeader 
        name={profile.name}
        ticker={profile.ticker}
        exchange={profile.exchange}
        sector={profile.sector}
        currentPrice={quote?.price || 0}
        dayChange={quote?.dayChange || 0}
        dayChangePercent={quote?.dayChangePercent || 0}
        volume={quote?.volume || 0}
        prevClose={quote?.close || 0}
        industry={profile.industry}
        description={profile.description}
      />
      
      <KeyMetricsBar 
        marketCap={quote?.marketCap || "N/A"}
        peRatio={parseFloat(ratios?.['Stock P/E'] || '0')} 
        weekHigh52={quote?.weekHigh52 || 0}
        weekLow52={quote?.weekLow52 || 0}
        bookValue={parseFloat(ratios?.['Book Value'] || '0')}
        faceValue={parseFloat(ratios?.['Face Value'] || '0')}
      />

      <div className="flex gap-6 mb-6 font-geist font-semibold text-[13px]">
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-primary text-primary">Overview</Link>
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors">Ratios</Link>
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors">Financials</Link>
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors">Shareholding</Link>
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors">Peers</Link>
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors">Corporate Actions</Link>
        <Link href="#" className="flex items-center gap-1.5 pb-2 border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors">Documents</Link>
      </div>
      
      <div className="flex flex-col gap-6 pb-12">
        {historicalPrices && (
          <section>
            <HistoricalChart data={historicalPrices} />
          </section>
        )}

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <ValuationGrid ratios={ratios} />
          </div>
          <div className="xl:col-span-4">
            <CorporateMetadata />
          </div>
        </section>

        <section>
          <FinancialTables income={financials} balanceSheet={balanceSheet} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5">
            <Shareholding shareholding={shareholding} />
          </div>
          <div className="xl:col-span-7">
            <PeerComparison peers={peers} />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            {actions ? <CorporateActions /> : <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 h-full flex items-center justify-center text-text-secondary">Corporate actions unavailable.</div>}
          </div>
          <div className="xl:col-span-5">
            <DocumentsList />
          </div>
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
