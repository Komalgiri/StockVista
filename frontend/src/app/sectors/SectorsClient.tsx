'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Cpu, 
  ShoppingBag, 
  Flame, 
  HeartPulse, 
  Car, 
  Wrench, 
  Truck, 
  Layers, 
  ArrowRight,
  Search,
  Grid,
  List as ListIcon,
  ArrowUpDown
} from 'lucide-react';
import type { SectorItem } from '@/services/api';

// Curated sub-industry mappings & marquee stocks for major sectors
const SECTOR_META: Record<string, { subIndustries: string[]; marquee: string[]; color: string }> = {
  'Financial Services': {
    subIndustries: ['Private Sector Banks', 'PSU Banks', 'NBFCs', 'Housing Finance', 'Capital Markets'],
    marquee: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'BAJFINANCE', 'KOTAKBANK'],
    color: 'from-orange-600 to-amber-700'
  },
  'Technology': {
    subIndustries: ['IT Services & Consulting', 'Software Products', 'Cloud Infrastructure', 'Telecom'],
    marquee: ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'TECHM'],
    color: 'from-amber-600 to-orange-700'
  },
  'FMCG': {
    subIndustries: ['Packaged Foods', 'Edible Oils', 'Tea & Beverages', 'Personal Care', 'Dairy'],
    marquee: ['ITC', 'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'DABUR'],
    color: 'from-orange-700 to-stone-800'
  },
  'Energy & Power': {
    subIndustries: ['Oil & Gas Refining', 'Power Generation', 'Renewable Solar & Wind', 'Gas Distribution'],
    marquee: ['RELIANCE', 'ONGC', 'NTPC', 'POWERGRID', 'IOC'],
    color: 'from-amber-700 to-orange-800'
  },
  'Healthcare': {
    subIndustries: ['Pharmaceutical Formulations', 'Active Pharma Ingredients (API)', 'Hospitals & Clinics'],
    marquee: ['SUNPHARMA', 'CIPLA', 'DRREDDY', 'DIVISLAB', 'APOLLOHOSP'],
    color: 'from-rose-700 to-orange-700'
  },
  'Construction & Real Estate': {
    subIndustries: ['Cement & Building Materials', 'Real Estate Development', 'Civil Infrastructure'],
    marquee: ['LT', 'ULTRACEMCO', 'DLF', 'GRASIM', 'AMBUJACEM'],
    color: 'from-stone-700 to-orange-900'
  },
  'Automobile': {
    subIndustries: ['Passenger Vehicles', 'Commercial Vehicles', '2 & 3 Wheelers', 'Tyres & Rubber'],
    marquee: ['TATAMOTORS', 'M&M', 'MARUTI', 'BAJAJ-AUTO', 'HEROMOTOCO'],
    color: 'from-orange-600 to-stone-800'
  },
  'Chemicals': {
    subIndustries: ['Specialty Chemicals', 'Agrochemicals & Fertilizers', 'Petrochemical Organics'],
    marquee: ['PIDILITIND', 'SRF', 'DEEPAKNTR', 'TATACHEM', 'AARTIIND'],
    color: 'from-amber-600 to-orange-900'
  },
  'Metals & Mining': {
    subIndustries: ['Iron & Steel Manufacturers', 'Aluminium & Zinc', 'Mineral Extraction & Mining'],
    marquee: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'COALINDIA', 'VEDL'],
    color: 'from-stone-800 to-amber-900'
  }
};

function getSectorIcon(sector: string) {
  const s = sector.toLowerCase();
  if (s.includes('financ') || s.includes('bank')) return <Building2 className="text-orange-700" size={20} />;
  if (s.includes('tech') || s.includes('soft')) return <Cpu className="text-orange-600" size={20} />;
  if (s.includes('fmcg') || s.includes('food') || s.includes('consumer')) return <ShoppingBag className="text-amber-700" size={20} />;
  if (s.includes('energy') || s.includes('power') || s.includes('oil')) return <Flame className="text-orange-700" size={20} />;
  if (s.includes('health') || s.includes('pharma')) return <HeartPulse className="text-rose-700" size={20} />;
  if (s.includes('auto')) return <Car className="text-amber-700" size={20} />;
  if (s.includes('construct') || s.includes('real')) return <Wrench className="text-stone-700" size={20} />;
  if (s.includes('logist') || s.includes('transport')) return <Truck className="text-orange-800" size={20} />;
  return <Layers className="text-stone-600" size={20} />;
}

