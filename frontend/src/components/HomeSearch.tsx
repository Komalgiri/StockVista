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
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { searchCompanies, type SearchResult } from '@/services/api';
import bgImage from '@/assets/serach_bg.png';

// Sector filter list for search bar dropdown
const SECTOR_OPTIONS = [
  { value: '', label: 'All Sectors (NSE & BSE)' },
  { value: 'Automobile', label: 'Automobile & Auto Parts' },
  { value: 'Financial Services', label: 'Financial Services & Banks' },
  { value: 'Technology', label: 'Technology & IT Services' },
  { value: 'Energy & Power', label: 'Energy, Oil & Power' },
  { value: 'FMCG', label: 'FMCG & Consumer Goods' },
  { value: 'Healthcare', label: 'Healthcare & Pharma' },
  { value: 'Infrastructure', label: 'Infrastructure & Capital Goods' },
  { value: 'Metals & Mining', label: 'Metals & Mining' },
  { value: 'Telecommunication', label: 'Telecommunication' },
];

// Top Indian companies for continuous auto-scrolling marquee carousel
const CAROUSEL_COMPANIES = [
  { ticker: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', logo: '/logos/tatamotors.png', cmp: '₹406.00', change: '+1.85%' },
  { ticker: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', logo: '/logos/reliance.png', cmp: '₹1,280.40', change: '+0.95%' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', logo: '/logos/hdfcbank.png', cmp: '₹1,745.20', change: '+0.60%' },
  { ticker: 'TCS', name: 'TCS', sector: 'IT Services', logo: '/logos/tcs.png', cmp: '₹3,890.00', change: '+1.20%' },
  { ticker: 'INFY', name: 'Infosys', sector: 'IT Services', logo: '/logos/infy.png', cmp: '₹1,620.50', change: '+0.80%' },
  { ticker: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', logo: '/logos/icicibank.png', cmp: '₹1,260.00', change: '+1.15%' },
  { ticker: 'ITC', name: 'ITC Ltd', sector: 'FMCG', logo: '/logos/itc.png', cmp: '₹480.20', change: '+0.45%' },
  { ticker: 'LT', name: 'Larsen & Toubro', sector: 'Infra', logo: '/logos/lt.png', cmp: '₹3,450.00', change: '+0.90%' },
  { ticker: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', logo: '/logos/bhartiartl.png', cmp: '₹1,710.00', change: '+1.40%' },
  { ticker: 'SBIN', name: 'State Bank of India', sector: 'Banking', logo: '/logos/sbin.png', cmp: '₹810.00', change: '+0.75%' },
  { ticker: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', logo: '/logos/hindunilvr.png', cmp: '₹2,380.00', change: '+0.30%' },
  { ticker: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', logo: '/logos/maruti.png', cmp: '₹12,450.00', change: '+1.65%' },
  { ticker: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC', logo: '/logos/bajfinance.png', cmp: '₹6,920.00', change: '+1.05%' },
  { ticker: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Pharma', logo: '/logos/sunpharma.png', cmp: '₹1,890.00', change: '+0.85%' },
  { ticker: 'TITAN', name: 'Titan Company', sector: 'Consumer', logo: '/logos/titan.png', cmp: '₹3,410.00', change: '+0.50%' },
  { ticker: 'WIPRO', name: 'Wipro', sector: 'IT Services', logo: '/logos/wipro.png', cmp: '₹530.00', change: '+0.65%' },
];

const CURATED_CARDS = [
  {
    ticker: 'TATAMOTORS',
    name: 'Tata Motors',
    desc: 'Commercial & passenger mobility solutions',
    sector: 'Automobile',
    cmp: '₹406.00',
    change: '+1.85%',
    isUp: true,
    mcap: '₹1.50L Cr',
    image: '/logos/tatamotors.png',
  },
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries',
    desc: 'Energy, digital services & retail conglomerate',
    sector: 'Energy & Power',
    cmp: '₹1,202.00',
    change: '+0.45%',
    isUp: true,
    mcap: '₹19.7L Cr',
    image: '/logos/reliance.png',
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank',
    desc: 'Private sector banking & financial services',
    sector: 'Financial Services',
    cmp: '₹1,682.30',
    change: '+0.75%',
    isUp: true,
    mcap: '₹12.8L Cr',
    image: '/logos/hdfcbank.png',
  },
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    desc: 'Global IT consulting, cloud & digital transformation',
    sector: 'Technology',
    cmp: '₹4,120.50',
    change: '+1.12%',
    isUp: true,
    mcap: '₹14.2L Cr',
    image: '/logos/tcs.png',
  }
];

const POPULAR_SEARCHES = [
  { ticker: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', cmp: '₹406.00', change: '+1.85%', isUp: true, mcap: '₹1.50L Cr' },
  { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy & Power', cmp: '₹1,202.00', change: '+0.45%', isUp: true, mcap: '₹19.7L Cr' },
  { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', cmp: '₹4,120.50', change: '+1.12%', isUp: true, mcap: '₹14.2L Cr' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financial Services', cmp: '₹1,682.30', change: '-0.32%', isUp: false, mcap: '₹12.8L Cr' },
  { ticker: 'INFY', name: 'Infosys Ltd', sector: 'Technology', cmp: '₹1,854.00', change: '+0.88%', isUp: true, mcap: '₹7.9L Cr' },
  { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financial Services', cmp: '₹1,245.60', change: '+1.05%', isUp: true, mcap: '₹8.9L Cr' },
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
  const [selectedSector, setSelectedSector] = useState('');
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const sectorDropdownRef = useRef<HTMLDivElement>(null);
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

  // Close sector dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
        setSectorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    } else if (selectedSector) {
      router.push(`/sectors/${encodeURIComponent(selectedSector)}`);
    }
  };

  const showResults = query.trim().length > 0;

  return (
    <div className="relative flex flex-col items-center justify-start min-h-[90vh] w-full overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-28">
      
      {/* Ethereal Wavy Gradient Ribbon Background (Top) */}
      <div className="absolute top-0 left-0 right-0 w-full h-[650px] -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[140%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-rose-50/20 to-transparent blur-3xl opacity-70" />
        <svg className="absolute w-full h-full opacity-35" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 200 C 300 400, 700 50, 1100 250 C 1300 350, 1500 200, 1600 300" stroke="url(#paint0_linear)" strokeWidth="1.5" />
          <path d="M-100 260 C 300 460, 700 110, 1100 310 C 1300 410, 1500 260, 1600 360" stroke="url(#paint0_linear)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100 320 C 300 520, 700 170, 1100 370 C 1300 470, 1500 320, 1600 420" stroke="url(#paint0_linear)" strokeWidth="0.8" opacity="0.6" />
          <defs>
            <linearGradient id="paint0_linear" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#c2410c" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Live Universe Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-normal mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>5,588 Listed Equities</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-mono text-[11px]">NSE &amp; BSE</span>
        </div>

        {/* Hero Title: Half Bold + Editorial Serif Accent */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-800 mb-3.5 text-center tracking-tight max-w-2xl leading-[1.25]">
          <span className="font-semibold text-slate-950">Find &amp; analyze India’s</span> <span className="font-normal text-slate-600">most</span> <span className="font-serif italic font-normal text-[#c2410c] tracking-normal">compelling equities.</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mb-8 text-center max-w-xl font-normal leading-relaxed">
          Financial metrics, annual disclosures, and ten-year balance sheets across listed Indian companies.
        </p>

        {/* Dual-Segment Floating Search Box Container - Increased Width & Breathing Room */}
        <div className="relative w-full max-w-3xl mb-12 sm:mb-14 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.08)] rounded-2xl bg-white border border-slate-200/90 transition-all focus-within:border-[#c2410c] focus-within:ring-4 focus-within:ring-orange-100">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center w-full p-1.5 sm:p-2">
            
            {/* Left Segment: Company / Keyword input */}
            <div className="relative flex items-center flex-1 w-full px-3 py-2 sm:py-2.5">
              <div className="text-slate-400 mr-3 shrink-0">
                {loading ? <Loader2 className="h-5 w-5 text-[#c2410c] animate-spin" /> : <Search className="h-5 w-5" />}
              </div>
              <input
                ref={inputRef}
                type="text"
                className="w-full border-0 focus:ring-0 p-0 text-base md:text-lg placeholder-slate-400 text-slate-950 bg-transparent font-medium"
                placeholder="Company, NSE symbol, or BSE code..."
                value={query}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {/* Vertical Hairline Divider */}
            <div className="hidden sm:block h-8 w-px bg-slate-200 mx-1" />

            {/* Right Segment: Custom Sleek Sector Dropdown */}
            <div ref={sectorDropdownRef} className="relative w-full sm:w-auto px-1 py-1 sm:py-0 border-t sm:border-t-0 border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200/80"
              >
                <Building2 className="h-4 w-4 text-[#c2410c] shrink-0" />
                <span className="truncate max-w-[150px] text-left">
                  {SECTOR_OPTIONS.find(s => s.value === selectedSector)?.label || 'All Sectors (NSE & BSE)'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ${sectorDropdownOpen ? 'rotate-180 text-[#c2410c]' : ''}`} />
              </button>

              {sectorDropdownOpen && (
                <div className="absolute right-0 sm:right-0 top-[calc(100%+8px)] w-72 bg-white/98 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Filter by Sector</span>
                    <span className="text-[9px] text-[#c2410c] font-mono font-bold">10 Sectors</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50 custom-scrollbar pr-1.5">
                    {SECTOR_OPTIONS.map((sec) => (
                      <button
                        key={sec.value}
                        type="button"
                        onClick={() => {
                          setSelectedSector(sec.value);
                          setSectorDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                          selectedSector === sec.value 
                            ? 'bg-orange-50 text-[#c2410c] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                        }`}
                      >
                        <span className="truncate mr-2">{sec.label}</span>
                        {selectedSector === sec.value && <Check size={14} className="text-[#c2410c] shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Submit Button */}
            <div className="w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
              <button 
                type="submit" 
                className="w-full sm:w-auto px-7 py-3.5 bg-[#c2410c] hover:bg-[#9a3412] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <span className="hidden md:inline-block font-mono text-[10px] bg-white/20 px-1.5 py-0.5 rounded">/</span>
              </button>
            </div>
          </form>

          {/* Premium Live Search Autocomplete Dropdown with Real Company Logos */}
          {showResults && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/98 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden divide-y divide-slate-100 max-h-[460px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150 pr-1">
              <div className="px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="font-bold text-slate-700">INDEX MATCHES ({results.length} securities)</span>
                <span className="text-[10px] text-slate-400">Click to analyze full metrics</span>
              </div>
              
              {loading && results.length === 0 && (
                <div className="px-6 py-8 text-slate-500 text-sm flex items-center justify-center gap-2.5">
                  <Loader2 size={18} className="animate-spin text-[#c2410c]" /> 
                  <span className="font-medium">Querying 5,588+ verified securities...</span>
                </div>
              )}
              
              {!loading && results.length === 0 && query.trim() && (
                <div className="px-6 py-8 text-slate-500 text-sm text-center">
                  <p className="font-bold text-slate-900 text-base">No matching security found for &quot;{query}&quot;</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Press Enter to resolve directly via stock symbol routing.</p>
                </div>
              )}
              
              {results.map((r) => {
                const logoPath = `/logos/${r.ticker.toLowerCase()}.png`;
                return (
                  <button
                    key={`${r.ticker}-${r.scrip_bse || ''}`}
                    onClick={() => handleSelect(r.ticker)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-orange-50/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 mr-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform p-1">
                        <img 
                          src={logoPath} 
                          alt={r.ticker} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.fallback-text')) {
                              const span = document.createElement('span');
                              span.className = 'fallback-text font-mono text-xs font-extrabold text-slate-700';
                              span.innerText = r.ticker.slice(0, 2);
                              parent.appendChild(span);
                            }
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-950 text-sm group-hover:text-[#c2410c] transition-colors">
                            {r.ticker}
                          </span>
                          {r.scrip_bse && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-mono">
                              BSE {r.scrip_bse}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-xs truncate font-medium">
                          {r.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] text-slate-400 font-sans hidden sm:inline px-2 py-0.5 rounded bg-slate-50 border border-slate-100">{r.sector}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold uppercase border border-slate-200/60">
                        {r.exchange}
                      </span>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-[#c2410c] group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Real Company Logos Continuous Auto-Scrolling Strip (Pure Logos Only) */}
        <div className="w-full max-w-5xl pt-2 pb-2 mb-16 sm:mb-20 relative overflow-hidden">
          {/* Scoped CSS for Guaranteed Infinite Marquee & Soft Scrollbar */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes sv_marquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-100%, 0, 0); }
            }
            .sv-marquee-track {
              display: flex !important;
              flex-shrink: 0 !important;
              align-items: center !important;
              white-space: nowrap !important;
              animation: sv_marquee 26s linear infinite !important;
              will-change: transform !important;
              pointer-events: auto !important;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px !important;
              height: 5px !important;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent !important;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #cbd5e1 !important;
              border-radius: 9999px !important;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #94a3b8 !important;
            }
            .custom-scrollbar {
              scrollbar-width: thin !important;
              scrollbar-color: #cbd5e1 transparent !important;
            }
          `}} />

          {/* Fade masks on left & right for smooth infinite flow */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-20 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 inset-y-0 w-20 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Auto-scrolling Dual-Track Pure Logos Row - Never Stops */}
          <div className="flex overflow-hidden select-none w-full">
            {/* Primary Track */}
            <div className="sv-marquee-track flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16">
              {CAROUSEL_COMPANIES.map((item, idx) => (
                <div
                  key={`primary-${item.ticker}-${idx}`}
                  onClick={() => handleSelect(item.ticker)}
                  title={`${item.name} (${item.ticker})`}
                  className="shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200 flex items-center justify-center p-1"
                >
                  <img 
                    src={item.logo} 
                    alt={item.name} 
                    className="h-8 sm:h-9 w-auto max-w-[120px] object-contain opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-200"
                  />
                </div>
              ))}
            </div>

            {/* Seamless Clone Track */}
            <div className="sv-marquee-track flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16" aria-hidden="true">
              {CAROUSEL_COMPANIES.map((item, idx) => (
                <div
                  key={`clone-${item.ticker}-${idx}`}
                  onClick={() => handleSelect(item.ticker)}
                  title={`${item.name} (${item.ticker})`}
                  className="shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200 flex items-center justify-center p-1"
                >
                  <img 
                    src={item.logo} 
                    alt={item.name} 
                    className="h-8 sm:h-9 w-auto max-w-[120px] object-contain opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curated Market Leaders Section in 2-Grid Format */}
        {!showResults && (
          <div className="w-full max-w-5xl flex flex-col gap-8">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h2 className="text-base sm:text-lg font-medium text-slate-900 tracking-tight">
                    Popular Equities &amp; Market Leaders
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Actively tracked companies with complete historical financials</p>
                </div>
                <Link 
                  href="/coverage" 
                  className="text-xs font-medium text-[#c2410c] hover:text-[#9a3412] inline-flex items-center gap-1 group transition-colors"
                >
                  View all 5,588+ <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 4 Cards in 2-Grid Form with Logo as Main Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CURATED_CARDS.map(card => (
                  <div
                    key={card.ticker}
                    onClick={() => handleSelect(card.ticker)}
                    className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer group gap-4 sm:gap-5"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
                      {/* Hero / Main Highlight: Large Brand Logo Showcase Tile */}
                      <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-slate-50/90 border border-slate-200/70 p-2.5 sm:p-3 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-orange-50/30 group-hover:border-orange-300/80 transition-all duration-200">
                        <img 
                          src={card.image} 
                          alt={card.name} 
                          className="w-full h-full object-contain drop-shadow-2xs" 
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-slate-900 text-sm sm:text-base truncate group-hover:text-[#c2410c] transition-colors">
                          {card.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-normal">
                          <span className="font-mono text-slate-400 text-[11px]">{card.ticker}</span>
                          <span className="text-slate-300">•</span>
                          <span className="truncate">{card.sector}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-1.5 font-normal">
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-center">
                      <div className="font-mono text-base sm:text-lg font-medium text-slate-900 tabular-nums">
                        {card.cmp}
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className={`font-mono text-[11px] font-medium px-2 py-0.5 rounded ${
                          card.isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {card.change}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10.5px] mt-1 hidden sm:inline-block font-normal">
                        MCap {card.mcap}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Leaders Institutional Data Table */}
            <div className="border border-slate-200/80 rounded-2xl bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 text-xs font-medium">
                  <TrendingUp size={15} className="text-[#c2410c]" />
                  <span>Market Leaders &amp; Benchmark Equities</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">NSE • Key Market Weight Index</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead className="text-[10.5px] uppercase tracking-wider font-medium text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-2 px-3 font-medium">Company</th>
                      <th className="py-2 px-3 font-medium">Sector</th>
                      <th className="py-2 px-3 text-right font-medium">LTP (CMP)</th>
                      <th className="py-2 px-3 text-right font-medium">Session Change</th>
                      <th className="py-2 px-3 text-right font-medium">Market Cap</th>
                      <th className="py-2 px-3 text-right font-medium">Action</th>
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
                            <span className="font-mono font-medium text-slate-900 group-hover:text-[#c2410c] transition-colors">{stock.ticker}</span>
                            <span className="text-slate-500 text-xs hidden sm:inline truncate max-w-[200px]">{stock.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/60">{stock.sector}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900">{stock.cmp}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`inline-block font-mono font-medium text-[11px] px-2 py-0.5 rounded ${
                            stock.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-[#c2410c] bg-orange-50'
                          }`}>
                            {stock.change}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 text-xs">{stock.mcap}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#c2410c] group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight size={12} />
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
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 text-slate-800 text-xs font-medium">
                  <Layers size={15} className="text-[#c2410c]" />
                  <span>Explore by Sector</span>
                </div>
                <Link href="/sectors" className="text-xs text-[#c2410c] hover:text-[#9a3412] font-medium flex items-center gap-1 group">
                  All 23 Sectors <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {FEATURED_SECTORS.map(sec => (
                  <Link
                    key={sec.name}
                    href={sec.href}
                    className="flex flex-col p-3 border border-slate-200/80 rounded-xl bg-white hover:border-slate-300 hover:shadow-2xs transition-all text-left group"
                  >
                    <span className="text-xs font-medium text-slate-800 group-hover:text-[#c2410c] transition-colors line-clamp-1">
                      {sec.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">{sec.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Institutional Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#c2410c] flex items-center justify-center shrink-0 border border-orange-200/50">
                  <Database size={16} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">5,588 Equities</div>
                  <div className="text-[11px] text-slate-400">Indexed Universe</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                  <BarChart3 size={16} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">10-Year Audited</div>
                  <div className="text-[11px] text-slate-400">Financial statements</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#c2410c] flex items-center justify-center shrink-0 border border-orange-200/50">
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">23 Macro Sectors</div>
                  <div className="text-[11px] text-slate-400">Industry taxonomy</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/50">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-900">Verified Disclosures</div>
                  <div className="text-[11px] text-slate-400">Exchange audited data</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Ethereal Wavy Gradient Ribbon in Light Rust Orange */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[380px] -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-[25%] left-1/2 -translate-x-1/2 w-[130%] h-[120%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-100/35 via-amber-50/15 to-transparent blur-3xl opacity-60" />
        <svg className="absolute bottom-0 w-full h-full opacity-35" viewBox="0 0 1440 380" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 240 C 250 140, 650 340, 1050 180 C 1250 100, 1450 260, 1600 200" stroke="url(#paint_bottom_rust)" strokeWidth="1.5" />
          <path d="M-100 280 C 250 180, 650 380, 1050 220 C 1250 140, 1450 300, 1600 240" stroke="url(#paint_bottom_rust)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100 320 C 250 220, 650 420, 1050 260 C 1250 180, 1450 340, 1600 280" stroke="url(#paint_bottom_rust)" strokeWidth="0.8" opacity="0.6" />
          <defs>
            <linearGradient id="paint_bottom_rust" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop stopColor="#c2410c" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.04" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
