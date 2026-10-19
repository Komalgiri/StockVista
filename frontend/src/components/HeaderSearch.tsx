'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { searchCompanies, type SearchResult } from '@/services/api';

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const data = await searchCompanies(q);
    setResults(data);
    setOpen(data.length > 0);
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 250);
  };

  const handleSelect = (ticker: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/company/${ticker}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) handleSelect(query.trim().toUpperCase());
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg hidden md:block">
      <form onSubmit={handleSubmit}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading
            ? <Loader2 className="h-4 w-4 text-outline animate-spin" />
            : <Search className="h-4 w-4 text-outline" />
          }
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="block w-full pl-9 pr-4 py-1.5 border border-border-strong rounded bg-surface-canvas placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-[13px] transition-colors"
          placeholder="Search by company name, NSE/BSE symbol…"
          autoComplete="off"
        />
      </form>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-surface-canvas border border-border-strong rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((r) => (
            <button
              key={`${r.ticker}-${r.scrip_bse || ''}`}
              onClick={() => handleSelect(r.ticker)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-subtle transition-colors text-left border-b border-border-hairline last:border-0"
            >
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <span className="font-geist font-semibold text-text-primary text-[13px] shrink-0">{r.ticker}</span>
                {r.scrip_bse && (
                  <span className="text-[9px] bg-surface-subtle border border-border-hairline text-text-tertiary px-1 rounded font-mono shrink-0">
                    {r.scrip_bse}
                  </span>
                )}
                <span className="text-text-secondary text-[12px] truncate inline-block align-middle">{r.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-text-tertiary">{r.sector}</span>
                <span className="text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded font-mono">{r.exchange}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
