import React, { useState } from 'react';
import { 
  GitMerge, 
  Clock, 
  User, 
  Server, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  ShieldAlert,
  ArrowRight,
  FileText,
  Info,
  HelpCircle
} from 'lucide-react';
import { ConcernBadge } from '../common/ConcernBadge';

export const ViewIncidentReconstruction = ({
  incidentId,
  incidentData,
  candidateIncidents = [],
  onLoadIncident,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!incidentData) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 space-y-3">
        <GitMerge size={32} className="mx-auto text-purple-400 animate-pulse" />
        <h3 className="text-lg font-bold text-white">Loading Incident Reconstruction Data</h3>
        <p className="text-xs">Reconstructing multi-factor alert correlation across operational evidence...</p>
      </div>
    );
  }

  const {
    incident_id,
    entity_id,
    title = "Candidate Incident — Potentially related alerts. Human verification required.",
    asset_id,
    user_id,
    time_window,
    link_strength,
    matched_factors = [],
    chronological_alerts = [],
    alert_sequence = [],
    associated_cases = [],
    explanation,
    human_verification_requirement,
    human_verification_notice,
    evidence = {},
  } = incidentData;

  const alerts = chronological_alerts.length > 0 ? chronological_alerts : alert_sequence;
  const primaryAsset = asset_id || incidentData.primary_asset || evidence.asset_ids?.[0] || "Correlated Asset Cluster";
  const targetUser = user_id || incidentData.target_user || "Operator Context";
  const rawStrength = typeof link_strength === 'string' ? link_strength.replace(/.*Enum\./, '') : (link_strength || "HIGH");
  const verificationText = human_verification_requirement || human_verification_notice || "Human supervisor verification required. Link Strength is based on matched relationship indicators. Correlation does not prove alerts belong to the same attack.";

  const SUPPORTED_FACTORS = [
    { factor: "same_asset", label: "Shared Asset", desc: "Alerts share physical or logical infrastructure asset", icon: Server },
    { factor: "same_user", label: "Shared User Account", desc: "Correlated under common account or operator identity", icon: User },
    { factor: "temporal_proximity", label: "Temporal Proximity", desc: "Alerts clustered within a close operational time window", icon: Clock },
    { factor: "severity_progression", label: "Severity Progression", desc: "Sequential progression from lower to higher severity", icon: ShieldAlert },
    { factor: "related_alert_categories", label: "Related Alert Categories", desc: "Complementary activity categories across alert stages", icon: Layers },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-600/60 uppercase">
              Feature 3 • Incident Reconstruction
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{incident_id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Candidate Incident Reconstruction
          </h2>
          <div className="mt-1 flex items-center space-x-2 text-xs sm:text-sm text-purple-200">
            <HelpCircle size={14} className="text-purple-400 flex-shrink-0" />
            <span className="font-semibold italic">“Which alerts may be related?”</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Correlates discrete alerts across operational evidence using deterministic relationship factors. Designed for supervisory evaluation to determine whether isolated alerts represent a coordinated incident.
          </p>
        </div>

        {/* CANDIDATE INCIDENT SELECTOR */}
        {candidateIncidents.length > 0 && (
          <div className="flex flex-col space-y-1.5 self-start md:self-auto min-w-[240px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Select Candidate Incident
            </span>
            <select
              value={incident_id}
              onChange={(e) => onLoadIncident && onLoadIncident(e.target.value)}
              className="bg-slate-900/95 text-purple-300 border border-purple-500/50 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer shadow-lg"
            >
              {candidateIncidents.map((c) => (
                <option key={c.finding_id} value={c.finding_id}>
                  {c.finding_id} ({c.evidence?.matched_factors?.length || 3} factors)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CORE CANDIDATE INCIDENT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* LEFT 2 COLUMNS: CORRELATION FACTORS & WHY ARGUS LINKED THEM */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-700/80 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                Rule IR-01 Candidate Correlation
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Candidate Incident — Potentially related alerts. Human verification required.
              </h3>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/70 text-purple-300 font-mono text-xs font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)] inline-block">
                Link Strength: {rawStrength}
              </span>
            </div>
          </div>

          {/* KEY ENTITY METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Server size={14} />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-slate-500 font-mono block">Entity / Asset:</span>
                <span className="font-mono font-bold text-white truncate block">{entity_id} &bull; {primaryAsset}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <User size={14} />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-slate-500 font-mono block">Account Context:</span>
                <span className="font-mono font-bold text-white truncate block">{targetUser}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Clock size={14} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">Correlated Alerts:</span>
                <span className="font-mono font-bold text-purple-300">{alerts.length} Linked in Chain</span>
              </div>
            </div>
          </div>

          {/* WHY ARGUS LINKED THEM */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <GitMerge size={14} className="text-purple-400" />
              <span>Why ARGUS Linked Them (Relationship Factors)</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {explanation || "Multiple alerts share correlated relationship factors across assets, accounts, or progression patterns, indicating potential multi-stage operational activity requiring unified supervisory inspection."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {SUPPORTED_FACTORS.map(({ factor, label, desc, icon: FIcon }) => {
                const isMatched = matched_factors.includes(factor);
                return (
                  <div
                    key={factor}
                    className={`p-2.5 rounded-xl border flex items-start space-x-2.5 transition-colors ${
                      isMatched
                        ? "bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-sm"
                        : "bg-slate-950/30 border-slate-800/80 text-slate-500 opacity-60"
                    }`}
                  >
                    <FIcon size={15} className={`mt-0.5 flex-shrink-0 ${isMatched ? "text-purple-400" : "text-slate-600"}`} />
                    <div className="truncate">
                      <div className="font-semibold text-xs text-white flex items-center space-x-1.5">
                        <span>{label}</span>
                        {isMatched && (
                          <span className="text-[9px] font-mono uppercase bg-purple-900/80 text-purple-300 px-1 rounded border border-purple-700">
                            Matched
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUPERVISORY VERIFICATION MANDATE & LINK STRENGTH DEFINITION */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle size={14} />
              <span>Human Supervisory Mandate</span>
            </span>
            <h4 className="text-sm font-bold text-white">
              Cross-Shift Verification Required
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verificationText}
            </p>

            {/* WHAT LINK STRENGTH MEANS & DOES NOT MEAN */}
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 space-y-2">
              <div className="font-bold text-purple-300 flex items-center space-x-1">
                <Info size={13} className="text-purple-400 flex-shrink-0" />
                <span>Understanding Link Strength:</span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Link Strength reflects the density of matched relationship factors (same asset, same user, temporal proximity, severity progression, related categories).
              </p>
              <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-amber-300/90 font-mono">
                &bull; NOT an attack probability<br/>
                &bull; NOT an AI confidence score<br/>
                &bull; Requires human supervisory review
              </div>
            </div>
          </div>

          {/* ASSOCIATED CASES RECORD */}
          {associated_cases && associated_cases.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
              <span className="text-slate-500 font-mono block text-[10px] uppercase mb-1">
                Associated Case Records:
              </span>
              <span className="text-cyan-300 font-mono font-semibold break-all">
                {associated_cases.join(", ")}
              </span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-300 flex items-center space-x-2">
            <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
            <span>Review the reconstructed chronological sequence below.</span>
          </div>
        </div>

      </div>

      {/* CHRONOLOGICAL ALERT SEQUENCE / TIMELINE */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock size={16} className="text-cyan-400" />
              <span>Reconstructed Alert Sequence Timeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological order of discrete alerts correlated into this candidate incident
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold self-start sm:self-auto">
            {alerts.length} Chronological Alerts Linked
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-mono">
            No chronological alert records available for this candidate incident.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:to-rose-500">
            {alerts.map((alert, idx) => (
              <div
                key={alert.alert_id || idx}
                className="relative group cursor-pointer"
                onClick={() => setActiveStep(idx)}
              >
                {/* TIMELINE NODE DOT */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeStep === idx 
                    ? "bg-cyan-400 border-white ring-4 ring-cyan-500/30 scale-125" 
                    : "bg-slate-950 border-purple-500"
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>

                {/* TIMELINE CARD */}
                <div className={`glass-card rounded-xl p-4 border transition-all ${
                  activeStep === idx 
                    ? "border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.2)] bg-slate-900/90" 
                    : "border-slate-800 hover:border-slate-700"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        Step {idx + 1}: {alert.alert_id}
                      </span>
                      <ConcernBadge level={alert.severity} size="sm" />
                      <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {alert.category}
                      </span>
                      {alert.asset_id && (
                        <span className="text-xs font-mono text-slate-300">
                          &bull; Asset: {alert.asset_id}
                        </span>
                      )}
                      {alert.user_id && (
                        <span className="text-xs font-mono text-slate-300">
                          &bull; User: {alert.user_id}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {alert.timestamp}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white mb-1">
                    {alert.title || alert.signature_name || "Security Alert"}
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed mb-2.5">
                    {alert.raw_details || alert.description || alert.summary || "Recorded telemetry event matching alert pattern."}
                  </div>

                  {/* RAW EVIDENCE SNIPPET IF PRESENT */}
                  {alert.evidence_snippet && (
                    <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono text-cyan-200 overflow-x-auto custom-scrollbar">
                      {typeof alert.evidence_snippet === "string" 
                        ? alert.evidence_snippet 
                        : JSON.stringify(alert.evidence_snippet, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ViewIncidentReconstruction;
