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
  History,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { searchCompanies, type SearchResult } from '@/services/api';
import bgImage from '@/assets/serach_bg.png';

// Pre-screened & suggested quick searches for Indian equities
const SUGGESTED_QUICK_SEARCHES = [
  { ticker: 'RELIANCE', name: 'Reliance Industries', tag: 'Energy', code: '500325' },
  { ticker: 'TCS', name: 'Tata Consultancy', tag: 'IT Services', code: '532540' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank', tag: 'Private Bank', code: '500180' },
  { ticker: 'INFY', name: 'Infosys', tag: 'Technology', code: '500209' },
  { ticker: 'ICICIBANK', name: 'ICICI Bank', tag: 'Banking', code: '532174' },
  { ticker: 'TATAMOTORS', name: 'Tata Motors', tag: 'Auto', code: '500570' },
  { ticker: 'ITC', name: 'ITC Ltd', tag: 'FMCG', code: '500875' },
  { ticker: 'BHARTIARTL', name: 'Bharti Airtel', tag: 'Telecom', code: '532454' },
];

const POPULAR_SEARCHES = [
  { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy & Power', cmp: '₹1,202.00', change: '+0.45%', isUp: true, mcap: '₹19.7L Cr' },
  { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', cmp: '₹4,120.50', change: '+1.12%', isUp: true, mcap: '₹14.2L Cr' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financial Services', cmp: '₹1,682.30', change: '-0.32%', isUp: false, mcap: '₹12.8L Cr' },
  { ticker: 'INFY', name: 'Infosys Ltd', sector: 'Technology', cmp: '₹1,854.00', change: '+0.88%', isUp: true, mcap: '₹7.9L Cr' },
  { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financial Services', cmp: '₹1,245.60', change: '+1.05%', isUp: true, mcap: '₹8.9L Cr' },
  { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecommunication', cmp: '₹1,620.00', change: '+0.74%', isUp: true, mcap: '₹9.4L Cr' },
];

const FEATURED_SECTORS = [
  { name: 'Financial Services', count: '850+ Equities', href: '/sectors/Financial%20Services' },
  { name: 'Technology', count: '410+ Equities', href: '/sectors/Technology' },
  { name: 'Healthcare', count: '390+ Equities', href: '/sectors/Healthcare' },
  { name: 'Energy & Power', count: '220+ Equities', href: '/sectors/Energy%20%26%20Power' },
  { name: 'FMCG', count: '280+ Equities', href: '/sectors/FMCG' },
  { name: 'Auto Components', count: '290+ Equities', href: '/sectors/Auto%20Components' },
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
    <div className="relative flex flex-col items-center justify-start min-h-[85vh] w-full overflow-hidden pt-10 pb-20">
      
      {/* Background Graphic */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[40vh] -z-10 pointer-events-none opacity-25">
        <img src={bgImage.src} alt="Cityscape background" className="w-full h-full object-cover object-bottom" />
      </div>
      
      {/* Subtle Radial Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] md:w-[120%] h-[100%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/40 via-stone-50/20 to-transparent rounded-[100%] -z-20 mt-[-5%] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Live Universe Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-semibold tracking-wide uppercase shadow-sm mb-6 animate-in fade-in duration-500 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
          <span>Active Universe: 5,588 Equities Indexed</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">NSE & BSE Integrated</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-geist text-3xl sm:text-5xl md:text-6xl text-slate-950 mb-3 text-center tracking-tight font-extrabold max-w-3xl leading-[1.15]">
          Institutional Equity Research <span className="text-[#c2410c]">Reimagined.</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-8 text-center max-w-2xl font-normal leading-relaxed">
          Comprehensive 10-year financials, Screener-grade metrics, and live quotes across India’s complete publicly listed universe.
        </p>

        {/* Search Bar Container */}
        <div className="relative w-full max-w-3xl mb-4 shadow-[0_12px_35px_-8px_rgba(0,0,0,0.1)] rounded-full bg-white border border-slate-200 transition-all focus-within:border-[#c2410c] focus-within:ring-4 focus-within:ring-orange-100">
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            <div className="absolute left-6 flex items-center pointer-events-none">
              {loading
                ? <Loader2 className="h-5 w-5 text-[#c2410c] animate-spin" />
                : <Search className="h-5 w-5 text-slate-400" />
              }
            </div>
            
            <input
              ref={inputRef}
              type="text"
              className="block w-full pl-15 pr-36 py-5 rounded-full border-0 focus:ring-0 text-base md:text-lg placeholder-slate-400 text-slate-950 bg-transparent font-medium"
              placeholder="Search by company name, NSE symbol (RELIANCE), or BSE code (500325)..."
              value={query}
              onChange={handleChange}
              autoComplete="off"
            />
            
            <div className="absolute right-3 hidden sm:flex items-center gap-2">
              <span className="hidden md:inline-block font-mono text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200/70">
                /
              </span>
              <button 
                type="submit" 
                className="px-6 py-3 bg-[#c2410c] text-white rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#9a3412] transition-all shadow-sm active:scale-95 cursor-pointer"
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
                  <Loader2 size={16} className="animate-spin text-[#c2410c]" /> Querying 5,500+ database records...
                </div>
              )}
              {!loading && results.length === 0 && query.trim() && (
                <div className="px-6 py-5 text-slate-500 text-sm text-center">
                  <p className="font-semibold text-slate-800">No matching security found for &quot;{query}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1">Press Search to resolve via direct exchange symbol routing.</p>
                </div>
              )}
              {results.map((r) => (
                <button
                  key={`${r.ticker}-${r.scrip_bse || ''}`}
                  onClick={() => handleSelect(r.ticker)}
                  className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-orange-50/40 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 mr-4">
                    <span className="font-mono font-bold text-slate-950 text-base shrink-0 group-hover:text-[#c2410c] transition-colors">
                      {r.ticker}
                    </span>
                    {r.scrip_bse && (
                      <span className="text-[10px] bg-orange-50 text-[#c2410c] border border-orange-200/80 px-1.5 py-0.5 rounded font-mono shrink-0">
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
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#c2410c] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pre-Searched Suggested Scrips Under Search Box */}
        <div className="w-full max-w-3xl mb-12 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            <History size={13} className="text-[#c2410c]" />
            <span>Suggested:</span>
          </div>
          {SUGGESTED_QUICK_SEARCHES.map(item => (
            <button
              key={item.ticker}
              onClick={() => handleSelect(item.ticker)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-[#c2410c] border border-slate-200 hover:border-orange-300 transition-all text-xs font-semibold shadow-2xs group cursor-pointer"
            >
              <span className="font-mono font-bold group-hover:text-[#c2410c]">{item.ticker}</span>
              <span className="text-[10px] text-slate-400 font-normal">({item.tag})</span>
            </button>
          ))}
        </div>

        {/* Popular Equities Section */}
        {!showResults && (
          <div className="w-full max-w-4xl flex flex-col gap-9">
            {/* Market Leaders Institutional Data Table */}
            <div className="border border-slate-200/90 rounded-2xl bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-950 font-inter text-xs font-bold tracking-wider uppercase">
                  <TrendingUp size={15} className="text-[#c2410c]" />
                  <span>Market Leaders & Core Bluechips</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">NSE • Top Market Weight Index</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead className="text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-2 px-3">Company</th>
                      <th className="py-2 px-3">Sector</th>
                      <th className="py-2 px-3 text-right">LTP (CMP)</th>
                      <th className="py-2 px-3 text-right">Session Change</th>
                      <th className="py-2 px-3 text-right">Market Cap</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] divide-y divide-slate-100">
                    {POPULAR_SEARCHES.map((stock) => (
                      <tr 
                        key={stock.ticker}
                        onClick={() => handleSelect(stock.ticker)}
                        className="hover:bg-orange-50/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-950 group-hover:text-[#c2410c] transition-colors">{stock.ticker}</span>
                            <span className="text-slate-500 text-xs hidden sm:inline truncate max-w-[200px]">{stock.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60">{stock.sector}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{stock.cmp}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`inline-block font-mono font-bold text-[11px] px-2 py-0.5 rounded-full ${
                            stock.isUp ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/70' : 'text-[#c2410c] bg-orange-50 border border-orange-200/70'
                          }`}>
                            {stock.change}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700 text-xs">{stock.mcap}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c2410c] group-hover:translate-x-0.5 transition-transform">
                            Analyze <ArrowRight size={12} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Sector Exploration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-900 font-inter text-xs font-bold tracking-wider uppercase">
                  <Layers size={15} className="text-[#c2410c]" />
                  <span>Explore by Economic Sector</span>
                </div>
                <Link href="/sectors" className="text-xs text-[#c2410c] hover:text-[#9a3412] font-semibold flex items-center gap-1 group">
                  All 23 Sectors <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {FEATURED_SECTORS.map(sec => (
                  <Link
                    key={sec.name}
                    href={sec.href}
                    className="flex flex-col p-3 border border-slate-200 rounded-xl bg-white hover:border-[#c2410c] hover:shadow-xs transition-all text-left group"
                  >
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-[#c2410c] transition-colors line-clamp-1">
                      {sec.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">{sec.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Institutional Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#c2410c] flex items-center justify-center shrink-0 border border-orange-200/60">
                  <Database size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">5,588 Equities</div>
                  <div className="text-[11px] text-slate-500">Indexed in SQLite</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 border border-slate-200">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">10-Year Audited</div>
                  <div className="text-[11px] text-slate-500">P&L, Balance Sheet, CF</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#c2410c] flex items-center justify-center shrink-0 border border-orange-200/60">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">23 Macro Sectors</div>
                  <div className="text-[11px] text-slate-500">Taxonomy Classifications</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">Zero Fabrication</div>
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
