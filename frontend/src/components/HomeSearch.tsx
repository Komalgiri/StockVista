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
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full max-w-5xl mx-auto px-4 overflow-hidden pt-20">
      {/* Arched Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white rounded-[100%] -z-10 mt-[-10%] opacity-80 pointer-events-none"></div>

      <h1 className="font-inter text-4xl md:text-6xl text-slate-500 mb-12 text-center tracking-tight">
        Find Your <span className="font-bold text-slate-800">Perfect Stock.</span>
      </h1>

      <div className="relative w-full max-w-3xl mb-16 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full bg-white">
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          <div className="absolute left-6 flex items-center pointer-events-none">
            {loading
              ? <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
              : <Search className="h-6 w-6 text-slate-400" />
            }
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-[180px] py-6 rounded-full border-0 focus:ring-0 text-lg placeholder-slate-400 text-slate-800 bg-transparent font-medium"
            placeholder="Search for a company..."
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />
          
          <div className="absolute right-36 h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="absolute right-4 flex items-center">
            <button type="submit" className="px-8 py-4 bg-[#0f172a] text-white rounded-full text-sm font-bold tracking-wide hover:bg-slate-800 transition-colors shadow-md">
              SEARCH
            </button>
          </div>
        </form>

        {/* Live search dropdown */}
        {showResults && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
            {loading && results.length === 0 && (
              <div className="px-6 py-4 text-slate-500 text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Searching...
              </div>
            )}
            {!loading && results.length === 0 && query.trim() && (
              <div className="px-6 py-4 text-slate-500 text-sm">
                No results for &quot;{query}&quot;. Try pressing Search to look up by ticker directly.
              </div>
            )}
            {results.map((r) => (
              <button
                key={r.ticker}
                onClick={() => handleSelect(r.ticker)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="font-geist font-bold text-slate-800 text-base w-24 shrink-0">{r.ticker}</span>
                  <span className="text-slate-600 text-sm truncate max-w-[300px] font-medium">{r.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400 font-mono">{r.sector}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono font-bold">{r.exchange}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Searches */}
      {!showResults && (
        <div className="w-full max-w-3xl mt-4">
          <div className="flex items-center gap-2 mb-6 text-slate-400 font-inter text-sm font-semibold tracking-wide uppercase">
            <TrendingUp size={16} />
            <span>Popular Searches</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {POPULAR_SEARCHES.map(item => (
              <Link
                key={item.ticker}
                href={`/company/${item.ticker}`}
                className="flex flex-col p-4 border border-slate-100 rounded-2xl bg-white hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="font-geist font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{item.ticker}</div>
                <div className="text-xs text-slate-500 truncate mb-3">{item.name}</div>
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wide mt-auto">{item.sector}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
