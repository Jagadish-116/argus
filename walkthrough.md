# ARGUS Web Prototype Walkthrough (SIH PS 26157)

We have engineered and validated the complete, 100% functional web prototype for **ARGUS (Adversarial Resilience & Governance Understanding System)**.

---

## 🎥 Full Browser Tour Recording

Below is the automated browser session recording verifying all interactive components, cohort switches, replays, modals, and ingestion features:

![ARGUS Interactive Prototype Verification Tour](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/argus_tour_1789273966465.webp)

---

## 📸 Key Interfaces & Architectural Modules

### 1. Main Supervisory Dashboard & Incident Decision Graph (DAG)
The main dashboard contrasts traditional superficial metrics (MTTR, Closure Rate) with ARGUS's behavioral ground truth (Decision Debt, Negative Space Gaps, Attacker Dwell Window).

- **Left Column:** The **Supervisory Attention Budget Queue** filtering the top high-impact cases requiring human intervention.
- **Right Column:** The **Incident Decision Graph (DAG)** mapping alert triggers, analyst triage, and omitted negative space forks (rendered in dashed crimson).

![Main Supervisory Dashboard](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/main_dashboard_1789273976609.png)

---

### 2. Ghost Attack Replay Studio
A dual-track interactive timeline comparing actual adversarial progression against SOC triage awareness. It exposes the exact minute a premature closure created an unmonitored lateral traversal pathway for the adversary.

![Ghost Attack Replay Studio](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/ghost_attack_replay_1789274034423.png)

---

### 3. Counterfactual Decision Simulator (Side-by-Side Comparison)
Compares three operational realities side-by-side with an interactive **Divergence Point Highlighter**:
1. **Observed SOC Path:** Premature ticket closure in 3m 24s $\rightarrow$ 260m uncontained breach window $\rightarrow$ 4 core banking servers compromised.
2. **Internal SOP Path:** EDR network isolation in 5m $\rightarrow$ L2 escalation $\rightarrow$ contained within 25m to 1 host.
3. **Supervisory Baseline:** Automated SOAR isolation in <60s $\rightarrow$ credential revocation $\rightarrow$ zero lateral movement.

![Counterfactual Simulator Comparison](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/counterfactual_3columns_1789274126796.png)

---

### 4. Multi-Entity Cohort Benchmarks (The 3-Archetype Proof)
Demonstrates the fundamental flaw of traditional throughput metrics across three organizational sectors:
- **Apex Bank (Alpha):** Grade A+ on paper (4.2m MTTR), but **Decision Debt 82** due to premature closures on SWIFT payment gateways.
- **National Grid (Beta):** Grade C+ on paper (28.4m MTTR), but **Decision Debt 21** (high evidence density, resilient defense).
- **Metro Health (Gamma):** Grade A+ on paper (12m MTTR, 99.4% SLA), but **Decision Debt 68** with **89.4% robotic template repetition** detected.

![Multi-Entity Cohort Benchmarks](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/cohort_benchmarks_1789274136904.png)

---

### 5. Supervisory Audit Dossier Modal
Generates signed regulatory reports in Markdown syntax with instant one-click copy and download, complete with particle celebrations.

![Supervisory Audit Dossier Modal](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/audit_dossier_modal_1789274162186.png)

---

### 6. Pitch Guide & Judge Defense Bank
Contains the 1-minute elevator pitch, 3-cohort proof breakdown, and an interactive accordion defense bank addressing the critical judge questions (Faults 1 through 30).

![Pitch Guide & Judge Defense Bank Modal](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/pitch_guide_modal_1789274191511.png)

---

### 7. Telemetry Ingestion Adapter
Allows ingesting custom raw JSON logs (or loading pre-configured templates for FinTech or SCADA/Grid) to test schema normalization and live Decision Debt calculation in real time.

![Telemetry Ingestion Adapter Modal](file:///C:/Users/asus/.gemini/antigravity-ide/brain/ec91399f-7f6e-446d-a78c-119196f0fd5d/ingest_modal_1789274213730.png)

---

## 🚀 How to Run Locally

1. Open your terminal in the project directory:
   ```bash
   cd c:/Users/asus/OneDrive/Projects/ARGUS
   ```
2. Start the Vite server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.
