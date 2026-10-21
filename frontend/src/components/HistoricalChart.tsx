'use client';

import { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export interface PricePoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export function HistoricalChart({ data }: { data: PricePoint[] }) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [showVolume, setShowVolume] = useState(true);
  const [showSMA, setShowSMA] = useState(true);

  if (!data || data.length === 0) {
    return (
      <div className="w-full border border-border-hairline rounded-lg bg-surface-canvas p-6 text-center text-text-secondary text-[13px]">
        Historical price chart data unavailable.
      </div>
    );
  }

  // Filter data based on selected timeframe
  const filteredData = useMemo(() => {
    if (data.length <= 1) return data;
    let count = data.length;
    if (timeframe === '1M') count = Math.min(22, data.length);
    else if (timeframe === '3M') count = Math.min(65, data.length);
    else if (timeframe === '6M') count = Math.min(130, data.length);
    else if (timeframe === '1Y') count = Math.min(250, data.length);
    else count = data.length;

    return data.slice(-count);
  }, [data, timeframe]);

  // Calculate Moving Averages dynamically
  const chartData = useMemo(() => {
    return filteredData.map((d, idx, arr) => {
      // 50-period SMA
      const window50 = arr.slice(Math.max(0, idx - 49), idx + 1);
      const sma50 = window50.reduce((acc, p) => acc + p.price, 0) / window50.length;
      return {
        ...d,
        sma: Math.round(sma50 * 100) / 100
      };
    });
  }, [filteredData]);

  const minPrice = useMemo(() => Math.min(...chartData.map(d => d.price)) * 0.98, [chartData]);
  const maxPrice = useMemo(() => Math.max(...chartData.map(d => d.price)) * 1.02, [chartData]);

  // Performance calculation
  const firstPrice = chartData[0]?.price || 1;
  const lastPrice = chartData[chartData.length - 1]?.price || firstPrice;
  const returnPct = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isPositive = returnPct >= 0;

  // Real volume calculation
  const maxVolume = useMemo(() => {
    const vols = chartData.map(d => d.volume || 1000000);
    return Math.max(...vols, 1000000);
  }, [chartData]);

  // Sample volume bars (24 bars evenly spaced)
  const volumeBars = useMemo(() => {
    if (chartData.length === 0) return [];
    const step = Math.max(1, Math.floor(chartData.length / 24));
    const bars = [];
    for (let i = 0; i < chartData.length; i += step) {
      const pt = chartData[i];
      const prev = i > 0 ? chartData[i - 1] : pt;
      const vol = pt.volume || 1000000;
      bars.push({
        heightPct: Math.min(100, Math.max(12, (vol / maxVolume) * 100)),
        isUp: pt.price >= prev.price
      });
    }
    return bars;
  }, [chartData, maxVolume]);

  // Dynamic Date Labels
  const dateLabels = useMemo(() => {
    if (chartData.length === 0) return [];
    const count = 5;
    const labels = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.min(chartData.length - 1, Math.floor((i / (count - 1)) * (chartData.length - 1)));
      const rawDate = chartData[idx]?.date;
      if (rawDate) {
        const d = new Date(rawDate);
        labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
      }
    }
    return labels;
  }, [chartData]);

  // Current Stats
  const latestSMA = chartData[chartData.length - 1]?.sma || lastPrice;
  const latestVol = chartData[chartData.length - 1]?.volume || 2500000;

  return (
    <div className="w-full border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Price & Volume Track</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Historical Market Trajectory</h2>
        </div>
        
        <div className="flex flex-col sm:items-end gap-2.5">
          <div className="flex items-center gap-3 text-[12px]">
            <span className="text-text-secondary font-medium">
              <span className="font-semibold text-text-primary">{timeframe}</span> Return:
            </span>
            <span className={`font-semibold px-2 py-0.5 rounded ${isPositive ? 'text-market-positive bg-market-positive-subtle' : 'text-market-negative bg-market-negative-subtle'}`}>
              {isPositive ? '+' : ''}{returnPct.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex gap-1 bg-surface-subtle p-0.5 rounded-md border border-border-hairline">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => (
              <button 
                key={tf} 
                onClick={() => setTimeframe(tf)}
                className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-colors ${
                  timeframe === tf 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-[11px] font-medium text-text-secondary">
            <label className="flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox" 
                className="accent-primary" 
                checked={showVolume} 
                onChange={(e) => setShowVolume(e.target.checked)} 
              /> 
              Vol Bars
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox" 
                className="accent-primary" 
                checked={showSMA} 
                onChange={(e) => setShowSMA(e.target.checked)} 
              /> 
              50 DMA
            </label>
          </div>
        </div>
      </div>
      
      <div className="relative h-[250px] w-full mt-4 flex flex-col pr-12 pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#16a34a' : '#2563eb'} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={isPositive ? '#16a34a' : '#2563eb'} stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={[minPrice, maxPrice]} hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderColor: '#e2e8f0', 
                borderRadius: '8px', 
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
              }}
              formatter={(value: any, name: any) => [
                `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 
                name === 'sma' ? '50 DMA' : 'Close Price'
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? '#16a34a' : '#2563eb'} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
            {showSMA && (
              <Area 
                type="monotone" 
                dataKey="sma" 
                stroke="#64748b" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                fill="none" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Real Volume Bars */}
        {showVolume && (
          <div className="absolute bottom-6 left-0 right-12 h-14 flex items-end justify-between px-1 pointer-events-none opacity-60">
            {volumeBars.map((bar, i) => (
              <div 
                key={i} 
                className={`w-[2.5%] rounded-t-xs transition-all ${bar.isUp ? 'bg-market-positive' : 'bg-market-negative'}`} 
                style={{ height: `${bar.heightPct}%` }}
              />
            ))}
          </div>
        )}

        {/* X Axis */}
        <div className="absolute bottom-0 left-0 right-12 flex justify-between border-t border-border-hairline pt-2 text-[10px] text-text-tertiary font-mono">
          {dateLabels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>

        {/* Y Axis Guide Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between border-l border-border-hairline pl-2 pb-6 text-[10px] text-text-tertiary font-mono items-end right-0 w-full">
          <div className="w-full border-b border-border-hairline/40 h-0 flex justify-end">
            <span className="-mt-1.5 bg-surface-canvas pl-2 font-mono">₹{maxPrice.toFixed(0)}</span>
          </div>
          <div className="w-full border-b border-border-hairline/40 border-dashed h-0 flex justify-end">
            <span className="-mt-1.5 bg-surface-canvas pl-2 font-mono">₹{((maxPrice + minPrice) / 2).toFixed(0)}</span>
          </div>
          <div className="w-full h-0 flex justify-end">
            <span className="-mt-1.5 bg-surface-canvas pl-2 font-mono">₹{minPrice.toFixed(0)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-3 border-t border-border-hairline text-[10px] font-mono text-text-tertiary gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#2563eb]"></span> Price: ₹{lastPrice.toFixed(2)}
          </span>
          {showSMA && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#60a5fa]"></span> 50 DMA: ₹{latestSMA.toFixed(2)}
            </span>
          )}
        </div>
        <div>
          Latest Vol: {(latestVol / 1000000).toFixed(2)}M shares
        </div>
      </div>
    </div>
  );
}
