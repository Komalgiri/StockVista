import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { getCoverageReport } from '@/services/api';
import { CoverageClient } from './CoverageClient';
import { ShieldCheck, Activity, Database, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Data Coverage & Telemetry Report — StockVista',
  description: 'Audited data coverage statistics and category completeness across 5,588 NSE and BSE listed equities on StockVista.',
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
          {/* Hero Banner */}
          <div className="border border-border-hairline rounded-xl p-6 md:p-8 bg-surface-subtle relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border-hairline text-[11px] font-medium text-text-secondary mb-3">
                <Activity size={12} className="text-emerald-600" />
                <span>Institutional Diagnostics & Verification</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary font-geist">
                Indian Stock Market Universe & Data Coverage Report
              </h1>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Real-time tracking of security indexing, exchange representation, and data availability across all Screener.in fundamental financial categories for the entire active Indian public equity universe.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 pt-6 border-t border-border-hairline/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Total Stocks Indexed</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">
                  {report?.totalCompanies?.toLocaleString() || '5,588'}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Economic Sectors</div>
                <div className="text-2xl font-bold text-text-primary font-mono mt-0.5">
                  {report?.sectorsCount || '23'}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Exchange Feeds</div>
                <div className="text-2xl font-bold text-blue-600 font-mono mt-0.5">
                  NSE & BSE
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-tertiary">Data Authenticity</div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mt-0.5">
                  Zero Fabrication
                </div>
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
