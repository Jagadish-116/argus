// frontend/src/App.jsx
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
import { PitchGuideModal } from './components/PitchGuideModal';
import { LogUploadModal } from './components/LogUploadModal';
import { EvidenceModal } from './components/common/EvidenceModal';

// Dedicated SIH 26157 Six Feature Pages
import { ViewEntityFindings } from './components/views/ViewEntityFindings';
import { ViewMonitoringCoverage } from './components/views/ViewMonitoringCoverage';
import { ViewIncidentReconstruction } from './components/views/ViewIncidentReconstruction';
import { ViewExpectedVsObserved } from './components/views/ViewExpectedVsObserved';
import { ViewPeerComparison } from './components/views/ViewPeerComparison';
import { ViewEvidenceTraceability } from './components/views/ViewEvidenceTraceability';

// Backend API Client & Rules
import { 
  fetchOverview, 
  fetchEntity, 
  fetchAssets, 
  fetchCandidateIncident, 
  fetchFinding 
} from './api/client';
import { 
  VIEW_HASHES, 
  HASH_TO_VIEW, 
  FEATURE_DEFINITIONS 
} from './constants/rules';

import { 
  ShieldAlert, 
  Flame, 
  GitFork, 
  Layers, 
  BarChart3, 
  EyeOff, 
  GitMerge, 
  FileCheck, 
  Network,
  AlertTriangle, 
  RefreshCw,
  Clock,
  Sparkles
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

const getViewFromHash = () => {
  const hash = window.location.hash || "#graph";
  return HASH_TO_VIEW[hash] || "graph";
};

export default function App() {
  // Mock Data State for Rich Interactive Features
  const [entities, setEntities] = useState(mockEntities);
  const [selectedEntity, setSelectedEntity] = useState(mockEntities[0]);
  const [selectedCase, setSelectedCase] = useState(mockEntities[0].cases[0]);
  
  // Navigation & View Routing State
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [activeIncidentId, setActiveIncidentId] = useState("IR01-CSE-ALPHA-0");
  const [modalFindingId, setModalFindingId] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Modals state
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Backend API Data State
  const [overviewData, setOverviewData] = useState(null);
  const [entityData, setEntityData] = useState(null);
  const [incidentData, setIncidentData] = useState(null);
  const [assetsData, setAssetsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [activeView]);

  // Sync activeView with browser history Back/Forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const targetView = getViewFromHash();
      setActiveView(targetView);
      if (
        (targetView === "incident-reconstruction" || targetView === "expected-vs-observed") &&
        activeIncidentId
      ) {
        loadIncidentData(activeIncidentId);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [activeIncidentId]);

  const navigateToView = (viewKey) => {
    const targetHash = VIEW_HASHES[viewKey] || (typeof viewKey === "string" && viewKey.startsWith("#") ? viewKey : `#${viewKey}`);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else if (activeView !== viewKey) {
      setActiveView(viewKey);
    }
  };

  // Initial Load of Backend Overview Data
  useEffect(() => {
    loadOverview();
  }, []);

  // Load Entity Data when selectedEntity changes
  useEffect(() => {
    const backendId = toBackendEntityId(selectedEntity.id);
    loadEntityDetails(backendId);
    loadAssetsData(backendId);
  }, [selectedEntity.id]);

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOverview();
      setOverviewData(data);
    } catch (err) {
      setError("Failed to connect to ARGUS Backend API. Ensure backend server is running on http://127.0.0.1:8000.");
    } finally {
      setLoading(false);
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
      console.error("Error loading entity details:", err);
    }
  };

  const loadAssetsData = async (entityId) => {
    try {
      const data = await fetchAssets(entityId);
      setAssetsData(data);
    } catch (err) {
      console.error("Error loading assets data:", err);
    }
  };

  const loadIncidentData = async (incidentId) => {
    try {
      const data = await fetchCandidateIncident(incidentId);
      setIncidentData(data);
    } catch (err) {
      console.error("Error loading candidate incident:", err);
    }
  };

  const openFindingModal = async (findingId) => {
    try {
      const data = await fetchFinding(findingId);
      setModalData(data);
      setModalFindingId(findingId);
    } catch (err) {
      console.error("Error loading finding drilldown:", err);
    }
  };

  // Switch active entity across both mock and backend data
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

  // Ingest custom case into mock entity state
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

  // Jump from Review Queue / Findings to Incident Reconstruction
  const handleInvestigatePriorityCase = (entityId, incidentId) => {
    handleSelectEntity(entityId);
    const targetIncident = incidentId || (entityData?.candidate_incidents?.[0]?.finding_id) || `IR01-${toBackendEntityId(entityId)}-0`;
    setActiveIncidentId(targetIncident);
    loadIncidentData(targetIncident);
    navigateToView("incident-reconstruction");
  };

  // Render error screen if backend cannot be reached
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#07090e] text-slate-200 p-6 scanline">
        <div className="glass-panel border-rose-500/40 rounded-2xl p-8 max-w-lg text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 bg-rose-950/80 border border-rose-500/60 text-rose-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-bold text-white">Backend Connection Required</h2>
          <p className="text-slate-300 text-xs leading-relaxed">{error}</p>
          <div className="bg-slate-950 p-3 rounded-xl text-left text-xs font-mono text-cyan-300 border border-slate-800">
            Start backend with:<br/>
            <span className="font-bold text-white">python run_demo.py</span>
          </div>
          <button
            type="button"
            onClick={loadOverview}
            className="px-5 py-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-xl font-semibold text-xs border border-slate-600 shadow-md transition-all flex items-center space-x-2 mx-auto"
          >
            <RefreshCw size={13} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 scanline">
      
      {/* 1. TOP EXECUTIVE HEADER */}
      <Header
        entities={entities}
        selectedEntity={selectedEntity}
        onSelectEntity={handleSelectEntity}
        onOpenExport={() => setIsDossierOpen(true)}
        onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      {/* 2. TOP ENTITY OPERATIONAL BANNER (Traditional Vanity KPIs vs ARGUS Behavioral Truth) */}
      <EntityOverviewBanner entity={selectedEntity} />

      {/* 3. NAVIGATION TABS BAR (Rich Interactive Console & Dedicated Feature Pages) */}
      <div className="w-full bg-[#090d16] border-b border-slate-800 px-4 lg:px-8 sticky top-[61px] z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Scrollable Tab Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 custom-scrollbar">
            
            {/* Interactive Tool 1: Review Queue & Decision Graph */}
            <button
              onClick={() => navigateToView('graph')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'graph'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Review Queue & Graph</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 text-cyan-300 font-sans border border-cyan-700/40">
                {selectedEntity.cases?.length || 0}
              </span>
            </button>

            {/* DEDICATED NEW FEATURE PAGE 1: EXECUTION GAPS */}
            <button
              onClick={() => navigateToView('execution-gaps')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'execution-gaps'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Feature 1: Execution Gaps</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 font-sans border border-amber-700/40">
                EG-01..04
              </span>
            </button>

            {/* DEDICATED NEW FEATURE PAGE 2: NEGATIVE SPACE */}
            <button
              onClick={() => navigateToView('negative-space')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'negative-space'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <EyeOff className="w-4 h-4 text-teal-400" />
              <span>Feature 2: Negative Space</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-950/80 text-teal-300 font-sans border border-teal-700/40">
                NS-01..02
              </span>
            </button>

            {/* DEDICATED NEW FEATURE PAGE 3: INCIDENT RECONSTRUCTION */}
            <button
              onClick={() => navigateToView('incident-reconstruction')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'incident-reconstruction'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GitMerge className="w-4 h-4 text-purple-400" />
              <span>Feature 3: Incident Reconstruction</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950/80 text-purple-300 font-sans border border-purple-700/40">
                IR-01
              </span>
            </button>

            {/* DEDICATED NEW FEATURE PAGE 4: EXPECTED VS OBSERVED */}
            <button
              onClick={() => navigateToView('expected-vs-observed')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'expected-vs-observed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Feature 4: Expected vs Observed</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 font-sans border border-emerald-700/40">
                EVO
              </span>
            </button>

            {/* DEDICATED NEW FEATURE PAGE 5: PEER COMPARISON */}
            <button
              onClick={() => navigateToView('peer-comparison')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'peer-comparison'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Feature 5: Peer Comparison</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-950/80 text-blue-300 font-sans border border-blue-700/40">
                Cohort
              </span>
            </button>

            {/* DEDICATED NEW FEATURE PAGE 6: EVIDENCE TRACEABILITY */}
            <button
              onClick={() => navigateToView('evidence-traceability')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'evidence-traceability'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FileCheck className="w-4 h-4 text-rose-400" />
              <span>Feature 6: Evidence Traceability</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950/80 text-rose-300 font-sans border border-rose-700/40">
                Audit Chain
              </span>
            </button>

            {/* Interactive Tool 2: Ghost Attack Replay */}
            <button
              onClick={() => navigateToView('ghost-replay')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'ghost-replay'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Flame className="w-4 h-4 text-red-400" />
              <span>Ghost Attack Replay</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-950/80 text-red-300 font-sans border border-red-700/40">
                5 Stages
              </span>
            </button>

            {/* Interactive Tool 3: Counterfactual Decision Replay */}
            <button
              onClick={() => navigateToView('counterfactual')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeView === 'counterfactual'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GitFork className="w-4 h-4 text-amber-400" />
              <span>Counterfactual Simulator</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 font-sans border border-amber-700/40">
                3 Paths
              </span>
            </button>

          </div>

          {/* Quick Status Pill */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-slate-400 py-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SIH PS 26157 VERIFIED DEMO SPECIFICATION</span>
          </div>

        </div>
      </div>

      {/* 4. MAIN WORK AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* VIEW 0: REVIEW QUEUE & INCIDENT DECISION GRAPH (FLAGSHIP INTERACTIVE DAG) */}
        {activeView === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <SupervisoryReviewQueue
                cases={selectedEntity.cases || []}
                selectedCase={selectedCase}
                onSelectCase={setSelectedCase}
                onOpenGraph={() => navigateToView('graph')}
                onOpenCounterfactual={() => navigateToView('counterfactual')}
              />
            </div>
            <div className="lg:col-span-7">
              <IncidentDecisionGraph activeCase={selectedCase} />
            </div>
          </div>
        )}

        {/* DEDICATED NEW FEATURE 1: EXECUTION GAPS */}
        {activeView === 'execution-gaps' && (
          <ViewEntityFindings
            entityData={entityData}
            onOpenModal={openFindingModal}
            initialTab="execution"
            onSelectIncident={(incId) => handleInvestigatePriorityCase(selectedEntity.id, incId)}
          />
        )}

        {/* DEDICATED NEW FEATURE 2: NEGATIVE SPACE */}
        {activeView === 'negative-space' && (
          <ViewMonitoringCoverage
            assetsData={assetsData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* DEDICATED NEW FEATURE 3: INCIDENT RECONSTRUCTION */}
        {activeView === 'incident-reconstruction' && (
          <ViewIncidentReconstruction
            incidentId={activeIncidentId}
            incidentData={incidentData}
            candidateIncidents={entityData?.candidate_incidents || []}
            onLoadIncident={loadIncidentData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* DEDICATED NEW FEATURE 4: EXPECTED VS OBSERVED */}
        {activeView === 'expected-vs-observed' && (
          <ViewExpectedVsObserved
            incidentId={activeIncidentId}
            incidentData={incidentData}
            entityData={entityData}
            candidateIncidents={entityData?.candidate_incidents || []}
            onLoadIncident={loadIncidentData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* DEDICATED NEW FEATURE 5: PEER COMPARISON */}
        {activeView === 'peer-comparison' && (
          <ViewPeerComparison
            data={overviewData}
            selectedEntityId={toBackendEntityId(selectedEntity.id)}
            onSelectEntity={handleSelectEntity}
            onInvestigatePriority={handleInvestigatePriorityCase}
          />
        )}

        {/* DEDICATED NEW FEATURE 6: EVIDENCE TRACEABILITY */}
        {activeView === 'evidence-traceability' && (
          <ViewEvidenceTraceability
            entityData={entityData}
            assetsData={assetsData}
            onOpenModal={openFindingModal}
          />
        )}

        {/* INTERACTIVE TOOL: GHOST ATTACK REPLAY */}
        {activeView === 'ghost-replay' && (
          <GhostAttackReplay activeEntityId={selectedEntity.id} />
        )}

        {/* INTERACTIVE TOOL: COUNTERFACTUAL DECISION REPLAY */}
        {activeView === 'counterfactual' && (
          <CounterfactualReplay />
        )}

        {/* 5. CONFIDENCE & RADICAL TRANSPARENCY PANEL (Always Visible on Work Area) */}
        <ConfidenceLimitationsPanel 
          activeEntity={selectedEntity} 
          activeCase={selectedCase} 
        />

      </main>

      {/* 6. FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090d16] px-4 lg:px-8 py-4 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ARGUS ENGINE v2.4-SUPERVISORY // NCIIPC & CERT-IN ALIGNED SPECIFICATION</span>
          </div>
          <div>
            <span className="text-cyan-400">SIH PROBLEM STATEMENT 26157 // ZERO CLOUD DEPENDENCY // AIR-GAPPED READY</span>
          </div>
        </div>
      </footer>

      {/* 7. MODALS */}
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

      {/* FORENSIC EVIDENCE MODAL */}
      {modalData && (
        <EvidenceModal 
          data={modalData} 
          onClose={() => setModalData(null)} 
        />
      )}

    </div>
  );
}
