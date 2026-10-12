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

  const displayMarketCap = marketCap || getVal('Market Cap', 'N/A');
  const displayCurrentPrice = currentPrice ? `₹${currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : getVal('Current Price', 'N/A');
  
  const highLowStr = weekHigh52 && weekLow52 
    ? `₹${weekHigh52.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹${weekLow52.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    : getVal('High / Low', 'N/A');

  const displayPE = peRatio && peRatio > 0 ? peRatio.toFixed(1) : getVal('Stock P/E', 'N/A');
  const displayBookValue = bookValue && bookValue > 0 ? `₹${bookValue.toFixed(1)}` : (getVal('Book Value', '') ? `₹${getVal('Book Value', '')}` : 'N/A');
  const displayDivYield = dividendYield || (getVal('Dividend Yield', '') ? `${getVal('Dividend Yield', '')} %` : 'N/A');
  const displayROCE = roce || (getVal('ROCE', '') ? `${getVal('ROCE', '')} %` : 'N/A');
  const displayROE = roe || (getVal('ROE', '') ? `${getVal('ROE', '')} %` : 'N/A');
  const displayFaceValue = faceValue && faceValue > 0 ? `₹${faceValue.toFixed(1)}` : (getVal('Face Value', '') ? `₹${getVal('Face Value', '')}` : 'N/A');

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 py-5 border-y border-border-hairline mb-5 bg-surface-canvas/50 px-3 rounded-lg">
      <MetricItem label="Market Cap" value={displayMarketCap} />
      <MetricItem label="Current Price" value={displayCurrentPrice} isPrimary />
      <MetricItem label="High / Low" value={highLowStr} />
      <MetricItem label="Stock P/E" value={displayPE} />
      <MetricItem label="Book Value" value={displayBookValue} />
      <MetricItem label="Div Yield" value={displayDivYield} />
      <MetricItem label="ROCE" value={displayROCE} />
      <MetricItem label="ROE" value={displayROE} />
      <MetricItem label="Face Value" value={displayFaceValue} />
    </div>
  );
}

function MetricItem({ label, value, isPrimary = false }: { label: string; value: string; isPrimary?: boolean }) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold mb-1 truncate">{label}</span>
      <span className={`font-geist text-[14px] md:text-[15px] font-semibold tabular-nums truncate ${isPrimary ? 'text-primary' : 'text-text-primary'}`} title={value}>
        {value}
      </span>
    </div>
  );
}

