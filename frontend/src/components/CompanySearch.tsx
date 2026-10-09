import { Search } from 'lucide-react';

export function CompanySearch() {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-outline" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-12 py-2 border border-border-strong rounded-md leading-5 bg-surface-subtle placeholder-text-tertiary focus:outline-none focus:bg-surface-canvas focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
        placeholder="Search companies, tickers..."
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-xs text-text-tertiary font-mono border border-border-hairline rounded px-1.5 py-0.5 bg-surface-canvas">
          Ctrl K
        </span>
      </div>
    </div>
  );
}
