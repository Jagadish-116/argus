// src/components/CounterfactualReplay.jsx
import React, { useState } from 'react';
import { 
  GitFork, 
  Layers, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Info,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { counterfactualScenarios } from '../data/counterfactualScenarios';

export function CounterfactualReplay() {
  const scenario = counterfactualScenarios[0];
  const { observed, sopCompliant, regulatoryBaseline } = scenario.branches;
  const [highlightDivergence, setHighlightDivergence] = useState(true);

  return (
    <div className="bg-[#0b0f1a] rounded-xl border border-slate-800 p-4 lg:p-5 flex flex-col space-y-4">
      
      {/* Header & Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              Counterfactual Decision Replay
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
              Comparative Simulator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side operational comparison: What the SOC actually executed vs Declared SOP vs Regulatory Baseline.
          </p>
        </div>

        {/* Toggle highlight */}
        <button
          onClick={() => setHighlightDivergence(!highlightDivergence)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            highlightDivergence
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{highlightDivergence ? 'Divergence Point Highlighted' : 'Show Flat Timeline'}</span>
        </button>
      </div>

      {/* Incident Case Banner */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
        <span className="text-slate-300">
          <strong className="text-cyan-400 font-mono">{scenario.caseId}:</strong> {scenario.incidentOverview}
        </span>
        <span className="text-slate-500 font-mono text-[11px] shrink-0">
          Asset: SWIFT-PROD-GW02
        </span>
      </div>

      {/* 3-Column Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        
        {/* Column 1: Observed Path (What Happened) */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/60 flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                1. OBSERVED PATH
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/50 text-red-300">
                ACTUAL SOC EXECUTION
              </span>
            </div>

            <div className="space-y-2.5">
              {observed.steps.map((step, idx) => {
                const isDivergence = step.status === 'critical_deviation';

                return (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      isDivergence && highlightDivergence
                        ? 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse-slow'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                      <span>{step.time}</span>
                      {isDivergence && (
                        <span className="text-red-400 font-bold">⚡ DECISION FORK FAILURE</span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-100">{step.action}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{step.details}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcome Metric Card */}
          <div className="p-3 rounded-lg bg-black/50 border border-red-900/60 text-xs font-mono space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Containment:</span>
              <span className="text-red-400 font-bold">{observed.metrics.containmentTime}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Dwell Exposure:</span>
              <span className="text-red-400">{observed.metrics.dwellTime}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Blast Radius:</span>
              <span className="text-red-300">{observed.metrics.blastRadius}</span>
            </div>
          </div>
        </div>

        {/* Column 2: SOP Compliant Path (Internal Expectation) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                2. INTERNAL SOP PATH
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-300">
                DECLARED POLICY
              </span>
            </div>

            <div className="space-y-2.5">
              {sopCompliant.steps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border bg-slate-900/70 border-slate-800 text-xs">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">{step.time}</div>
                  <div className="font-semibold text-slate-200">{step.action}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{step.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome Metric Card */}
          <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Containment:</span>
              <span className="text-amber-400 font-bold">{sopCompliant.metrics.containmentTime}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Dwell Exposure:</span>
              <span className="text-slate-300">{sopCompliant.metrics.dwellTime}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Blast Radius:</span>
              <span className="text-slate-300">{sopCompliant.metrics.blastRadius}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Regulatory Supervisory Baseline (Gold Standard) */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/60 flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                3. SUPERVISORY BASELINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-300">
                NCIIPC / CERT-IN GOLD
              </span>
            </div>

            <div className="space-y-2.5">
              {regulatoryBaseline.steps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border bg-cyan-950/30 border-cyan-700/40 text-xs">
                  <div className="text-[10px] font-mono text-cyan-500 mb-1">{step.time}</div>
                  <div className="font-semibold text-cyan-200">{step.action}</div>
                  <div className="text-[11px] text-slate-300 mt-1">{step.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome Metric Card */}
          <div className="p-3 rounded-lg bg-black/50 border border-cyan-900/60 text-xs font-mono space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Containment:</span>
              <span className="text-cyan-400 font-bold">{regulatoryBaseline.metrics.containmentTime}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Dwell Exposure:</span>
              <span className="text-emerald-400">{regulatoryBaseline.metrics.dwellTime}</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Blast Radius:</span>
              <span className="text-emerald-400">{regulatoryBaseline.metrics.blastRadius}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
