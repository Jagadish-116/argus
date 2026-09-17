import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Info,
  Layers,
  ArrowRight,
  Terminal
} from 'lucide-react';

export const IncidentDecisionPipeline = () => {
  const [selectedScenario, setSelectedScenario] = useState("critical");
  const [activeStep, setActiveStep] = useState(3); // 0: Trigger, 1: Triage, 2: Decision, 3: Action
  const [isSimulating, setIsSimulating] = useState(false);

  const scenarios = {
    critical: {
      id: "critical",
      name: "Critical Privilege Escalation (EG-01)",
      trigger: {
        alertId: "ALT-ALPHA-4002",
        sourceIp: "192.168.10.45",
        timestamp: "2026-09-17 08:42:15 UTC",
        severity: "CRITICAL",
        border: "#EF4444", // Red
      },
      triage: {
        matchedRule: "RULE-EG01-UNESCALATED-SERIOUS",
        confidence: "98.4%",
        border: "#3B82F6", // Blue
      },
      decision: {
        question: "Is Severity > High & Escalation Missing?",
        condition: "Condition: Critical Asset + 0 Tier-2 Tickets",
        result: "YES",
      },
      action: {
        outcome: "Isolate Host & Alert Supervisor",
        playbook: "PB-CONTAIN-HOST-01",
        type: "containment", // Red border
        border: "#EF4444",
      },
      edgeColor: "#EF4444", // Critical path
    },
    standard: {
      id: "standard",
      name: "Low-Risk Procedural Verification",
      trigger: {
        alertId: "ALT-BETA-1082",
        sourceIp: "10.0.4.19",
        timestamp: "2026-09-17 09:15:00 UTC",
        severity: "MEDIUM",
        border: "#F59E0B", // Amber
      },
      triage: {
        matchedRule: "RULE-BENIGN-SCAN-FILTER",
        confidence: "91.2%",
        border: "#3B82F6", // Blue
      },
      decision: {
        question: "Is Severity > High & Escalation Missing?",
        condition: "Condition: Standard Baseline Satisfied",
        result: "NO",
      },
      action: {
        outcome: "Log Telemetry & Mark Resolved",
        playbook: "PB-STANDARD-LOG-04",
        type: "resolution", // Green border
        border: "#10B981",
      },
      edgeColor: "#06B6D4", // Standard cyan path
    },
  };

  const current = scenarios[selectedScenario];

  const runSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setActiveStep(step);
      if (step >= 3) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 900);
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-5 sm:p-6 shadow-md space-y-6">
      
      {/* PIPELINE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider bg-[#06B6D4]/20 px-2 py-0.5 rounded-full border border-[#06B6D4]/30">
              Decision Tree Engine
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">Graph Module</span>
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">
            Incident Decision Pipeline (Automated Reasoning Flow)
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Interactive topological graph mapping trigger ingestion, automated triage, branching evaluation, and playbook execution.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <select
            value={selectedScenario}
            onChange={(e) => {
              setSelectedScenario(e.target.value);
              setActiveStep(3);
            }}
            className="bg-[#0F172A] text-[#F8FAFC] border border-[#334155] rounded-md px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#06B6D4]"
          >
            <option value="critical">Scenario 1: Critical Escalation</option>
            <option value="standard">Scenario 2: Standard Resolution</option>
          </select>

          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulating}
            className="btn-primary px-3 py-1.5 text-xs flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
          >
            <Play size={13} />
            <span>{isSimulating ? "Streaming..." : "Simulate Flow"}</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE GRAPH CANVAS */}
      <div className="relative overflow-x-auto custom-scrollbar p-4 bg-[#0F172A] rounded-lg border border-[#334155] min-h-[360px] flex items-center justify-center">
        
        {/* SVG CONNECTOR LINES */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minWidth: "820px", minHeight: "340px" }}
        >
          {/* Edge 1: TriggerNode -> TriageNode */}
          <line
            x1="185"
            y1="170"
            x2="285"
            y2="170"
            stroke={activeStep >= 1 ? current.edgeColor : "#64748B"}
            strokeWidth="2.5"
            className={activeStep >= 1 ? "edge-flow-active" : ""}
          />

          {/* Edge 2: TriageNode -> DecisionNode */}
          <line
            x1="455"
            y1="170"
            x2="535"
            y2="170"
            stroke={activeStep >= 2 ? current.edgeColor : "#64748B"}
            strokeWidth="2.5"
            className={activeStep >= 2 ? "edge-flow-active" : ""}
          />

          {/* Edge 3: DecisionNode -> ActionNode */}
          <line
            x1="665"
            y1="170"
            x2="755"
            y2="170"
            stroke={activeStep >= 3 ? current.edgeColor : "#64748B"}
            strokeWidth="2.5"
            className={activeStep >= 3 ? "edge-flow-active" : ""}
          />
        </svg>

        {/* NODES ROW */}
        <div className="relative z-10 flex items-center space-x-12 sm:space-x-16 min-w-[820px] py-6 px-4">
          
          {/* 1. TRIGGER NODE */}
          <div 
            className={`w-44 bg-[#1E293B] rounded-lg p-3.5 border-2 shadow-lg transition-all ${
              activeStep >= 0 ? "scale-105" : "opacity-60"
            }`}
            style={{ borderColor: current.trigger.border }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                TriggerNode
              </span>
              <ShieldAlert size={14} style={{ color: current.trigger.border }} />
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#94A3B8] font-sans block">Alert ID:</span>
                <span className="font-bold text-[#F8FAFC]">{current.trigger.alertId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] font-sans block">Source IP:</span>
                <span className="text-[#06B6D4]">{current.trigger.sourceIp}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] font-sans block">Timestamp:</span>
                <span className="text-[#94A3B8] text-[10px]">{current.trigger.timestamp}</span>
              </div>
            </div>
          </div>

          {/* EDGE LABEL 1 */}
          <div className="relative">
            <span className="px-2 py-0.5 rounded-full bg-[#0F172A] border border-[#64748B] text-[10px] font-mono font-bold text-[#94A3B8] shadow">
              Ingest
            </span>
          </div>

          {/* 2. TRIAGE NODE */}
          <div 
            className={`w-44 bg-[#1E293B] rounded-lg p-3.5 border-2 border-[#3B82F6] shadow-lg transition-all ${
              activeStep >= 1 ? "scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3B82F6]">
                TriageNode
              </span>
              <Cpu size={14} className="text-[#3B82F6]" />
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#94A3B8] font-sans block">Matched Rule:</span>
                <span className="font-bold text-[#F8FAFC] text-[11px] truncate block" title={current.triage.matchedRule}>
                  {current.triage.matchedRule}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-[10px] text-[#94A3B8] font-sans block">Confidence Score:</span>
                <span className="text-base font-extrabold text-[#3B82F6]">{current.triage.confidence}</span>
              </div>
            </div>
          </div>

          {/* EDGE LABEL 2 */}
          <div className="relative">
            <span className="px-2 py-0.5 rounded-full bg-[#0F172A] border border-[#64748B] text-[10px] font-mono font-bold text-[#06B6D4] shadow">
              Evaluate
            </span>
          </div>

          {/* 3. DECISION NODE (DIAMOND SHAPE WITH SLATE BACKGROUND & CYAN GLOW) */}
          <div className="relative flex items-center justify-center">
            {/* Outer Diamond Geometry */}
            <div 
              className={`w-36 h-36 bg-[#1E293B] border-2 border-[#06B6D4] transform rotate-45 flex items-center justify-center transition-all ${
                activeStep >= 2 ? "scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "opacity-60"
              }`}
            >
              {/* Inner Content (Counter-Rotated to remain upright) */}
              <div className="transform -rotate-45 text-center p-2 space-y-1 max-w-[110px]">
                <span className="text-[9px] font-mono uppercase font-bold text-[#06B6D4] block">
                  DecisionNode
                </span>
                <div className="text-[11px] font-bold text-[#F8FAFC] leading-tight">
                  {current.decision.question}
                </div>
              </div>
            </div>

            {/* Edge Pill Label anchored to the right of DecisionNode */}
            <div className="absolute -right-12 z-20">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-md border ${
                current.decision.result === "YES"
                  ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                  : "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
              }`}>
                {current.decision.result}
              </span>
            </div>
          </div>

          {/* 4. ACTION NODE (RESOLUTION: GREEN BORDER, CONTAINMENT: RED BORDER) */}
          <div 
            className={`w-48 bg-[#1E293B] rounded-lg p-3.5 border-2 shadow-lg transition-all ${
              activeStep >= 3 ? "scale-105" : "opacity-60"
            }`}
            style={{ 
              borderColor: current.action.border,
              boxShadow: activeStep >= 3 ? `0 0 20px ${current.action.border}33` : "none" 
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: current.action.border }}>
                ActionNode ({current.action.type})
              </span>
              {current.action.type === "containment" ? (
                <XCircle size={14} className="text-[#EF4444]" />
              ) : (
                <CheckCircle2 size={14} className="text-[#10B981]" />
              )}
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#94A3B8] font-sans block">Outcome Action:</span>
                <span className="font-bold text-[#F8FAFC] text-xs leading-tight block">
                  {current.action.outcome}
                </span>
              </div>
              <div className="bg-[#0F172A] p-2 rounded border border-[#334155] text-[10px]">
                <span className="text-[#94A3B8] font-sans block">Executed Playbook:</span>
                <span className="text-[#06B6D4] font-bold">{current.action.playbook}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SCHEMA FOOTER SPECIFICATION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
          <span className="text-[10px] font-mono uppercase text-[#EF4444] font-bold block mb-1">
            TriggerNode Schema
          </span>
          <p className="text-[#94A3B8] text-[11px] leading-relaxed">
            Ingests alert ID, source IP, and timestamp with red/amber priority border.
          </p>
        </div>

        <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
          <span className="text-[10px] font-mono uppercase text-[#3B82F6] font-bold block mb-1">
            TriageNode Schema
          </span>
          <p className="text-[#94A3B8] text-[11px] leading-relaxed">
            Displays evaluated rule signature and probabilistic confidence score.
          </p>
        </div>

        <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
          <span className="text-[10px] font-mono uppercase text-[#06B6D4] font-bold block mb-1">
            DecisionNode Schema
          </span>
          <p className="text-[#94A3B8] text-[11px] leading-relaxed">
            Branching diamond geometry with slate background and cyan ambient glow.
          </p>
        </div>

        <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
          <span className="text-[10px] font-mono uppercase text-[#10B981] font-bold block mb-1">
            ActionNode Schema
          </span>
          <p className="text-[#94A3B8] text-[11px] leading-relaxed">
            Contains playbook outcome with green (resolution) or red (containment) border.
          </p>
        </div>
      </div>

    </div>
  );
};

export default IncidentDecisionPipeline;
