'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/company/${query.trim().toUpperCase()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg hidden md:block">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-outline" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-9 pr-12 py-1.5 border border-border-strong rounded bg-surface-canvas placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-[13px] transition-colors"
        placeholder="Search company by name, NSE/BSE symbol, or ISIN..."
      />
    </form>
  );
}
