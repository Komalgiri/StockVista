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
    <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold tracking-wider font-mono border-r border-border-hairline pr-5">
      {indices?.nifty50 && (
        <span className="flex items-center gap-1">
          {(indices.nifty50.changePercent ?? 0) >= 0
            ? <TrendingUp size={11} className="text-market-positive" />
            : <TrendingDown size={11} className="text-market-negative" />
          }
          NIFTY&nbsp;50:&nbsp;
          <span className="text-text-primary">{fmt(indices.nifty50.value, 2)}</span>
          &nbsp;<ChangeLabel pct={indices.nifty50.changePercent} />
        </span>
      )}
      {indices?.sensex && (
        <span className="flex items-center gap-1">
          {(indices.sensex.changePercent ?? 0) >= 0
            ? <TrendingUp size={11} className="text-market-positive" />
            : <TrendingDown size={11} className="text-market-negative" />
          }
          SENSEX:&nbsp;
          <span className="text-text-primary">{fmt(indices.sensex.value, 2)}</span>
          &nbsp;<ChangeLabel pct={indices.sensex.changePercent} />
        </span>
      )}
    </div>
  );
}
