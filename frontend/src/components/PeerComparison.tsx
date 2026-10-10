import { ArrowUpRight } from 'lucide-react';
import type { FinancialData } from './FinancialTables';

export function PeerComparison({ peers }: { peers: FinancialData | null }) {
  if (!peers || !peers.headers || peers.rows.length === 0) {
    return <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 h-full flex items-center justify-center text-text-secondary">Peer comparison data unavailable.</div>;
  }

  // Remove first row (usually empty)
  const rows = peers.rows.filter(r => r.title);

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Industry Valuation</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Peer Group Comparison</h2>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full text-left font-inter">
          <thead className="text-[10px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b-2 border-border-strong">
            <tr>
              <th className="py-2.5 px-2 whitespace-nowrap">Company name</th>
              {peers.headers.slice(1).map((h, i) => (
                <th key={i} className="py-2.5 px-2 text-right whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[12px] divide-y divide-border-hairline">
            {rows.map((peer, idx) => (
              <tr key={idx} className={`transition-colors hover:bg-surface-subtle ${idx === 0 ? 'bg-primary-container/5' : ''}`}>
                <td className={`py-3 px-2 font-medium flex items-center gap-1.5 whitespace-nowrap ${idx === 0 ? 'text-primary' : 'text-text-primary'}`}>
                  {peer.title}
                </td>
                {peer.values.map((val, i) => (
                  <td key={i} className="py-3 px-2 tabular-nums text-right text-text-secondary whitespace-nowrap">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-[11px]">
        <div className="text-text-secondary">Data from <span className="font-semibold text-text-primary">Screener.in</span></div>
        <button className="text-primary font-semibold hover:underline flex items-center gap-1">Detailed Screener Peer View <ArrowUpRight size={14}/></button>
      </div>
    </div>
  );
}
