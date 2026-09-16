// src/components/LogUploadModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

const samplePayloads = [
  {
    label: 'Sample: In-Memory Attack (FinTech)',
    json: JSON.stringify({
      case_id: 'CUSTOM-INGEST-801',
      alert_name: 'LSASS Memory Injection',
      severity: 'CRITICAL',
      asset_name: 'PAYMENT-SWITCH-01',
      analyst: 'Tier1_Analyst',
      triage_duration_sec: 140,
      actions_taken: ['Viewed alert', 'Pinged server', 'Closed ticket'],
      notes: 'No abnormal traffic seen. Closed.'
    }, null, 2)
  },
  {
    label: 'Sample: SCADA Modbus Command (Grid)',
    json: JSON.stringify({
      case_id: 'CUSTOM-INGEST-802',
      alert_name: 'Unauthorized Modbus Coil Write',
      severity: 'CRITICAL',
      asset_name: 'GENERATOR-RTU-09',
      analyst: 'ICS_Lead_V',
      triage_duration_sec: 1600,
      actions_taken: ['Host network isolated', 'PCAP buffer extracted', 'Dual-analyst signed off'],
      notes: 'Spoofed packet blocked at DMZ firewall. Validated.'
    }, null, 2)
  }
];

export function LogUploadModal({ isOpen, onClose, onIngestCase }) {
  const [jsonText, setJsonText] = useState(samplePayloads[0].json);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleIngest = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      
      const newCase = {
        id: parsed.case_id || `CASE-${Date.now().toString().slice(-4)}`,
        title: parsed.alert_name || 'Custom Ingested Incident',
        timestamp: new Date().toISOString(),
        severity: parsed.severity || 'HIGH',
        asset: parsed.asset_name || 'HOST-UNKNOWN',
        assetCriticality: parsed.severity === 'CRITICAL' ? 'MAXIMUM_CRITICAL' : 'HIGH',
        assignedAnalyst: parsed.analyst || 'Analyst_Custom',
        durationMinutes: Math.round((parsed.triage_duration_sec || 300) / 60 * 10) / 10,
        status: 'INGESTED_ANALYZED',
        decisionDebtImpact: parsed.triage_duration_sec < 300 ? 32 : 8,
        evidenceQualityScore: parsed.notes?.length > 40 ? 80 : 35,
        negativeSpaceFlags: parsed.triage_duration_sec < 300 ? [
          {
            type: 'PREMATURE_CLOSURE',
            severity: 'HIGH',
            description: 'Triage closed under 5 minutes without mandatory process tree inspection.',
            expectedBy: 'Supervisory Baseline'
          }
        ] : [],
        gamingSignals: [],
        linkStrength: 85,
        notes: [
          {
            time: new Date().toISOString(),
            analyst: parsed.analyst || 'Analyst_Custom',
            content: parsed.notes || 'No notes provided.'
          }
        ],
        missingActions: parsed.triage_duration_sec < 300 ? ['Endpoint Network Quarantine', 'Forensic PCAP Capture'] : [],
        observedActions: parsed.actions_taken || ['Alert viewed in SIEM'],
        graphNodes: [
          { id: 'n1', label: parsed.alert_name || 'Custom Alert', type: 'alert', severity: parsed.severity || 'HIGH', detail: parsed.asset_name },
          { id: 'n2', label: 'Triage: ' + (parsed.analyst || 'Analyst'), type: 'analyst_action', detail: parsed.notes }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Triage' }
        ]
      };

      onIngestCase(newCase);
      confetti({ particleCount: 40, spread: 50 });
      onClose();
    } catch (e) {
      setError('Invalid JSON syntax. Please verify and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b0f1a] border border-cyan-500/50 rounded-2xl w-full max-w-2xl flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                TELEMETRY INGESTION ADAPTER
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-sans border border-cyan-700">
                  CANONICAL NORMALIZER
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Directly map SIEM alerts and case tickets into ARGUS Behavioral Schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          
          {/* Sample buttons */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Load Sample:</span>
            {samplePayloads.map((samp, i) => (
              <button
                key={i}
                onClick={() => setJsonText(samp.json)}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]"
              >
                {samp.label}
              </button>
            ))}
          </div>

          {/* JSON Textarea */}
          <div className="space-y-1">
            <label className="text-slate-400 font-mono block text-[11px]">
              Raw SOC Log Payload (JSON):
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={12}
              className="w-full bg-[#070a12] border border-slate-800 rounded-lg p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 selection:bg-cyan-500/40"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 font-mono text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleIngest}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Normalize & Ingest</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
