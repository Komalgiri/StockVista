'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
  Search,
  Grid,
  List as ListIcon,
  PieChart
} from 'lucide-react';
import type { SectorItem } from '@/services/api';

// Icon mapper for prominent sectors
function getSectorIcon(sector: string) {
  const s = sector.toLowerCase();
  if (s.includes('financ') || s.includes('bank')) return <Building2 className="text-blue-600" size={20} />;
  if (s.includes('tech') || s.includes('soft')) return <Cpu className="text-indigo-600" size={20} />;
  if (s.includes('fmcg') || s.includes('food') || s.includes('consumer')) return <ShoppingBag className="text-amber-600" size={20} />;
  if (s.includes('energy') || s.includes('power') || s.includes('oil')) return <Flame className="text-orange-600" size={20} />;
  if (s.includes('health') || s.includes('pharma')) return <HeartPulse className="text-rose-600" size={20} />;
  if (s.includes('auto')) return <Car className="text-cyan-600" size={20} />;
  if (s.includes('construct') || s.includes('real')) return <Wrench className="text-stone-600" size={20} />;
  if (s.includes('logist') || s.includes('transport')) return <Truck className="text-emerald-600" size={20} />;
  return <Layers className="text-slate-600" size={20} />;
}

export function SectorsClient({ 
  initialSectors, 
  totalCompanies 
}: { 
  initialSectors: SectorItem[]; 
  totalCompanies: number;
}) {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialSectors;
    return initialSectors.filter(s => s.sector.toLowerCase().includes(q));
  }, [initialSectors, query]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
          <input
            type="text"
            placeholder="Filter sectors by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-subtle border border-border-hairline rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-surface-subtle border border-border-hairline rounded-lg p-1 text-text-secondary">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-surface text-text-primary shadow-xs' : 'hover:text-text-primary'}`}
            title="Grid View"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-surface text-text-primary shadow-xs' : 'hover:text-text-primary'}`}
            title="Table View"
          >
            <ListIcon size={16} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-hairline rounded-xl p-8">
          <p className="text-text-secondary text-sm">No sectors match &quot;{query}&quot;</p>
          <button 
            onClick={() => setQuery('')}
            className="mt-3 text-xs font-semibold text-primary underline"
          >
            Clear filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const share = totalCompanies > 0 ? ((item.count / totalCompanies) * 100).toFixed(1) : '0';
            return (
              <Link
                key={item.sector}
                href={`/sectors/${encodeURIComponent(item.sector)}`}
                className="group border border-border-hairline hover:border-border-strong rounded-xl p-5 bg-surface-subtle hover:bg-surface transition-all duration-150 flex flex-col justify-between hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border-hairline flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getSectorIcon(item.sector)}
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-dim text-text-secondary">
                      {share}%
                    </span>
                  </div>
                  <h3 className="font-semibold text-text-primary text-[15px] group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {item.sector}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {item.count} listed {item.count === 1 ? 'company' : 'companies'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-hairline flex items-center justify-between text-xs font-medium text-text-tertiary group-hover:text-primary transition-colors">
                  <span>Explore Sector</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="border border-border-hairline rounded-xl overflow-hidden bg-surface-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-dim text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border-hairline font-mono">
              <tr>
                <th className="py-3 px-4">Sector Name</th>
                <th className="py-3 px-4 text-right">Listed Equities</th>
                <th className="py-3 px-4 text-right">Universe Share</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filtered.map((item) => {
                const share = totalCompanies > 0 ? ((item.count / totalCompanies) * 100).toFixed(1) : '0';
                return (
                  <tr key={item.sector} className="hover:bg-surface transition-colors">
                    <td className="py-3.5 px-4 font-medium text-text-primary flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-surface border border-border-hairline flex items-center justify-center shrink-0">
                        {getSectorIcon(item.sector)}
                      </div>
                      <span>{item.sector}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-text-secondary">
                      {item.count}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-text-secondary">
                      {share}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/sectors/${encodeURIComponent(item.sector)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Browse <ArrowRight size={12} />
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
