# ARGUS — SOC Behavioural Assurance Engine (SIH26157)

> **Tagline:** Evidence-based supervisory assurance for SOC operations.  
> **Target Audience:** Regulators (e.g., CERT-In, NCIIPC), Internal Cyber Audit Teams, and SOC Supervisors.  
> **Environment:** 100% Offline / Air-Gapped Compliant.

---

## 1. Executive Summary & Problem Definition

### The Vanity Metric Dilemma
In modern Security Operations Centers (SOCs) monitoring Critical Sector Entities (CSEs)—such as power grids, nuclear plants, transportation networks, and financial institutions—performance dashboards almost universally highlight self-reported operational vanity metrics:
- **Reported Closure Rate:** Often reported at 95%–99%.
- **Reported MTTR (Mean Time to Resolve):** Often reported at 3–5 minutes.

While these numbers present an image of extreme efficiency, **speed does not equal security**. When operational pressure prioritizes SLA compliance over genuine threat containment, severe operational distortions emerge:
1. **Procedural Rubber-Stamping:** Serious alerts are closed rapidly with generic template notes (e.g., *"reviewed alert - false positive risk low"*) without substantive diagnostics.
2. **Missing Supervisory Escalation:** High and Critical severity alerts are closed at the Tier-1 level without notifying supervisors or triggering incident response protocols.
3. **Repeated Unresolved Incidents:** Underlying root causes are never remediated, causing the same asset to trigger recurring alarms.
4. **Telemetry Voids (Monitoring Blind Spots):** Critical assets go silent or unmonitored; traditional dashboards interpret zero alerts as "safe," masking catastrophic visibility failures.

### The ARGUS Solution
ARGUS is an **evidence-based supervisory assurance engine**. It does not seek to replace the SOC SIEM/SOAR or declare an organization universally "secure" or "insecure." Instead, it performs **independent, retrospective behavioral audits** on raw historical SOC operational evidence (alerts, case logs, analyst notes, and asset inventories) to answer six critical supervisory questions.

---

