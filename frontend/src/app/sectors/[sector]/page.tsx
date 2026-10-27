import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { getCompaniesBySector } from '@/services/api';
import { SectorDetailClient } from './SectorDetailClient';
import { ArrowLeft, Layers, Building2 } from 'lucide-react';

interface SectorPageProps {
  params: Promise<{ sector: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const decoded = decodeURIComponent(sector);
  return {
    title: `${decoded} Stocks in India (NSE & BSE) — Opp Code Stock Vision`,
    description: `Complete list of public companies in the ${decoded} sector listed on NSE and BSE with full financial statements and ratios on Opp Code Stock Vision.`,
  };
}

export const instant = false;

export default async function SectorDetailPage({ params, searchParams }: SectorPageProps) {
  const { sector } = await params;
  const resolvedSearchParams = await searchParams;
  const decodedSector = decodeURIComponent(sector);

  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const limit = parseInt(resolvedSearchParams.limit || '40', 10);

  const data = await getCompaniesBySector(decodedSector, page, limit);

  if (!data || data.companies.length === 0 && page === 1) {
    return (
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 text-center flex flex-col items-center justify-center">
          <Layers size={40} className="text-text-tertiary mb-3" />
          <h1 className="text-xl font-bold text-text-primary">Sector Not Found</h1>
          <p className="text-sm text-text-secondary mt-1">No companies indexed under sector &quot;{decodedSector}&quot;.</p>
          <Link href="/sectors" className="mt-4 px-4 py-2 bg-orange-700 text-white rounded-lg text-xs font-semibold">
            Return to Sectors Directory
          </Link>
        </main>
      </div>
    );
  }

  const { companies, pagination } = data;

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
              <Link href="/sectors" className="hover:text-text-primary transition-colors">Sectors</Link>
              <span>/</span>
              <span className="text-text-primary font-medium">{decodedSector}</span>
            </div>
          </div>
          <HeaderSearch />
        </header>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner with Rust Orange Touch */}
          <div className="border border-border-hairline rounded-2xl p-6 bg-surface-subtle relative overflow-hidden shadow-2xs">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                  <Link href="/sectors" className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-800">
                    <ArrowLeft size={13} /> All Sectors
                  </Link>
                  <span>•</span>
                  <span>Indian Equities Taxonomy</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary font-geist flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                  <span>{decodedSector}</span>
                </h1>
                <p className="text-xs text-text-secondary mt-1.5 max-w-2xl">
                  Comprehensive listing of publicly listed Indian enterprises in the {decodedSector} sector. Access fundamental statements, valuation ratios, and exchange filings.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-surface border border-border-hairline text-xs font-medium text-text-secondary shadow-2xs">
                  Sector Equities: <span className="font-mono font-bold text-orange-700 text-sm">{pagination.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Filter, Search & Table */}
          <SectorDetailClient 
            initialCompanies={companies} 
            sectorName={decodedSector} 
            pagination={pagination} 
          />
        </div>
      </main>
    </div>
  );
}
