'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  TrendingUp, 
  Loader2, 
  Layers, 
  ShieldCheck, 
  BarChart3, 
  Building2, 
  ArrowRight,
  Database,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { searchCompanies, type SearchResult } from '@/services/api';
import bgImage from '@/assets/serach_bg.png';

const POPULAR_SEARCHES = [
  { ticker: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy & Power', mcap: '₹19.7L Cr' },
  { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', mcap: '₹14.2L Cr' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financial Services', mcap: '₹12.8L Cr' },
  { ticker: 'INFY', name: 'Infosys Ltd', sector: 'Technology', mcap: '₹7.9L Cr' },
  { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financial Services', mcap: '₹8.9L Cr' },
  { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecommunication', mcap: '₹9.4L Cr' },
];

const FEATURED_SECTORS = [
  { name: 'Financial Services', count: '850+ Stocks', href: '/sectors/Financial%20Services' },
  { name: 'Technology', count: '410+ Stocks', href: '/sectors/Technology' },
  { name: 'Healthcare', count: '390+ Stocks', href: '/sectors/Healthcare' },
  { name: 'Energy & Power', count: '220+ Stocks', href: '/sectors/Energy%20%26%20Power' },
  { name: 'FMCG', count: '280+ Stocks', href: '/sectors/FMCG' },
  { name: 'Auto Components', count: '290+ Stocks', href: '/sectors/Auto%20Components' },
];

export function HomeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Global hotkey to focus search bar: press '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    debounceRef.current = setTimeout(() => doSearch(val), 200);
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
    <div className="relative flex flex-col items-center justify-start min-h-[85vh] w-full overflow-hidden pt-12 pb-20">
      
      {/* Background Graphic */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[45vh] -z-10 pointer-events-none opacity-40">
        <img src={bgImage.src} alt="Cityscape background" className="w-full h-full object-cover object-bottom" />
      </div>
      
      {/* Subtle Radial Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] md:w-[120%] h-[100%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/70 via-slate-50/20 to-transparent rounded-[100%] -z-20 mt-[-5%] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Live Universe Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold tracking-wide uppercase shadow-sm mb-6 animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Universe: 5,588 Equities Indexed</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">NSE & BSE Integrated</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-geist text-3xl sm:text-5xl md:text-6xl text-slate-900 mb-4 text-center tracking-tight font-extrabold max-w-3xl">
          Institutional Equity Research <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Reimagined.</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-10 text-center max-w-2xl font-normal leading-relaxed">
          Comprehensive 10-year financials, Screener-grade metrics, and live market quotes across India’s complete publicly listed universe.
        </p>

        {/* Search Bar Container */}
        <div className="relative w-full max-w-3xl mb-12 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] rounded-full bg-white border border-slate-200/80 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            <div className="absolute left-6 flex items-center pointer-events-none">
              {loading
                ? <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                : <Search className="h-5 w-5 text-slate-400" />
              }
            </div>
            
            <input
              ref={inputRef}
              type="text"
              className="block w-full pl-15 pr-36 py-5 rounded-full border-0 focus:ring-0 text-base md:text-lg placeholder-slate-400 text-slate-900 bg-transparent font-medium"
              placeholder="Search by company name, NSE symbol (RELIANCE), or BSE code (500325)..."
              value={query}
              onChange={handleChange}
              autoComplete="off"
            />
            
            <div className="absolute right-3 hidden sm:flex items-center gap-2">
              <span className="hidden md:inline-block font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200/70">
                Press /
              </span>
              <button 
                type="submit" 
                className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold tracking-wider uppercase hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Live Search Autocomplete Dropdown */}
          {showResults && (
            <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {loading && results.length === 0 && (
                <div className="px-6 py-4 text-slate-500 text-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" /> Querying 5,500+ database records...
                </div>
              )}
              {!loading && results.length === 0 && query.trim() && (
                <div className="px-6 py-5 text-slate-500 text-sm text-center">
                  <p className="font-semibold text-slate-700">No matching security found for &quot;{query}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1">Press Search to resolve via direct exchange symbol routing.</p>
                </div>
              )}
              {results.map((r) => (
                <button
                  key={`${r.ticker}-${r.scrip_bse || ''}`}
                  onClick={() => handleSelect(r.ticker)}
                  className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/90 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 mr-4">
                    <span className="font-mono font-bold text-slate-900 text-base shrink-0 group-hover:text-blue-600 transition-colors">
                      {r.ticker}
                    </span>
                    {r.scrip_bse && (
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/60 px-1.5 py-0.5 rounded font-mono shrink-0">
                        BSE: {r.scrip_bse}
                      </span>
                    )}
                    <span className="text-slate-600 text-sm truncate font-medium">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs text-slate-400 font-sans hidden sm:inline">{r.sector}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold uppercase border border-slate-200/60">
                      {r.exchange}
                    </span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Equities Section */}
        {!showResults && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-500 font-inter text-xs font-bold tracking-wider uppercase">
                  <TrendingUp size={15} className="text-emerald-600" />
                  <span>Market Leaders & Bluechips</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Real-time audited coverage</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 w-full">
                {POPULAR_SEARCHES.map(item => (
                  <Link
                    key={item.ticker}
                    href={`/company/${item.ticker}`}
                    className="flex flex-col p-3.5 border border-slate-200/80 rounded-xl bg-white hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600 text-sm transition-colors">
                        {item.ticker}
                      </span>
                      <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mb-2">{item.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-auto pt-1 border-t border-slate-100">
                      <span>{item.mcap}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Sector Exploration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-500 font-inter text-xs font-bold tracking-wider uppercase">
                  <Layers size={15} className="text-blue-600" />
                  <span>Explore by Economic Sector</span>
                </div>
                <Link href="/sectors" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group">
                  All 23 Sectors <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {FEATURED_SECTORS.map(sec => (
                  <Link
                    key={sec.name}
                    href={sec.href}
                    className="flex flex-col p-3 border border-slate-200/70 rounded-xl bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all text-left group"
                  >
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {sec.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">{sec.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Institutional Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Database size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">5,588 Equities</div>
                  <div className="text-[11px] text-slate-500">Indexed in SQLite</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">10-Year Audited</div>
                  <div className="text-[11px] text-slate-500">P&L, Balance Sheet, CF</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">23 Macro Sectors</div>
                  <div className="text-[11px] text-slate-500">Taxonomy Classifications</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Zero Fabrication</div>
                  <div className="text-[11px] text-slate-500">Authentic Public Data</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
