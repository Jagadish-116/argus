import React from 'react';
import { 
  BarChart2, 
  Building2, 
  Clock, 
  ShieldAlert, 
  EyeOff, 
  Activity, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ConcernBadge } from '../common/ConcernBadge';
import { ENTITY_NAMES, ENTITY_SECTORS } from '../../constants/rules';

export const ViewPeerComparison = ({
  data,
  selectedEntityId,
  onSelectEntity,
  onInvestigatePriority,
}) => {
  if (!data || !data.peer_benchmark) return null;

  const benchmark = data.peer_benchmark;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-600/60 uppercase">
              Feature 5 • Peer Comparison
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">Sectoral Benchmark</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Cross-Entity Contextual Supervisory Benchmarking
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Compares operational metrics across peer Critical Sector Entities to provide human supervisors with baseline context. Does not produce reductive scores or security rankings.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Monitored Peers</div>
            <div className="text-2xl font-black font-mono text-blue-400">
              {benchmark.length} CSEs
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-blue-400">
            <BarChart2 size={20} />
          </div>
        </div>
      </div>

      {/* PEER BENCHMARK COMPARISON MATRIX TABLE */}
      <div className="argus-panel p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC] flex items-center space-x-2">
              <Building2 size={16} className="text-[#3B82F6]" />
              <span>Comparative Supervisory Indicator Matrix</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Uniformly calculated indicators derived from operational telemetry and case management records
            </p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar rounded-md border border-[#334155]">
          <table className="argus-table w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0F172A] text-[#94A3B8] font-mono text-[11px] uppercase border-b-2 border-[#334155] sticky top-0 z-10">
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">Sector</th>
                <th className="p-3.5">Reported MTTR</th>
                <th className="p-3.5">Unescalated Serious Ratio</th>
                <th className="p-3.5">Median Closure</th>
                <th className="p-3.5">Repeated Alerts</th>
                <th className="p-3.5">Telemetry Voids</th>
                <th className="p-3.5">Supervisory Concern</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {benchmark.map((bm, index) => {
                const isCurrent = bm.entity_id === selectedEntityId;
                const rowBg = index % 2 === 0 ? "bg-[#1E293B]" : "bg-[#1E293B]/60";
                return (
                  <tr
                    key={bm.entity_id}
                    className={`${rowBg} hover:bg-[#334155] transition-colors ${
                      isCurrent ? "ring-1 ring-[#06B6D4] font-medium" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-[#F8FAFC] flex items-center space-x-2">
                        <span>{bm.entity_name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/20 px-1.5 py-0.5 rounded border border-[#06B6D4]/40">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#94A3B8]">{bm.entity_id}</span>
                    </td>
                    <td className="p-3.5 text-[#94A3B8]">
                      {ENTITY_SECTORS[bm.entity_id] || "Critical Sector"}
                    </td>
                    <td className="p-3.5 font-mono text-[#F8FAFC]">
                      {bm.reported_mttr_mins} mins
                    </td>
                    <td className="p-3.5 font-mono font-bold">
                      <span className={bm.unescalated_critical_ratio_percent > 15 ? "text-[#EF4444]" : "text-[#10B981]"}>
                        {bm.unescalated_critical_ratio_percent}%
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[#F8FAFC]">
                      {bm.median_serious_closure_mins} mins
                    </td>
                    <td className="p-3.5 font-mono text-[#F8FAFC]">
                      {bm.repeated_unremediated_count}
                    </td>
                    <td className="p-3.5 font-mono text-[#F8FAFC]">
                      <span className={bm.telemetry_void_asset_count > 0 ? "text-[#06B6D4]" : "text-[#94A3B8]"}>
                        {bm.telemetry_void_asset_count}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <ConcernBadge level={bm.missing_escalation_concern} size="sm" />
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectEntity(bm.entity_id)}
                        className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
                          isCurrent
                            ? "bg-[#06B6D4] text-[#0F172A] font-bold shadow-sm"
                            : "btn-secondary text-xs"
                        }`}
                      >
                        {isCurrent ? "Inspecting" : "Select"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESTRAINED PEER COMPARISON NOTICE */}
      <div className="p-4 rounded-xl glass-card text-center text-xs text-slate-400 leading-relaxed border border-slate-800/80">
        <div className="flex items-center justify-center space-x-1.5 font-semibold text-slate-300 mb-1">
          <Info size={14} className="text-blue-400" />
          <span>Supervisory Context Guideline</span>
        </div>
        Peer comparisons provide situational context for human auditors. Differences in operational metrics reflect varied architectural topologies, mandate scopes, and telemetry pipelines — not a mathematical declaration of security or compliance.
      </div>

    </div>
  );
};

export default ViewPeerComparison;
