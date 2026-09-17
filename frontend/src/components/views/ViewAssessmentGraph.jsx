import React, { useState } from 'react';
import { 
  BarChart2, 
  Building2, 
  Info, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp,
  Sliders,
  GitBranch,
  Layers
} from 'lucide-react';
import { ENTITY_NAMES, ENTITY_SECTORS } from '../../constants/rules';
import { IncidentDecisionPipeline } from '../common/IncidentDecisionPipeline';

export const ViewAssessmentGraph = ({
  entityData,
  assetsData,
  overviewData,
  selectedEntityId,
  onSelectEntity,
  onNavigateToFeature,
}) => {
  const [activeGraphTab, setActiveGraphTab] = useState("overview"); // "overview" | "decision-tree"

  const executionGaps = entityData?.execution_gaps || [];
  const negativeSpaces = assetsData?.negative_space_findings || entityData?.negative_spaces || [];
  const allFindings = [...executionGaps, ...negativeSpaces];

  const ruleCategories = [
    { code: "EG-01", label: "Missing escalation / un-escalated serious alert", featureId: "execution-gaps", color: "from-rose-500 to-red-600", border: "border-rose-500" },
    { code: "EG-02", label: "Possible premature closure (supervisory verification required)", featureId: "execution-gaps", color: "from-amber-500 to-orange-600", border: "border-amber-500" },
    { code: "EG-03", label: "Investigation evidence quality / repetitive template concern", featureId: "execution-gaps", color: "from-yellow-500 to-amber-600", border: "border-yellow-500" },
    { code: "EG-04", label: "Repeated unremediated alerts on same asset", featureId: "execution-gaps", color: "from-purple-500 to-indigo-600", border: "border-purple-500" },
    { code: "NS-01", label: "Critical asset monitoring evidence void", featureId: "negative-space", color: "from-cyan-500 to-blue-600", border: "border-cyan-500" },
    { code: "NS-02", label: "Expected operational process evidence absent", featureId: "negative-space", color: "from-blue-500 to-indigo-600", border: "border-blue-500" },
  ];

  const findingCounts = ruleCategories.map(rc => ({
    ...rc,
    count: allFindings.filter(f => f.rule_code === rc.code).length,
  }));

  const maxCount = Math.max(...findingCounts.map(f => f.count), 1);

  const peerBenchmarks = overviewData?.peer_benchmark || [];
  const maxPeerRatio = Math.max(...peerBenchmarks.map(p => p.unescalated_critical_ratio_percent || 0), 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* PAGE HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-600/60 uppercase">
              Supervisory Synthesis
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{selectedEntityId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            ARGUS Supervisory Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Visual overview of evidence-backed supervisory indicators for the selected entity.
          </p>
        </div>

        {/* ENTITY SELECTOR */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex flex-col space-y-2 min-w-[220px] self-start md:self-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Viewing Entity</span>
          <div className="flex gap-1.5">
            {["CSE-ALPHA", "CSE-BETA", "CSE-GAMMA"].map((eid) => (
              <button
                key={eid}
                type="button"
                onClick={() => onSelectEntity(eid)}
                className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  selectedEntityId === eid
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {eid.replace("CSE-", "")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex flex-wrap gap-2 border-b border-[#334155] pb-2">
        <button
          type="button"
          onClick={() => setActiveGraphTab("overview")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeGraphTab === "overview"
              ? "bg-[#06B6D4] text-[#0F172A] shadow-md font-extrabold"
              : "bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]"
          }`}
        >
          <BarChart2 size={14} />
          <span>Supervisory Assessment Profile (Graphs 1 & 2)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveGraphTab("decision-tree")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeGraphTab === "decision-tree"
              ? "bg-[#06B6D4] text-[#0F172A] shadow-md font-extrabold"
              : "bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]"
          }`}
        >
          <GitBranch size={14} />
          <span>Incident Decision Pipeline (Interactive Graph Module)</span>
        </button>
      </div>

      {/* GRAPH MODULE: INCIDENT DECISION PIPELINE */}
      {activeGraphTab === "decision-tree" && (
        <IncidentDecisionPipeline />
      )}

      {/* OVERVIEW GRAPHS 1 & 2 */}
      {activeGraphTab === "overview" && (
        <>
          {/* GRAPH 1: SUPERVISORY FINDINGS PROFILE (HORIZONTAL BAR CHART) */}
          <div className="argus-panel p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <BarChart2 size={18} className="text-cyan-400" />
              <span>Graph 1: Supervisory Findings Profile ({ENTITY_NAMES[selectedEntityId] || selectedEntityId})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Actual count of evidence-backed findings calculated across ARGUS detector rules.
            </p>
          </div>
          <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/80">
            Total Verified Findings: {allFindings.length}
          </div>
        </div>

        {/* BARS CONTAINER */}
        <div className="space-y-4">
          {findingCounts.map((item) => {
            const widthPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div key={item.code} className="space-y-1.5 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-16 font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-center">
                      {item.code}
                    </span>
                    <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className="font-mono font-bold text-sm text-white">
                      {item.count} <span className="text-[11px] font-normal text-slate-400">findings</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateToFeature(item.featureId)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center space-x-0.5 transition-colors"
                    >
                      <span>Drilldown</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>

                {/* HORIZONTAL BAR TRACK */}
                <div className="w-full h-4 bg-slate-950/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 ease-out shadow-sm`}
                    style={{ width: `${Math.max(widthPct, item.count > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GRAPH 2: PEER BEHAVIOUR COMPARISON */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Building2 size={18} className="text-blue-400" />
              <span>Graph 2: Peer Behaviour Comparison — Un-escalated Serious Alert Ratio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative metric: Percentage of High/Critical alerts closed without supervisory escalation (API-derived).
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Sectoral Baseline Context
          </span>
        </div>

        <div className="space-y-4">
          {peerBenchmarks.map((bm) => {
            const isSelected = bm.entity_id === selectedEntityId;
            const ratio = bm.unescalated_critical_ratio_percent || 0;
            const widthPct = (ratio / (maxPeerRatio || 100)) * 100;

            return (
              <div
                key={bm.entity_id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected 
                    ? "bg-cyan-950/30 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "bg-slate-950/50 border-slate-800/80"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{bm.entity_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({bm.entity_id})</span>
                    {isSelected && (
                      <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm font-bold text-white">
                    <span className={ratio > 15 ? "text-rose-400" : "text-emerald-400"}>
                      {ratio}%
                    </span>
                    <span className="text-[11px] font-normal text-slate-400 ml-1">un-escalated</span>
                  </div>
                </div>

                {/* BAR TRACK */}
                <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ratio > 15
                        ? "bg-gradient-to-r from-amber-500 to-rose-600"
                        : "bg-gradient-to-r from-teal-500 to-cyan-500"
                    }`}
                    style={{ width: `${Math.max(widthPct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RESTRAINED INTERPRETATION DISCLAIMER */}
      <div className="p-4 rounded-lg bg-[#1E293B] text-center text-xs text-[#94A3B8] leading-relaxed border border-[#334155] shadow-sm">
        <div className="flex items-center justify-center space-x-1.5 font-semibold text-[#F8FAFC] mb-1">
          <Info size={14} className="text-[#06B6D4]" />
          <span>Supervisory Assessment Interpretation</span>
        </div>
        These visualisations summarise evidence-backed supervisory indicators. They prioritise areas for human review and do not declare an entity secure, insecure, compromised, or compliant.
      </div>
    </>
  )}

    </div>
  );
};

export default ViewAssessmentGraph;
