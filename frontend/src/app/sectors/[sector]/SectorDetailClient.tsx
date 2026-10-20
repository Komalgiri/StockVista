'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Search, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Tag
} from 'lucide-react';
import type { SearchResult } from '@/services/api';

interface SectorDetailClientProps {
  initialCompanies: SearchResult[];
  sectorName: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function SectorDetailClient({ initialCompanies, sectorName, pagination }: SectorDetailClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exchangeFilter, setExchangeFilter] = useState<'ALL' | 'DUAL' | 'BSE' | 'NSE'>('ALL');

  const filteredCompanies = useMemo(() => {
    let list = initialCompanies;
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.ticker && c.ticker.toLowerCase().includes(q)) ||
        (c.symbol_nse && c.symbol_nse.toLowerCase().includes(q)) ||
        (c.scrip_bse && c.scrip_bse.includes(q))
      );
    }

    if (exchangeFilter === 'DUAL') {
      list = list.filter(c => c.exchange.includes('NSE') && c.exchange.includes('BSE'));
    } else if (exchangeFilter === 'BSE') {
      list = list.filter(c => c.exchange === 'BSE');
    } else if (exchangeFilter === 'NSE') {
      list = list.filter(c => c.exchange === 'NSE');
    }

    return list;
  }, [initialCompanies, searchQuery, exchangeFilter]);

  return (
    <div className="space-y-4">
      {/* ── Filter & Search Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3.5 rounded-2xl border border-border-hairline shadow-2xs">
        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={15} />
          <input
            type="text"
            placeholder={`Filter ${pagination.total} stocks in this sector...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-subtle border border-border-hairline rounded-xl focus:outline-hidden focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Exchange Filter Segmented Tabs */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-surface-subtle border border-border-hairline rounded-xl p-1 text-xs">
          <button
            onClick={() => setExchangeFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              exchangeFilter === 'ALL' 
                ? 'bg-surface text-orange-700 shadow-2xs font-semibold' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All ({pagination.total})
          </button>
          <button
            onClick={() => setExchangeFilter('DUAL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              exchangeFilter === 'DUAL' 
                ? 'bg-surface text-orange-700 shadow-2xs font-semibold' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            NSE & BSE
          </button>
          <button
            onClick={() => setExchangeFilter('BSE')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              exchangeFilter === 'BSE' 
                ? 'bg-surface text-orange-700 shadow-2xs font-semibold' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            BSE Only
          </button>
        </div>
      </div>

      {/* ── Companies Data Table ───────────────────────────────────────────── */}
      <div className="border border-border-hairline rounded-2xl overflow-hidden bg-surface shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-subtle text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border-hairline font-mono">
              <tr>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Exchange Symbol</th>
                <th className="py-3 px-4">Listing Scope</th>
                <th className="py-3 px-4">Sub-Industry Classification</th>
                <th className="py-3 px-4 text-right">Fundamental Research</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-text-tertiary text-xs">
                    No securities match &quot;{searchQuery}&quot; with current filters.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => {
                  const primaryTicker = c.symbol_nse || c.ticker || c.scrip_bse || '';
                  const initial = c.name ? c.name.charAt(0).toUpperCase() : 'S';

                  return (
                    <tr key={c.ticker + (c.scrip_bse || '')} className="hover:bg-surface-subtle transition-colors group">
                      <td className="py-3.5 px-4 font-medium text-text-primary">
                        <Link 
                          href={`/company/${encodeURIComponent(primaryTicker)}`}
                          className="hover:text-orange-700 transition-colors flex items-center gap-2.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-orange-50/80 border border-orange-200/60 text-orange-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <span className="font-semibold text-text-primary group-hover:text-orange-700 transition-colors">
                            {c.name}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          {c.symbol_nse ? (
                            <span className="font-semibold text-text-primary bg-surface-subtle px-2 py-0.5 rounded-md border border-border-hairline group-hover:border-orange-300 transition-colors">
                              {c.symbol_nse}
                            </span>
                          ) : (
                            <span className="text-text-tertiary text-[11px]">—</span>
                          )}
                          {c.scrip_bse && (
                            <span className="text-text-tertiary font-mono text-[11px]">
                              BSE: {c.scrip_bse}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                          c.exchange.includes('NSE') && c.exchange.includes('BSE')
                            ? 'bg-orange-50 text-orange-800 border border-orange-200/70'
                            : c.exchange.includes('NSE')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/70'
                        }`}>
                          {c.exchange}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Tag size={11} className="text-text-tertiary" />
                          <span>{c.industry || 'Diversified Business'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/company/${encodeURIComponent(primaryTicker)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 px-3 py-1.5 rounded-lg bg-orange-50/60 border border-orange-200/80 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-2xs"
                        >
                          <span>Analyze Financials</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ──────────────────────────────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border-hairline bg-surface flex items-center justify-between text-xs text-text-secondary">
            <div>
              Showing page <span className="font-semibold text-text-primary font-mono">{pagination.page}</span> of{' '}
              <span className="font-semibold text-text-primary font-mono">{pagination.totalPages}</span> ({pagination.total} total companies)
            </div>

            <div className="flex items-center gap-2">
              {pagination.page > 1 ? (
                <Link
                  href={`/sectors/${encodeURIComponent(sectorName)}?page=${pagination.page - 1}&limit=${pagination.limit}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-hairline hover:bg-surface-subtle text-text-primary font-medium transition-colors"
                >
                  <ChevronLeft size={14} /> Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-hairline/50 text-text-tertiary cursor-not-allowed">
                  <ChevronLeft size={14} /> Previous
                </span>
              )}

              {pagination.page < pagination.totalPages ? (
                <Link
                  href={`/sectors/${encodeURIComponent(sectorName)}?page=${pagination.page + 1}&limit=${pagination.limit}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-hairline hover:bg-surface-subtle text-text-primary font-medium transition-colors"
                >
                  Next <ChevronRight size={14} />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-hairline/50 text-text-tertiary cursor-not-allowed">
                  Next <ChevronRight size={14} />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
