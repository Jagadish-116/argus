// src/components/SupervisoryReviewQueue.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  GitBranch, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  FileSearch, 
  Flame, 
  Filter, 
  ArrowUpRight 
} from 'lucide-react';
import { NegativeSpaceTypes, GamingFlags } from '../types';

export function SupervisoryReviewQueue({ 
  cases, 
  selectedCase, 
  onSelectCase, 
  onOpenGraph, 
  onOpenCounterfactual 
}) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredCases = cases.filter(c => {
    if (filterType === 'ALL') return true;
    if (filterType === 'NEGATIVE_SPACE') return c.negativeSpaceFlags && c.negativeSpaceFlags.length > 0;
    if (filterType === 'GAMING') return c.gamingSignals && c.gamingSignals.length > 0;
    if (filterType === 'CRITICAL_DEBT') return c.decisionDebtImpact >= 25;
    return true;
  });

  return (
    <div className="bg-[#0b0f1a] rounded-xl border border-slate-800 p-4 lg:p-5 flex flex-col h-full">
      
      {/* Header & Attention Budget Philosophy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              Supervisory Attention Budget Queue
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              Top Priority Review
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritizing high-impact operational anomalies over alert fatigue volume.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'ALL' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({cases.length})
          </button>
          <button
            onClick={() => setFilterType('NEGATIVE_SPACE')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'NEGATIVE_SPACE' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Negative Space
          </button>
          <button
            onClick={() => setFilterType('GAMING')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'GAMING' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Gaming
          </button>
          <button
            onClick={() => setFilterType('CRITICAL_DEBT')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'CRITICAL_DEBT' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            High Debt
          </button>
        </div>
      </div>

      {/* Case List */}
      <div className="space-y-3 mt-4 overflow-y-auto max-h-[580px] pr-1">
        {filteredCases.map((caseItem) => {
          const isSelected = selectedCase?.id === caseItem.id;
          const hasNegativeSpace = caseItem.negativeSpaceFlags?.length > 0;
          const hasGaming = caseItem.gamingSignals?.length > 0;

          return (
            <div
              key={caseItem.id}
              onClick={() => onSelectCase(caseItem)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-cyan-950/30 border-cyan-500/80 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {caseItem.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                      caseItem.severity === 'CRITICAL'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {caseItem.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {caseItem.asset}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                    {caseItem.title}
                  </h4>
                </div>

                {/* Decision Debt Pill */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Risk Impact</span>
                  <span className={`text-sm font-mono font-bold ${
                    caseItem.decisionDebtImpact > 20 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    +{caseItem.decisionDebtImpact} pts
                  </span>
                </div>
              </div>

              {/* Negative Space Tags */}
              {hasNegativeSpace && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {caseItem.negativeSpaceFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-red-300"
                    >
                      <Flame className="w-3 h-3 text-red-400" />
                      {flag.type.replace('_', ' ')}
                    </span>
                  ))}
                  {hasGaming && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      GAMING DETECTED
                    </span>
                  )}
                </div>
              )}

              {/* Meta details & Quick Launch actions */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {caseItem.durationMinutes} min triage
                  </span>
                  <span>•</span>
                  <span>Analyst: {caseItem.assignedAnalyst}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(caseItem);
                      onOpenGraph();
                    }}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-mono underline-offset-2 hover:underline"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    Decision Graph
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(caseItem);
                      onOpenCounterfactual();
                    }}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-mono underline-offset-2 hover:underline ml-2"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Counterfactual
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
