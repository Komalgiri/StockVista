import { ExternalLink, Globe, Building2 } from 'lucide-react';
import type { CompanyProfile } from '@/services/api';

interface CorporateMetadataProps {
  profile?: CompanyProfile | null;
  ratios?: Record<string, string> | null;
}

export function CorporateMetadata({ profile, ratios }: CorporateMetadataProps) {
  const sector = profile?.sector || 'Unclassified';
  const industry = profile?.industry || 'Unclassified';
  const ticker = profile?.ticker || '—';
  const bseCode = profile?.bseCode;
  const website = profile?.website;

  // Clean domain display (e.g. https://www.tcs.com -> tcs.com)
  const cleanDomain = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    }
  };

  const faceValue = ratios?.['Face Value'] ? `₹${ratios['Face Value']}` : '—';
  const bookValue = ratios?.['Book Value'] ? `₹${ratios['Book Value']}` : '—';

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Exchange Registration</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Corporate Metadata</h2>
        </div>
        <Building2 size={18} className="text-text-tertiary" />
      </div>

      <div className="flex-1 flex flex-col justify-between text-[12px] font-inter">
        <MetaRow label="Macro Sector" value={sector} />
        <MetaRow label="Industry Group" value={industry} />
        <MetaRow label="Primary Exchange" value={profile?.exchange ? (profile.exchange.includes('NSE') ? 'National Stock Exchange (NSE)' : 'Bombay Stock Exchange (BSE)') : 'Indian Exchanges'} />
        <MetaRow label="NSE Symbol" value={<span className="font-mono font-semibold text-primary">{profile?.exchange === 'BSE' ? 'BSE Listed Only' : ticker}</span>} />
        
        <MetaRow 
          label="BSE Scrip Code" 
          value={
            bseCode ? (
              profile?.bseUrl ? (
                <a href={profile.bseUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono inline-flex items-center gap-1">
                  {bseCode} <ExternalLink size={11} />
                </a>
              ) : (
                <span className="font-mono">{bseCode}</span>
              )
            ) : (
              <span className="text-text-tertiary">Listed</span>
            )
          } 
        />

        <MetaRow 
          label="Official Website" 
          value={
            website ? (
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 font-medium">
                <Globe size={12} /> {cleanDomain(website)}
              </a>
            ) : (
              <span className="text-text-tertiary">Not available</span>
            )
          } 
        />

        <MetaRow label="Face Value" value={faceValue} />
        <MetaRow label="Book Value / Share" value={bookValue} />

        <div className="flex justify-between items-center py-2.5">
          <span className="text-text-secondary font-medium">Market Segment</span>
          <span className="text-text-primary font-semibold text-right">Regular Rolling Settlement (EQ)</span>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border-hairline gap-2">
      <span className="text-text-secondary font-medium truncate">{label}</span>
      <span className="text-text-primary font-semibold text-right truncate">{value}</span>
    </div>
  );
}
