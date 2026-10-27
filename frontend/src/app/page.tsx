import { Sidebar } from '@/components/Sidebar';
import { HomeSearch } from '@/components/HomeSearch';
import { MarketTicker } from '@/components/MarketTicker';

export const instant = false;

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-slate-200/90 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-xs font-geist">
                OC
              </div>
              <span className="font-geist font-bold text-slate-950 text-sm">Opp Code Stock Vision</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-600 text-xs font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-semibold text-slate-800">Markets Active</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">Live Indian Exchange Feeds</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <MarketTicker />
            
    
            
          </div>
        </header>
        
        <div className="flex-1 w-full flex flex-col">
          <HomeSearch />
        </div>
      </main>
    </div>
  );
}
