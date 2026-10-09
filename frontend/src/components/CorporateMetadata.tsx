import { Share } from 'lucide-react';

export function CorporateMetadata() {
  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Listing Profile</h3>
          <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Corporate Metadata</h2>
        </div>
        <button className="text-text-secondary hover:text-primary"><Share size={16} /></button>
      </div>

      <div className="flex-1 flex flex-col justify-between text-[12px] font-inter">
        <MetaRow label="Macro Sector" value="Energy" />
        <MetaRow label="Industry Subgroup" value="Oil Refining & Marketing" />
        <MetaRow label="NSE Listing Date" value="28 Nov 1995" />
        <MetaRow label="Face Value" value="₹10.00" />
        <MetaRow label="ISIN Code" value={<span className="text-primary hover:underline cursor-pointer">INE002A01018</span>} />
        <MetaRow label="Official Domain" value={<span className="text-primary hover:underline cursor-pointer">ril.com</span>} />
        
        <div className="flex justify-between items-start py-3">
          <span className="text-text-secondary font-medium">Auditors</span>
          <span className="text-text-primary font-semibold text-right max-w-[140px]">D T S & Associates LLP, S R B C & CO LLP</span>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border-hairline">
      <span className="text-text-secondary font-medium">{label}</span>
      <span className="text-text-primary font-semibold">{value}</span>
    </div>
  );
}
