import { Suspense } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { getSectors, SectorItem } from '@/services/api';
import { 
  Building2, 
  Cpu, 
  ShoppingBag, 
  Flame, 
  HeartPulse, 
  TrendingUp, 
  Wrench, 
  ShieldCheck, 
  Car, 
  Truck, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SectorsClient } from './SectorsClient';

export const metadata = {
  title: 'Indian Stock Market Sectors & Industries — StockVista',
  description: 'Browse all NSE & BSE listed companies categorized by sector and industry, mirroring Screener.in directory structure.',
};

export const instant = false;

export default async function SectorsPage() {
  const sectors = await getSectors();
  const totalCompanies = sectors.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-border-hairline px-4 md:px-8 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
              <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-text-primary font-medium">Sectors & Industries</span>
            </div>
          </div>
          <HeaderSearch />
        </header>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Hero Banner */}
          <div className="border border-border-hairline rounded-xl p-6 md:p-8 bg-surface-subtle relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border-hairline text-[11px] font-medium text-text-secondary mb-3">
                <Sparkles size={12} className="text-primary" />
                <span>Sectoral Taxonomy & Directory</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary font-geist">
                Browse Indian Equities by Sector
              </h1>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Explore comprehensive financial data across 23 economic sectors covering over 5,500+ NSE and BSE listed enterprises. Filter, compare, and analyze sector performance with audited financials.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 pt-6 border-t border-border-hairline/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Classified Sectors</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">{sectors.length}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Classified Stocks</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">{totalCompanies.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Exchange Universe</div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mt-0.5">NSE & BSE</div>
              </div>
            </div>
          </div>

          {/* Interactive Sectors Grid with Instant Filtering */}
          <SectorsClient initialSectors={sectors} totalCompanies={totalCompanies} />
        </div>
      </main>
    </div>
  );
}
