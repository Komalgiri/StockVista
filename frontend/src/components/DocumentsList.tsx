'use client';

import { useState, useMemo } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Search, 
  Download, 
  FileSpreadsheet, 
  Video, 
  Headphones, 
  ShieldCheck, 
  Sparkles, 
  Info,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';

export type DocumentsData = Record<string, { name: string; url: string }[]>;

interface FlatDoc {
  category: string;
  name: string;
  url: string;
  type: 'annual' | 'transcript' | 'ppt' | 'recording' | 'rating' | 'general';
  year?: string;
  sourceDomain: string;
}

export function DocumentsList({ documents }: { documents?: DocumentsData | null }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);

  // Flatten and enrich documents data
  const flatDocs: FlatDoc[] = useMemo(() => {
    if (!documents) return [];
    const list: FlatDoc[] = [];

    Object.entries(documents).forEach(([catTitle, items]) => {
      items.forEach(item => {
        let docType: FlatDoc['type'] = 'general';
        const lowerName = item.name.toLowerCase();
        const lowerCat = catTitle.toLowerCase();
        const lowerUrl = item.url.toLowerCase();

        if (lowerName.includes('annual report') || lowerCat.includes('annual report')) {
          docType = 'annual';
        } else if (lowerName === 'transcript' || lowerName.includes('transcript')) {
          docType = 'transcript';
        } else if (lowerName === 'ppt' || lowerName.includes('presentation') || lowerName.includes('earning')) {
          docType = 'ppt';
        } else if (lowerName === 'rec' || lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be') || lowerName.includes('audio') || lowerName.includes('webcast')) {
          docType = 'recording';
        } else if (lowerName.includes('rating') || lowerCat.includes('rating') || lowerUrl.includes('crisil')) {
          docType = 'rating';
        }

        // Extract year if present
        const yearMatch = item.name.match(/20\d{2}|FY\d{2}/i);
        const year = yearMatch ? yearMatch[0] : undefined;

        // Source domain
        let sourceDomain = 'Official Filing';
        try {
          const parsed = new URL(item.url);
          sourceDomain = parsed.hostname.replace(/^www\./, '');
        } catch {
          sourceDomain = item.url.includes('bseindia') ? 'bseindia.com' : 'nseindia.com';
        }

        list.push({
          category: catTitle,
          name: item.name,
          url: item.url,
          type: docType,
          year,
          sourceDomain
        });
      });
    });

    return list;
  }, [documents]);

  // Unique categories for pills
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    flatDocs.forEach(d => {
      if (d.type === 'annual') set.add('Annual Reports');
      else if (d.type === 'transcript') set.add('Transcripts');
      else if (d.type === 'ppt') set.add('Investor PPTs');
      else if (d.type === 'recording') set.add('Concall Audio/REC');
      else if (d.type === 'rating') set.add('Credit Ratings');
    });
    return Array.from(set);
  }, [flatDocs]);

  // Filtered documents based on search and category tab
  const filteredDocs = useMemo(() => {
    return flatDocs.filter(d => {
      // Category filter
      let matchCat = true;
      if (selectedCategory === 'Annual Reports') matchCat = d.type === 'annual';
      else if (selectedCategory === 'Transcripts') matchCat = d.type === 'transcript';
      else if (selectedCategory === 'Investor PPTs') matchCat = d.type === 'ppt';
      else if (selectedCategory === 'Concall Audio/REC') matchCat = d.type === 'recording';
      else if (selectedCategory === 'Credit Ratings') matchCat = d.type === 'rating';

      // Search query
      const matchSearch = !searchQuery.trim() || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.year && d.year.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.sourceDomain.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [flatDocs, selectedCategory, searchQuery]);

  const visibleDocs = expanded ? filteredDocs : filteredDocs.slice(0, 8);
  const hasDocs = flatDocs.length > 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 sm:p-6 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-4 border-b border-border-hairline">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary">Repository</span>
              <span className="text-[9px] bg-primary/10 text-primary font-mono px-2 py-0.5 rounded-full font-semibold">
                {flatDocs.length} Verified Records
              </span>
            </div>
            <h2 className="font-geist text-xl font-bold text-text-primary leading-tight">
              Exchange Filings &amp; Reports
            </h2>
            <p className="text-[12px] text-text-secondary mt-0.5">
              Audited annual accounts, earnings calls, investor decks, and statutory filings
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports or years..."
              className="w-full bg-surface-subtle border border-border-hairline rounded-md pl-9 pr-3 py-1.5 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map(cat => {
            const count = cat === 'All' 
              ? flatDocs.length 
              : flatDocs.filter(d => {
                  if (cat === 'Annual Reports') return d.type === 'annual';
                  if (cat === 'Transcripts') return d.type === 'transcript';
                  if (cat === 'Investor PPTs') return d.type === 'ppt';
                  if (cat === 'Concall Audio/REC') return d.type === 'recording';
                  if (cat === 'Credit Ratings') return d.type === 'rating';
                  return false;
                }).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-surface-muted border border-border-hairline'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-tertiary'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Document Cards Grid */}
        {!hasDocs ? (
          <div className="py-12 text-center text-text-secondary text-[13px] border border-dashed border-border-hairline rounded-lg">
            <FileText size={28} className="mx-auto mb-2 opacity-30 text-text-tertiary" />
            Company documents and regulatory filings are currently unavailable for this security.
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-10 text-center text-text-secondary text-[12px] border border-dashed border-border-hairline rounded-lg">
            No filings found matching &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleDocs.map((doc, idx) => (
              <FilingCard key={idx} doc={doc} />
            ))}
          </div>
        )}

        {/* Expand / Collapse Footer */}
        {filteredDocs.length > 8 && (
          <div className="mt-5 pt-3 border-t border-border-hairline flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[12px] font-semibold text-primary hover:text-primary-container inline-flex items-center gap-1.5 py-1 px-3 rounded hover:bg-primary-fixed/20 transition-colors"
            >
              {expanded ? (
                <>Show less <ChevronUp size={14} /></>
              ) : (
                <>View all {filteredDocs.length} filings <ChevronDown size={14} /></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Institutional Consensus Outlook Disclaimer Card */}
      <div className="border border-border-hairline rounded-lg bg-surface-canvas p-4 shadow-sm flex items-start gap-3 bg-surface-subtle/50">
        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
          <Info size={14} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
            <h4 className="font-geist text-[13px] font-bold text-text-primary">
              Broker Consensus &amp; Sell-Side Outlook
            </h4>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-text-secondary bg-surface-canvas px-2 py-0.5 rounded border border-border-hairline">
              Institutional Tier
            </span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Sell-side earnings forecast targets and analyst upgrade/downgrade consensus remain unaggregated on zero-config public feeds. All statutory exchange filings, financial statements, and balance sheet disclosures above are directly synchronized with BSE/NSE.
          </p>
        </div>
      </div>
    </div>
  );
}

function FilingCard({ doc }: { doc: FlatDoc }) {
  // Visual config based on document type
  const typeConfig = {
    annual: {
      badge: 'Annual Report',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <FileSpreadsheet size={16} className="text-amber-500" />
    },
    transcript: {
      badge: 'Transcript',
      badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      icon: <Headphones size={16} className="text-indigo-500" />
    },
    ppt: {
      badge: 'Investor Deck',
      badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      icon: <Sparkles size={16} className="text-sky-500" />
    },
    recording: {
      badge: 'Recording',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: <Video size={16} className="text-rose-500" />
    },
    rating: {
      badge: 'Rating Update',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <ShieldCheck size={16} className="text-emerald-500" />
    },
    general: {
      badge: 'Filing',
      badgeClass: 'bg-surface-muted text-text-secondary border-border-hairline',
      icon: <FileText size={16} className="text-primary" />
    }
  }[doc.type];

  return (
    <a 
      href={doc.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3.5 rounded-lg border border-border-hairline bg-surface-subtle/70 hover:bg-surface-muted hover:border-primary/40 transition-all duration-200 group shadow-2xs hover:shadow-xs"
    >
      <div className="flex items-start gap-3 min-w-0 pr-2">
        <div className="w-8 h-8 rounded-md bg-surface-canvas border border-border-hairline flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
          {typeConfig.icon}
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded border ${typeConfig.badgeClass}`}>
              {typeConfig.badge}
            </span>
            {doc.year && (
              <span className="text-[10px] font-mono font-medium text-text-tertiary">
                {doc.year}
              </span>
            )}
            <span className="text-[10px] text-text-tertiary truncate max-w-[120px]">
              {doc.sourceDomain}
            </span>
          </div>

          <span className="font-geist font-semibold text-[13px] text-text-primary group-hover:text-primary transition-colors leading-snug line-clamp-1" title={doc.name}>
            {doc.name}
          </span>
        </div>
      </div>

      <div className="shrink-0 pl-2 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all">
        <ExternalLink size={15} />
      </div>
    </a>
  );
}
