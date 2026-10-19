'use client';

import { Home, Layers, PieChart, Search, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isSectors = pathname?.startsWith('/sectors');
  const isCoverage = pathname?.startsWith('/coverage');

  return (
    <aside className="w-16 md:w-60 bg-surface-subtle border-r border-border-hairline h-full flex flex-col transition-all duration-300 select-none shrink-0">
      <Link 
        href="/"
        className="h-16 flex items-center justify-center md:justify-start md:px-4 border-b border-border-hairline gap-2 hover:bg-surface-muted transition-colors"
      >
        <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-sm font-geist tracking-tight">
          SV
        </div>
        <div className="hidden md:flex flex-col">
          <span className="font-geist font-semibold text-text-primary leading-tight text-[15px]">StockVista</span>
          <span className="text-[9px] uppercase tracking-widest text-text-tertiary">India Equities</span>
        </div>
      </Link>
      
      <div className="px-4 py-3 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider hidden md:block">
        Navigation
      </div>
      
      <nav className="flex-1 flex flex-col gap-1 px-2">
        <NavItem href="/" icon={<Home size={18} />} label="Search Terminal" active={isHome} />
        <NavItem href="/sectors" icon={<Layers size={18} />} label="Sectors & Industries" active={isSectors} />
        <NavItem href="/coverage" icon={<Activity size={18} />} label="Universe & Coverage" active={isCoverage} badge="5,500+" />
      </nav>

      <div className="p-3 border-t border-border-hairline hidden md:block text-[11px] text-text-tertiary">
        <div className="flex items-center justify-between mb-1">
          <span>Active Universe</span>
          <span className="font-mono text-text-primary font-semibold">5,588</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span>Coverage Engine</span>
          <span className="text-emerald-600 font-medium">Online</span>
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
  badge
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-primary text-on-primary font-medium shadow-xs' 
          : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={active ? 'text-on-primary' : 'text-text-secondary'}>{icon}</div>
        <span className="hidden md:block text-[13px]">{label}</span>
      </div>
      {badge && (
        <span className={`hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded ${
          active ? 'bg-white/20 text-white' : 'bg-surface-dim text-text-secondary'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
