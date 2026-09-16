# ARGUS — Adversarial Resilience & Governance Understanding System
### SIH Problem Statement 26157: SOC Behavioral Assessment & Operational Supervisory Assurance

[![Built for SIH 26157](https://img.shields.io/badge/SIH-26157-cyan.svg)](https://www.sih.gov.in/)
[![Environment](https://img.shields.io/badge/Deployment-Air--Gapped%20Offline-emerald.svg)]()
[![Architecture](https://img.shields.io/badge/Design-Dual--Expectation%20Governance-blue.svg)]()

> **"Traditional SOC metrics measure *how many* alerts were closed and how fast. ARGUS determines *whether decisions were operationally sound*, exposes the *negative space* of omitted actions, and prioritizes evidence for human supervisory review."**

---

## 🎯 Executive Overview & Problem Context

In modern cybersecurity operations, Security Operations Centers (SOCs) routinely boast stellar performance dashboards:
- **98% Ticket Closure Rates**
- **Under 5-Minute Mean-Time-To-Respond (MTTR)**
- **99% SLA Adherence**

Yet, major financial institutions, healthcare providers, and critical power grids continue to suffer catastrophic breaches that dwell undetected for months. 

### Why Traditional Metrics Fail:
1. **The KPI Illusion:** Analysts are incentivized to rapidly close tickets rather than perform deep investigations.
2. **The Negative Space Blindspot:** Standard dashboards only log actions that *occurred*. They are blind to actions that **should have happened according to SOP but were omitted** (e.g., alert closed without host isolation, unrevoked credentials, absent memory snapshots).
3. **Gaming & Template Repetition:** Analysts frequently copy-paste generic triage notes across hundreds of tickets to satisfy procedural audits.
4. **Alert Fatigue:** Regulators and SOC leads are overwhelmed by 10,000+ alerts, making proactive supervision impossible without an intelligent attention budget.

---

## 🛡️ The ARGUS Solution Architecture

ARGUS replaces superficial throughput counters with **Evidence-Based Supervisory Behavioral Analytics**:

```
                             [ Raw SOC Operational Telemetry ]
                       (SIEM Alerts, Triage Notes, EDR Dispositions)
                                        │
                                        ▼
                       ┌─────────────────────────────────┐
                       │   DATA ASSURANCE & INTEGRITY    │
                       │  - Completeness Audit (0-100%)  │
                       │  - Evidence Quality Score (EQS) │
                       │  - SHA-256 Provenance Proof     │
                       └────────────────┬────────────────┘
                                        │
                                        ▼
                       ┌─────────────────────────────────┐
                       │   CANONICAL NORMALIZER LAYER    │
                       │  Maps heterogeneous SIEM/SOAR   │
                       │  schemas into unified ARGUS DAG │
                       └────────────────┬────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  DUAL-EXPECTATION    │     │  BEHAVIORAL GAMING   │     │  EXPLAINABLE INCIDENT│
│  ENGINE              │     │  & TEMPLATE ENGINE   │     │  LINKING ENGINE      │
│ Layer A: Org SOP     │     │ - Cosine note repeat │     │ - Same user (+25)    │
│ Layer B: Supervisory │     │ - Synthetic duration │     │ - Same asset (+25)   │
│   Regulatory Baseline│     │ - Velocity anomaly   │     │ - ATT&CK sequence    │
└──────────┬───────────┘     └──────────┬───────────┘     └──────────┬───────────┘
           └────────────────────────────┼────────────────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │    NEGATIVE SPACE ENGINE    │
                         │  Detects omitted containment│
                         │  missed escalations & gaps  │
                         └──────────────┬──────────────┘
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
┌──────────────────────────────┐                         ┌──────────────────────────────┐
│     DECISION DEBT INDEX      │                         │     INTERACTIVE REPLAYS      │
│  Accumulated risk score across│                         │ - Ghost Attack Replay        │
│  5 operational failure vectors│                         │ - Counterfactual Simulator   │
│  (0 - 100 explainable points) │                         │ - Incident Decision Graph    │
└──────────────┬───────────────┘                         └──────────────┬───────────────┘
               └────────────────────────────┬────────────────────────────┘
                                            │
                                            ▼
                         ┌─────────────────────────────────────┐
                         │   CONFIDENCE & TRANSPARENCY PANEL   │
                         │  Exposes data coverage, boundaries, │
                         │  and mandatory human verification   │
                         └──────────────────┬──────────────────┘
                                            │
                                            ▼
                         ┌─────────────────────────────────────┐
                         │      SUPERVISORY AUDIT DOSSIER      │
                         │  Exportable signed regulatory report│
                         └─────────────────────────────────────┘
```

---

## 🔬 Core Innovations & Capabilities

### 1. The Incident Decision Graph (DAG) — Dual View Modes
Visualizes security operations as a directed acyclic graph with two switchable modes:
- **Interactive 2D Topology Graph View:** Renders an interactive 2D node-link network with SVG cubic Bezier connectors, pan-and-drag canvas controls, zoom in/out/reset, and animated dashed-red markers showing where operational negative space branched away from compliant policy.
- **Sequential Pipeline View:** A horizontal stage flow detailing time offsets and sequential triage progression.
Unlike conventional dashboards, ARGUS displays both the **Observed Execution Path** (what happened) and the **Omitted Negative Space Forks** (critical containments or escalations that were skipped according to policy).

### 2. Decision Debt Index (0 - 100)
Quantifies the accumulation of uncontained operational risk caused by premature closures, lack of evidence, and delayed response. Every point is transparently derived from 5 explainable vectors with zero black-box mystery scoring.

### 3. Ghost Attack Replay Studio
A dual-track interactive simulator that replays real-world MITRE ATT&CK campaigns against the SOC's operational awareness. It reveals the exact minute a premature closure created an open operational window for an adversary to move laterally.

### 4. Counterfactual Decision Simulator
A 3-column side-by-side comparative engine:
- **Observed SOC Path:** What actually took place (e.g. premature closure in 3m, 260m dwell time, 4 servers breached).
- **Internal SOP Path:** What the organization's own documented manual required (quarantine in 5m, contained to 1 host).
- **Supervisory Baseline:** What national guidelines (NCIIPC / CERT-In) mandate (instant automated SOAR isolation < 60s, zero breach).

### 5. Multi-Entity Cohort Benchmarking (The 3-Archetype Proof)
ARGUS pre-loads three distinct organizational archetypes demonstrating why standard KPIs are misleading:
- **Apex Global Financial (Alpha):** Grade A+ on paper (4.2m MTTR, 97.8% closed), but **Decision Debt 82** due to premature closures on SWIFT payment gateways.
- **National Power Grid (Beta):** Grade C+ on paper (28.4m MTTR), but **Decision Debt 21** (resilient, deep evidence, zero uncontained lateral traversal).
- **Metro Health Consortium (Gamma):** Grade A+ on paper (12m MTTR, 99.4% SLA), but **Decision Debt 68** with 89.4% robotic template repetition detected.

### 6. Supervisory Attention Budget Review Queue
Filters out alert noise and delivers the **Top Actionable Cases** that carry real operational risk, maximizing the efficiency of regulatory auditors and human supervisors.

### 7. Signed Supervisory Audit Dossier
Generates exportable, cryptographically validated compliance dossiers in Markdown, JSON, and printable formats.

---

## 💻 Tech Stack & Architecture

- **Frontend:** React 18, Vite 8
- **Styling & Aesthetics:** Tailwind CSS v4, custom obsidian cyber theme (`#07090e`), neon telemetry badges (`#00f0ff`, `#ef4444`, `#10b981`, `#f59e0b`)
- **Icons & Visuals:** Lucide React, Canvas Confetti
- **Graph & Timeline Rendering:** Native SVG & Canvas Directed Acyclic Graph (DAG) visualizer with zero external cloud dependencies
- **Air-Gapped & Offline Ready:** 100% self-contained client-side analytics. No data leaves the local machine.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Launch
```bash
# 1. Clone or navigate to the repository
cd c:/Users/asus/OneDrive/Projects/ARGUS

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser and navigate to: `http://localhost:5173/`

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎤 SIH Judge Pitch & Defense Strategy

### 1-Minute Elevator Pitch
> *"Respected judges, existing SOC dashboards measure **how many** alerts were closed and how fast. But in modern cyber warfare, a SOC can report a 98% closure rate and 4-minute MTTR while completely missing multi-stage intrusions.
> 
> We built **ARGUS**—the Adversarial Resilience & Governance Understanding System. Instead of superficial throughput KPIs, ARGUS audits the negative space of security decisions: what actions **should** have occurred according to SOP and regulatory guidelines, but were omitted. By reconstructing multi-stage Incident Decision Graphs, quantifying accumulated Decision Debt, and replaying attacks against triage timelines, ARGUS gives national regulators and chief supervisors an unhackable, evidence-backed ground truth of operational readiness."*

### Key Judge Defense Answers
- **"How do you know what SHOULD have happened?"**
  - *Answer:* ARGUS uses a Dual-Expectation Model. Layer A measures against the company's own declared SOP; Layer B measures against regulatory baselines (NCIIPC / CERT-In). We report deviations from declared standards, not arbitrary opinions.
- **"What if an analyst copy-pastes template notes to game the system?"**
  - *Answer:* ARGUS includes cosine-similarity template detection and velocity artificiality analysis (e.g. Entity Gamma's 89.4% template flag).
- **"Why aren't you using generative AI for everything?"**
  - *Answer:* Security governance requires deterministic, auditable decisions. ARGUS uses deterministic rule evaluation and graph heuristics; AI/LLMs are strictly confined to evidence-grounded explanation.

---

## 👥 Team & Project Credits
- **Project:** ARGUS — Adversarial Resilience & Governance Understanding System
- **Problem Statement:** SIH 26157 (Ministry / Organization: Critical Information Infrastructure & Cyber Governance)
- **Developed for:** Smart India Hackathon (SIH)
