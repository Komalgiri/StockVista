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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 my-4">
      <MetricItem label="Market Cap" value={displayMarketCap} hint="Total Equity" />
      <MetricItem label="Current Price" value={displayCurrentPrice} isPrimary hint="LTP" />
      <MetricItem label="52W High / Low" value={highLowStr} hint="Annual Range" />
      <MetricItem label="Stock P/E" value={displayPE} hint="Trailing Multiple" />
      <MetricItem label="Book Value" value={displayBookValue} hint="Per Share" />
      <MetricItem label="Dividend Yield" value={displayDivYield} hint="Annual Return" />
      <MetricItem label="ROCE" value={displayROCE} isAccent hint="EBIT / Capital" />
      <MetricItem label="ROE" value={displayROE} isAccent hint="Net Return" />
      <MetricItem label="Face Value" value={displayFaceValue} hint="Nominal" />
    </div>
  );
}

function MetricItem({ 
  label, 
  value, 
  isPrimary = false,
  isAccent = false,
  hint
}: { 
  label: string; 
  value: string; 
  isPrimary?: boolean;
  isAccent?: boolean;
  hint?: string;
}) {
  return (
    <div className={`flex flex-col justify-between p-3 rounded-xl border transition-all min-w-0 ${
      isPrimary 
        ? 'bg-blue-50/70 border-blue-200/80 shadow-xs' 
        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
    }`}>
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold truncate">{label}</span>
      </div>
      <div className={`font-mono text-[14px] md:text-[15px] font-bold tabular-nums truncate ${
        isPrimary ? 'text-blue-700' : isAccent ? 'text-slate-900 font-extrabold' : 'text-slate-900'
      }`} title={value}>
        {value}
      </div>
      {hint && (
        <span className="text-[9px] text-slate-400 font-sans mt-0.5 truncate">{hint}</span>
      )}
    </div>
  );
}

