import { Calendar } from 'lucide-react';

export function CorporateActions() {
  const data = [
    { date: "19 Aug 2024", type: "DIVIDEND", details: "Final Dividend ₹10.00 per share (Ex-Date: 19 Aug)" },
    { date: "28 Aug 2023", type: "AGM", details: "46th Annual General Meeting of Shareholders" },
    { date: "20 Jul 2023", type: "SPIN-OFF", details: "Jio Financial Services Ltd (JFSL) 1:1 spin off" },
  ];

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Corporate Events</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Corporate Actions</h2>
        </div>
        <Calendar size={18} className="text-text-secondary" />
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left font-inter">
          <thead className="text-[10px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b border-border-hairline">
            <tr>
              <th className="py-2.5 px-2 w-[25%]">Date</th>
              <th className="py-2.5 px-2 w-[20%]">Type</th>
              <th className="py-2.5 px-2">Details</th>
            </tr>
          </thead>
          <tbody className="text-[12px] divide-y divide-border-hairline">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-subtle transition-colors">
                <td className="py-3 px-2 font-medium text-text-secondary tabular-nums">{item.date}</td>
                <td className="py-3 px-2">
                  <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                    item.type === 'DIVIDEND' ? 'bg-market-positive-subtle text-market-positive border border-market-positive/20' :
                    item.type === 'SPIN-OFF' ? 'bg-primary-container/10 text-primary border border-primary/20' :
                    'bg-surface-muted text-text-secondary border border-border-hairline'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-text-primary leading-snug">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-border-hairline">
        <button className="text-[11px] text-text-secondary font-medium hover:text-primary transition-colors">View all Historical Corporate Actions...</button>
      </div>
    </div>
  );
}
