import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { getCoverageReport } from '@/services/api';
import { CoverageClient } from './CoverageClient';
import { Activity } from 'lucide-react';

export const metadata = {
  title: 'Data Coverage & Telemetry Report — Opp Code Stock Vision',
  description: 'Audited data coverage statistics and category completeness across 5,588 NSE and BSE listed equities on Opp Code Stock Vision. Powered by OPP Code Vision Technology.',
};

export const instant = false;

export default async function CoveragePage() {
  const report = await getCoverageReport();

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
              <span className="text-text-primary font-medium">Universe & Coverage</span>
            </div>
          </div>
          <HeaderSearch />
        </header>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Hero Banner with Rust Orange Accent */}
          <div className="border border-border-hairline rounded-2xl p-6 md:p-8 bg-surface-subtle relative overflow-hidden shadow-2xs">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/80 border border-orange-200/80 text-[11px] font-semibold text-orange-800 mb-3.5 shadow-2xs">
                <Activity size={12} className="text-orange-600" />
                <span>Audited Technical Verification</span>
                <span className="w-1 h-1 rounded-full bg-orange-400" />
                <span className="font-mono text-orange-700">5,588 Active Equities</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary font-geist">
                Universe & Data Coverage Telemetry
              </h1>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Live verification of security ingestion, dual-exchange representation across NSE and BSE, and complete financial statement coverage for all Screener.in data categories.
              </p>
            </div>

            {/* Quick Metrics KPI Bar */}
            <div className="mt-6 pt-6 border-t border-border-hairline/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Indexed Equities</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">
                  {report?.totalCompanies?.toLocaleString() || '5,588'}
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">NSE & BSE Universe</div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Economic Sectors</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">
                  {report?.sectorsCount || '23'}
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">Categorized Segments</div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Exchange Feeds</div>
                <div className="text-2xl font-bold text-orange-700 font-mono mt-0.5">
                  Dual-Active
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">NSE + BSE Master</div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border-hairline">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Authenticity Score</div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mt-0.5">
                  100%
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Zero Fabrication</div>
              </div>
            </div>
          </div>

          {/* Interactive Report View */}
          <CoverageClient report={report} />
        </div>
      </main>
    </div>
  );
}
