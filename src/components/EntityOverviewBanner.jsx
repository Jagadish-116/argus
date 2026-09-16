// src/components/EntityOverviewBanner.jsx
import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Copy, 
  Gauge, 
  Zap, 
  EyeOff,
  Building2
} from 'lucide-react';

export function EntityOverviewBanner({ entity }) {
  const isCritical = entity.argusMetrics.decisionDebt >= 70;
  const isHealthy = entity.argusMetrics.decisionDebt < 35;

  return (
    <section className="w-full bg-[#0c101d] border-b border-slate-800/80 px-4 lg:px-8 py-5">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Entity Metadata Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {entity.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {entity.sector}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${
                  isCritical 
                    ? 'bg-red-950/60 text-red-400 border-red-800/60' 
                    : isHealthy 
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                      : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                }`}>
                  {entity.argusMetrics.archetype}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {entity.scale} • {entity.socModel}
              </p>
            </div>
          </div>

          {/* Data Assurance Summary */}
          <div className="flex items-center gap-4 text-xs font-mono bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block">EVIDENCE COMPLETENESS</span>
              <span className="text-cyan-400 font-bold">{entity.dataAssurance.completeness}%</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">EVIDENCE QUALITY</span>
              <span className={`font-bold ${
                entity.dataAssurance.overallEvidenceQuality > 75 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {entity.dataAssurance.overallEvidenceQuality}/100
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">INTEGRITY PROVENANCE</span>
              <span className="text-emerald-400 flex items-center gap-1 font-sans text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> SHA-256 Validated
              </span>
            </div>
          </div>
        </div>

        {/* The Core Contrast: Traditional Superficial Metrics vs ARGUS Behavioral Truth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Traditional Superficial View */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                TRADITIONAL SOC OPERATIONAL KPIS (SUPERFICIAL)
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {entity.traditionalMetrics.statusGrade}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block uppercase">MTTR Response</span>
                <span className="text-lg font-bold text-slate-200 font-mono">{entity.traditionalMetrics.mttr}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Average Triage Time</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block uppercase">Closure Rate</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{entity.traditionalMetrics.closureRate}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{entity.traditionalMetrics.alertsVolume}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block uppercase">SLA Adherence</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">{entity.traditionalMetrics.slaAdherence}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Per contractual SLA</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/40">
              💡 <span className="text-slate-300 font-medium">Superficial Audit takeaway:</span> Appears fast, efficient, and compliant under standard metrics dashboards.
            </div>
          </div>

          {/* ARGUS Behavioral Ground Truth View */}
          <div className={`p-4 rounded-xl border relative overflow-hidden ${
            isCritical 
              ? 'bg-red-950/15 border-red-700/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
              : isHealthy 
                ? 'bg-emerald-950/15 border-emerald-700/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'bg-amber-950/15 border-amber-700/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-300 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                ARGUS BEHAVIORAL ASSURANCE & RESILIENCE DEBT
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                isCritical 
                  ? 'bg-red-600/30 text-red-300 border border-red-500/50' 
                  : isHealthy 
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
              }`}>
                DEBT: {entity.argusMetrics.decisionDebt} / 100
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase">Negative Space</span>
                <span className={`text-lg font-bold font-mono ${
                  entity.argusMetrics.negativeSpaceFindings > 5 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {entity.argusMetrics.negativeSpaceFindings} Gaps
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Omitted Containments</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase">Gaming Index</span>
                <span className={`text-lg font-bold font-mono ${
                  parseFloat(entity.argusMetrics.templateRepetition) > 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {entity.argusMetrics.templateRepetition}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Template Repetition</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase">Dwell Window</span>
                <span className={`text-lg font-bold font-mono ${
                  entity.argusMetrics.averageAttackerDwellWindow.includes('hour') ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {entity.argusMetrics.averageAttackerDwellWindow}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Uncontained Exposure</span>
              </div>
            </div>

            <div className="mt-3 text-xs bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">
                🔎 <span className="font-semibold text-white">Supervisory Diagnosis:</span> {entity.argusMetrics.statusGrade}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {entity.argusMetrics.decisionDebtTrend}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
