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
    name: 'Tata Motors Ltd',
    role: 'Commercial & Passenger Mobility',
    sector: 'Automobile',
    cmp: '₹406.00',
    change: '+1.85%',
    isUp: true,
    mcap: '₹1.50L Cr',
    image: '/logos/tatamotors.png',
    location: 'Mumbai • NSE & BSE Listed'
  },
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries',
    role: 'Energy, Retail & Digital Telecom',
    sector: 'Energy & Power',
    cmp: '₹1,202.00',
    change: '+0.45%',
    isUp: true,
    mcap: '₹19.7L Cr',
    image: '/logos/reliance.png',
    location: 'Mumbai • NSE & BSE Listed'
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    role: 'Private Banking & Credit Services',
    sector: 'Financial Services',
    cmp: '₹1,682.30',
    change: '+0.75%',
    isUp: true,
    mcap: '₹12.8L Cr',
    image: '/logos/hdfcbank.png',
    location: 'Mumbai • NSE & BSE Listed'
  },
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    role: 'Global IT Consulting & Cloud',
    sector: 'Technology',
    cmp: '₹4,120.50',
    change: '+1.12%',
    isUp: true,
    mcap: '₹14.2L Cr',
    image: '/logos/tcs.png',
    location: 'Mumbai • NSE & BSE Listed'
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
    <div className="relative flex flex-col items-center justify-start min-h-[90vh] w-full overflow-hidden pt-8 pb-20">
      
      {/* Ethereal Wavy Gradient Ribbon Background (Matching Reference) */}
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-semibold tracking-wide uppercase shadow-sm mb-5 animate-in fade-in duration-500 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
          <span>Active Universe: 5,588 Equities Indexed</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">NSE &amp; BSE Integrated</span>
        </div>

        {/* Hero Title Matching Reference Styling */}
        <h1 className="font-geist text-3xl sm:text-5xl md:text-6xl text-slate-950 mb-3.5 text-center tracking-tight font-extrabold max-w-3xl leading-[1.12]">
          Find &amp; Analyze India’s Most <span className="text-[#c2410c]">Compelling Equities.</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-8 text-center max-w-2xl font-normal leading-relaxed">
          StockVista is your institutional gateway to 5,588+ NSE &amp; BSE listed companies — with 10-year audited accounts, Screener-grade metrics, and verified exchange filings.
        </p>

        {/* Dual-Segment Floating Search Box Container - Increased Width */}
        <div className="relative w-full max-w-4xl mb-8 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] rounded-2xl bg-white border border-slate-200/90 transition-all focus-within:border-[#c2410c] focus-within:ring-4 focus-within:ring-orange-100">
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
        <div className="w-full max-w-5xl mb-12 relative overflow-hidden py-3">
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
                    className="h-9 sm:h-11 w-auto max-w-[130px] object-contain"
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
                    className="h-9 sm:h-11 w-auto max-w-[130px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curated Market Leaders Section in 2-Grid Format */}
        {!showResults && (
          <div className="w-full max-w-5xl flex flex-col gap-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-geist text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                    Most Recent Searches &amp; Leaders
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Core bluechip equities with verified 10-year audited financials</p>
                </div>
                <Link 
                  href="/coverage" 
                  className="text-xs font-bold text-[#c2410c] hover:text-[#9a3412] inline-flex items-center gap-1 group transition-colors"
                >
                  View all 5,588+ <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 4 Cards in 2-Grid Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CURATED_CARDS.map(card => (
                  <div
                    key={card.ticker}
                    onClick={() => handleSelect(card.ticker)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                        <img 
                          src={card.image} 
                          alt={card.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-sm font-bold text-slate-950 group-hover:text-[#c2410c] transition-colors">
                            {card.ticker}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-[#c2410c] border border-orange-200/80 font-bold shrink-0">
                            {card.sector}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-slate-950">
                          {card.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate font-medium">
                          {card.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                      <div className="font-mono font-extrabold text-base sm:text-lg text-slate-950 tabular-nums">
                        {card.cmp}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          {card.change}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{card.mcap}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Leaders Institutional Data Table */}
            <div className="border border-slate-200/90 rounded-2xl bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-950 font-inter text-xs font-bold tracking-wider uppercase">
                  <TrendingUp size={15} className="text-[#c2410c]" />
                  <span>Market Leaders &amp; Core Bluechips</span>
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