export function SectorsClient({ 
  initialSectors = [], 
  totalCompanies = 0 
}: { 
  initialSectors?: SectorItem[]; 
  totalCompanies?: number;
}) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'count-desc' | 'count-asc' | 'alpha'>('count-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const safeSectors = useMemo(() => {
    if (!Array.isArray(initialSectors)) return [];
    return initialSectors.filter(s => s && typeof s.sector === 'string');
  }, [initialSectors]);

  const filteredAndSorted = useMemo(() => {
    let result = [...safeSectors];
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(s => (s.sector || '').toLowerCase().includes(q));
    }

    if (sortBy === 'count-desc') {
      result.sort((a, b) => (b.count || 0) - (a.count || 0));
    } else if (sortBy === 'count-asc') {
      result.sort((a, b) => (a.count || 0) - (b.count || 0));
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => (a.sector || '').localeCompare(b.sector || ''));
    }

    return result;
  }, [safeSectors, query, sortBy]);

  // Top marquee sectors for spotlight cards
  const spotlightSectors = useMemo(() => {
    return safeSectors
      .filter(s => s?.sector && SECTOR_META[s.sector] && s.sector !== 'Diversified')
      .slice(0, 4);
  }, [safeSectors]);

  return (
    <div className="space-y-8">
      {/* ── 1. Top Featured Spotlight Sectors ─────────────────────────────── */}
      {!query && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-orange-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                Pillar Industry Sectors
              </h2>
            </div>
            <span className="text-xs text-text-tertiary">Key market weightings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spotlightSectors.map((s) => {
              const meta = SECTOR_META[s.sector];
              return (
                <div 
                  key={s.sector} 
                  className="group rounded-2xl border border-border-hairline hover:border-orange-300/80 bg-surface p-4.5 hover:shadow-xs transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-orange-50/80 border border-orange-200/60 flex items-center justify-center">
                        {getSectorIcon(s.sector)}
                      </div>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-subtle border border-border-hairline text-text-secondary">
                        {s.count} stocks
                      </span>
                    </div>

                    <div>
                      <Link 
                        href={`/sectors/${encodeURIComponent(s.sector)}`}
                        className="font-bold text-base text-text-primary group-hover:text-orange-700 transition-colors block"
                      >
                        {s.sector}
                      </Link>
                      <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">
                        {meta?.subIndustries.slice(0, 2).join(' • ')}
                      </p>
                    </div>

                    {/* Marquee Stocks Chips */}
                    {meta?.marquee && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {meta.marquee.slice(0, 4).map((m) => (
                          <Link
                            key={m}
                            href={`/company/${m}`}
                            className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-subtle border border-border-hairline text-text-secondary hover:text-orange-700 hover:border-orange-300 transition-colors"
                          >
                            {m}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-border-hairline/80 flex items-center justify-between text-xs font-semibold text-orange-700 group-hover:translate-x-0.5 transition-transform">
                    <Link href={`/sectors/${encodeURIComponent(s.sector)}`} className="inline-flex items-center gap-1">
                      <span>View Sector Directory</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. Visual Market Weight Distribution Strip ───────────────────────── */}
      <div className="border border-border-hairline rounded-2xl p-5 bg-surface-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <div className="font-semibold text-text-primary flex items-center gap-2">
            <span className="w-1.5 h-3 rounded-full bg-orange-600" />
            <span>Universe Sectoral Allocation Distribution</span>
          </div>
          <span className="text-text-tertiary font-mono">
            Classified across {safeSectors.length} distinct industry segments
          </span>
        </div>

        {/* Multi-segment Progress Bar with Rust Orange Palette */}
        <div className="h-3 w-full bg-surface-dim rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: '9.2%' }} className="bg-orange-700 h-full" title="Financial Services: 514" />
          <div style={{ width: '5.6%' }} className="bg-orange-600 h-full" title="Technology: 316" />
          <div style={{ width: '3.4%' }} className="bg-amber-600 h-full" title="FMCG: 188" />
          <div style={{ width: '2.9%' }} className="bg-orange-500 h-full" title="Construction & Real Estate: 162" />
          <div style={{ width: '2.5%' }} className="bg-amber-700 h-full" title="Energy & Power: 142" />
          <div style={{ width: '2.5%' }} className="bg-rose-700 h-full" title="Healthcare: 141" />
          <div style={{ width: '1.6%' }} className="bg-stone-600 h-full" title="Textiles: 92" />
          <div style={{ width: '1.4%' }} className="bg-amber-800 h-full" title="Chemicals: 79" />
          <div style={{ width: '70.9%' }} className="bg-stone-300 dark:bg-stone-700 h-full" title="Diversified & Other: 3,954" />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-text-secondary pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-700" /> Financials (9.2%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-600" /> Tech (5.6%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" /> FMCG (3.4%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Realty & Infra (2.9%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-700" /> Energy (2.5%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-700" /> Healthcare (2.5%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700" /> Diversified & Other (70.9%)
          </span>
        </div>
      </div>

      {/* ── 3. Controls & Filter Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
          <input
            type="text"
            placeholder="Search sectors (e.g., Financials, Auto, Energy)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-subtle border border-border-hairline rounded-xl focus:outline-hidden focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-surface-subtle border border-border-hairline rounded-xl px-2.5 py-1.5 text-xs text-text-secondary">
            <ArrowUpDown size={13} className="text-text-tertiary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'count-desc' | 'count-asc' | 'alpha')}
              className="bg-transparent border-none text-xs font-medium text-text-primary focus:outline-hidden cursor-pointer"
            >
              <option value="count-desc">Most Listed Equities</option>
              <option value="count-asc">Lowest Equities</option>
              <option value="alpha">Alphabetical (A - Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-surface-subtle border border-border-hairline rounded-xl p-1 text-text-secondary">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-surface text-orange-700 shadow-xs' : 'hover:text-text-primary'}`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-surface text-orange-700 shadow-xs' : 'hover:text-text-primary'}`}
              title="Table View"
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Main Directory Listing ────────────────────────────────────────── */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-hairline rounded-2xl p-8 bg-surface-subtle">
          <p className="text-text-secondary text-sm">No sectors found matching &quot;{query}&quot;</p>
          <button 
            onClick={() => setQuery('')}
            className="mt-3 text-xs font-semibold text-orange-700 underline cursor-pointer"
          >
            Reset filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredAndSorted.map((item) => {
            const share = totalCompanies > 0 ? ((item.count / totalCompanies) * 100).toFixed(1) : '0';
            const meta = SECTOR_META[item.sector];
            return (
              <Link
                key={item.sector}
                href={`/sectors/${encodeURIComponent(item.sector)}`}
                className="group border border-border-hairline hover:border-orange-300 rounded-2xl p-5 bg-surface hover:bg-surface-subtle transition-all duration-150 flex flex-col justify-between hover:shadow-xs relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50/80 border border-orange-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getSectorIcon(item.sector)}
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border-hairline text-text-secondary group-hover:border-orange-200 group-hover:text-orange-700 transition-colors">
                      {item.count} stocks ({share}%)
                    </span>
                  </div>

                  <h3 className="font-bold text-text-primary text-[15px] group-hover:text-orange-700 transition-colors">
                    {item.sector}
                  </h3>

                  {meta?.subIndustries && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {meta.subIndustries.slice(0, 3).map((sub) => (
                        <span key={sub} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-subtle text-text-tertiary">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-border-hairline flex items-center justify-between text-xs font-semibold text-text-tertiary group-hover:text-orange-700 transition-colors">
                  <span>Browse Companies</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Tabular View */
        <div className="border border-border-hairline rounded-2xl overflow-hidden bg-surface shadow-2xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-subtle text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border-hairline font-mono">
              <tr>
                <th className="py-3 px-4">Sector Name</th>
                <th className="py-3 px-4 text-right">Listed Equities</th>
                <th className="py-3 px-4 text-right">Universe Share</th>
                <th className="py-3 px-4 text-right">Sub-Industries</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredAndSorted.map((item) => {
                const share = totalCompanies > 0 ? ((item.count / totalCompanies) * 100).toFixed(1) : '0';
                const meta = SECTOR_META[item.sector];
                return (
                  <tr key={item.sector} className="hover:bg-surface-subtle transition-colors group">
                    <td className="py-3.5 px-4 font-semibold text-text-primary flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-orange-50/80 border border-orange-200/60 flex items-center justify-center shrink-0">
                        {getSectorIcon(item.sector)}
                      </div>
                      <Link href={`/sectors/${encodeURIComponent(item.sector)}`} className="hover:text-orange-700 transition-colors">
                        {item.sector}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-text-primary font-medium">
                      {item.count}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-text-secondary">
                      {share}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-text-tertiary">
                      {meta?.subIndustries ? `${meta.subIndustries.length} segments` : 'Diversified'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/sectors/${encodeURIComponent(item.sector)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800 hover:underline"
                      >
                        Explore <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
