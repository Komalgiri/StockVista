import { PieChart as PieIcon, ShieldCheck } from 'lucide-react';
import type { FinancialData } from './FinancialTables';

// Rust Orange, Carbon Black, Slate, and subtle Green palette
const CATEGORY_COLORS: Record<string, string> = {
  promoters: '#c2410c', // Deep Rust Orange
  promoter: '#c2410c',
  fiis: '#18181b',      // Carbon Black
  fii: '#18181b',
  diis: '#ea580c',      // Vibrant Rust Orange
  dii: '#ea580c',
  public: '#71717a',    // Neutral Slate Stone
  government: '#16a34a',// Emerald Green
  others: '#a1a1aa'     // Muted Gray
};

const FALLBACK_PALETTE = ['#c2410c', '#18181b', '#ea580c', '#71717a', '#16a34a', '#a1a1aa'];

export function Shareholding({ shareholding }: { shareholding: FinancialData | null }) {
  if (!shareholding || !shareholding.headers || shareholding.rows.length === 0) {
    return (
      <div className="border border-border-hairline rounded-xl bg-surface-canvas p-6 shadow-xs h-full flex items-center justify-center text-text-secondary text-sm">
        Shareholding pattern unavailable for this security.
      </div>
    );
  }

  // Use the latest quarter column to calculate ownership breakdown
  const summaryData = shareholding.rows.map((row, i) => {
    const cleanTitle = row.title.replace('+', '').trim();
    const key = cleanTitle.toLowerCase();
    const matchedColor = CATEGORY_COLORS[key] || FALLBACK_PALETTE[i % FALLBACK_PALETTE.length];
    
    return {
      category: cleanTitle,
      percentage: parseFloat(row.values[row.values.length - 1] || '0'),
      color: matchedColor
    };
  }).filter(d => d.percentage > 0).sort((a, b) => b.percentage - a.percentage);

  // Generate conic gradient for the enlarged donut chart
  let conic = '';
  let acc = 0;
  for (let i = 0; i < summaryData.length; i++) {
    const start = acc;
    const end = acc + summaryData[i].percentage;
    conic += `${summaryData[i].color} ${start}% ${end}%${i === summaryData.length - 1 ? '' : ', '}`;
    acc = end;
  }
  if (acc < 100) conic += `, #f4f4f5 ${acc}% 100%`;

  const topCategory = summaryData[0];
  const latestQuarter = shareholding.headers[shareholding.headers.length - 1];

  return (
    <div className="border border-slate-200/90 rounded-2xl bg-white p-5 md:p-6 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#c2410c]">Ownership Distribution</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
            </div>
            <h2 className="font-geist text-[18px] font-bold text-slate-900 leading-tight">Shareholding Structure</h2>
          </div>
          <span className="text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-mono font-semibold">
            {latestQuarter}
          </span>
        </div>

        {/* Enlarged Donut Chart & Breakdown Deck */}
        <div className="flex flex-col sm:flex-row items-center gap-8 my-6">
          
          {/* Prominent Donut Graphic */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex-shrink-0">
            <div 
              className="w-full h-full rounded-full shadow-inner transition-transform hover:scale-102 duration-300" 
              style={{ background: `conic-gradient(${conic})` }}
            />
            {/* Center Cutout */}
            <div className="absolute inset-5 sm:inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-xs border border-slate-100/80">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5 max-w-[85%] truncate text-center">
                {topCategory?.category || 'Holdings'}
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {topCategory ? `${topCategory.percentage.toFixed(1)}%` : '—'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Majority Stake</span>
            </div>
          </div>

          {/* Detailed Category Legend */}
          <div className="flex-1 flex flex-col gap-2.5 w-full">
            {summaryData.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="w-3.5 h-3.5 rounded-sm shadow-xs shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-800 font-semibold truncate">{item.category}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums shrink-0">
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
                {/* Horizontal Share Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 5-Quarter Historical Trend Table */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center justify-between">
          <span>5-Quarter Historical Shift</span>
          <span className="text-slate-400 font-normal">Official Exchange Disclosures</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="text-[10px] uppercase tracking-[0.04em] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2 px-1.5 font-semibold">Category</th>
                {shareholding.headers.slice(shareholding.headers.length - 5, shareholding.headers.length).map((h, i) => (
                  <th key={i} className="py-2 px-1.5 text-right font-mono font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[12px] divide-y divide-slate-100">
              {shareholding.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-1.5 font-medium text-slate-800">{row.title.replace('+', '').trim()}</td>
                  {row.values.slice(row.values.length - 5, row.values.length).map((val, i) => (
                    <td key={i} className="py-2 px-1.5 text-right font-mono tabular-nums text-slate-600">{val}%</td>
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
