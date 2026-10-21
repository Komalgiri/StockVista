import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Plus, Download, Bell, ExternalLink, Globe } from 'lucide-react';
import { RefreshButton } from './RefreshButton';

interface CompanyHeaderProps {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  prevClose: number;
  industry?: string;
  description?: string;
  website?: string | null;
  bseCode?: string | null;
  bseUrl?: string | null;
  nseUrl?: string | null;
}

export function CompanyHeader({ 
  name, 
  ticker, 
  exchange, 
  sector, 
  currentPrice, 
  dayChange, 
  dayChangePercent, 
  volume, 
  prevClose, 
  industry, 
  description,
  website,
  bseCode,
  bseUrl,
  nseUrl
}: CompanyHeaderProps) {
  const isPositive = dayChange >= 0;
  
  return (
    <div className="flex flex-col gap-4 py-4 border-b border-border-hairline">
      {/* Breadcrumbs and Live Tag */}
      <div className="flex justify-between items-center text-[11px] font-inter">
        <div className="flex gap-2 text-text-secondary font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Equities</Link>
          <span>/</span>
          <Link href={`/sectors/${encodeURIComponent(sector)}`} className="hover:text-primary transition-colors">{sector}</Link>
          <span>/</span>
          <span className="text-text-primary font-semibold">{ticker}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-market-positive bg-market-positive-subtle px-2 py-0.5 rounded font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-market-positive animate-pulse"></span>
            Live Data Feed
          </span>
          <span className="text-text-secondary hidden sm:inline">NSE / BSE Integrated</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left Side: Title, Tags, Description, Buttons */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <h1 className="font-geist text-2xl md:text-[28px] font-bold text-text-primary tracking-tight leading-none">{name}</h1>
            <div className="flex gap-1.5 flex-wrap items-center">
              <a 
                href={nseUrl || `https://www.nseindia.com/get-quotes/equity?symbol=${ticker}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#c2410c] border border-orange-200/80 hover:bg-orange-100 transition-colors inline-flex items-center gap-1"
              >
                NSE: {ticker} <ExternalLink size={10} />
              </a>
              {bseCode && (
                <a 
                  href={bseUrl || `https://www.bseindia.com/stock-share-price/equity/equity/${bseCode}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 hover:text-slate-950 transition-colors inline-flex items-center gap-1"
                >
                  BSE: {bseCode} <ExternalLink size={10} />
                </a>
              )}
              {website && (
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 hover:text-[#c2410c] transition-colors inline-flex items-center gap-1"
                  title="Official Website"
                >
                  <Globe size={11} /> Website
                </a>
              )}
            </div>
          </div>
          
          <div className="text-[12px] text-text-secondary font-medium mb-3 flex items-center gap-1.5">
            <span className="text-[#c2410c] font-bold">🏢 {sector}</span>
            <span className="text-text-tertiary">&gt;</span>
            <span className="text-slate-700">{industry || 'Commercial Enterprise'}</span>
          </div>

          <p className="text-[13px] text-text-secondary leading-relaxed mb-4 max-w-3xl line-clamp-3" title={description}>
            {description || `${name} is an active Indian security listed on the National Stock Exchange (NSE).`}
          </p>

          <div className="flex flex-wrap gap-2 text-[12px] font-semibold items-center">
            <button className="flex items-center gap-1.5 bg-[#c2410c] text-white px-3.5 py-1.5 rounded-lg hover:bg-[#9a3412] transition-colors shadow-xs cursor-pointer">
              <Plus size={14} /> Add to Watchlist
            </button>
            <RefreshButton ticker={ticker} />
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <Download size={14} /> Export Overview
            </button>
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <Bell size={14} /> Set Alert
            </button>
          </div>
        </div>
        
        {/* Right Side: Price */}
        <div className="flex flex-col md:items-end bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs min-w-[240px]">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span>Last Traded Price</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="font-mono text-3xl md:text-[36px] font-extrabold text-slate-900 tabular-nums tracking-tight leading-none mb-2">
            ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono font-bold text-[13px] tabular-nums ${
            isPositive 
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/70' 
              : 'text-rose-700 bg-rose-50 border border-rose-200/70'
          }`}>
            {isPositive ? <ArrowUpRight size={15} strokeWidth={2.5} /> : <ArrowDownRight size={15} strokeWidth={2.5} />}
            <span>{isPositive ? '+' : '-'}{Math.abs(dayChange).toFixed(2)} ({Math.abs(dayChangePercent).toFixed(2)}%)</span>
          </div>
          
          <div className="flex justify-between w-full mt-4 pt-3 border-t border-slate-100 text-[11px]">
            <div>
              <div className="text-slate-400 font-medium mb-0.5">Prev. Close</div>
              <div className="font-mono font-bold text-slate-800 tabular-nums">₹{prevClose.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 font-medium mb-0.5">Day Volume</div>
              <div className="font-mono font-bold text-slate-800 tabular-nums">{(volume / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

