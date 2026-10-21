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
    <div className="w-full border border-slate-200/90 rounded-2xl bg-white p-5 md:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#c2410c]">Price & Volume Track</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
          </div>
          <h2 className="font-geist text-[18px] font-bold text-slate-900 leading-tight">Historical Market Trajectory</h2>
        </div>
        
        <div className="flex flex-col sm:items-end gap-2.5">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              <span className="font-bold text-slate-900">{timeframe}</span> Trajectory:
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
              isPositive 
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/80' 
                : 'text-[#c2410c] bg-orange-50 border border-orange-200/80'
            }`}>
              {isPositive ? '+' : ''}{returnPct.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Timeframe Selectors */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => (
                <button 
                  key={tf} 
                  onClick={() => setTimeframe(tf)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    timeframe === tf 
                      ? 'bg-slate-950 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Feature Toggles (Replaces browser checkboxes) */}
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  showVolume
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900'
                }`}
              >
                Vol
              </button>
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  showSMA
                    ? 'bg-[#c2410c] text-white border-[#c2410c] shadow-2xs'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900'
                }`}
              >
                50 DMA
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative h-[270px] w-full mt-2 flex flex-col pr-14 pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#16a34a' : '#c2410c'} stopOpacity={0.20}/>
                <stop offset="95%" stopColor={isPositive ? '#16a34a' : '#c2410c'} stopOpacity={0.00}/>
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
              stroke={isPositive ? '#16a34a' : '#c2410c'} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
            {showSMA && (
              <Area 
                type="monotone" 
                dataKey="sma" 
                stroke="#18181b" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                fill="none" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Subtle, Professional Volume Histogram Bars */}
        {showVolume && (
          <div className="absolute bottom-6 left-0 right-14 h-9 flex items-end justify-between px-2 pointer-events-none opacity-30">
            {volumeBars.map((bar, i) => (
              <div 
                key={i} 
                className={`w-[1.2%] rounded-t-xs transition-all ${bar.isUp ? 'bg-emerald-600' : 'bg-[#c2410c]'}`} 
                style={{ height: `${Math.max(10, bar.heightPct * 0.75)}%` }}
              />
            ))}
          </div>
        )}

        {/* X Axis Date Labels */}
        <div className="absolute bottom-0 left-0 right-14 flex justify-between border-t border-slate-200 pt-2 text-[10px] text-slate-400 font-mono">
          {dateLabels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>

        {/* Y Axis Guide Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between border-l border-slate-200/80 pl-2.5 pb-6 text-[10px] text-slate-400 font-mono items-end right-0 w-full">
          <div className="w-full border-b border-slate-100 h-0 flex justify-end">
            <span className="-mt-1.5 bg-white pl-2 font-mono">₹{maxPrice.toFixed(0)}</span>
          </div>
          <div className="w-full border-b border-slate-100 border-dashed h-0 flex justify-end">
            <span className="-mt-1.5 bg-white pl-2 font-mono">₹{((maxPrice + minPrice) / 2).toFixed(0)}</span>
          </div>
          <div className="w-full h-0 flex justify-end">
            <span className="-mt-1.5 bg-white pl-2 font-mono">₹{minPrice.toFixed(0)}</span>
          </div>
        </div>
      </div>
      
      {/* Chart Legend HUD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className={`w-2.5 h-0.5 ${isPositive ? 'bg-emerald-600' : 'bg-[#c2410c]'}`} />
            Price: ₹{lastPrice.toFixed(2)}
          </span>
          {showSMA && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-0.5 bg-slate-900" />
              50 DMA: ₹{latestSMA.toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-slate-400">
          Day Vol: {(latestVol / 1000000).toFixed(2)}M shares
        </div>
      </div>
    </div>
  );
}
