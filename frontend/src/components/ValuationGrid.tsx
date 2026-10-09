export function ValuationGrid({ peRatio, pbRatio, dividendYield }: { peRatio: number; pbRatio: number; dividendYield: number }) {
  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Key Multiples</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Valuation & Capital Efficiency</h2>
        </div>
        <span className="text-[10px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border-hairline font-mono">TTM (Standalone & Cons.)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
        <ValuationItem title="P/E RATIO" value={peRatio.toFixed(1)} sub="Ind. PE 24.1" />
        <ValuationItem title="PRICE TO BOOK" value={pbRatio.toFixed(2)} sub="Premium 2.2x" />
        <ValuationItem title="RETURN ON EQUITY" value="9.8%" sub="3Yr Avg 9.4%" />
        <ValuationItem title="ROCE" value="10.4%" sub="+40bps YoY" />
        <ValuationItem title="RETURN ON ASSETS" value="4.9%" sub="Asset Base ₹15.5L Cr" />
        <ValuationItem title="EV / EBITDA" value="13.8x" sub="Sector 12.2x" />
        <ValuationItem title="DIVIDEND YIELD" value={`${dividendYield.toFixed(2)}%`} sub="₹10.0 / share" />
        <ValuationItem title="DEBT TO EQUITY" value="0.38" sub="Comfortable" />
      </div>
    </div>
  );
}

function ValuationItem({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col border-l-2 border-border-hairline pl-3 pb-1">
      <span className="text-[10px] font-semibold text-text-tertiary tracking-wider mb-1 uppercase">{title}</span>
      <span className="font-geist text-[22px] font-bold text-text-primary tabular-nums leading-none mb-1.5">{value}</span>
      <span className="text-[11px] text-text-secondary">{sub}</span>
    </div>
  );
}