## 2. System Architecture

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │                  ARGUS Single-Process                  │
                                  │                     (run_demo.py)                      │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                   ┌──────────────────────────┴──────────────────────────┐
                                   ▼                                                     ▼
                 ┌───────────────────────────────────┐                 ┌───────────────────────────────────┐
                 │       FastAPI Backend (:8000)     │                 │   Single-Page Web UI (Offline)    │
                 │  - app.py                         │◄────────────────┤  - index.html                     │
                 │  - engine.py (ArgusEngine)        │    REST API     │  - app.js (React 18 + Babel)      │
                 │  - models.py (Pydantic schemas)   │                 │  - vendor/ (Tailwind, React, etc.)│
                 └─────────────────┬─────────────────┘                 └─────────────────┬─────────────────┘
                                   │                                                     │
                   ┌───────────────┴───────────────┐                                     │
                   ▼                               ▼                                     │
    ┌─────────────────────────────┐ ┌─────────────────────────────┐                      │
    │     Synthetic Data Layer    │ │     Analytical Engines      │                      │
    │ - data_generator.py         │ │ - execution_gaps.py (EG)    │                      │
    │ - data_loader.py            │ │ - negative_space.py (NS)    │                      │
    │ - data/*.json               │ │ - correlation.py (IR)       │                      │
    │   (Alerts, Cases, Assets,   │ │ - indicators.py             │                      │
    │    Entities)                │ │ - prioritisation.py         │                      │
    └─────────────────────────────┘ └─────────────────────────────┘                      │
                                                                                         ▼
                                                      ┌──────────────────────────────────────────────────┐
                                                      │              Six Distinct Capabilities           │
                                                      │  1. Execution Gaps (#execution-gaps)             │
                                                      │  2. Negative Space (#negative-space)             │
                                                      │  3. Incident Reconstruction                      │
                                                      │     (#incident-reconstruction)                   │
                                                      │  4. Expected vs Observed (#expected-vs-observed) │
                                                      │  5. Peer Comparison (#peer-comparison)           │
                                                      │  6. Evidence Traceability                        │
                                                      │     (#evidence-traceability)                     │
                                                      └──────────────────────────────────────────────────┘
```

### Component Breakdown

| Layer | Files | Description |
| :--- | :--- | :--- |
| **Launcher** | `run_demo.py` | Air-gap verification, synthetic data check, and single Uvicorn server launcher. |
| **Backend API** | `backend/app.py` | FastAPI REST services exposing overview, entity details, finding drill-downs, and candidate incidents. |
| **Core Engine** | `backend/engine.py` | Aggregates and pre-computes analytical indicators across all entities and loads findings in-memory. |
| **Data Models** | `backend/models.py` | Strongly typed Pydantic models for alerts, cases, assets, findings, and supervisory indicators. |
| **Analytics Subsystem** | `backend/analytics/` | Four modular analytical engines: `execution_gaps.py`, `negative_space.py`, `correlation.py`, `indicators.py`, and `prioritisation.py`. |
| **Data Generation** | `backend/data_generator.py` | Generates realistic CSE operational scenarios (Alpha: vanity gaming, Beta: well-handled, Gamma: nuclear telemetry gap). |
| **Frontend UI** | `frontend/` | 100% offline single-page application served directly from FastAPI using local vendor assets. |

---

## 3. The Six Supervisory Capabilities

ARGUS organizes its supervisory findings across six clearly delineated capabilities:

### 1. Execution Gaps (`#execution-gaps`)
*“What expected SOC actions may not have happened?”*
- **EG-01 (Un-escalated High/Critical Alert):** Serious alerts closed without recorded supervisory escalation.
- **EG-02 (Possible Premature Closure):** Multi-indicator heuristic requiring: (1) High/Critical severity, (2) closure in < 5 minutes, AND (3) secondary evidence weakness (notes < 45 chars, generic boilerplate phrasing, or missing escalation).
- **EG-03 (Investigation Evidence Quality):** Jaccard text similarity (>0.85) clustering identifying analysts repeatedly pasting identical template closure notes.
- **EG-04 (Repeated Un-remediated Alerts):** Detects $\ge 4$ recurrences of the same alert category on a single asset within a 48-hour window.

### 2. Negative Space (`#negative-space`)
*“What expected evidence is missing?”*
- **NS-01 (Possible Monitoring Blind Spot):** Identifies critical infrastructure assets that recorded zero telemetry or alert entries during the entire evaluation window.
- **NS-02 (Expected Process Evidence Absent):** Identifies serious alerts where formal case files or mandatory supervisory escalation audits are completely absent from the log record.

### 3. Incident Reconstruction (`#incident-reconstruction`)
*“Which alerts may be related?”*
- Correlates discrete alerts across operational evidence using deterministic relationship factors:
  - Same Asset
  - Same User / Account Context
  - Temporal Proximity (clustered operational time window)
  - Severity Progression (e.g. Medium to Critical)
  - Related Alert Categories (e.g. Intrusion / Escalation to Exfiltration)
- Computes **Link Strength** (LOW, MEDIUM, HIGH) purely as an evidence-factor relationship density metric (explicitly NOT an AI confidence score, attack probability, or compromise declaration).
- Displays a chronological alert sequence timeline with timestamps, alert IDs, assets, accounts, categories, and supporting log details.
- Preserves IR-01 mandate: *“Candidate Incident — Potentially related alerts. Human verification required.”*

### 4. Expected vs Observed (`#expected-vs-observed`)
*“What should have happened vs what the evidence shows?”*
- Distinct 3-column comparative matrix strictly grounded in configured baselines and recorded evidence:
  - **EXPECTED:** Documented operational baseline policies (mandatory escalation on High/Critical alerts, substantive investigation duration & note depth, tailored root-cause notes, and recurrence prevention).
  - **OBSERVED:** What the SOC evidence actually recorded (`unescalated_critical_count`, median serious closure duration, rapid closures lacking notes, template clusters, recurring alert counts, and candidate incident dispositions).
  - **DIFFERENCE REQUIRING REVIEW:** Tangible, evidence-backed operational omissions warranting human supervisory inquiry.
- Does not claim an autonomous counterfactual replay engine; serves as objective supervisory decision support assembled from detector outputs.

### 5. Peer Comparison (`#peer-comparison`)
*“How does this entity’s operational behavior compare to peers?”*
- Contextual benchmarking matrix contrasting reported vanity KPIs (closure rate, MTTR) against behavioral realities (unescalated ratios, median serious closure times, template clusters, and telemetry voids).
- Preserves relative supervisory context without reductive composite rankings or universal security scores.

### 6. Evidence Traceability (`#evidence-traceability`)
*“Why did ARGUS produce this finding?”*
- End-to-end deterministic audit trail for legitimate analytical findings (EG-01..04, NS-01..02).
- Demonstrates the complete 4-step flow:  
  $$\text{FINDING} \longrightarrow \text{WHY ARGUS FLAGGED IT} \longrightarrow \text{SUPPORTING EVIDENCE} \longrightarrow \text{HUMAN VERIFICATION}$$
- Connects directly to the existing `EvidenceModal` via `/api/finding/{finding_id}` displaying full raw JSON log snippets and case audit trails.

---

## 4. Analytical Rule Matrix

| Rule Code | Title | Concern Level | Verification Question |
| :--- | :--- | :---: | :--- |
| **EG-01** | Un-escalated High/Critical Alert | HIGH / MED | Was formal escalation required under security policy? |
| **EG-02** | Possible Premature Closure | HIGH / MED | Did substantive diagnostic analysis occur prior to closure? |
| **EG-03** | Repetitive / Template Investigation Notes | HIGH / MED | Was tailored root-cause analysis performed rather than rubber-stamping? |
| **EG-04** | Repeated Un-remediated Alerts | HIGH / MED | Was root-cause remediation implemented or was the alert merely dismissed? |
| **NS-01** | Possible Monitoring Blind Spot | HIGH | Was the critical asset logging telemetry during this evaluation period? |
| **NS-02** | Expected Process Evidence Absent | HIGH / MED | Was the required investigation documented in external audit records? |
| **IR-01** | Candidate Incident Reconstruction | HIGH / MED | Do these connected events represent a coordinated operational incident? |

---

## 5. Getting Started & Offline Operation

ARGUS is designed to run 100% locally without an Internet connection.

### Prerequisites
- Python 3.8+
- Required Python packages: `fastapi`, `uvicorn`, `pydantic`

### Launching ARGUS
```bash
# From the project root directory
python run_demo.py
```

`run_demo.py` automatically performs:
1. **Vendor Asset Verification:** Verifies local minified copies of Tailwind CSS, React, ReactDOM, and Babel in `frontend/vendor/`.
2. **Synthetic Dataset Ingestion:** Ensures `backend/data/*.json` are generated and loaded.
3. **Service Initialization:** Launches Uvicorn at `http://127.0.0.1:8000`.

### Endpoints
- **Web Application UI:** `http://127.0.0.1:8000/`
- **Supervisory Overview API:** `http://127.0.0.1:8000/api/overview`
- **OpenAPI Documentation:** `http://127.0.0.1:8000/docs`

---

## 6. Verification & Test Suite

ARGUS includes automated unit and integration tests:

```bash
# Run core analytics detector tests (verifies EG-01..04, NS-01..02, IR-01 semantics)
python backend/test_engine.py

# Run API contract and routing tests
python backend/test_api.py

# Run dynamic evidence mutation tests
python backend/test_dynamic_change.py

# Run frontend asset serving tests
python backend/test_frontend_serve.py
```
