import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { getSectors } from '@/services/api';
import { Sparkles } from 'lucide-react';
import { SectorsClient } from './SectorsClient';

export const metadata = {
  title: 'Indian Stock Market Sectors & Industries — Opp Code Stock Vision',
  description: 'Browse all NSE & BSE listed companies categorized by verified sector and industry taxonomy on Opp Code Stock Vision.',
};

export const instant = false;

export default async function SectorsPage() {
  const rawSectors = await getSectors();
  const sectors = Array.isArray(rawSectors) ? rawSectors : [];
  const totalCompanies = sectors.reduce((acc, s) => acc + (s.count || 0), 0);

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
          {/* Hero Banner with Rust Orange Accents */}
          <div className="border border-border-hairline rounded-2xl p-6 md:p-8 bg-surface-subtle relative overflow-hidden shadow-2xs">
            {/* Subtle Rust Orange Ambient Gradient */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/80 border border-orange-200/80 text-[11px] font-semibold text-orange-800 mb-3.5 shadow-2xs">
                <Sparkles size={12} className="text-orange-600" />
                <span>Sectoral Taxonomy & Directory</span>
                <span className="w-1 h-1 rounded-full bg-orange-400" />
                <span className="font-mono text-orange-700">23 Active Sectors</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary font-geist">
                Indian Stock Market Sector Directory
              </h1>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Explore audited financials and fundamental metrics for 5,500+ listed companies across the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE), organized into economic sectors and industry peers.
              </p>
            </div>

            {/* Quick Metrics KPI Bar */}
            <div className="mt-6 pt-6 border-t border-border-hairline/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Economic Sectors</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">{sectors.length}</div>
                <div className="text-[10px] text-text-tertiary mt-0.5">Primary groupings</div>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Indexed Equities</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">{totalCompanies.toLocaleString()}</div>
                <div className="text-[10px] text-text-tertiary mt-0.5">NSE & BSE verified</div>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Largest Sector</div>
                <div className="text-lg font-bold text-orange-700 font-mono mt-0.5 truncate">Financials</div>
                <div className="text-[10px] text-text-tertiary mt-0.5">514 enterprise listings</div>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Exchange Scope</div>
                <div className="text-lg font-bold text-text-primary font-mono mt-0.5">Dual-Exchange</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Active coverage</div>
              </div>
            </div>
          </div>

          {/* Interactive Sectors Component with Spotlight Cards & Treemap */}
          <SectorsClient initialSectors={sectors} totalCompanies={totalCompanies} />
        </div>
      </main>
    </div>
  );
}
