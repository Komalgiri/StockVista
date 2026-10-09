interface KeyMetricsProps {
  marketCap: string;
  peRatio: number;
  weekHigh52: number;
  weekLow52: number;
  bookValue?: number;
  faceValue?: number;
}

export function KeyMetricsBar({ marketCap, peRatio, weekHigh52, weekLow52, bookValue = 1142.10, faceValue = 10.0 }: KeyMetricsProps) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-x-12 gap-y-6 py-6 border-b border-border-hairline mb-4">
      <MetricItem label="Market Cap" value={marketCap} />
      <MetricItem label="Stock P/E" value={peRatio.toFixed(1)} />
      <MetricItem label="52W High" value={`₹${weekHigh52.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
      <MetricItem label="52W Low" value={`₹${weekLow52.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
      <MetricItem label="Book Value" value={`₹${bookValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
      <MetricItem label="Face Value" value={`₹${faceValue.toFixed(1)}`} />
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-text-tertiary uppercase tracking-widest font-semibold mb-1">{label}</span>
      <span className="font-geist text-[16px] font-semibold text-text-primary tabular-nums">{value}</span>
    </div>
  );
}
