'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCw, Check, AlertCircle } from 'lucide-react';
import { refreshCompanyData } from '@/services/api';

export function RefreshButton({ ticker }: { ticker: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    setStatus('idle');

    try {
      const res = await refreshCompanyData(ticker);
      if (res && res.refreshed) {
        setStatus('success');
        router.refresh(); // Refresh Next.js Server Components with newly written SQLite cache
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
        status === 'success'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : status === 'error'
          ? 'bg-rose-50 text-rose-800 border-rose-200'
          : 'bg-white hover:bg-orange-50/50 text-slate-700 hover:text-[#c2410c] border-slate-200 hover:border-orange-300'
      }`}
      title="Fetch fresh audited financial statements and ratios from exchange feeds"
    >
      <RotateCw 
        size={13} 
        className={loading ? 'animate-spin text-[#c2410c]' : status === 'success' ? 'text-emerald-600' : 'text-slate-500'} 
      />
      <span>
        {loading 
          ? 'Syncing Filings...' 
          : status === 'success' 
          ? 'Statements Synced' 
          : status === 'error' 
          ? 'Sync Failed' 
          : 'Refresh Filings'}
      </span>
    </button>
  );
}
