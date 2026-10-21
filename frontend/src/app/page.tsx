import { Sidebar } from '@/components/Sidebar';
import { HomeSearch } from '@/components/HomeSearch';
import { MarketTicker } from '@/components/MarketTicker';

export const instant = false;

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-border-hairline px-4 md:px-8 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-20">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center font-bold text-xs font-geist">
              SV
            </div>
            <span className="font-geist font-semibold text-primary text-base">StockVista</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <MarketTicker />
            <div className="flex items-center gap-2.5 pl-3 border-l border-border-hairline">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold tracking-tight shadow-sm">
                KG
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[12px] font-semibold text-text-primary leading-tight">Institutional Terminal</span>
                <span className="text-[10px] text-text-tertiary">NSE / BSE Integrated</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 w-full flex flex-col">
          <HomeSearch />
        </div>
      </main>
    </div>
  );
}
