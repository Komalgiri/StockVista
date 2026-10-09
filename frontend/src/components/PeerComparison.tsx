import { ArrowUpRight } from 'lucide-react';

export function PeerComparison() {
  const peers = [
    { name: "Reliance Industries", cmpt: 2914.40, pe: 28.4, mcap: '19,71,840', div: 0.34, roce: 10.4, ret: '+28.4%' },
    { name: "Indian Oil Corp (IOC)", cmpt: 172.50, pe: 5.8, mcap: '2,43,620', div: 4.60, roce: 18.2, ret: '+66.4%' },
    { name: "Bharat Petroleum (BPCL)", cmpt: 610.30, pe: 4.2, mcap: '1,32,610', div: 4.10, roce: 22.5, ret: '+72.1%' },
    { name: "ONGC", cmpt: 275.40, pe: 6.5, mcap: '3,50,240', div: 4.40, roce: 14.1, ret: '+76.8%' },
  ];

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Industry Valuation</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Peer Group Comparison</h2>
        </div>
        <span className="text-[10px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border-hairline font-mono">Refining & Oil Marketing</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-inter">
          <thead className="text-[10px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b-2 border-border-strong">
            <tr>
              <th className="py-2.5 px-2">Company name</th>
              <th className="py-2.5 px-2 text-right">CMP (₹)</th>
              <th className="py-2.5 px-2 text-right">P/E</th>
              <th className="py-2.5 px-2 text-right">MCAP (₹ Cr)</th>
              <th className="py-2.5 px-2 text-right">Div %</th>
              <th className="py-2.5 px-2 text-right">ROCE %</th>
              <th className="py-2.5 px-2 text-right">1Y Return</th>
            </tr>
          </thead>
          <tbody className="text-[12px] divide-y divide-border-hairline">
            {peers.map((peer, idx) => (
              <tr key={idx} className={`transition-colors hover:bg-surface-subtle ${idx === 0 ? 'bg-primary-container/5' : ''}`}>
                <td className={`py-3 px-2 font-medium flex items-center gap-1.5 ${idx === 0 ? 'text-primary' : 'text-text-primary'}`}>
                  {idx + 1}. {peer.name}
                </td>
                <td className="py-3 px-2 tabular-nums text-right font-semibold text-text-primary">{peer.cmpt.toFixed(2)}</td>
                <td className="py-3 px-2 tabular-nums text-right text-text-secondary">{peer.pe.toFixed(1)}</td>
                <td className="py-3 px-2 tabular-nums text-right text-text-secondary">{peer.mcap}</td>
                <td className="py-3 px-2 tabular-nums text-right text-text-secondary">{peer.div.toFixed(2)}%</td>
                <td className="py-3 px-2 tabular-nums text-right text-text-secondary">{peer.roce.toFixed(1)}%</td>
                <td className="py-3 px-2 tabular-nums text-right font-semibold text-market-positive">{peer.ret}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-[11px]">
        <div className="text-text-secondary">Median Sector P/E: <span className="font-semibold text-text-primary">6.2x</span></div>
        <button className="text-primary font-semibold hover:underline flex items-center gap-1">Detailed Screener Peer View <ArrowUpRight size={14}/></button>
      </div>
    </div>
  );
}
