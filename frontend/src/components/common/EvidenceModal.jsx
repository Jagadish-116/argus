import React, { useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  Search
} from 'lucide-react';
import { ConcernBadge } from './ConcernBadge';
import { getRuleTranslation } from '../../constants/rules';

export const EvidenceModal = ({ data, onClose }) => {
  if (!data) return null;

  const trans = getRuleTranslation(data.rule_code);

  // Close modal when Escape key is pressed; cleanup on unmount
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const copyJson = () => {
    const jsonStr = JSON.stringify(data.evidence?.raw_snippets || data.evidence, null, 2);
    navigator.clipboard?.writeText(jsonStr);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="glass-panel border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-extrabold text-sm font-mono shadow-[0_0_12px_rgba(6,182,212,0.25)] flex-shrink-0">
              {data.rule_code}
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-cyan-300 font-bold">{data.finding_id}</span>
                <ConcernBadge level={data.concern_level} size="sm" />
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 tracking-tight truncate">
                {trans.plainTitle}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
            title="Close (Escape)"
          >
            <X size={16} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs custom-scrollbar">
          
          {/* SUPERVISORY RATIONALE */}
          <div className="glass-card rounded-xl p-4 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              <FileText size={14} />
              <span>Supervisory Finding Rationale</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
              {data.explanation}
            </p>
          </div>

          {/* SUPERVISOR GUIDANCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="glass-card rounded-xl p-4 border-l-4 border-l-cyan-500 border-slate-800/80">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] block mb-1">
                Why Review This:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {trans.whyReview}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 border-l-4 border-l-amber-500 border-slate-800/80">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block mb-1">
                Supervisor Should Verify:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {trans.supervisorAction}
              </p>
            </div>
          </div>

          {/* AFFECTED RECORDS TRACEABILITY */}
          {data.affected_records && (
            <div className="glass-card rounded-xl p-4 border border-slate-800/80">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-2.5">
                Traceable Record Identifiers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-sans font-semibold block text-[10px] mb-0.5">Alert IDs:</span>
                  <span className="text-cyan-300 font-bold break-all">
                    {data.affected_records.alert_ids?.join(", ") || "None"}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-sans font-semibold block text-[10px] mb-0.5">Case IDs:</span>
                  <span className="text-cyan-300 font-bold break-all">
                    {data.affected_records.case_ids?.join(", ") || "None"}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-sans font-semibold block text-[10px] mb-0.5">Asset IDs:</span>
                  <span className="text-cyan-300 font-bold break-all">
                    {data.affected_records.asset_ids?.join(", ") || "None"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RAW SNIPPETS JSON VIEWER */}
          <div className="glass-card rounded-xl p-4 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                <Terminal size={14} className="text-cyan-400" />
                <span>Raw Evidence Log Traceability (JSON)</span>
              </div>
              <button
                type="button"
                onClick={copyJson}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 text-[11px] transition-colors border border-slate-700"
                title="Copy raw evidence JSON"
              >
                <Copy size={11} />
                <span>Copy</span>
              </button>
            </div>
            <pre className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/90 text-cyan-200 font-mono text-[11px] overflow-x-auto max-h-52 custom-scrollbar shadow-inner leading-relaxed">
              {JSON.stringify(data.evidence?.raw_snippets || data.evidence, null, 2)}
            </pre>
          </div>

          {/* HUMAN VERIFICATION NOTICE */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-[11px] flex items-center space-x-2">
            <CheckCircle2 size={15} className="text-cyan-400 flex-shrink-0" />
            <span>{data.human_verification_notice || "Supervisory verification required. Decision support for human supervisory review."}</span>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Press ESC or click outside to dismiss</span>
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-xl text-xs font-semibold border border-slate-600 shadow-md transition-all"
          >
            Close Evidence Window
          </button>
        </div>

      </div>
    </div>
  );
};

export default EvidenceModal;
