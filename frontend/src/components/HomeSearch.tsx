'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function HomeSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  
  const popularSearches = [
    { ticker: 'RELIANCE', name: 'Reliance Industries', trend: '+1.5%' },
    { ticker: 'TCS', name: 'Tata Consultancy Services', trend: '+0.8%' },
    { ticker: 'HDFCBANK', name: 'HDFC Bank', trend: '-0.4%' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/company/${query.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-3xl mx-auto px-4">
      <h1 className="font-geist text-4xl md:text-5xl font-bold text-text-primary mb-2 text-center tracking-tight">
        Discover Market Opportunities
      </h1>
      <p className="text-text-secondary font-inter mb-10 text-center max-w-xl">
        Institutional-grade financial equity research environment calibrated for Indian capital market analysts.
      </p>

      <form onSubmit={handleSearch} className="relative w-full mb-8 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-outline" />
        </div>
        <input
          type="text"
          className="block w-full pl-14 pr-24 py-4 border border-border-strong rounded-lg leading-5 bg-surface-canvas placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg transition-shadow"
          placeholder="Search for companies, tickers, or indices (e.g., RELIANCE)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors">
            Search
          </button>
        </div>
      </form>

      <div className="w-full">
        <div className="flex items-center gap-2 mb-4 text-text-secondary font-inter text-sm font-medium">
          <TrendingUp size={16} />
          <span>Popular Searches</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {popularSearches.map(item => (
            <Link 
              key={item.ticker} 
              href={`/company/${item.ticker}`}
              className="flex items-center justify-between p-3 border border-border-hairline rounded-md bg-surface-canvas hover:bg-surface-subtle hover:border-border-strong transition-all"
            >
              <div>
                <div className="font-geist font-semibold text-text-primary">{item.ticker}</div>
                <div className="text-xs text-text-tertiary truncate max-w-[120px]">{item.name}</div>
              </div>
              <div className={`text-sm font-medium ${item.trend.startsWith('+') ? 'text-market-positive' : 'text-market-negative'}`}>
                {item.trend}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
