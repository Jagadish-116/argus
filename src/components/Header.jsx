// src/components/Header.jsx
import React from 'react';
import { 
  Shield, 
  Activity, 
  FileText, 
  UploadCloud, 
  HelpCircle, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export function Header({ 
  entities, 
  selectedEntity, 
  onSelectEntity, 
  onOpenExport, 
  onUploadClick 
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/95 backdrop-blur border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider text-white font-mono flex items-center gap-1.5">
                ARGUS
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-sans border border-cyan-500/30">
                  ASSURANCE
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Adversarial Resilience & Governance Understanding System // SOC Supervisory Assurance
            </p>
          </div>
        </div>

        {/* Status Indicators & Entity Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Air-gapped / Offline Assurance Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden lg:inline">ENVIRONMENT:</span>
            <span>OFFLINE AIR-GAPPED</span>
          </div>

          {/* Active Entity Cohort Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg p-1">
            <span className="text-xs text-slate-400 px-2 font-mono hidden sm:inline">COHORT:</span>
            <select 
              value={selectedEntity.id}
              onChange={(e) => {
                const found = entities.find(ent => ent.id === e.target.value);
                if (found) onSelectEntity(found);
              }}
              className="bg-slate-950 text-cyan-300 text-xs font-medium rounded-md px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {entities.map(ent => (
                <option key={ent.id} value={ent.id}>
                  {ent.name} ({ent.shortName})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-all"
              title="Generate supervisory audit dossier"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Dossier</span>
            </button>

            <button
              onClick={onUploadClick}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
              title="Ingest raw SOC telemetry logs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ingest</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
