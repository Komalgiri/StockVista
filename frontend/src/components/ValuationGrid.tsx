export function ValuationGrid({ ratios }: { ratios: Record<string, string> | null }) {
  if (!ratios || Object.keys(ratios).length === 0) {
    return <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex items-center justify-center text-text-secondary">Valuation ratios unavailable.</div>;
  }

  const parseVal = (key: string, fallback: string = 'N/A') => ratios[key] || fallback;

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Key Multiples</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Valuation & Capital Efficiency</h2>
        </div>
        <span className="text-[10px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border-hairline font-mono">TTM</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
        <ValuationItem title="P/E RATIO" value={parseVal('Stock P/E')} sub={`Ind. PE ${parseVal('Industry PE')}`} />
        <ValuationItem title="PRICE TO BOOK" value={parseVal('Price to book value')} sub="TTM" />
        <ValuationItem title="RETURN ON EQUITY" value={`${parseVal('ROE')} %`} sub="Trailing 12M" />
        <ValuationItem title="ROCE" value={`${parseVal('ROCE')} %`} sub="Capital Emp." />
        <ValuationItem title="FACE VALUE" value={`₹${parseVal('Face Value')}`} sub="Per Share" />
        <ValuationItem title="EV / EBITDA" value={parseVal('EV / EBITDA')} sub="TTM" />
        <ValuationItem title="DIVIDEND YIELD" value={`${parseVal('Dividend Yield')} %`} sub="Annualized" />
        <ValuationItem title="DEBT TO EQUITY" value={parseVal('Debt to equity')} sub="Leverage" />
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
