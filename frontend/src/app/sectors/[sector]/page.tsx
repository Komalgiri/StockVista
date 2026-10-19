import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { HeaderSearch } from '@/components/HeaderSearch';
import { getCompaniesBySector } from '@/services/api';
import { ArrowLeft, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Layers, Building } from 'lucide-react';

interface SectorPageProps {
  params: Promise<{ sector: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const decoded = decodeURIComponent(sector);
  return {
    title: `${decoded} Stocks in India (NSE & BSE) — StockVista`,
    description: `Complete list of public companies in the ${decoded} sector listed on NSE and BSE with full financial statements and ratios.`,
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
    // If empty or invalid
    return (
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 text-center flex flex-col items-center justify-center">
          <Layers size={40} className="text-text-tertiary mb-3" />
          <h1 className="text-xl font-bold text-text-primary">Sector Not Found</h1>
          <p className="text-sm text-text-secondary mt-1">No companies indexed under sector &quot;{decodedSector}&quot;.</p>
          <Link href="/sectors" className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-md text-xs font-semibold">
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
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                <Link href="/sectors" className="inline-flex items-center gap-1 hover:text-text-primary">
                  <ArrowLeft size={13} /> All Sectors
                </Link>
                <span>•</span>
                <span>Sector Directory</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary font-geist flex items-center gap-2">
                <span>{decodedSector}</span>
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Showing {companies.length} of {pagination.total} listed equities in this sector.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-hairline text-xs font-medium text-text-secondary">
                Total Companies: <span className="font-mono font-bold text-text-primary">{pagination.total}</span>
              </div>
            </div>
          </div>

          {/* Companies Table */}
          <div className="border border-border-hairline rounded-xl overflow-hidden bg-surface-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-dim text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border-hairline font-mono">
                  <tr>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Symbol / Scrip</th>
                    <th className="py-3 px-4">Exchange</th>
                    <th className="py-3 px-4">Industry Classification</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                  {companies.map((c) => {
                    const primaryTicker = c.symbol_nse || c.ticker || c.scrip_bse || '';
                    return (
                      <tr key={c.ticker + (c.scrip_bse || '')} className="hover:bg-surface transition-colors">
                        <td className="py-3.5 px-4 font-medium text-text-primary">
                          <Link 
                            href={`/company/${encodeURIComponent(primaryTicker)}`}
                            className="hover:underline flex items-center gap-2"
                          >
                            <Building size={14} className="text-text-tertiary shrink-0" />
                            <span>{c.name}</span>
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            {c.symbol_nse && (
                              <span className="font-semibold text-text-primary bg-surface px-1.5 py-0.5 rounded border border-border-hairline">
                                {c.symbol_nse}
                              </span>
                            )}
                            {c.scrip_bse && (
                              <span className="text-text-secondary font-mono text-[11px]">
                                BSE: {c.scrip_bse}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                            c.exchange.includes('NSE') && c.exchange.includes('BSE')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : c.exchange.includes('NSE')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {c.exchange}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-text-secondary">
                          {c.industry || 'Diversified Business'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/company/${encodeURIComponent(primaryTicker)}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary px-3 py-1.5 rounded-md bg-surface border border-border-hairline hover:bg-primary hover:text-on-primary transition-all shadow-2xs"
                          >
                            View Financials <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-border-hairline bg-surface flex items-center justify-between text-xs text-text-secondary">
                <div>
                  Page <span className="font-medium text-text-primary font-mono">{pagination.page}</span> of{' '}
                  <span className="font-medium text-text-primary font-mono">{pagination.totalPages}</span> ({pagination.total} total)
                </div>

                <div className="flex items-center gap-2">
                  {pagination.page > 1 ? (
                    <Link
                      href={`/sectors/${encodeURIComponent(decodedSector)}?page=${pagination.page - 1}&limit=${pagination.limit}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-border-hairline hover:bg-surface-subtle text-text-primary font-medium transition-colors"
                    >
                      <ChevronLeft size={14} /> Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-border-hairline/50 text-text-tertiary cursor-not-allowed">
                      <ChevronLeft size={14} /> Previous
                    </span>
                  )}

                  {pagination.page < pagination.totalPages ? (
                    <Link
                      href={`/sectors/${encodeURIComponent(decodedSector)}?page=${pagination.page + 1}&limit=${pagination.limit}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-border-hairline hover:bg-surface-subtle text-text-primary font-medium transition-colors"
                    >
                      Next <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-border-hairline/50 text-text-tertiary cursor-not-allowed">
                      Next <ChevronRight size={14} />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
