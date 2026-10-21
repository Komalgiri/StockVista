'use client';

import { Search, Layers, Activity, TrendingUp, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isSectors = pathname?.startsWith('/sectors');
  const isCoverage = pathname?.startsWith('/coverage');

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-slate-200/90 h-full flex flex-col transition-all duration-300 select-none shrink-0 shadow-xs">
      
      {/* Brand Header */}
      <Link 
        href="/"
        className="h-16 flex items-center justify-center md:justify-start md:px-5 border-b border-slate-200/80 gap-3 hover:bg-slate-50/80 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-[#c2410c] text-white flex items-center justify-center font-bold text-sm font-geist tracking-tight shadow-sm shrink-0">
          SV
        </div>
        <div className="hidden md:flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-geist font-extrabold text-slate-950 leading-tight text-[15px] tracking-tight">StockVista</span>
            <span className="text-[9px] font-mono font-bold bg-orange-100 text-[#c2410c] px-1.5 py-0.2 rounded">PRO</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">India Equity Research</span>
        </div>
      </Link>
      
      {/* Section Label */}
      <div className="px-5 pt-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
        Terminal Workspaces
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 px-3 py-2">
        <NavItem 
          href="/" 
          icon={<Search size={18} />} 
          label="Search Terminal" 
          active={isHome} 
        />
        <NavItem 
          href="/sectors" 
          icon={<Layers size={18} />} 
          label="Sectors & Industry" 
          active={isSectors} 
          badge="23"
        />
        <NavItem 
          href="/coverage" 
          icon={<Activity size={18} />} 
          label="Universe Coverage" 
          active={isCoverage} 
          badge="5,588"
          badgeHighlight
        />
      </nav>

      {/* Terminal Telemetry Footer */}
      <div className="p-4 border-t border-slate-200/80 hidden md:block bg-slate-50/50 text-[11px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-500 font-medium">Indexed Equities</span>
          <span className="font-mono text-slate-900 font-bold">5,588</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-500 font-medium">Data Pipeline</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Ingestion
          </span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active = false,
  badge,
  badgeHighlight = false
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  badge?: string;
  badgeHighlight?: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-slate-950 text-white font-semibold shadow-sm' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 font-medium'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={active ? 'text-[#f97316]' : 'text-slate-400 group-hover:text-slate-700'}>
          {icon}
        </div>
        <span className="hidden md:block text-[13px] truncate">{label}</span>
      </div>
      {badge && (
        <span className={`hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
          active 
            ? 'bg-white/15 text-white' 
            : badgeHighlight
              ? 'bg-orange-50 text-[#c2410c] border border-orange-200/60'
              : 'bg-slate-100 text-slate-600'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
