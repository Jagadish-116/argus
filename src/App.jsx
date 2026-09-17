// src/App.jsx
import React, { useState, useEffect } from 'react';
import { mockEntities } from './data/mockEntities';
import { Header } from './components/Header';
import { EntityOverviewBanner } from './components/EntityOverviewBanner';
import { SupervisoryReviewQueue } from './components/SupervisoryReviewQueue';
import { IncidentDecisionGraph } from './components/IncidentDecisionGraph';
import { GhostAttackReplay } from './components/GhostAttackReplay';
import { CounterfactualReplay } from './components/CounterfactualReplay';
import { ConfidenceLimitationsPanel } from './components/ConfidenceLimitationsPanel';
import { SupervisoryDossierModal } from './components/SupervisoryDossierModal';
import { LogUploadModal } from './components/LogUploadModal';
import { EvidenceModal } from './components/common/EvidenceModal';

// Dedicated Six Feature Pages from SIH 26157
import { ViewEntityFindings } from './components/views/ViewEntityFindings';
import { ViewMonitoringCoverage } from './components/views/ViewMonitoringCoverage';
import { ViewIncidentReconstruction } from './components/views/ViewIncidentReconstruction';
import { ViewExpectedVsObserved } from './components/views/ViewExpectedVsObserved';
import { ViewPeerComparison } from './components/views/ViewPeerComparison';
import { ViewEvidenceTraceability } from './components/views/ViewEvidenceTraceability';

// Backend API Client
import { 
  fetchOverview, 
  fetchEntity, 
  fetchAssets, 
  fetchCandidateIncident, 
  fetchFinding 
} from './api/client';

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
  HelpCircle,
  EyeOff,
  GitMerge,
  FileCheck,
  Network
} from 'lucide-react';

// Bi-directional mapping between mock entity IDs and Backend CSE IDs
const ENTITY_MAP = {
  'entity-alpha': 'CSE-ALPHA',
  'entity-beta': 'CSE-BETA',
  'entity-gamma': 'CSE-GAMMA',
  'CSE-ALPHA': 'entity-alpha',
  'CSE-BETA': 'entity-beta',
  'CSE-GAMMA': 'entity-gamma'
};

const toBackendEntityId = (id) => {
  if (!id) return 'CSE-ALPHA';
  if (id.startsWith('CSE-')) return id;
  return ENTITY_MAP[id] || 'CSE-ALPHA';
};

const toMockEntityId = (id) => {
  if (!id) return 'entity-alpha';
  if (id.startsWith('entity-')) return id;
  return ENTITY_MAP[id] || 'entity-alpha';
};

const HASH_TO_TAB = {
  '#graph': 'SUPERVISORY_QUEUE',
  '#review-queue': 'SUPERVISORY_QUEUE',
  '#assessment-graph': 'SUPERVISORY_QUEUE',
  '#ghost-replay': 'GHOST_REPLAY',
  '#counterfactual': 'COUNTERFACTUAL',
  '#benchmarks': 'BENCHMARKS',
  '#execution-gaps': 'EXECUTION_GAPS',
  '#negative-space': 'NEGATIVE_SPACE',
  '#incident-reconstruction': 'INCIDENT_RECONSTRUCTION',
  '#expected-vs-observed': 'EXPECTED_VS_OBSERVED',
  '#peer-comparison': 'PEER_COMPARISON',
  '#evidence-traceability': 'EVIDENCE_TRACEABILITY',
  '#home': 'SUPERVISORY_QUEUE',
  '': 'SUPERVISORY_QUEUE',
  '#': 'SUPERVISORY_QUEUE'
};

const TAB_TO_HASH = {
  'SUPERVISORY_QUEUE': '#graph',
  'GHOST_REPLAY': '#ghost-replay',
  'COUNTERFACTUAL': '#counterfactual',
  'BENCHMARKS': '#benchmarks',
  'EXECUTION_GAPS': '#execution-gaps',
  'NEGATIVE_SPACE': '#negative-space',
  'INCIDENT_RECONSTRUCTION': '#incident-reconstruction',
  'EXPECTED_VS_OBSERVED': '#expected-vs-observed',
  'PEER_COMPARISON': '#peer-comparison',
  'EVIDENCE_TRACEABILITY': '#evidence-traceability'
};

