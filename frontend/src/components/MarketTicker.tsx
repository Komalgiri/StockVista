'use client';

import { useEffect, useState } from 'react';
import { getMarketIndices, type MarketIndices } from '@/services/api';
import { TrendingUp, TrendingDown } from 'lucide-react';

function fmt(n: number | null | undefined, decimals = 2) {
  if (n == null) return '—';
  return n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function ChangeLabel({ pct }: { pct: number | null | undefined }) {
  if (pct == null) return <span className="text-text-tertiary">—</span>;
  const positive = pct >= 0;
  return (
    <span className={positive ? 'text-market-positive' : 'text-market-negative'}>
      {positive ? '+' : ''}{fmt(pct)}%
    </span>
  );
}

export function MarketTicker() {
  const [indices, setIndices] = useState<MarketIndices | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getMarketIndices();
      if (!cancelled) {
        setIndices(data);
        setLoading(false);
      }
    }

    load();
    // Refresh every 60 seconds (backend TTL is also 60s)
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold tracking-wider font-mono border-r border-border-hairline pr-5 animate-pulse">
        <span className="bg-surface-subtle rounded w-28 h-3 inline-block" />
        <span className="bg-surface-subtle rounded w-28 h-3 inline-block" />
      </div>
    );
  }

  // If both indices are null, render nothing silently
  if (!indices?.nifty50 && !indices?.sensex) return null;

  return (
    <div className="hidden md:flex items-center gap-3">
      {indices?.nifty50 && (
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-mono shadow-2xs">
          <div className="flex items-center gap-1.5">
            {(indices.nifty50.changePercent ?? 0) >= 0
              ? <TrendingUp size={13} className="text-emerald-600" />
              : <TrendingDown size={13} className="text-red-600" />
            }
            <span className="font-bold text-slate-500 text-[11px]">NIFTY 50</span>
          </div>
          <span className="font-extrabold text-slate-950 text-xs tabular-nums">{fmt(indices.nifty50.value, 2)}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold ${
            (indices.nifty50.changePercent ?? 0) >= 0 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
              : 'bg-red-50 text-red-700 border border-red-200/60'
          }`}>
            {(indices.nifty50.changePercent ?? 0) >= 0 ? '+' : ''}{fmt(indices.nifty50.changePercent)}%
          </span>
        </div>
      )}
      {indices?.sensex && (
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-mono shadow-2xs">
          <div className="flex items-center gap-1.5">
            {(indices.sensex.changePercent ?? 0) >= 0
              ? <TrendingUp size={13} className="text-emerald-600" />
              : <TrendingDown size={13} className="text-red-600" />
            }
            <span className="font-bold text-slate-500 text-[11px]">SENSEX</span>
          </div>
          <span className="font-extrabold text-slate-950 text-xs tabular-nums">{fmt(indices.sensex.value, 2)}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold ${
            (indices.sensex.changePercent ?? 0) >= 0 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
              : 'bg-red-50 text-red-700 border border-red-200/60'
          }`}>
            {(indices.sensex.changePercent ?? 0) >= 0 ? '+' : ''}{fmt(indices.sensex.changePercent)}%
          </span>
        </div>
      )}
    </div>
  );
}

