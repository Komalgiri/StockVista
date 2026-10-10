import { FileText, Download, ExternalLink } from 'lucide-react';

export type DocumentsData = Record<string, { name: string, url: string }[]>;

export function DocumentsList({ documents }: { documents?: DocumentsData | null }) {
  const hasDocs = documents && Object.keys(documents).length > 0;

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
            <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Documents & Reports</h2>
          </div>
          <FileText size={18} className="text-text-secondary" />
        </div>

        {!hasDocs ? (
          <div className="text-[12px] text-text-secondary text-center py-6">Company documents unavailable.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(documents).map(([title, links]) => (
              <div key={title} className="flex flex-col gap-3">
                <h4 className="text-[12px] font-semibold text-text-primary border-b border-border-hairline pb-1">{title}</h4>
                {links.map((link, idx) => (
                  <DocItem key={idx} title={link.name} url={link.url} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocItem({ title, url }: { title: string, url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-border-hairline rounded bg-surface-subtle hover:bg-surface-muted transition-colors group">
      <div className="flex items-center gap-3">
        <div className="text-primary"><FileText size={20} /></div>
        <div className="font-geist font-semibold text-[13px] text-text-primary group-hover:text-primary transition-colors">{title}</div>
      </div>
      <div className="text-text-tertiary group-hover:text-primary transition-colors">
        <ExternalLink size={14} />
      </div>
    </a>
  );
}

