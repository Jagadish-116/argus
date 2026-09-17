import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  ArrowRight, 
  ArrowDown,
  CheckCircle2, 
  Terminal, 
  FileText, 
  ShieldAlert, 
  Filter,
  Layers,
  HelpCircle,
  Info
} from 'lucide-react';
import { ConcernBadge } from '../common/ConcernBadge';
import { getRuleTranslation } from '../../constants/rules';

export const ViewEvidenceTraceability = ({
  entityData,
  assetsData,
  onOpenModal,
}) => {
  const [filterRule, setFilterRule] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  if (!entityData) return null;

  const {
    entity_id,
    execution_gaps = [],
  } = entityData;

  const negative_spaces = assetsData?.negative_space_findings || entityData.negative_spaces || [];

  // Combine verifiable analytical findings that correspond to /api/finding/{finding_id}
  const legitimateFindings = [
    ...execution_gaps,
    ...negative_spaces,
  ];

  const filteredFindings = legitimateFindings.filter((f) => {
    if (filterRule !== "ALL" && f.rule_code !== filterRule) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchId = f.finding_id?.toLowerCase().includes(term);
      const matchRule = f.rule_code?.toLowerCase().includes(term);
      const matchExpl = f.explanation?.toLowerCase().includes(term);
      return matchId || matchRule || matchExpl;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-600/60 uppercase">
              Feature 6 • Evidence Traceability
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{entity_id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Supervisory Evidence Traceability
          </h2>
          <div className="mt-1 flex items-center space-x-2 text-xs sm:text-sm text-rose-200">
            <HelpCircle size={14} className="text-rose-400 flex-shrink-0" />
            <span className="font-semibold italic">“Why did ARGUS produce this finding?”</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Exposes the deterministic audit trail behind every supervisory finding. Demonstrates how rules evaluate raw operational telemetry to generate evidence-backed rationale for human review.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 self-start md:self-auto shadow-md">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Findings Traceable</div>
            <div className="text-2xl font-black font-mono text-rose-400">
              {legitimateFindings.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <FileCheck size={20} />
          </div>
        </div>
      </div>

      {/* 4-STAGE AUDIT TRAIL PIPELINE BANNER */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 shadow-xl">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3 font-semibold">
          Audit Traceability Flow:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
              1
            </span>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400">FINDING</div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Identified Rule Deviation</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Automated detection flags evidence anomaly</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500 text-amber-300 font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
              2
            </span>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">WHY ARGUS FLAGGED IT</div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Supervisory Rationale</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Why this pattern represents operational concern</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500 text-purple-300 font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
              3
            </span>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider text-purple-400">SUPPORTING EVIDENCE</div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Underlying Records</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Alert IDs, Case IDs, and raw log records</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
              4
            </span>
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">HUMAN VERIFICATION</div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Supervisory Action</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Guidance for supervisor to validate operational context</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Filter finding ID, rule, or explanation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 shadow-inner"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {["ALL", "EG-01", "EG-02", "EG-03", "EG-04", "NS-01", "NS-02"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setFilterRule(code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterRule === code
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* TRACEABLE FINDINGS LIST */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 font-mono text-xs">
            No matching findings found for the selected filter.
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const trans = getRuleTranslation(finding.rule_code);
            const affectedAlerts = finding.affected_records?.alert_ids || finding.evidence?.alert_ids || [];
            const affectedCases = finding.affected_records?.case_ids || finding.evidence?.case_ids || [];
            const affectedAssets = finding.affected_records?.asset_ids || (finding.asset_name ? [finding.asset_name] : []);

            return (
              <div
                key={finding.finding_id}
                className="glass-card rounded-2xl p-5 border border-slate-700/80 hover:border-rose-500/50 transition-all shadow-md space-y-3"
              >
                {/* 1. FINDING HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {finding.rule_code}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-cyan-300">{finding.finding_id}</span>
                        <ConcernBadge level={finding.concern_level} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{trans.plainTitle}</h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenModal && onOpenModal(finding.finding_id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-semibold border border-slate-700 hover:border-cyan-500/60 transition-all flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
                    title={`Inspect full forensic evidence for ${finding.finding_id}`}
                  >
                    <FileText size={13} />
                    <span>Inspect Evidence</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* 2. FINDING EXPLANATION */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {finding.explanation}
                </p>

                {/* 3-PART TRACEABILITY BREAKDOWN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] pt-1">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1 uppercase text-[10px] tracking-wider">
                      Why ARGUS Flagged It:
                    </span>
                    <span className="text-slate-300 leading-relaxed block">{trans.whyReview}</span>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-1 uppercase text-[10px] tracking-wider">
                      Supporting Evidence:
                    </span>
                    <div className="space-y-0.5 text-slate-300 font-mono text-[10px]">
                      {affectedAlerts.length > 0 && (
                        <div>Alerts: <span className="text-cyan-200">{affectedAlerts.join(", ")}</span></div>
                      )}
                      {affectedCases.length > 0 && (
                        <div>Cases: <span className="text-cyan-200">{affectedCases.join(", ")}</span></div>
                      )}
                      {affectedAssets.length > 0 && (
                        <div>Assets: <span className="text-cyan-200">{affectedAssets.join(", ")}</span></div>
                      )}
                      {affectedAlerts.length === 0 && affectedCases.length === 0 && affectedAssets.length === 0 && (
                        <div className="text-slate-500">Asset Telemetry Record</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1 uppercase text-[10px] tracking-wider">
                      Human Verification:
                    </span>
                    <span className="text-slate-300 leading-relaxed block">{trans.supervisorAction}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default ViewEvidenceTraceability;
