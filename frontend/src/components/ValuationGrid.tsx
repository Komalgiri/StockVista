export function ValuationGrid({ ratios }: { ratios: Record<string, string> | null }) {
  if (!ratios || Object.keys(ratios).length === 0) {
    return (
      <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex items-center justify-center text-text-secondary">
        Valuation ratios unavailable.
      </div>
    );
  }

  const getClean = (key: string) => {
    const val = ratios[key];
    if (!val) return null;
    return val.replace(/\s+/g, ' ').trim();
  };

  // Derive Price to Book (P/B) if not directly provided
  let pbRatio = getClean('Price to book value');
  if (!pbRatio && ratios['Current Price'] && ratios['Book Value']) {
    const cp = parseFloat(ratios['Current Price'].replace(/[^0-9.-]+/g, ''));
    const bv = parseFloat(ratios['Book Value'].replace(/[^0-9.-]+/g, ''));
    if (!isNaN(cp) && !isNaN(bv) && bv > 0) {
      pbRatio = (cp / bv).toFixed(2);
    }
  }

  const peVal = getClean('Stock P/E') || '—';
  const roeVal = getClean('ROE') ? `${getClean('ROE')} %` : '—';
  const roceVal = getClean('ROCE') ? `${getClean('ROCE')} %` : '—';
  const divYieldVal = getClean('Dividend Yield') ? `${getClean('Dividend Yield')} %` : '—';
  const faceVal = getClean('Face Value') ? `₹${getClean('Face Value')}` : '—';
  const bookVal = getClean('Book Value') ? `₹${getClean('Book Value')}` : '—';
  const highLow = getClean('High / Low') || '—';
  const rawCap = getClean('Market Cap');
  const mCap = rawCap ? `₹${rawCap.replace(/₹/g, '').replace(/Cr\.?/gi, '').trim()} Cr` : '—';

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Key Multiples</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Valuation & Capital Efficiency</h2>
        </div>
        <span className="text-[10px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border-hairline font-mono">TTM Audited</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
        <ValuationItem title="P/E RATIO" value={peVal} sub="Price to Earnings (TTM)" />
        <ValuationItem title="PRICE TO BOOK" value={pbRatio || '—'} sub="Price / Book Value" />
        <ValuationItem title="RETURN ON EQUITY" value={roeVal} sub="ROE (Latest FY)" />
        <ValuationItem title="ROCE" value={roceVal} sub="Return on Capital Emp." />
        <ValuationItem title="BOOK VALUE" value={bookVal} sub="Net Asset Value / Share" />
        <ValuationItem title="DIVIDEND YIELD" value={divYieldVal} sub="Annualized Payout" />
        <ValuationItem title="FACE VALUE" value={faceVal} sub="Per Equity Share" />
        <ValuationItem title="52W RANGE" value={highLow} sub="High / Low Track" />
      </div>
    </div>
  );
}

function ValuationItem({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col border-l-2 border-primary/40 pl-3 pb-1">
      <span className="text-[10px] font-semibold text-text-tertiary tracking-wider mb-1 uppercase truncate">{title}</span>
      <span className="font-geist text-[20px] font-bold text-text-primary tabular-nums leading-none mb-1.5 truncate" title={value}>
        {value}
      </span>
      <span className="text-[11px] text-text-secondary truncate">{sub}</span>
    </div>
  );
}

