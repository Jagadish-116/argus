// src/components/SupervisoryDossierModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ShieldAlert, 
  Printer, 
  Award, 
  Building2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SupervisoryDossierModal({ entity, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !entity) return null;

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateMarkdownReport = () => {
    return `# ARGUS SUPERVISORY AUDIT DOSSIER
**Evaluation Reference:** SIH26157-AUDIT-${entity.id.toUpperCase()}-${Date.now().toString().slice(-6)}
**Date Generated:** ${reportDate}
**Security Classification:** RESTRICTED // REGULATORY AUDIT USE ONLY

---

## 1. Executive Summary & Diagnosis
- **Assessed Entity:** ${entity.name} (${entity.shortName})
- **Industry Sector:** ${entity.sector}
- **Operational Archetype:** ${entity.argusMetrics.archetype}
- **Supervisory Status:** ${entity.argusMetrics.statusGrade}

## 2. Quantitative Assurance Comparison
| Metric Dimension | Traditional KPI (Superficial) | ARGUS Behavioral Assurance (Observed) | Supervisory Implication |
|---|---|---|---|
| Response Latency / MTTR | ${entity.traditionalMetrics.mttr} (Grade: ${entity.traditionalMetrics.statusGrade}) | ${entity.argusMetrics.averageAttackerDwellWindow} Attacker Dwell Window | Superficial speed masks uncontained lateral movement |
| Case Resolution Rate | ${entity.traditionalMetrics.closureRate} (${entity.traditionalMetrics.alertsVolume}) | ${entity.argusMetrics.negativeSpaceFindings} Negative Space Omissions | Critical containment steps bypassed |
| Operational Health Index | ${entity.traditionalMetrics.slaAdherence} Contractual SLA | Decision Debt: ${entity.argusMetrics.decisionDebt} / 100 | ${entity.argusMetrics.decisionDebt > 70 ? 'CRITICAL OPERATIONAL RISK' : 'STABLE RESILIENCE'} |
| Investigative Authenticity | 100% Ticket Completeness | ${entity.argusMetrics.templateRepetition} Template Repetition | ${parseFloat(entity.argusMetrics.templateRepetition) > 40 ? 'High probability of robotic checklist compliance' : 'Natural investigative variability'} |

## 3. Data Integrity & Provenance
- **Evidence Completeness:** ${entity.dataAssurance.completeness}%
- **Evidence Quality Index:** ${entity.dataAssurance.overallEvidenceQuality}/100
- **Cryptographic Provenance:** ${entity.dataAssurance.hashIntegrity}
- **Assurance Verdict:** ${entity.dataAssurance.status}

## 4. Prioritized Negative Space Gaps (Top Audit Findings)
${entity.cases.map(c => `
### Case [${c.id}]: ${c.title}
- **Target Asset:** ${c.asset} (${c.assetCriticality})
- **Triage Duration:** ${c.durationMinutes} mins | Decision Debt Impact: +${c.decisionDebtImpact} pts
- **Negative Space Flags:**
${c.negativeSpaceFlags?.map(f => `  - [${f.severity}] **${f.type}**: ${f.description} *(Expected by: ${f.expectedBy})*`).join('\n') || '  - None identified.'}
- **Missing Required Actions:**
${c.missingActions?.map(a => `  - ❌ ${a}`).join('\n') || '  - All mandatory actions verified.'}
`).join('\n')}

---
**Certified by ARGUS Supervisory Intelligence Engine // Offline Air-Gapped Verification**
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const markdown = generateMarkdownReport();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARGUS_Audit_Dossier_${entity.shortName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b0f1a] border border-cyan-500/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                SUPERVISORY AUDIT DOSSIER
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-sans border border-cyan-700">
                  SIGNED EXPORT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official Regulatory Assessment Record for {entity.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Dossier</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 font-sans">
          
          {/* Executive Overview Header */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-500 font-mono uppercase block">Target Organization</span>
              <h4 className="text-base font-bold text-white mt-0.5">{entity.name}</h4>
              <span className="text-slate-400 text-xs">{entity.sector} • {entity.scale}</span>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-slate-500 block uppercase text-[10px]">Decision Debt Score</span>
              <span className={`text-2xl font-bold ${
                entity.argusMetrics.decisionDebt > 70 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {entity.argusMetrics.decisionDebt} / 100
              </span>
              <span className="text-slate-400 block text-[11px]">{entity.argusMetrics.statusGrade}</span>
            </div>
          </div>

          {/* Markdown Preview Area */}
          <div className="p-4 rounded-xl bg-[#07090e] border border-slate-800/80 font-mono text-[12px] leading-relaxed text-slate-300 space-y-4">
            <pre className="whitespace-pre-wrap font-mono text-slate-300 overflow-x-auto">
              {generateMarkdownReport()}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
