# Implementation Plan: ARGUS (Adversarial Resilience & Governance Understanding System)

ARGUS is a next-generation SOC supervisory and operational assurance platform for **SIH Problem Statement 26157**. Instead of measuring superficial throughput metrics (MTTR, alert closure counts) that can be easily gamed, ARGUS performs evidence-grounded behavioral reconstruction of SOC operations. It identifies operational "negative space" (critical actions that should have occurred according to SOP and supervisory baselines but were omitted), quantifies accumulated Decision Debt, reconstructs multi-stage incident decision graphs, and replays attacks against SOC response timelines.

---

## System Architecture

```
                                 [ SOC Operational Telemetry ]
                           (Alerts, Triage Logs, Case Notes, Actions)
                                            │
                                            ▼
                           ┌───────────────────────────────────┐
                           │   DATA ASSURANCE & INTEGRITY      │
                           │  - Completeness & Provenance      │
                           │  - Evidence Quality Score (0-100) │
                           └─────────────────┬─────────────────┘
                                             │
                                             ▼
                           ┌───────────────────────────────────┐
                           │     CANONICAL NORMALIZER          │
                           │  Maps disparate SIEM/SOAR/Ticketing│
                           │  schemas into unified ARGUS Schema│
                           └─────────────────┬─────────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │  DUAL EXPECTATION     │   │  BEHAVIORAL PATTERN   │   │  RELATIONSHIP GRAPH   │
   │  ENGINE               │   │  & GAMING ENGINE      │   │  & CLUSTERING ENGINE  │
   │ - Layer A: SOP Policy │   │ - Rapid Closure spikes│   │ - Cross-case linkage  │
   │ - Layer B: Supervisor │   │ - Template repetition │   │ - Entity & blast radius│
   │   Regulatory Baseline │   │ - Documentation depth │   │ - Attack chain assembly│
   └───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘
               └─────────────────────────────┼─────────────────────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │   NEGATIVE SPACE ENGINE   │
                               │  Detects omitted actions, │
                               │  skipped containment,     │
                               │  premature closures       │
                               └─────────────┬─────────────┘
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
   ┌───────────────────────┐                                   ┌───────────────────────┐
   │  DECISION DEBT &      │                                   │  INTERACTIVE REPLAY   │
   │  PRIORITIZATION       │                                   │  ENGINES              │
   │ - Multi-signal score  │                                   │ - Ghost Attack Replay │
   │ - Attention Budget Q  │                                   │ - Counterfactual View │
   │ - Top 5 Action Items  │                                   │ - Interactive Graph   │
   └───────────┬───────────┘                                   └───────────┬───────────┘
               └─────────────────────────────┬─────────────────────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ CONFIDENCE & LIMITATIONS  │
                               │ Exposes uncertainty, data │
                               │ coverage, & human review  │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                           ┌───────────────────────────────────┐
                           │    SUPERVISORY CONSOLE (UI)       │
                           │ - Multi-Entity Cohort Benchmarks  │
                           │ - Case Deep-Dive & Replay Studio  │
                           │ - Signed Audit Export & Feedback  │
                           └───────────────────────────────────┘
```

---

## User Review Required

> [!IMPORTANT]
> **Tech Stack Selection**: We propose using **Vite + React 18 + Tailwind CSS + Lucide Icons + Canvas/SVG Visualizers**. This ensures high performance, zero external cloud dependencies (100% offline runnable as required by air-gapped supervisory environments), and sub-second interactive animations for graphs, replays, and heatmaps.

> [!NOTE]
> **Pre-Packaged Case Cohorts for Instant Demonstration**:
> The prototype will come pre-loaded with three realistic, distinct organizational entities demonstrating the core behavioral paradigms:
> 1. **Entity Alpha (FinTech / High-Volume Banking)**: "KPI Green, Operationally Compromised" — 97% alert closure rate and 4.2m MTTR, but exhibits 73% premature closures on high-value assets and omitted containment actions.
> 2. **Entity Beta (Critical Power & Grid Utility)**: "KPI Amber, Operationally Resilient" — Slower MTTR (28.4m) and lower closure velocity, but deep evidentiary capture, 94% escalation compliance, and zero uncontained lateral movement.
> 3. **Entity Gamma (Public Sector Health Org)**: "The Compliance Mirage" — 99.4% procedural compliance on paper, but 88% template repetition detected (canned investigation notes gaming standard checklists).

