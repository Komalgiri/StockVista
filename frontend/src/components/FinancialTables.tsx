import { ChevronDown, Download } from 'lucide-react';

export function FinancialTables({ data }: { data: { title: string; values: string[]; growth: string; isHeader?: boolean; indent?: boolean; expandable?: boolean; isRatio?: boolean }[] }) {
  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Financial Performance</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Consolidated Financial Statements</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-subtle p-0.5 rounded-md border border-border-hairline">
            <button className="text-[11px] px-4 py-1.5 rounded font-semibold bg-primary text-on-primary shadow-sm transition-colors">Profit & Loss</button>
            <button className="text-[11px] px-4 py-1.5 rounded font-semibold text-text-secondary hover:text-text-primary transition-colors">Balance Sheet</button>
            <button className="text-[11px] px-4 py-1.5 rounded font-semibold text-text-secondary hover:text-text-primary transition-colors">Cash Flow</button>
          </div>
          <button className="text-text-secondary hover:text-primary flex items-center gap-1 text-[11px] font-semibold"><Download size={14}/> CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-inter">
          <thead className="text-[11px] uppercase tracking-[0.04em] font-semibold text-text-secondary border-b-2 border-border-strong">
            <tr>
              <th className="py-3 px-2">Metric (in ₹ Cr)</th>
              <th className="py-3 px-2 text-right">Mar 2020</th>
              <th className="py-3 px-2 text-right">Mar 2021</th>
              <th className="py-3 px-2 text-right">Mar 2022</th>
              <th className="py-3 px-2 text-right">Mar 2023</th>
              <th className="py-3 px-2 text-right text-primary">Mar 2024 (TTM)</th>
              <th className="py-3 px-2 text-right">YoY Growth</th>
            </tr>
          </thead>
          <tbody className="text-[13px] divide-y divide-border-hairline">
            <FinancialRow title="Revenue from Operations" values={['5,96,679', '4,66,924', '6,99,962', '8,79,468', '9,74,864']} growth="+10.8%" isHeader expandable />
            <FinancialRow title="Operating Expenses" values={['5,08,140', '3,84,163', '5,85,258', '7,37,160', '8,02,732']} growth="+8.9%" indent />
            <FinancialRow title="Operating Profit (EBITDA)" values={['88,239', '82,761', '1,10,504', '1,42,308', '1,72,784']} growth="+21.4%" />
            <FinancialRow title="OPM %" values={['14.8%', '17.7%', '15.8%', '16.2%', '17.7%']} growth="+150 bps" isRatio />
            <FinancialRow title="Depreciation" values={['22,203', '26,572', '29,797', '39,315', '48,120']} growth="+18.4%" indent />
            <FinancialRow title="Interest" values={['22,027', '21,189', '14,584', '19,571', '23,280']} growth="+19.0%" indent />
            <FinancialRow title="Profit before Tax (PBT)" values={['53,607', '55,461', '84,312', '94,003', '1,08,860']} growth="+15.8%" />
            <FinancialRow title="Net Profit (PAT)" values={['39,880', '53,739', '67,845', '74,088', '79,020']} growth="+6.7%" isHeader expandable />
            <FinancialRow title="EPS in Rs" values={['63.1', '79.4', '100.4', '108.5', '116.4']} growth="+6.7%" indent />
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-[10px] text-text-tertiary font-mono">
        <div>*All figures audited as per Ind AS standards</div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-market-positive rounded-full"></span> TTM YoY calculations annualized</div>
      </div>
    </div>
  );
}

function FinancialRow({ title, values, growth, isHeader, indent, expandable, isRatio }: { title: string; values: string[]; growth: string; isHeader?: boolean; indent?: boolean; expandable?: boolean; isRatio?: boolean }) {
  return (
    <tr className={`hover:bg-surface-subtle transition-colors group ${isHeader ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
      <td className={`py-3 px-2 flex items-center gap-1 ${indent ? 'pl-6' : ''}`}>
        {expandable && <ChevronDown size={14} className="text-primary cursor-pointer" />}
        {!expandable && !indent && <span className="w-3"></span>}
        {title}
      </td>
      {values.map((val: string, i: number) => (
        <td key={i} className={`py-3 px-2 text-right tabular-nums ${i === 4 ? 'font-semibold text-text-primary' : ''}`}>{val}</td>
      ))}
      <td className={`py-3 px-2 text-right tabular-nums font-semibold ${growth.startsWith('+') ? 'text-market-positive bg-market-positive-subtle/30' : 'text-market-negative bg-market-negative-subtle/30'}`}>
        {growth}
      </td>
    </tr>
  );
}
