'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface PricePoint {
  date: string;
  price: number;
}

export function HistoricalChart({ data }: { data: PricePoint[] }) {
  if (!data || data.length === 0) return null;
  
  const minPrice = Math.min(...data.map(d => d.price)) * 0.95;
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.05;
  
  // Calculate a simple moving average for styling using a deterministic value
  const chartData = data.map((d, i) => ({
    ...d,
    sma: d.price * (1 + ((i % 5) * 0.01 - 0.02))
  }));

  return (
    <div className="w-full border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Chart Analysis</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight max-w-[200px]">Historical Price Action & Volume</h2>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4 text-[12px]">
            <div className="text-text-secondary">
              <span className="font-semibold text-text-primary">1Y</span> Performance:
            </div>
            <div className="font-semibold text-market-positive bg-market-positive-subtle px-2 py-0.5 rounded">
              +28.4%
            </div>
          </div>
          
          <div className="flex gap-1 bg-surface-subtle p-0.5 rounded-md border border-border-hairline">
            {['1D', '5D', '1M', '6M', '1Y', '3Y', '5Y', 'Max'].map(tf => (
              <button key={tf} className={`text-[11px] px-2.5 py-1 rounded-sm font-semibold transition-colors ${tf === '1Y' ? 'bg-primary text-on-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                {tf}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-[11px] font-medium text-text-secondary">
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-primary" defaultChecked /> Vol (1D)</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-primary" defaultChecked /> SMA (50)</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-primary" /> Ind. (200)</label>
          </div>
        </div>
      </div>
      
      <div className="relative h-[250px] w-full mt-4 flex flex-col pr-10 pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={[minPrice, maxPrice]} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface-canvas)', borderColor: 'var(--color-border-strong)', borderRadius: '6px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Area type="monotone" dataKey="price" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
            <Area type="monotone" dataKey="sma" stroke="#71717a" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Volume Bars */}
        <div className="absolute bottom-6 left-0 right-10 h-16 flex items-end justify-between px-2">
          {[1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, 1].map((val, i) => (
            <div key={i} className={`w-[3%] rounded-t-sm ${val > 0 ? 'bg-market-positive' : 'bg-market-negative'}`} style={{ height: `${(i * 7) % 80 + 20}%` }}></div>
          ))}
        </div>

        {/* X Axis */}
        <div className="absolute bottom-0 left-0 right-10 flex justify-between border-t border-border-strong pt-2 text-[10px] text-text-tertiary font-mono">
          <span>Apr &apos;23</span>
          <span>Jul &apos;23</span>
          <span>Oct &apos;23</span>
          <span>Jan &apos;24</span>
          <span>Mar &apos;24</span>
        </div>

        {/* Y Axis lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between border-l border-border-strong pl-2 pb-6 text-[10px] text-text-tertiary font-mono items-end right-0 w-full">
          <div className="w-full border-b border-border-hairline h-0 flex justify-end"><span className="-mt-1.5 bg-surface-canvas pl-2">{maxPrice.toFixed(0)}</span></div>
          <div className="w-full border-b border-border-hairline border-dashed h-0 flex justify-end"><span className="-mt-1.5 bg-surface-canvas pl-2">{((maxPrice + minPrice) / 2).toFixed(0)}</span></div>
          <div className="w-full h-0 flex justify-end"><span className="-mt-1.5 bg-surface-canvas pl-2">{minPrice.toFixed(0)}</span></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-[10px] font-mono text-text-tertiary">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-primary"></span> Price Close</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#71717a]"></span> SMA (50) ₹2,696.40</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-outline"></span> SMA (200) ₹2,475.20</span>
        </div>
        <div>Vol: 4.54M • 20D Avg: 5.20M</div>
      </div>
    </div>
  );
}