---

## Open Questions

None at this stage. All requirements align with SIH PS 26157 and the 30-fault design hardening discussed.

---

## Proposed Changes

We will implement the full standalone application in `c:\Users\asus\OneDrive\Projects\ARGUS`.

### 1. Project Initialization & Tooling
- Initialize Vite React project with Tailwind CSS and Lucide React.
- Configure offline dark-mode cyber aesthetic with obsidian background (`#070a12`), electric cyan (`#00f0ff`), cyber amber (`#f59e0b`), critical crimson (`#ef4444`), and tactical emerald (`#10b981`).

### 2. Core Engine & Data Models (`src/types/` & `src/engine/`)
- `types.ts`: Formal TypeScript definitions for Entities, Alerts, Cases, Actions, Playbook Steps, Decision Nodes, Negative Space Flags, and Audit Findings.
- `mockData.ts`: Realistic datasets for Alpha, Beta, and Gamma entities with full alert timelines, raw JSON logs, analyst notes, and kill-chain progressions.
- `negativeSpaceEngine.ts`: Logic comparing Observed Action Sequence vs Expected SOP Baseline and Supervisory Baseline to isolate omitted actions.
- `decisionDebtEngine.ts`: Algorithmic evaluation of accumulated risk debt across 5 vectors (containment delay, evidence vacuum, premature closure, escalation omission, gaming index).
- `incidentLinker.ts`: Heuristic and graph clustering linking isolated alerts into unified attack campaigns with Link Strength scoring.

### 3. Interactive UI Modules (`src/components/`)
- **Header & Entity Switcher**: Displays system status (Air-gapped / Local / Offline), dataset assurance score, active cohort selector (Alpha, Beta, Gamma), and quick export triggers.
- **Supervisory Heatmap & Attention Budget Dashboard**:
  - Entity Comparison Matrix: Compares Traditional KPIs vs ARGUS Behavioral Debt Score.
  - Attention Budget Queue: Filters out noise and surfaces the Top 5 High-Impact Action Items requiring human intervention.
- **Incident Decision Graph (Interactive Canvas/SVG)**:
  - Visual node-link DAG tracing the alert trigger $\rightarrow$ analyst triage $\rightarrow$ investigative actions $\rightarrow$ missing negative space forks $\rightarrow$ resolution.
  - Clickable nodes with inspector drawer showing analyst notes, telemetry payloads, and evidence scores.
- **Ghost Attack Replay Studio**:
  - Interactive playback controller (Play, Pause, Step-Forward, Speed 1x/2x/5x).
  - Synchronized dual-timeline: Attacker TTP Progression (MITRE ATT&CK stages) vs SOC Operational Awareness (Acknowledged / Ignored / Delayed / Contained).
- **Counterfactual Replay Comparison**:
  - Side-by-side interactive diff: "Observed Response" vs "Policy-Compliant SOP" vs "Regulator Supervisory Baseline".
  - Shows where decision forks created breach exposure windows.
- **Confidence & Limitations Panel**:
  - Radical transparency widget displaying Data Completeness %, Provenance Rating, Heuristic Confidence, and Explicit Known Limitations (e.g. missing asset criticality on 2 cases).
- **Audit Report Generator & Export Modal**:
  - Instant generation and download of supervisory audit dossiers in Markdown, JSON, and formatted printable view.

### 4. Documentation & Verification Deliverables
- `README.md`: Comprehensive project overview, SIH PS 26157 alignment, architecture explanation, quick-start guide, and judge demo script.
- `walkthrough.md`: Step-by-step walkthrough covering every feature and screenshot/verification guide.

---

## Verification Plan

### Automated Build & Lint Verification
- Run `npm run build` to ensure 100% type-safety and bundle integrity.
- Run `npm test` or component sanity scripts.

### Manual Feature Verification
- Verify switching between Entity Alpha, Beta, and Gamma dynamically updates the entire supervisory dashboard, Decision Debt calculations, and attention budget queues.
- Verify Negative Space highlighting correctly flags uncontained critical alerts.
- Verify Ghost Attack Replay operates smoothly with pause/scrub/play controls.
- Verify Counterfactual Replay accurately renders side-by-side operational differences.
- Verify Audit Report export produces comprehensive, downloadable files.
- Launch browser preview to validate layout responsiveness and dark-mode aesthetic.
