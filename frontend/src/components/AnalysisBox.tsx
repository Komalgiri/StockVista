import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { AnalysisData } from '@/services/api';

export function AnalysisBox({ analysis }: { analysis?: AnalysisData | null }) {
  const pros = analysis?.pros || [];
  const cons = analysis?.cons || [];

  if (pros.length === 0 && cons.length === 0) {
    return null;
  }

  return (
    <div className="border border-border-hairline rounded-lg bg-surface-canvas p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary mb-1">Qualitative Assessment</h3>
        <h2 className="font-geist text-[18px] font-bold text-text-primary leading-tight">Investment Strengths & Limitations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="border border-emerald-200/70 rounded-xl p-4 sm:p-5 bg-emerald-50/40 flex flex-col shadow-xs">
          <div className="flex items-center gap-2 mb-3.5 text-emerald-700 font-geist font-bold text-[14px]">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>Investment Strengths</span>
          </div>
          {pros.length > 0 ? (
            <ul className="flex flex-col gap-2.5 text-[12px] text-slate-700 leading-relaxed">
              {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[12px] text-slate-400 italic">No key automated strengths flagged.</div>
          )}
        </div>

        {/* Cons */}
        <div className="border border-rose-200/70 rounded-xl p-4 sm:p-5 bg-rose-50/40 flex flex-col shadow-xs">
          <div className="flex items-center gap-2 mb-3.5 text-rose-700 font-geist font-bold text-[14px]">
            <AlertCircle size={18} className="text-rose-600" />
            <span>Key Risk Factors</span>
          </div>
          {cons.length > 0 ? (
            <ul className="flex flex-col gap-2.5 text-[12px] text-slate-700 leading-relaxed">
              {cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-[12px] text-slate-400 italic">No key automated risk factors flagged.</div>
          )}
        </div>
      </div>
    </div>
  );
}
