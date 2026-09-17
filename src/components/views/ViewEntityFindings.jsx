import React, { useState } from 'react';
import { 
  ShieldAlert, 
  GitMerge, 
  ListOrdered, 
  TrendingUp, 
  FileText, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  Info
} from 'lucide-react';
import { ConcernBadge } from '../common/ConcernBadge';
import { getRuleTranslation } from '../../constants/rules';

export const ViewEntityFindings = ({
  entityData,
  onOpenModal,
  initialTab = "execution",
  onSelectIncident,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!entityData) return null;

  const {
    entity_id,
    entity_name,
    sector,
    indicators = {},
    execution_gaps = [],
    candidate_incidents = [],
    prioritised_cases = [],
    trend_analysis = [],
  } = entityData;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/60 uppercase">
              Feature 1 • Execution Gaps
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{entity_id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Supervisory Execution Gap Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Audit of documented SOC escalation rules against actual case outcomes. Pinpoints serious unescalated cases, rapid closures lacking notes, and repeated alerts.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Execution Gaps</div>
            <div className="text-2xl font-black font-mono text-amber-400">
              {execution_gaps.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("execution")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "execution"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800"
          }`}
        >
          <ShieldAlert size={14} />
          <span>Execution Gaps ({execution_gaps.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "incidents"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800"
          }`}
        >
          <GitMerge size={14} />
          <span>Candidate Incidents ({candidate_incidents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "queue"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
              : "bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800"
          }`}
        >
          <ListOrdered size={14} />
          <span>Prioritised Review Queue ({prioritised_cases.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trends")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "trends"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800"
          }`}
        >
          <TrendingUp size={14} />
          <span>Historical Trend Analysis ({trend_analysis.length} Days)</span>
        </button>
      </div>

      {/* TAB 1: EXECUTION GAPS */}
      {activeTab === "execution" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Showing verified behavioural deviations across rules EG-01, EG-02, EG-03, and EG-04</span>
            <span className="font-mono text-[11px] text-cyan-400">Click card for audit evidence</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {execution_gaps.map((gap) => {
              const trans = getRuleTranslation(gap.rule_code);
              return (
                <div
                  key={gap.finding_id}
                  className="glass-card rounded-xl p-5 border border-slate-700/80 hover:border-amber-500/60 transition-all duration-200 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 font-mono font-bold text-xs flex-shrink-0">
                        {gap.rule_code}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-cyan-300 font-bold">{gap.finding_id}</span>
                          <ConcernBadge level={gap.concern_level} size="sm" />
                        </div>
                        <h4 className="text-base font-bold text-white mt-0.5">{trans.plainTitle}</h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenModal(gap.finding_id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/60 text-xs font-semibold flex items-center space-x-1.5 transition-all self-start sm:self-auto shadow-sm"
                    >
                      <FileText size={13} />
                      <span>Inspect Evidence</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                    {gap.explanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                      <span className="font-bold text-slate-400 block text-[10px] uppercase mb-1">
                        Operational Concern:
                      </span>
                      <span className="text-slate-300 leading-relaxed">{trans.whatNoticed}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase mb-1">
                        Supervisory Action:
                      </span>
                      <span className="text-slate-300 leading-relaxed">{trans.supervisorAction}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE INCIDENTS */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Multi-factor correlated alert chains identified across shared assets, usernames, temporal windows, and escalating severity.
          </div>

          <div className="grid grid-cols-1 gap-4">
            {candidate_incidents.map((inc) => (
              <div
                key={inc.finding_id}
                className="glass-card rounded-xl p-5 border border-slate-700/80 hover:border-cyan-500/60 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs flex-shrink-0">
                      IR-01
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-cyan-300 font-bold">{inc.finding_id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/60 text-purple-300 text-[10px] font-mono font-bold uppercase">
                          Link Strength: {inc.evidence?.link_strength || "HIGH"}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        Candidate Multi-Stage Incident: {inc.evidence?.matched_factors?.length || 5} Correlated Factors
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onSelectIncident && onSelectIncident(inc.finding_id)}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/60 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <GitMerge size={13} />
                      <span>Reconstruct Timeline</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
                  {inc.explanation}
                </p>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-500 self-center">Matched Correlation:</span>
                  {(inc.evidence?.matched_factors || []).map((factor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-slate-800 font-mono text-[11px]"
                    >
                      &bull; {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRIORITISED REVIEW QUEUE */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Algorithmic ranking of individual SOC cases based on asset criticality, response duration, and evidence quality signals.
          </div>

          <div className="space-y-3">
            {prioritised_cases.map((pc) => {
              const linkedFinding = (execution_gaps || []).find(eg => 
                eg.evidence?.case_ids?.includes(pc.case_id) || 
                eg.evidence?.alert_ids?.includes(pc.primary_alert_id)
              );

              return (
                <div
                  key={pc.case_id}
                  className="glass-card rounded-xl p-4.5 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                        #{pc.rank}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Case {pc.case_id} &bull; {pc.asset_name}
                      </h4>
                      <ConcernBadge level={pc.priority_level} size="sm" label={`Priority: ${pc.priority_level}`} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {pc.justification_reasons.map((r, idx) => (
                        <span key={idx} className="bg-slate-950/80 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-800/80">
                          &bull; {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {linkedFinding ? (
                    <button
                      type="button"
                      onClick={() => onOpenModal(linkedFinding.finding_id)}
                      className="self-start md:self-center px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-750 hover:from-slate-750 hover:to-slate-700 text-cyan-300 font-semibold rounded-xl text-xs border border-slate-700 hover:border-cyan-500/60 shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap"
                      title={`Inspect finding evidence ${linkedFinding.finding_id}`}
                    >
                      <FileText size={13} />
                      <span>Inspect Finding Evidence</span>
                      <ArrowRight size={12} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="self-start md:self-center px-4 py-2 bg-slate-900/60 text-slate-600 font-semibold rounded-xl text-xs border border-slate-800/60 cursor-not-allowed whitespace-nowrap flex items-center space-x-1.5"
                      title="No standalone supervisory finding generated for this case"
                    >
                      <Lock size={12} />
                      <span>No Linked Finding</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: HISTORICAL LOG TRENDS */}
      {activeTab === "trends" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Temporal distribution of recorded alert volume vs identified supervisory execution gaps across observation dates.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {trend_analysis.map((t) => (
              <div key={t.date} className="glass-card rounded-xl p-4 border border-slate-800/90 font-mono">
                <span className="text-xs font-sans font-bold text-white block mb-2">{t.date}</span>
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Alerts:</span>
                  <span className="text-white font-bold">{t.alert_count}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5">
                  <span className="text-slate-400">Execution Gaps:</span>
                  <span className="text-amber-400 font-bold">{t.execution_gap_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewEntityFindings;
