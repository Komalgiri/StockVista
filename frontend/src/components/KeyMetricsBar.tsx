import { Activity } from 'lucide-react';

interface KeyMetricsProps {
  marketCap?: string;
  currentPrice?: number;
  peRatio?: number;
  weekHigh52?: number;
  weekLow52?: number;
  bookValue?: number;
  faceValue?: number;
  dividendYield?: string;
  roce?: string;
  roe?: string;
  ratios?: Record<string, string> | null;
}

export function KeyMetricsBar({ 
  marketCap, 
  currentPrice,
  peRatio, 
  weekHigh52, 
  weekLow52, 
  bookValue, 
  faceValue,
  dividendYield,
  roce,
  roe,
  ratios 
}: KeyMetricsProps) {
  // Extract from ratios dictionary if available
  const getVal = (key: string, fallback: string) => {
    if (ratios && ratios[key]) {
      return ratios[key].replace(/\s+/g, ' ').trim();
    }
    return fallback;
  };

  const displayMarketCap = marketCap || getVal('Market Cap', '—');
  const displayCurrentPrice = currentPrice ? `₹${currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : getVal('Current Price', '—');
  
  const highLowStr = weekHigh52 && weekLow52 
    ? `₹${weekHigh52.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹${weekLow52.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    : getVal('High / Low', '—');

  const displayPE = peRatio && peRatio > 0 ? peRatio.toFixed(1) : getVal('Stock P/E', '—');
  const displayBookValue = bookValue && bookValue > 0 ? `₹${bookValue.toFixed(1)}` : (getVal('Book Value', '') ? `₹${getVal('Book Value', '')}` : '—');
  const displayDivYield = dividendYield || (getVal('Dividend Yield', '') ? `${getVal('Dividend Yield', '')} %` : '—');
  const displayROCE = roce || (getVal('ROCE', '') ? `${getVal('ROCE', '')} %` : '—');
  const displayROE = roe || (getVal('ROE', '') ? `${getVal('ROE', '')} %` : '—');
  const displayFaceValue = faceValue && faceValue > 0 ? `₹${faceValue.toFixed(1)}` : (getVal('Face Value', '') ? `₹${getVal('Face Value', '')}` : '—');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs my-5">
      {/* Light Background Graphics & Geometric Mesh */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <svg className="w-full h-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="metrics-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#09090b" strokeWidth="0.8" />
              <circle cx="36" cy="36" r="1.2" fill="#c2410c" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#metrics-grid)" />
        </svg>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-100/40 via-amber-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-orange-50 text-[#c2410c] border border-orange-200/80">
              <Activity size={13} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-inter">Key Valuation &amp; Performance Multiples</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Audited TTM &amp; Exchange Trading Feed</span>
        </div>

        {/* 2-Tier Structured Grid Layout */}
        <div className="flex flex-col gap-4">
          {/* Grid 1: Market Valuation & Price Band (5 Columns) */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-inter">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
              <span>Market Valuation &amp; Price Band</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              <MetricItem label="Market Cap" value={displayMarketCap} hint="Total Equity" />
              <MetricItem label="Current Price" value={displayCurrentPrice} isPrimary hint="LTP" />
              <MetricItem label="52W High / Low" value={highLowStr} hint="Annual Range" />
              <MetricItem label="Stock P/E" value={displayPE} hint="Trailing Multiple" />
              <MetricItem label="Face Value" value={displayFaceValue} hint="Nominal" />
            </div>
          </div>

          {/* Grid 2: Capital Efficiency, Quality & Yield (4 Columns) */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-inter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Capital Efficiency &amp; Return Metrics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <MetricItem label="ROCE" value={displayROCE} isGreen hint="EBIT / Capital" />
              <MetricItem label="ROE" value={displayROE} isGreen hint="Net Return" />
              <MetricItem label="Book Value" value={displayBookValue} hint="Per Share" />
              <MetricItem label="Dividend Yield" value={displayDivYield} hint="Annual Return" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({ 
  label, 
  value, 
  isPrimary = false,
  isGreen = false,
  hint
}: { 
  label: string; 
  value: string; 
  isPrimary?: boolean;
  isGreen?: boolean;
  hint?: string;
}) {
  return (
    <div className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all min-w-0 ${
      isPrimary 
        ? 'bg-orange-50/70 border-orange-200/90 shadow-2xs hover:border-orange-300' 
        : isGreen
        ? 'bg-emerald-50/30 border-emerald-200/60 hover:border-emerald-300 shadow-2xs'
        : 'bg-white/90 backdrop-blur-xs border-slate-200/80 hover:border-slate-300 shadow-2xs'
    }`}>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold truncate font-inter">{label}</span>
      </div>
      <div className={`font-mono text-[15px] sm:text-[16px] font-extrabold tabular-nums truncate tracking-tight ${
        isPrimary ? 'text-[#c2410c]' : isGreen ? 'text-emerald-700' : 'text-slate-950'
      }`} title={value}>
        {value}
      </div>
      {hint && (
        <span className="text-[9.5px] text-slate-400 font-sans mt-0.5 truncate font-medium">{hint}</span>
      )}
    </div>
  );
}

