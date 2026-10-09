interface KeyMetricsProps {
  peRatio: number;
  pbRatio: number;
  dividendYield: number;
  marketCap: string;
}

export function KeyMetrics({ peRatio, pbRatio, dividendYield, marketCap }: KeyMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="Market Cap" value={marketCap} />
      <MetricCard title="P/E Ratio" value={peRatio.toFixed(2)} />
      <MetricCard title="P/B Ratio" value={pbRatio.toFixed(2)} />
      <MetricCard title="Div Yield" value={`${dividendYield.toFixed(2)}%`} />
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-border-hairline rounded-md bg-surface-canvas p-4 flex flex-col justify-between transition-shadow hover:shadow-sm">
      <div className="text-text-secondary text-[11px] font-inter uppercase tracking-[0.04em] font-semibold mb-2">{title}</div>
      <div className="font-geist text-2xl font-bold text-text-primary tracking-tighter">{value}</div>
    </div>
  );
}
