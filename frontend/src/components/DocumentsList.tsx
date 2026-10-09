import { FileText, Download } from 'lucide-react';

export function DocumentsList() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border-hairline rounded-lg bg-surface-canvas p-4 shadow-sm flex items-start gap-3 bg-surface-muted/30">
        <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border-hairline flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-text-tertiary">ℹ️</span>
        </div>
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary">Consensus Outlook</h3>
            <span className="text-[9px] uppercase tracking-widest font-semibold text-text-secondary bg-surface-canvas px-1.5 py-0.5 rounded border border-border-hairline">Broker Estimates</span>
          </div>
          <h4 className="font-geist text-[13px] font-bold text-text-primary mb-1.5">No consensus estimates provided</h4>
          <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
            Consensus forecasts from sell-side brokerages are currently unavailable for this security via the active data tier. Core audited financials remain fully synchronized.
          </p>
          <a href="#" className="text-[11px] text-primary font-medium hover:underline">Learn about StockVista Institutional Access →</a>
        </div>
      </div>

      <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Exchange Filings</h3>
            <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Annual Reports & Investor Balances</h2>
          </div>
          <FileText size={18} className="text-text-secondary" />
        </div>

        <div className="flex flex-col gap-3">
          <DocItem title="Annual Report FY 2023-24" meta="PDF • 46.2 MB • Released: Jun 2024" />
          <DocItem title="Q4 FY24 Earnings Presentation" meta="PPT/PDF • 14.5 MB • Released: Jan 2024" />
        </div>
      </div>
    </div>
  );
}

function DocItem({ title, meta }: { title: string, meta: string }) {
  return (
    <div className="flex items-center justify-between p-3 border border-border-hairline rounded bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="text-market-negative"><FileText size={20} /></div>
        <div>
          <div className="font-geist font-semibold text-[13px] text-text-primary group-hover:text-primary transition-colors">{title}</div>
          <div className="text-[10px] text-text-tertiary font-inter">{meta}</div>
        </div>
      </div>
      <button className="flex items-center gap-1 text-[10px] font-semibold text-text-secondary bg-surface-canvas border border-border-strong px-2 py-1 rounded hover:bg-surface-subtle transition-colors">
        <Download size={12} /> PDF
      </button>
    </div>
  );
}
