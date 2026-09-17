import React from 'react';
import { 
  Shield, 
  ShieldAlert, 
  EyeOff, 
  GitMerge, 
  Layers, 
  BarChart2, 
  FileCheck, 
  ArrowRight, 
  Activity, 
  Clock, 
  AlertTriangle,
  Building2,
  CheckCircle2,
  Sparkles,
  Info,
  Radio
} from 'lucide-react';
import { FEATURE_DEFINITIONS, ENTITY_NAMES, ENTITY_SECTORS } from '../../constants/rules';
import { ConcernBadge } from '../common/ConcernBadge';
import { MetricCard } from '../common/MetricCard';

const ICON_MAP = {
  ShieldAlert,
  EyeOff,
  GitMerge,
  Layers,
  BarChart3: BarChart2,
  FileCheck,
};

export const ViewHomeShell = ({
  selectedEntityId,
  entityData,
  overviewData,
  onNavigateToFeature,
  onSelectEntity,
  onInvestigatePriority,
}) => {
  const currentEntity = (overviewData?.entities || []).find(e => e.entity_id === selectedEntityId) || {};
  const priorityCase = (entityData?.prioritised_cases || [])[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* EXECUTIVE HERO COMMAND PANEL */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-white/[0.1] shadow-2xl bg-gradient-to-r from-[#0C1425]/90 via-[#0F1A30]/80 to-[#0A1120]/90">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={12} className="text-cyan-400" />
              <span>Behavioural SOC Assurance Platform</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Supervisory Assurance & Operational Integrity
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              ARGUS independently analyzes historical SOC operational evidence to uncover unescalated serious alerts, rapid closures, monitoring blind spots, and correlated multi-stage intrusion campaigns.
            </p>
          </div>

          {/* RIGHT: TACTICAL ENTITY TELEMETRY HUD */}
          <div className="bg-[#0A101D]/90 border border-white/[0.12] rounded-xl p-4 flex flex-col space-y-3 min-w-[280px] shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                <Radio size={12} className="text-cyan-400 animate-pulse" />
                <span>Assessed Entity Scope</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                LIVE AUDIT
              </span>
            </div>

            <div>
              <div className="text-lg font-bold text-white flex items-center space-x-2">
                <Building2 size={18} className="text-cyan-400" />
                <span>{ENTITY_NAMES[selectedEntityId] || selectedEntityId}</span>
              </div>
              <div className="text-xs text-cyan-300/80 font-medium mt-0.5">
                {ENTITY_SECTORS[selectedEntityId]}
              </div>
            </div>

            {/* SEGMENTED SWITCHER BUTTONS */}
            <div className="flex bg-[#050811] p-1 rounded-lg border border-white/[0.08] gap-1">
              {[
                { id: "CSE-ALPHA", label: "Alpha" },
                { id: "CSE-BETA", label: "Beta" },
                { id: "CSE-GAMMA", label: "Gamma" }
              ].map((ent) => {
                const isActive = selectedEntityId === ent.id;
                return (
                  <button
                    key={ent.id}
                    type="button"
                    onClick={() => onSelectEntity(ent.id)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-all text-center ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {ent.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TOP 4 KEY METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Reported Closure Rate"
          value={`${Math.round((currentEntity.reported_closure_rate || 0.98) * 100)}%`}
          subtitle="Reported resolved alerts in observation window"
          icon={Activity}
          accent="emerald"
          badge={<ConcernBadge level="LOW" size="sm" label="Reported" />}
        />
        <MetricCard
          title="Unescalated Serious Ratio"
          value={`${currentEntity.unescalated_critical_ratio ? (currentEntity.unescalated_critical_ratio * 100).toFixed(1) : "20.8"}%`}
          subtitle="High/Critical alerts closed without supervisory escalation"
          icon={ShieldAlert}
          accent={currentEntity.missing_escalation_concern === "HIGH" ? "rose" : "amber"}
          badge={<ConcernBadge level={currentEntity.missing_escalation_concern || "HIGH"} size="sm" />}
        />
        <MetricCard
          title="Repeated Alerts"
          value={currentEntity.repeated_unremediated_count || 22}
          subtitle="Recurring identical alert signatures on same assets"
          icon={Clock}
          accent="purple"
          badge={<ConcernBadge level="MEDIUM" size="sm" label="Recurring" />}
        />
        <MetricCard
          title="Telemetry Void Assets"
          value={currentEntity.telemetry_void_asset_count || 2}
          subtitle="Designated critical infrastructure with 0 logs"
          icon={EyeOff}
          accent="cyan"
          badge={<ConcernBadge level="HIGH" size="sm" label="Blind Spot" />}
        />
      </div>

      {/* SIX OFFICIAL SUPERVISORY CAPABILITIES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Six Official Supervisory Capabilities</span>
              <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-700/60">
                Core Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any capability to launch its dedicated deep-dive assurance console
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.06]">
            SOC Behavioural Assurance
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURE_DEFINITIONS.map((feat) => {
            const FeatIcon = ICON_MAP[feat.iconName] || Shield;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigateToFeature(feat.id)}
                className="glass-card rounded-xl p-5 border border-white/[0.08] hover:border-cyan-400/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] hover:-translate-y-1 bg-[#0F172A]/75 hover:bg-[#141E36]"
              >
                <div>
                  {/* CARD HEADER */}
                  <div className="flex items-center space-x-3 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-500/40 group-hover:border-cyan-400 text-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)] group-hover:scale-105 transition-all flex-shrink-0">
                      <FeatIcon size={20} />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                        Capability 0{feat.num}
                      </span>
                      <h4 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors truncate">
                        {feat.name}
                      </h4>
                    </div>
                  </div>

                  {/* HELPER QUESTION CALLOUT */}
                  <div className="mb-3 p-2.5 rounded-lg bg-[#0B1220] border-l-2 border-l-cyan-400 border border-white/[0.04] text-[11px] text-cyan-200/95 font-medium italic leading-relaxed">
                    "{feat.helper}"
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {feat.desc}
                  </p>
                </div>

                {/* CARD FOOTER */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span className="text-[11px] font-mono text-slate-400 font-normal">Module Console</span>
                  <span className="flex items-center space-x-1 font-bold transform group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOP PRIORITISED CASE CALLOUT BANNER */}
      {priorityCase && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 border-l-4 border-l-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl bg-gradient-to-r from-amber-950/20 to-transparent">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 font-mono text-[10px] font-bold uppercase tracking-wider">
                Prioritised Case #1
              </span>
              <h4 className="text-sm font-bold text-white">
                Case {priorityCase.case_id} &bull; {priorityCase.asset_name}
              </h4>
              <ConcernBadge level={priorityCase.priority_level} size="sm" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {priorityCase.justification_reasons?.join(" • ")}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => onInvestigatePriority(selectedEntityId, `IR01-${selectedEntityId}-0`)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all self-start md:self-center flex-shrink-0"
          >
            <span>Reconstruct Incident Timeline</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* RESTRAINED SUPERVISORY ASSURANCE NOTICE */}
      <div className="p-4 rounded-xl glass-card text-center text-xs text-slate-400 leading-relaxed border border-white/[0.06]">
        <div className="flex items-center justify-center space-x-1.5 font-semibold text-slate-300 mb-1">
          <Info size={14} className="text-cyan-400" />
          <span>Supervisory Decision Support Mandate</span>
        </div>
        ARGUS operates as evidence-based decision support for human cyber regulators and SOC supervisors. It highlights areas warranting inquiry and does not issue autonomous declarations of compromise or compliance.
      </div>

    </div>
  );
};

export default ViewHomeShell;
