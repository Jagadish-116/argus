import React, { useState } from 'react';
import { 
  EyeOff, 
  Server, 
  FileX, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Activity,
  Search
} from 'lucide-react';
import { ConcernBadge } from '../common/ConcernBadge';
import { getRuleTranslation } from '../../constants/rules';

export const ViewMonitoringCoverage = ({ assetsData, onOpenModal }) => {
  const [filter, setFilter] = useState("all");

  if (!assetsData) return null;

  const {
    entity_id,
    total_assets = 0,
    assets = [],
    telemetry_void_assets = [],
    negative_space_findings = [],
  } = assetsData;

  const ns01Findings = negative_space_findings.filter(f => f.rule_code === "NS-01");
  const ns02Findings = negative_space_findings.filter(f => f.rule_code === "NS-02");

  const filteredAssets = assets.filter(a => {
    if (filter === "voids") return a.is_telemetry_void;
    if (filter === "critical") return a.criticality === "CRITICAL";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-600/60 uppercase">
              Feature 2 • Negative Space
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">{entity_id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Monitoring Blind Spots & Missing Process Evidence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Surfaces designated critical systems producing zero alert telemetry and identifies mandatory operational processes lacking required case records.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Telemetry Voids</div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              {telemetry_void_assets.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <EyeOff size={20} />
          </div>
        </div>
      </div>

      {/* TWO CORE NEGATIVE SPACE CATEGORIES (NS-01 & NS-02) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* NS-01 CARD */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-cyan-500 border-slate-700/80 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700/60">
                Rule NS-01
              </span>
              <span className="text-xs font-mono text-slate-400">
                {ns01Findings.length} Detected
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Critical Asset Telemetry Void
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Identifies high-value operational assets that recorded zero security alerts or telemetry logs during the entire audit window.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">
              {telemetry_void_assets.map(a => a.asset_name).join(", ") || "None"}
            </span>
            {ns01Findings[0] && (
              <button
                type="button"
                onClick={() => onOpenModal(ns01Findings[0].finding_id)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1 border border-slate-700"
              >
                <span>Inspect Evidence</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* NS-02 CARD */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 border-slate-700/80 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/60">
                Rule NS-02
              </span>
              <span className="text-xs font-mono text-slate-400">
                {ns02Findings.length} Detected
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Expected Operational Process Evidence Absent
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Flags documented SOC response procedures (e.g. shift handovers, supervisory escalation) where no audit records were found.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300">
              {ns02Findings.length > 0 ? "Documented process records missing" : "No missing process records"}
            </span>
            {ns02Findings[0] && (
              <button
                type="button"
                onClick={() => onOpenModal(ns02Findings[0].finding_id)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center space-x-1 border border-slate-700"
              >
                <span>Inspect Evidence</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ASSET INVENTORY & MONITORING COVERAGE TABLE */}
      <div className="argus-panel p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC] flex items-center space-x-2">
              <Server size={16} className="text-[#06B6D4]" />
              <span>Critical Asset Inventory & Telemetry Status</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Real-time audit of asset logs across power grid control and substation units
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === "all" ? "bg-[#06B6D4] text-[#0F172A] font-bold" : "btn-secondary text-xs"
              }`}
            >
              All ({assets.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("voids")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === "voids" ? "bg-[#EF4444] text-white font-bold" : "btn-secondary text-xs"
              }`}
            >
              Telemetry Voids ({telemetry_void_assets.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("critical")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === "critical" ? "bg-[#F59E0B] text-[#0F172A] font-bold" : "btn-secondary text-xs"
              }`}
            >
              Critical Only
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar rounded-md border border-[#334155]">
          <table className="argus-table w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#334155] text-[#94A3B8] font-mono text-[11px] uppercase bg-[#0F172A] sticky top-0 z-10">
                <th className="p-3">Asset ID</th>
                <th className="p-3">Asset Name</th>
                <th className="p-3">System Role</th>
                <th className="p-3">Criticality</th>
                <th className="p-3">Alert Count</th>
                <th className="p-3">Monitoring Status</th>
                <th className="p-3 text-right">Supervisory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredAssets.map((ast, index) => {
                const linkedVoidFinding = ns01Findings.find(f => 
                  f.affected_records?.asset_ids?.includes(ast.asset_id) ||
                  f.finding_id.includes(ast.asset_id)
                );
                const rowBg = index % 2 === 0 ? "bg-[#1E293B]" : "bg-[#1E293B]/60";

                return (
                  <tr key={ast.asset_id} className={`${rowBg} hover:bg-[#334155] transition-colors`}>
                    <td className="p-3 font-mono font-bold text-[#06B6D4]">{ast.asset_id}</td>
                    <td className="p-3 font-semibold text-[#F8FAFC]">{ast.asset_name}</td>
                    <td className="p-3 text-[#94A3B8]">{ast.role}</td>
                    <td className="p-3">
                      <ConcernBadge 
                        level={ast.criticality === "CRITICAL" ? "CRITICAL" : "MEDIUM"} 
                        size="sm" 
                        label={ast.criticality} 
                      />
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className={ast.alert_count === 0 ? "text-[#EF4444]" : "text-[#F8FAFC]"}>
                        {ast.alert_count}
                      </span>
                    </td>
                    <td className="p-3">
                      {ast.is_telemetry_void ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] font-mono text-[10px] font-bold">
                          <EyeOff size={11} />
                          <span>TELEMETRY VOID</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] font-mono text-[10px] font-bold">
                          <CheckCircle2 size={11} />
                          <span>MONITORED</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {linkedVoidFinding ? (
                        <button
                          type="button"
                          onClick={() => onOpenModal(linkedVoidFinding.finding_id)}
                          className="btn-secondary text-xs px-2.5 py-1 inline-flex items-center space-x-1"
                        >
                          <FileText size={12} />
                          <span>Inspect Void</span>
                        </button>
                      ) : (
                        <span className="text-[#64748B] font-mono text-[11px]">Normal Coverage</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ViewMonitoringCoverage;
