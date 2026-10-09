

export function Shareholding() {
  const data = [
    { category: 'Promoters', percentage: 50.3, color: '#2563EB' },
    { category: 'Foreign Inst. (FII)', percentage: 22.4, color: '#3B82F6' },
    { category: 'Domestic Inst. (DII)', percentage: 16.4, color: '#60A5FA' },
    { category: 'Mutual Funds', percentage: 6.8, color: '#93C5FD' },
    { category: 'Public & Others', percentage: 4.1, color: '#CBD5E1' },
  ];

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Ownership Distribution</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Shareholding Pattern</h2>
        </div>
        <span className="text-[10px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border-hairline font-mono">Q4 FY24</span>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="relative w-32 h-32 flex-shrink-0">
          {/* Simulate Donut Chart */}
          <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#2563EB 0% 50.3%, #3B82F6 50.3% 72.7%, #60A5FA 72.7% 89.1%, #93C5FD 89.1% 95.9%, #CBD5E1 95.9% 100%)` }}></div>
          <div className="absolute inset-3 bg-surface-canvas rounded-full flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-text-tertiary mb-0.5">Promoters</span>
            <span className="font-geist text-xl font-bold text-primary">50.3%</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5 text-[12px] font-inter">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: item.color }}></span>
                <span className="text-text-secondary font-medium">{item.category}</span>
              </div>
              <span className="text-text-primary font-semibold tabular-nums">{item.percentage.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-border-hairline flex justify-between items-center">
        <span className="text-[11px] font-medium text-text-secondary">4 Quarter Trajectory</span>
        <span className="text-[11px] font-semibold text-market-positive bg-market-positive-subtle px-2 py-0.5 rounded flex items-center gap-1">
          <ArrowUpRightIcon size={12} strokeWidth={3} /> Steady / Minor FII Accumulation
        </span>
      </div>
    </div>
  );
}

function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  );
}
