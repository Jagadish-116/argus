// src/App.jsx
import React, { useState } from 'react';
import { 
  mockEntities 
} from './data/mockEntities';
import { Header } from './components/Header';
import { EntityOverviewBanner } from './components/EntityOverviewBanner';
import { SupervisoryReviewQueue } from './components/SupervisoryReviewQueue';
import { IncidentDecisionGraph } from './components/IncidentDecisionGraph';
import { GhostAttackReplay } from './components/GhostAttackReplay';
import { CounterfactualReplay } from './components/CounterfactualReplay';
import { ConfidenceLimitationsPanel } from './components/ConfidenceLimitationsPanel';
import { SupervisoryDossierModal } from './components/SupervisoryDossierModal';
import { PitchGuideModal } from './components/PitchGuideModal';
import { LogUploadModal } from './components/LogUploadModal';
import { 
  ShieldAlert, 
  Flame, 
  GitFork, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  Terminal, 
  Activity,
  Award,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [entities, setEntities] = useState(mockEntities);
  const [selectedEntity, setSelectedEntity] = useState(mockEntities[0]);
  const [selectedCase, setSelectedCase] = useState(mockEntities[0].cases[0]);
  const [activeTab, setActiveTab] = useState('SUPERVISORY_QUEUE'); // SUPERVISORY_QUEUE | GHOST_REPLAY | COUNTERFACTUAL | BENCHMARKS

  // Modals state
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // When entity changes, reset selected case
  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
    if (entity.cases && entity.cases.length > 0) {
      setSelectedCase(entity.cases[0]);
    } else {
      setSelectedCase(null);
    }
  };

  // Ingest custom case
  const handleIngestCase = (newCase) => {
    const updatedCases = [newCase, ...selectedEntity.cases];
    const updatedEntity = {
      ...selectedEntity,
      cases: updatedCases,
      argusMetrics: {
        ...selectedEntity.argusMetrics,
        decisionDebt: Math.min(100, selectedEntity.argusMetrics.decisionDebt + newCase.decisionDebtImpact),
        negativeSpaceFindings: selectedEntity.argusMetrics.negativeSpaceFindings + (newCase.negativeSpaceFlags?.length || 0)
      }
    };

    const updatedEntities = entities.map(e => e.id === selectedEntity.id ? updatedEntity : e);
    setEntities(updatedEntities);
    setSelectedEntity(updatedEntity);
    setSelectedCase(newCase);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 scanline">
      
      {/* 1. System Header */}
      <Header
        entities={entities}
        selectedEntity={selectedEntity}
        onSelectEntity={handleSelectEntity}
        onOpenExport={() => setIsDossierOpen(true)}
        onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      {/* 2. Top Entity Operational Banner (Traditional vs Behavioral Contrast) */}
      <EntityOverviewBanner entity={selectedEntity} />

      {/* 3. Navigation Tabs Bar */}
      <div className="w-full bg-[#090d16] border-b border-slate-800 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Tab buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('SUPERVISORY_QUEUE')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'SUPERVISORY_QUEUE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Review Queue & Decision Graph</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-900/80 text-cyan-300 font-sans">
                {selectedEntity.cases.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('GHOST_REPLAY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'GHOST_REPLAY'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>Ghost Attack Replay</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-900/60 text-red-300 font-sans">
                5 Stages
              </span>
            </button>

            <button
              onClick={() => setActiveTab('COUNTERFACTUAL')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'COUNTERFACTUAL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GitFork className="w-4 h-4 text-amber-400" />
              <span>Counterfactual Simulator</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900/60 text-amber-300 font-sans">
                3 Paths
              </span>
            </button>

            <button
              onClick={() => setActiveTab('BENCHMARKS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === 'BENCHMARKS'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Multi-Entity Cohort Benchmarks</span>
            </button>
          </div>

          {/* Quick Demo Pill */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SIH PS 26157 VERIFIED DEMO SPECIFICATION</span>
          </div>

        </div>
      </div>

      {/* 4. Main Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Review Queue & Incident Decision Graph */}
        {activeTab === 'SUPERVISORY_QUEUE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <SupervisoryReviewQueue
                cases={selectedEntity.cases}
                selectedCase={selectedCase}
                onSelectCase={setSelectedCase}
                onOpenGraph={() => setActiveTab('SUPERVISORY_QUEUE')}
                onOpenCounterfactual={() => setActiveTab('COUNTERFACTUAL')}
              />
            </div>
            <div className="lg:col-span-7">
              <IncidentDecisionGraph activeCase={selectedCase} />
            </div>
          </div>
        )}

        {/* Tab 2: Ghost Attack Replay */}
        {activeTab === 'GHOST_REPLAY' && (
          <GhostAttackReplay activeEntityId={selectedEntity.id} />
        )}

        {/* Tab 3: Counterfactual Decision Replay */}
        {activeTab === 'COUNTERFACTUAL' && (
          <CounterfactualReplay />
        )}

        {/* Tab 4: Multi-Entity Cohort Benchmarks */}
        {activeTab === 'BENCHMARKS' && (
          <div className="bg-[#0b0f1a] rounded-xl border border-slate-800 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white font-mono">
                  Contextual Peer Cohort Benchmark Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Comparing why traditional throughput KPIs fail to reveal real operational security posture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {entities.map(ent => (
                <div 
                  key={ent.id}
                  onClick={() => handleSelectEntity(ent)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    selectedEntity.id === ent.id
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{ent.shortName}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      ent.argusMetrics.decisionDebt > 70 
                        ? 'bg-red-950 text-red-400 border border-red-800' 
                        : ent.argusMetrics.decisionDebt < 30
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      DEBT: {ent.argusMetrics.decisionDebt}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white mt-2">{ent.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{ent.sector}</div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>MTTR Latency:</span>
                      <span className="text-white font-bold">{ent.traditionalMetrics.mttr}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Closure Rate:</span>
                      <span className="text-emerald-400 font-bold">{ent.traditionalMetrics.closureRate}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Template Repetition:</span>
                      <span className={parseFloat(ent.argusMetrics.templateRepetition) > 40 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {ent.argusMetrics.templateRepetition}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Attacker Dwell:</span>
                      <span className="text-red-400 font-bold">{ent.argusMetrics.averageAttackerDwellWindow}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 rounded bg-black/40 border border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-white block mb-0.5">Supervisory Diagnosis:</strong>
                    {ent.argusMetrics.archetype}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Confidence & Radical Transparency Panel (Always Visible) */}
        <ConfidenceLimitationsPanel 
          activeEntity={selectedEntity} 
          activeCase={selectedCase} 
        />

      </main>

      {/* 6. Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090d16] px-4 lg:px-8 py-4 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ARGUS ENGINE v2.4-SUPERVISORY // NCIIPC & CERT-IN ALIGNED SPECIFICATION</span>
          </div>
          <div>
            <span>SIH PROBLEM STATEMENT 26157 // ZERO CLOUD DEPENDENCY // AIR-GAPPED READY</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SupervisoryDossierModal
        entity={selectedEntity}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      <PitchGuideModal
        isOpen={isPitchGuideOpen}
        onClose={() => setIsPitchGuideOpen(false)}
      />

      <LogUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onIngestCase={handleIngestCase}
      />

    </div>
  );
}
