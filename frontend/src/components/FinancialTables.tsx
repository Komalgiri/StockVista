import { useState } from 'react';
import { Download } from 'lucide-react';

export interface FinancialData {
  headers: string[];
  rows: { title: string; values: string[] }[];
}

export interface IncomeData {
  quarterly: FinancialData | null;
  annual: FinancialData | null;
}

export function FinancialTables({ income, balanceSheet, cashFlow }: { income?: IncomeData | null, balanceSheet?: FinancialData | null, cashFlow?: FinancialData | null }) {
  const [activeTab, setActiveTab] = useState<'quarterly' | 'annual'>('annual');

  if (!income && !balanceSheet && !cashFlow) {
    return <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex items-center justify-center text-text-secondary">Financial statements unavailable.</div>;
  }

  const data = activeTab === 'quarterly' ? income?.quarterly : income?.annual; 
  if (!data || !data.headers || data.headers.length === 0) return null;

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm overflow-x-hidden w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Financial Performance</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Consolidated Profit & Loss</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-subtle p-0.5 rounded-md border border-border-hairline">
            <button 
              onClick={() => setActiveTab('quarterly')}
              className={`text-[11px] px-4 py-1.5 rounded font-semibold transition-colors ${activeTab === 'quarterly' ? 'bg-primary text-on-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Quarterly
            </button>
            <button 
              onClick={() => setActiveTab('annual')}
              className={`text-[11px] px-4 py-1.5 rounded font-semibold transition-colors ${activeTab === 'annual' ? 'bg-primary text-on-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Annual
            </button>
          </div>
          <button className="text-text-secondary hover:text-primary flex items-center gap-1 text-[11px] font-semibold"><Download size={14}/> CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto w-full pb-4">
        <table className="w-full text-left font-inter">
          <thead className="text-[11px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b-2 border-border-strong">
            <tr>
              <th className="py-3 px-2 whitespace-nowrap min-w-[180px]">Metric (in ₹ Cr)</th>
              {data.headers.slice(1).map((h, i) => (
                <th key={i} className={`py-3 px-2 text-right whitespace-nowrap ${h === 'TTM' ? 'text-primary' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-border-hairline">
            {data.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface-subtle transition-colors group text-text-secondary">
                <td className="py-3 px-2 font-medium text-text-primary whitespace-nowrap">{row.title}</td>
                {row.values.map((val: string, i: number) => (
                  <td key={i} className="py-3 px-2 text-right tabular-nums whitespace-nowrap">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-[10px] text-text-tertiary font-mono">
        <div>*Data sourced directly from Screener.in</div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-market-positive rounded-full"></span> TTM YoY calculations annualized</div>
      </div>
    </div>
  );
}
