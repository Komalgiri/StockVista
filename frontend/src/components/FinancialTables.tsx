"use client";

import { useState } from 'react';
import { Download, Table } from 'lucide-react';

export interface FinancialData {
  headers: string[];
  rows: { title: string; values: string[] }[];
}

export interface IncomeData {
  quarterly: FinancialData | null;
  annual: FinancialData | null;
}

type StatementType = 'quarters' | 'pnl' | 'balance' | 'cashflow';

interface StatementOption {
  key: StatementType;
  label: string;
  title: string;
  subtitle: string;
  data: FinancialData | null | undefined;
}

export function FinancialTables({ 
  income, 
  balanceSheet, 
  cashFlow 
}: { 
  income?: IncomeData | null; 
  balanceSheet?: FinancialData | null; 
  cashFlow?: FinancialData | null; 
}) {
  const [activeTab, setActiveTab] = useState<StatementType>('pnl');

  const statements: StatementOption[] = [
    {
      key: 'quarters',
      label: 'Quarterly Results',
      title: 'Quarterly Financial Results',
      subtitle: 'Standout figures across recent consecutive quarters',
      data: income?.quarterly
    },
    {
      key: 'pnl',
      label: 'Profit & Loss',
      title: 'Consolidated Profit & Loss',
      subtitle: 'Historical annual performance & operating leverage',
      data: income?.annual
    },
    {
      key: 'balance',
      label: 'Balance Sheet',
      title: 'Consolidated Balance Sheet',
      subtitle: 'Assets, liabilities, equity capital and borrowing trends',
      data: balanceSheet
    },
    {
      key: 'cashflow',
      label: 'Cash Flows',
      title: 'Consolidated Cash Flow Statement',
      subtitle: 'Operating, investing, and financing cash generation',
      data: cashFlow
    }
  ];

  const currentStatement = statements.find(s => s.key === activeTab) || statements[1];
  const activeData = currentStatement.data;

  // CSV download utility
  const downloadCSV = () => {
    if (!activeData || !activeData.headers || activeData.headers.length === 0) return;
    const headerRow = activeData.headers.map(h => `"${h}"`).join(',');
    const rows = activeData.rows.map(r => [`"${r.title}"`, ...r.values.map(v => `"${v}"`)].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeTab}-statement.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!income && !balanceSheet && !cashFlow) {
    return (
      <div className="border border-border-hairline rounded-lg bg-surface-canvas p-6 shadow-sm h-full flex items-center justify-center text-text-secondary">
        Financial statements unavailable for this company.
      </div>
    );
  }

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm overflow-x-hidden w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary">Financial Statements</span>
            <span className="text-[9px] bg-primary-fixed/20 text-primary px-1.5 py-0.5 rounded font-mono font-medium">Consolidated / Standalone</span>
          </div>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">
            {currentStatement.title}
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5">
            {currentStatement.subtitle}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-subtle p-0.5 rounded-md border border-border-hairline flex-wrap">
            {statements.map(tab => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                disabled={!tab.data || tab.data.rows?.length === 0}
                className={`text-[11px] px-3.5 py-1.5 rounded font-semibold transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : (!tab.data || tab.data.rows?.length === 0)
                      ? 'text-text-tertiary opacity-50 cursor-not-allowed'
                      : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={downloadCSV}
            disabled={!activeData || activeData.rows.length === 0}
            className="text-text-secondary hover:text-primary flex items-center gap-1.5 text-[11px] font-semibold border border-border-hairline px-2.5 py-1.5 rounded bg-surface-subtle hover:bg-surface-canvas transition-colors disabled:opacity-40"
            title="Download table as CSV"
          >
            <Download size={13}/> CSV
          </button>
        </div>
      </div>

      {!activeData || !activeData.headers || activeData.rows.length === 0 ? (
        <div className="py-12 text-center text-text-secondary text-[13px] border border-dashed border-border-hairline rounded-lg my-2">
          <Table size={24} className="mx-auto mb-2 opacity-40 text-text-tertiary" />
          No data available for {currentStatement.title}. Please check alternate statement tabs.
        </div>
      ) : (
        <div className="overflow-x-auto w-full pb-4">
          <table className="w-full text-left font-inter">
            <thead className="text-[11px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b-2 border-border-strong">
              <tr>
                <th className="py-3 px-2 whitespace-nowrap min-w-[200px]">Metric (in ₹ Cr)</th>
                {activeData.headers.slice(1).map((h, i) => (
                  <th key={i} className={`py-3 px-2 text-right whitespace-nowrap ${h === 'TTM' ? 'text-primary font-bold' : ''}`}>
                    {h || `Col ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-border-hairline">
              {activeData.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-subtle transition-colors group text-text-secondary">
                  <td className="py-2.5 px-2 font-medium text-text-primary whitespace-nowrap">{row.title}</td>
                  {row.values.map((val: string, i: number) => (
                    <td key={i} className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-3 border-t border-border-hairline text-[10px] text-text-tertiary font-mono gap-2">
        <div>*Data synced from audited filings via Screener.in</div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-market-positive rounded-full"></span> All figures in INR Crores</span>
          <span>•</span>
          <span>Fiscal Year ending March</span>
        </div>
      </div>
    </div>
  );
}

