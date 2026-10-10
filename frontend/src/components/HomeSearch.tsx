'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { searchCompanies, type SearchResult } from '@/services/api';

const POPULAR_SEARCHES = [
  { ticker: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
  { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financial Services' },
  { ticker: 'INFY', name: 'Infosys', sector: 'Technology' },
  { ticker: 'ZOMATO', name: 'Zomato', sector: 'Consumer Services' },
  { ticker: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financial Services' },
];

export function HomeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const data = await searchCompanies(q);
    setResults(data);
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 250);
  };

  const handleSelect = (ticker: string) => {
    router.push(`/company/${ticker}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].ticker);
    } else if (query.trim()) {
      handleSelect(query.trim().toUpperCase());
    }
  };

  const showResults = query.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-3xl mx-auto px-4">
      <h1 className="font-geist text-4xl md:text-5xl font-bold text-text-primary mb-2 text-center tracking-tight">
        Discover Market Opportunities
      </h1>
      <p className="text-text-secondary font-inter mb-10 text-center max-w-xl">
        Institutional-grade financial equity research environment calibrated for Indian capital market analysts.
      </p>

      <div className="relative w-full mb-8 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading
              ? <Loader2 className="h-6 w-6 text-outline animate-spin" />
              : <Search className="h-6 w-6 text-outline" />
            }
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-24 py-4 border border-border-strong rounded-lg leading-5 bg-surface-canvas placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg transition-shadow"
            placeholder="Search by company name, NSE/BSE symbol… (e.g. RELIANCE, HDFC Bank)"
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors">
              Search
            </button>
          </div>
        </form>

        {/* Live search dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 mt-1 w-full bg-surface-canvas border border-border-strong rounded-lg shadow-xl z-50 overflow-hidden">
            {loading && results.length === 0 && (
              <div className="px-4 py-3 text-text-tertiary text-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Searching…
              </div>
            )}
            {!loading && results.length === 0 && query.trim() && (
              <div className="px-4 py-3 text-text-tertiary text-sm">
                No results for &quot;{query}&quot;. Try pressing Search to look up by ticker directly.
              </div>
            )}
            {results.map((r) => (
              <button
                key={r.ticker}
                onClick={() => handleSelect(r.ticker)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-surface-subtle transition-colors text-left border-b border-border-hairline last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-geist font-bold text-primary text-sm w-24 shrink-0">{r.ticker}</span>
                  <span className="text-text-primary text-sm truncate max-w-[300px]">{r.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-text-tertiary font-mono">{r.sector}</span>
                  <span className="text-[10px] bg-surface-dim border border-border-hairline text-text-secondary px-1.5 py-0.5 rounded font-mono">{r.exchange}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Searches — only shown when not searching */}
      {!showResults && (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4 text-text-secondary font-inter text-sm font-medium">
            <TrendingUp size={16} />
            <span>Popular Searches</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            {POPULAR_SEARCHES.map(item => (
              <Link
                key={item.ticker}
                href={`/company/${item.ticker}`}
                className="flex items-center justify-between p-3 border border-border-hairline rounded-md bg-surface-canvas hover:bg-surface-subtle hover:border-border-strong transition-all"
              >
                <div>
                  <div className="font-geist font-semibold text-text-primary">{item.ticker}</div>
                  <div className="text-xs text-text-tertiary truncate max-w-[120px]">{item.name}</div>
                </div>
                <span className="text-[10px] text-text-tertiary font-mono">{item.sector}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
