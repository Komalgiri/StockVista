import { Sidebar } from '@/components/Sidebar';
import { HomeSearch } from '@/components/HomeSearch';

export const instant = false;

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-border-hairline px-4 md:px-8 flex items-center justify-between sticky top-0 bg-background z-10">
          <div className="md:hidden">
            <span className="font-geist font-semibold text-primary text-lg">StockVista</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-8 h-8 rounded-full bg-surface-dim border border-border-strong flex items-center justify-center text-sm font-semibold text-primary cursor-pointer">
              JS
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <HomeSearch />
        </div>
      </main>
    </div>
  );
}
