import { Home, Star, BarChart2, Search, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-16 md:w-60 bg-surface-subtle border-r border-border-hairline h-full flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center justify-center md:justify-start md:px-4 border-b border-border-hairline gap-2">
        <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-lg font-geist">SV</div>
        <div className="hidden md:flex flex-col">
          <span className="font-geist font-semibold text-text-primary leading-tight text-[15px]">StockVista</span>
          <span className="text-[9px] uppercase tracking-widest text-text-tertiary">India Equities</span>
        </div>
      </div>
      
      <div className="px-4 py-3 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider hidden md:block">
        Terminal Core
      </div>
      
      <nav className="flex-1 flex flex-col gap-1 px-2">
        <NavItem icon={<Home size={18} />} label="Home" active />
        <NavItem icon={<Star size={18} />} label="Watchlist" />
        <NavItem icon={<BarChart2 size={18} />} label="Markets" />
        <NavItem icon={<Search size={18} />} label="Stock Screener" />
        <NavItem icon={<Briefcase size={18} />} label="Portfolio" />
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href="#" 
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-primary-container/10 text-primary font-medium' 
          : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
      }`}
    >
      <div className={active ? 'text-primary' : 'text-text-secondary'}>{icon}</div>
      <span className="hidden md:block text-[13px]">{label}</span>
    </Link>
  );
}
