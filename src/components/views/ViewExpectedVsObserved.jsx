import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText,
  FileCheck,
  Scale,
  ArrowRight,
  HelpCircle,
  Info
} from 'lucide-react';
import { ConcernBadge } from '../common/ConcernBadge';

export const ViewExpectedVsObserved = ({
  incidentId,
  incidentData,
  entityData,
  candidateIncidents = [],
  onLoadIncident,
  onOpenModal,
}) => {
  if (!entityData) return null;

  const {
    entity_id,
    indicators = {},
    execution_gaps = [],
  } = entityData;

  const evoResponse = incidentData?.expected_vs_observed_response;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-600/60 uppercase">
              Feature 4 • Expected vs Observed
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{entity_id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Operational Baseline vs Recorded Evidence
          </h2>
          <div className="mt-1 flex items-center space-x-2 text-xs sm:text-sm text-emerald-200">
            <HelpCircle size={14} className="text-emerald-400 flex-shrink-0" />
            <span className="font-semibold italic">“What should have happened vs what the evidence shows?”</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Directly contrasts documented SOC operational baselines against immutable evidence recorded in alerts and case logs. Highlights evidence-backed discrepancies that warrant human supervisory review.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 self-start md:self-auto shadow-md">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Execution Gaps</div>
            <div className="text-2xl font-black font-mono text-amber-400">
              {execution_gaps.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Scale size={20} />
          </div>
        </div>
      </div>

      {/* CANDIDATE INCIDENT CONTEXT (IF LOADED) */}
      {evoResponse && (
        <div className="glass-panel rounded-2xl p-4.5 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-950/40 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                Candidate Incident Focus:
              </span>
              <span className="font-mono text-xs text-white font-semibold">
                {incidentId || incidentData?.incident_id}
              </span>
            </div>
            {candidateIncidents.length > 1 && (
              <select
                value={incidentId || incidentData?.incident_id}
                onChange={(e) => onLoadIncident && onLoadIncident(e.target.value)}
                className="bg-slate-900 text-purple-300 border border-purple-700/60 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer"
              >
                {candidateIncidents.map((c) => (
                  <option key={c.finding_id} value={c.finding_id}>
                    {c.finding_id}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1 uppercase text-[10px]">Expected Incident Baseline:</span>
              <span className="text-slate-200">{evoResponse.expected_response}</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1 uppercase text-[10px]">Recorded Case Action:</span>
              <span className="text-slate-200">{evoResponse.observed_response}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-COLUMN STRUCTURE: EXPECTED / OBSERVED / DIFFERENCE REQUIRING REVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* COLUMN 1: EXPECTED */}
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-cyan-500 border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Configured Baseline
              </span>
              <h3 className="text-base font-bold text-white">EXPECTED</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">1. Supervisory Escalation Policy:</span>
              <p className="text-slate-300 leading-relaxed">
                Documented policy requires that all High and Critical severity alerts receive supervisory escalation before case closure.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 block pt-0.5">&bull; Baseline: 0% unescalated critical closures</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">2. Investigation Duration & Depth:</span>
              <p className="text-slate-300 leading-relaxed">
                Serious cases require adequate investigation time (threshold: &ge; 5.0 mins) or substantive diagnostic notes and escalation.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 block pt-0.5">&bull; Baseline: Substantive analysis prior to closure</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">3. Individual Diagnostic Notes:</span>
              <p className="text-slate-300 leading-relaxed">
                Case logs should record distinct evidence-grounded diagnostic reasoning rather than generic copy-pasted templates.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 block pt-0.5">&bull; Baseline: Tailored root-cause notes per case</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">4. Root-Cause Remediation:</span>
              <p className="text-slate-300 leading-relaxed">
                Remediating an alert on an asset should prevent immediate recurrence of the same alert signature within 48 hours.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 block pt-0.5">&bull; Baseline: Effective technical remediation</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: OBSERVED */}
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-amber-500 border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Recorded Case Evidence
              </span>
              <h3 className="text-base font-bold text-white">OBSERVED</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">1. Unescalated Closures:</span>
              <p className="text-slate-300 leading-relaxed">
                {indicators.unescalated_critical_count || 0} of {indicators.total_critical_alerts || 0} High/Critical alerts ({((indicators.unescalated_critical_ratio || 0) * 100).toFixed(1)}%) were closed directly without recorded supervisory escalation.
              </p>
              <span className="text-[10px] font-mono text-amber-400 block pt-0.5">&bull; Evidence: Case escalation_flag = false</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">2. Rapid Closures with Weak Notes:</span>
              <p className="text-slate-300 leading-relaxed">
                Median serious alert closure duration is {indicators.median_serious_closure_mins || 3.2} mins. {indicators.rapid_closure_count || 0} cases closed in &lt; 5 mins combined with brief or generic notes.
              </p>
              <span className="text-[10px] font-mono text-amber-400 block pt-0.5">&bull; Evidence: Duration &lt; 5m + note characters &lt; 20</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">3. Repetitive Template Notes:</span>
              <p className="text-slate-300 leading-relaxed">
                {indicators.template_cluster_count || 0} cases contain identical repetitive investigation notes (e.g. "Reviewed alert.", "Quick check.") across multiple shift tickets.
              </p>
              <span className="text-[10px] font-mono text-amber-400 block pt-0.5">&bull; Evidence: Exact note string clusters across cases</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">4. Repeated Recurring Alerts:</span>
              <p className="text-slate-300 leading-relaxed">
                {indicators.repeated_unremediated_count || 0} recurring alert instances triggered on the same asset within 48 hours without root-cause remediation.
              </p>
              <span className="text-[10px] font-mono text-amber-400 block pt-0.5">&bull; Evidence: Repeated alert signature counts &gt; threshold</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: DIFFERENCE REQUIRING REVIEW */}
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-rose-500 border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 flex-shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                Evidence-Backed Delta
              </span>
              <h3 className="text-base font-bold text-white truncate">DIFFERENCE REQUIRING REVIEW</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
              <span className="font-bold text-rose-300 block">Delta 1: Missing Supervisory Oversight</span>
              <p className="text-slate-300 leading-relaxed">
                High/Critical events were resolved without supervisor notification, creating procedural blind spots where threats may persist undetected.
              </p>
              <span className="text-[10px] font-mono text-rose-400 block pt-0.5">&bull; Action: Verify if formal escalation was required</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
              <span className="font-bold text-rose-300 block">Delta 2: Premature Resolution Risk</span>
              <p className="text-slate-300 leading-relaxed">
                Fast closure alone is not sufficient, but paired with minimal notes and missing escalation, it suggests cases were closed without adequate diagnostic triage.
              </p>
              <span className="text-[10px] font-mono text-rose-400 block pt-0.5">&bull; Action: Re-evaluate investigation adequacy</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
              <span className="font-bold text-rose-300 block">Delta 3: Procedural Rubber-Stamping</span>
              <p className="text-slate-300 leading-relaxed">
                Templated notes suggest analyst effort was directed at meeting closure velocity KPIs rather than conducting substantive technical inquiry.
              </p>
              <span className="text-[10px] font-mono text-rose-400 block pt-0.5">&bull; Action: Audit ticket quality and analyst workload</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
              <span className="font-bold text-rose-300 block">Delta 4: Unremediated Asset Vulnerability</span>
              <p className="text-slate-300 leading-relaxed">
                Repeated alert recurrence indicates alerts are being dismissed as individual incidents rather than triggering engineering remediation.
              </p>
              <span className="text-[10px] font-mono text-rose-400 block pt-0.5">&bull; Action: Ensure root-cause remediation was applied</span>
            </div>
          </div>
        </div>

      </div>

      {/* DISCREPANCY EVIDENCE DRILL-DOWN LIST (USING REAL FINDING IDS) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileCheck size={16} className="text-emerald-400" />
              <span>Evidence-Backed Execution Gaps for Supervisory Review</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific findings identified by comparing configured baselines against recorded evidence
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {execution_gaps.length} Discrepancy Findings
          </span>
        </div>

        {execution_gaps.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-mono">
            No baseline discrepancies flagged for this entity.
          </div>
        ) : (
          <div className="space-y-3">
            {execution_gaps.slice(0, 6).map((gap) => (
              <div
                key={gap.finding_id}
                className="glass-card rounded-xl p-4 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:border-emerald-500/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {gap.rule_code}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">{gap.finding_id}</span>
                    <ConcernBadge level={gap.concern_level} size="sm" />
                  </div>
                  <div className="text-xs text-slate-200">{gap.explanation}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenModal && onOpenModal(gap.finding_id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 hover:border-cyan-500/60 transition-colors flex items-center space-x-1.5 self-start sm:self-auto shadow-sm whitespace-nowrap"
                  title={`Inspect finding evidence for ${gap.finding_id}`}
                >
                  <FileText size={13} />
                  <span>Inspect Evidence</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUPERVISORY NOTICE */}
      <div className="p-3.5 rounded-xl glass-card text-center text-xs text-slate-400 border border-white/[0.06]">
        <div className="flex items-center justify-center space-x-1.5 font-semibold text-slate-300 mb-0.5">
          <Info size={13} className="text-emerald-400" />
          <span>Supervisory Decision Support Mandate</span>
        </div>
        Feature 4 contrasts configured baseline expectations with recorded case telemetry to highlight operational discrepancies. It provides objective decision support for human cyber supervisors and does not simulate ungrounded counterfactual scenarios.
      </div>

    </div>
  );
};

export default ViewExpectedVsObserved;