export default function App() {
  const [entities, setEntities] = useState(mockEntities);
  const [selectedEntity, setSelectedEntity] = useState(mockEntities[0]);
  const [selectedCase, setSelectedCase] = useState(mockEntities[0].cases[0]);
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash || '#graph';
    return HASH_TO_TAB[hash] || 'SUPERVISORY_QUEUE';
  });

  // Modals state
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Backend API data state
  const [overviewData, setOverviewData] = useState(null);
  const [entityData, setEntityData] = useState(null);
  const [incidentData, setIncidentData] = useState(null);
  const [assetsData, setAssetsData] = useState(null);
  const [activeIncidentId, setActiveIncidentId] = useState("IR01-CSE-ALPHA-0");

  // Sync hash changes with browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#graph';
      const targetTab = HASH_TO_TAB[hash] || 'SUPERVISORY_QUEUE';
      setActiveTab(targetTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tabKey) => {
    const targetHash = TAB_TO_HASH[tabKey] || '#graph';
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    setActiveTab(tabKey);
  };

  // Initial load of backend API data
  useEffect(() => {
    loadOverview();
  }, []);

  // Fetch backend data whenever selectedEntity changes
  useEffect(() => {
    const backendId = toBackendEntityId(selectedEntity.id);
    loadEntityDetails(backendId);
    loadAssetsData(backendId);
  }, [selectedEntity.id]);

  const loadOverview = async () => {
    try {
      const data = await fetchOverview();
      setOverviewData(data);
    } catch (err) {
      console.warn("Backend API overview offline; running with rich synthetic engine:", err);
    }
  };

  const loadEntityDetails = async (entityId) => {
    try {
      const data = await fetchEntity(entityId);
      setEntityData(data);
      if (data.candidate_incidents && data.candidate_incidents.length > 0) {
        const firstIncId = data.candidate_incidents[0].finding_id;
        setActiveIncidentId(firstIncId);
        loadIncidentData(firstIncId);
      }
    } catch (err) {
      console.warn("Backend API entity details offline:", err);
    }
  };

  const loadAssetsData = async (entityId) => {
    try {
      const data = await fetchAssets(entityId);
      setAssetsData(data);
    } catch (err) {
      console.warn("Backend API assets offline:", err);
    }
  };

  const loadIncidentData = async (incidentId) => {
    try {
      const data = await fetchCandidateIncident(incidentId);
      setIncidentData(data);
    } catch (err) {
      console.warn("Backend API incident offline:", err);
    }
  };

  const openFindingModal = async (findingId) => {
    try {
      const data = await fetchFinding(findingId);
      setModalData(data);
    } catch (err) {
      console.warn("Error fetching finding modal:", err);
    }
  };

  // When entity changes, reset selected case
  const handleSelectEntity = (entityOrId) => {
    let mockObj;
    if (typeof entityOrId === 'string') {
      const targetMockId = toMockEntityId(entityOrId);
      mockObj = entities.find(e => e.id === targetMockId) || entities[0];
    } else {
      mockObj = entityOrId;
    }
    setSelectedEntity(mockObj);
    if (mockObj.cases && mockObj.cases.length > 0) {
      setSelectedCase(mockObj.cases[0]);
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
        decisionDebt: Math.min(100, selectedEntity.argusMetrics.decisionDebt + (newCase.decisionDebtImpact || 20)),
        negativeSpaceFindings: selectedEntity.argusMetrics.negativeSpaceFindings + (newCase.negativeSpaceFlags?.length || 0)
      }
    };

    const updatedEntities = entities.map(e => e.id === selectedEntity.id ? updatedEntity : e);
    setEntities(updatedEntities);
    setSelectedEntity(updatedEntity);
    setSelectedCase(newCase);
  };

  const handleInvestigatePriorityCase = (entityId, incidentId) => {
    handleSelectEntity(entityId);
    const targetIncident = incidentId || (entityData?.candidate_incidents?.[0]?.finding_id) || `IR01-${toBackendEntityId(entityId)}-0`;
    setActiveIncidentId(targetIncident);
    loadIncidentData(targetIncident);
    changeTab('INCIDENT_RECONSTRUCTION');
  };

  return (
    <div style={{ backgroundColor: '#07090e', minHeight: '100vh' }} className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 scanline">
      
      {/* 1. System Header */}
      <Header
        entities={entities}
        selectedEntity={selectedEntity}
        onSelectEntity={handleSelectEntity}
        onOpenExport={() => setIsDossierOpen(true)}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      {/* 2. Top Entity Operational Banner (Traditional vs Behavioral Contrast) */}
      <EntityOverviewBanner entity={selectedEntity} />

      {/* 3. Navigation Tabs Bar (Rich Console + Dedicated Feature Pages) */}
      <div className="w-full bg-[#090d16] border-b border-slate-800 px-4 lg:px-8 sticky top-[61px] z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Tab buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 custom-scrollbar">
            
            {/* Previous Flagship Tab 1: Review Queue & Decision Graph */}
            <button
              onClick={() => changeTab('SUPERVISORY_QUEUE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'SUPERVISORY_QUEUE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Review Queue & Decision Graph</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-900/80 text-cyan-300 font-sans">
                {selectedEntity.cases.length}
              </span>
            </button>

            {/* DEDICATED NEW PAGE: FEATURE 1 EXECUTION GAPS */}
            <button
              onClick={() => changeTab('EXECUTION_GAPS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'EXECUTION_GAPS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Feature 1: Execution Gaps</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900/80 text-amber-300 font-sans">
                EG-01..04
              </span>
            </button>

            {/* DEDICATED NEW PAGE: FEATURE 2 NEGATIVE SPACE */}
            <button
              onClick={() => changeTab('NEGATIVE_SPACE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'NEGATIVE_SPACE'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <EyeOff className="w-4 h-4 text-teal-400" />
              <span>Feature 2: Negative Space</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-900/80 text-teal-300 font-sans">
                NS-01..02
              </span>
            </button>

            {/* DEDICATED NEW PAGE: FEATURE 3 INCIDENT RECONSTRUCTION */}
            <button
              onClick={() => changeTab('INCIDENT_RECONSTRUCTION')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'INCIDENT_RECONSTRUCTION'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GitMerge className="w-4 h-4 text-purple-400" />
              <span>Feature 3: Incident Reconstruction</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-900/80 text-purple-300 font-sans">
                IR-01
              </span>
            </button>

            {/* DEDICATED NEW PAGE: FEATURE 4 EXPECTED VS OBSERVED */}
            <button
              onClick={() => changeTab('EXPECTED_VS_OBSERVED')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'EXPECTED_VS_OBSERVED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Feature 4: Expected vs Observed</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-900/80 text-emerald-300 font-sans">
                EVO
              </span>
            </button>

            {/* DEDICATED NEW PAGE: FEATURE 5 PEER COMPARISON */}
            <button
              onClick={() => changeTab('PEER_COMPARISON')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'PEER_COMPARISON'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Feature 5: Peer Comparison</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-900/80 text-blue-300 font-sans">
                Cohort
              </span>
            </button>

            {/* DEDICATED NEW PAGE: FEATURE 6 EVIDENCE TRACEABILITY */}
            <button
              onClick={() => changeTab('EVIDENCE_TRACEABILITY')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'EVIDENCE_TRACEABILITY'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FileCheck className="w-4 h-4 text-rose-400" />
              <span>Feature 6: Evidence Traceability</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-900/80 text-rose-300 font-sans">
                Audit Chain
              </span>
            </button>

            {/* Previous Tab 2: Ghost Attack Replay */}
            <button
              onClick={() => changeTab('GHOST_REPLAY')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
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

            {/* Previous Tab 3: Counterfactual Simulator */}
            <button
              onClick={() => changeTab('COUNTERFACTUAL')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
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

            {/* Previous Tab 4: Multi-Entity Cohort Benchmarks */}
            <button
              onClick={() => changeTab('BENCHMARKS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'BENCHMARKS'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Peer Cohort Benchmarks</span>
            </button>

          </div>

          {/* Quick Demo Pill */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SOC BEHAVIOURAL ASSURANCE // OPERATIONAL CONSOLE</span>
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
                onOpenGraph={() => changeTab('SUPERVISORY_QUEUE')}
                onOpenCounterfactual={() => changeTab('COUNTERFACTUAL')}
              />
            </div>
            <div className="lg:col-span-7">
              <IncidentDecisionGraph activeCase={selectedCase} />
            </div>
          </div>
        )}

        {/* DEDICATED NEW PAGE: FEATURE 1 EXECUTION GAPS */}
        {activeTab === 'EXECUTION_GAPS' && (
          <ViewEntityFindings
            entityData={entityData}
            onOpenModal={openFindingModal}
            initialTab="execution"
            onSelectIncident={(incId) => handleInvestigatePriorityCase(selectedEntity.id, incId)}
          />
        )}

        {/* DEDICATED NEW PAGE: FEATURE 2 NEGATIVE SPACE */}
        {activeTab === 'NEGATIVE_SPACE' && (
          <ViewMonitoringCoverage
            assetsData={assetsData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* DEDICATED NEW PAGE: FEATURE 3 INCIDENT RECONSTRUCTION */}
        {activeTab === 'INCIDENT_RECONSTRUCTION' && (
          <ViewIncidentReconstruction
            incidentId={activeIncidentId}
            incidentData={incidentData}
            candidateIncidents={entityData?.candidate_incidents || []}
            onLoadIncident={loadIncidentData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* DEDICATED NEW PAGE: FEATURE 4 EXPECTED VS OBSERVED */}
        {activeTab === 'EXPECTED_VS_OBSERVED' && (
          <ViewExpectedVsObserved
            incidentId={activeIncidentId}
            incidentData={incidentData}
            entityData={entityData}
            candidateIncidents={entityData?.candidate_incidents || []}
            onLoadIncident={loadIncidentData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* DEDICATED NEW PAGE: FEATURE 5 PEER COMPARISON */}
        {activeTab === 'PEER_COMPARISON' && (
          <ViewPeerComparison
            data={overviewData}
            selectedEntityId={toBackendEntityId(selectedEntity.id)}
            onSelectEntity={handleSelectEntity}
            onInvestigatePriority={handleInvestigatePriorityCase}
          />
        )}

        {/* DEDICATED NEW PAGE: FEATURE 6 EVIDENCE TRACEABILITY */}
        {activeTab === 'EVIDENCE_TRACEABILITY' && (
          <ViewEvidenceTraceability
            entityData={entityData}
            assetsData={assetsData}
            onOpenModal={openFindingModal}
          />
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
            <span>ENTERPRISE ASSURANCE PLATFORM // ZERO CLOUD DEPENDENCY // AIR-GAPPED READY</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SupervisoryDossierModal
        entity={selectedEntity}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      <LogUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onIngestCase={handleIngestCase}
      />

      {/* Evidence Drill-Down Modal */}
      {modalData && (
        <EvidenceModal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}

    </div>
  );
}
