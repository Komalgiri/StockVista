import { ArrowUpRight } from 'lucide-react';
import type { FinancialData } from './FinancialTables';

export function Shareholding({ shareholding }: { shareholding: FinancialData | null }) {
  if (!shareholding || !shareholding.headers || shareholding.rows.length === 0) {
    return <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex items-center justify-center text-text-secondary">Shareholding data unavailable.</div>;
  }

  // Use the last column to generate a donut chart summary
  const lastColIndex = shareholding.headers.length - 2; // -1 because slice(1), actually values are 0-indexed corresponding to headers 1-indexed
  
  const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#CBD5E1'];
  const summaryData = shareholding.rows.map((row, i) => {
    return {
      category: row.title,
      percentage: parseFloat(row.values[row.values.length - 1] || '0'),
      color: colors[i % colors.length]
    }
  }).filter(d => d.percentage > 0).sort((a,b) => b.percentage - a.percentage);

  // Generate conic gradient string
  let conic = '';
  let acc = 0;
  for (let i = 0; i < summaryData.length; i++) {
    const start = acc;
    const end = acc + summaryData[i].percentage;
    conic += `${summaryData[i].color} ${start}% ${end}%${i === summaryData.length - 1 ? '' : ', '}`;
    acc = end;
  }
  if (acc < 100) conic += `, transparent ${acc}% 100%`;

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Ownership Distribution</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Shareholding Pattern</h2>
        </div>
        <span className="text-[10px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border-hairline font-mono">{shareholding.headers[shareholding.headers.length - 1]}</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
        <div className="relative w-32 h-32 flex-shrink-0">
          <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${conic})` }}></div>
          <div className="absolute inset-3 bg-surface-canvas rounded-full flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-text-tertiary mb-0.5 max-w-[80%] truncate text-center">{summaryData[0]?.category}</span>
            <span className="font-geist text-xl font-bold text-primary">{summaryData[0]?.percentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5 text-[12px] font-inter w-full">
          {summaryData.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="w-3 h-3 rounded-sm shadow-sm shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-text-secondary font-medium truncate">{item.category}</span>
              </div>
              <span className="text-text-primary font-semibold tabular-nums shrink-0">{item.percentage.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-border-hairline flex flex-col gap-2">
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left font-inter">
            <thead className="text-[10px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b-2 border-border-strong">
              <tr>
                <th className="py-2 px-1 font-normal">Qtr</th>
                {shareholding.headers.slice(shareholding.headers.length - 5, shareholding.headers.length).map((h, i) => (
                  <th key={i} className="py-2 px-1 text-right font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[11px] divide-y divide-border-hairline">
              {shareholding.rows.map((row, idx) => (
                <tr key={idx} className="text-text-secondary">
                  <td className="py-2 px-1 font-medium">{row.title.replace('+', '').trim()}</td>
                  {row.values.slice(row.values.length - 5, row.values.length).map((val, i) => (
                    <td key={i} className="py-2 px-1 text-right tabular-nums">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
