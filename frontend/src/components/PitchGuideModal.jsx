// src/components/PitchGuideModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const defenseQuestions = [
  {
    q: 'Fault 1: How do you know what SHOULD have happened? Who tells ARGUS what is correct?',
    a: 'We do not invent arbitrary universal correctness. ARGUS uses a Dual-Expectation Model: Layer A evaluates compliance against the organization’s declared Standard Operating Procedures (SOP), while Layer B benchmarks against regulatory supervisory baselines (NCIIPC, CERT-In, NIST SP 800-61). We report execution gaps relative to declared policy, not subjective opinion.'
  },
  {
    q: 'Fault 2: What if the organization games ARGUS by copying-pasting template notes?',
    a: 'ARGUS features automated Gaming & Metric-Manipulation Detection. In Entity Gamma, we demonstrate an 89.4% template repetition detector that flags high cosine similarity across triage notes and rigid artificial closure times (e.g. exactly 12m 00s), surfacing "compliance without substance".'
  },
  {
    q: 'Fault 3: What if the input data is incomplete or manipulated ("Garbage In, Garbage Out")?',
    a: 'Before scoring behavior, ARGUS computes an Evidence Quality Score (0-100) and Data Assurance Rating. If triage records lack timestamps, process arguments, or PCAP hashes, ARGUS flags an "Evidence Vacuum" rather than hallucinating a conclusion.'
  },
  {
    q: 'Fault 4: Why are you using AI? Aren’t you just rules, statistics, and graphs?',
    a: 'Exactly—and that is a deliberate strength! Security decisions cannot rely on unpredictable black-box LLM hallucinations. The core analytical engine combines deterministic policy evaluation, graph-based relationship reconstruction, and statistical anomaly detection. Machine learning and optional local LLMs are strictly confined to evidence-grounded summarization.'
  },
  {
    q: 'Fault 5: Doesn’t a high alert volume overwhelm the supervisor with false positives?',
    a: 'ARGUS enforces a Supervisory Attention Budget. Instead of dumping 10,000 alerts on human auditors, our prioritization engine clusters related cases and surfaces the Top Actionable Incidents that carry the highest accumulated Decision Debt and containment omissions.'
  },
  {
    q: 'Fault 6: How does ARGUS operate in sensitive or air-gapped critical infrastructure?',
    a: 'ARGUS is engineered for 100% offline, air-gapped deployment with zero external internet dependencies. Telemetry is hashed and verified locally using SHA-256 integrity proofs, ensuring complete operational privacy for military, banking, and energy operators.'
  }
];

export function PitchGuideModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b0f1a] border border-cyan-500/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                PITCH GUIDE & JUDGE DEFENSE BLUEPRINT
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-sans border border-amber-700">
                  SIH 26157 WINNING KIT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                1-Minute Pitch Script, Core Differentiators, and the 30-Fault Defense Bank
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Section 1: The 1-Minute Pitch Script */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              THE 1-MINUTE ELEVATOR PITCH
            </div>
            <p className="text-slate-300 text-xs leading-relaxed italic bg-slate-900/60 p-3 rounded border border-slate-800">
              "Respected judges, existing SOC dashboards measure <strong>how many</strong> alerts were closed and how fast. But in modern cyber warfare, a SOC can report a 98% closure rate and 4-minute MTTR while completely missing multi-stage intrusions.
              <br /><br />
              We built <strong>ARGUS</strong>—the Adversarial Resilience & Governance Understanding System. Instead of superficial throughput KPIs, ARGUS audits the <em>negative space</em> of security decisions: what actions <strong>should</strong> have occurred according to SOP and regulatory guidelines, but were omitted. By reconstructing multi-stage Incident Decision Graphs, quantifying accumulated Decision Debt, and replaying attacks against triage timelines, ARGUS gives national regulators and chief supervisors an unhackable, evidence-backed ground truth of operational readiness."
            </p>
          </div>

          {/* Section 2: The Three-Entity Demonstration Strategy */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              THE THREE-COHORT DEMO PROOF
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-red-950/20 border border-red-800/40 space-y-1">
                <span className="font-bold text-red-300 font-mono block">1. Apex Bank (Alpha)</span>
                <span className="text-[11px] text-slate-400 block">
                  KPIs: <strong>97.8% closed, 4.2m MTTR</strong>
                </span>
                <span className="text-red-400 font-bold block text-[11px]">ARGUS Verdict: Decision Debt 82</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  73% premature closures. SWIFT gateway credential dump closed in 3m without quarantine, enabling breach.
                </p>
              </div>

              <div className="p-3 rounded bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                <span className="font-bold text-emerald-300 font-mono block">2. National Grid (Beta)</span>
                <span className="text-[11px] text-slate-400 block">
                  KPIs: <strong>82.4% closed, 28.4m MTTR</strong>
                </span>
                <span className="text-emerald-400 font-bold block text-[11px]">ARGUS Verdict: Decision Debt 21</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  Appears slow on paper, but executes instant physical isolation, captures PCAPs, and has zero uncontained gaps.
                </p>
              </div>

              <div className="p-3 rounded bg-amber-950/20 border border-amber-800/40 space-y-1">
                <span className="font-bold text-amber-300 font-mono block">3. Metro Health (Gamma)</span>
                <span className="text-[11px] text-slate-400 block">
                  KPIs: <strong>99.4% closed, 12m MTTR</strong>
                </span>
                <span className="text-amber-400 font-bold block text-[11px]">ARGUS Verdict: Decision Debt 68</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  The Compliance Mirage: 89.4% template repetition. Analysts copy-pasting checklists without actual investigation.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Judge Q&A Defense Bank */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-sm">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              HARDENED JUDGE DEFENSE BANK (FAULTS 1 - 30)
            </div>
            
            <div className="space-y-2">
              {defenseQuestions.map((item, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <div 
                    key={idx} 
                    className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between font-mono font-semibold text-slate-200 hover:text-cyan-300 text-xs transition-all"
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-slate-300 text-[11px] leading-relaxed border-t border-slate-800/50 bg-slate-950/70">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
