import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Plus, Download, Bell, ExternalLink, Globe } from 'lucide-react';

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
                className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container text-primary border border-primary-fixed hover:bg-primary/10 transition-colors inline-flex items-center gap-1"
              >
                NSE: {ticker} <ExternalLink size={10} />
              </a>
              {bseCode && (
                <a 
                  href={bseUrl || `https://www.bseindia.com/stock-share-price/equity/equity/${bseCode}/`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-subtle text-text-secondary border border-border-hairline hover:text-text-primary transition-colors inline-flex items-center gap-1"
                >
                  BSE: {bseCode} <ExternalLink size={10} />
                </a>
              )}
              {website && (
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-subtle text-primary border border-border-hairline hover:underline transition-colors inline-flex items-center gap-1"
                  title="Official Website"
                >
                  <Globe size={11} /> Website
                </a>
              )}
            </div>
          </div>
          
          <div className="text-[12px] text-text-secondary font-medium mb-3 flex items-center gap-1.5">
            <span className="text-primary font-semibold">🏢 {sector}</span>
            <span className="text-text-tertiary">&gt;</span>
            <span>{industry || 'Commercial Enterprise'}</span>
          </div>

          <p className="text-[13px] text-text-secondary leading-relaxed mb-4 max-w-3xl line-clamp-3" title={description}>
            {description || `${name} is an active Indian security listed on the National Stock Exchange (NSE).`}
          </p>

          <div className="flex flex-wrap gap-2 text-[12px] font-semibold">
            <button className="flex items-center gap-1.5 bg-primary text-on-primary px-3 py-1.5 rounded-md hover:bg-primary-container transition-colors shadow-xs">
              <Plus size={14} /> Add to Watchlist
            </button>
            <button className="flex items-center gap-1.5 bg-surface-canvas border border-border-strong text-text-primary px-3 py-1.5 rounded-md hover:bg-surface-subtle transition-colors">
              <Download size={14} /> Export Overview
            </button>
            <button className="flex items-center gap-1.5 bg-surface-canvas border border-border-strong text-text-primary px-3 py-1.5 rounded-md hover:bg-surface-subtle transition-colors">
              <Bell size={14} /> Set Alert
            </button>
          </div>
        </div>
        
        {/* Right Side: Price */}
        <div className="flex flex-col md:items-end bg-surface-subtle p-4 rounded-md border border-border-hairline min-w-[220px]">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest mb-1">Current Market Price</div>
          <div className="font-geist text-3xl md:text-[34px] font-bold text-text-primary tabular-nums tracking-tighter leading-none mb-1">
            ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center justify-end gap-1 font-inter font-bold text-[14px] tabular-nums ${isPositive ? 'text-market-positive' : 'text-market-negative'}`}>
            {isPositive ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
            <span>{isPositive ? '+' : '-'}{Math.abs(dayChange).toFixed(2)} ({Math.abs(dayChangePercent).toFixed(2)}%)</span>
          </div>
          
          <div className="flex justify-between w-full mt-4 pt-3 border-t border-border-hairline text-[11px]">
            <div>
              <div className="text-text-tertiary mb-0.5">Prev. Close</div>
              <div className="font-semibold text-text-primary tabular-nums">₹{prevClose.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="text-right">
              <div className="text-text-tertiary mb-0.5">Volume</div>
              <div className="font-semibold text-text-primary tabular-nums">{(volume / 1000000).toFixed(2)}M shares</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

