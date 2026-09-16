// src/data/counterfactualScenarios.js

export const counterfactualScenarios = [
  {
    caseId: 'CASE-ALPHA-101',
    title: 'Counterfactual Analysis: In-Memory Credential Theft on Core Gateway',
    incidentOverview: 'Critical LSASS dump alert on SWIFT payment infrastructure. Real-world adversary leveraged uncontained host for lateral traversal.',
    branches: {
      observed: {
        title: 'Observed SOC Execution (What Actually Happened)',
        badge: 'ACTUAL_SOC_PATH',
        badgeColor: 'crimson',
        steps: [
          {
            time: 'T + 00m',
            action: 'Alert Fires in SIEM',
            details: 'CrowdStrike Falcon detected powershell reading memory of lsass.exe.',
            status: 'normal'
          },
          {
            time: 'T + 01m',
            action: 'Analyst Initial Triage',
            details: 'Analyst checks hostname SWIFT-PROD-GW02 in asset list. Sees scheduled backup tag.',
            status: 'normal'
          },
          {
            time: 'T + 03m',
            action: 'Premature Ticket Closure',
            details: 'Analyst marks ticket "Closed - False Positive (Backup Activity)" without verifying parent process.',
            status: 'critical_deviation',
            gapType: 'PREMATURE_CLOSURE'
          },
          {
            time: 'T + 04m to T + 260m',
            action: 'Operational Negative Space Window',
            details: 'Adversary harvests admin tokens, executes Pass-The-Hash, and establishes command and control.',
            status: 'catastrophic_exposure',
            gapType: 'BREACH_EXPOSURE'
          }
        ],
        metrics: {
          containmentTime: 'NEVER CONTAINED',
          dwellTime: '260+ minutes',
          decisionDebtAccrued: '+34 pts',
          blastRadius: '4 Core Banking Servers'
        }
      },
      sopCompliant: {
        title: 'Organization SOP Path (Internal Policy Compliance)',
        badge: 'INTERNAL_SOP_PATH',
        badgeColor: 'amber',
        steps: [
          {
            time: 'T + 00m',
            action: 'Alert Fires in SIEM',
            details: 'Alert tagged Critical per internal asset tiering rules.',
            status: 'normal'
          },
          {
            time: 'T + 05m',
            action: 'Host Network Isolation',
            details: 'Analyst triggers EDR isolation within 15 minute SLA per SOP Section 12.B.',
            status: 'compliant'
          },
          {
            time: 'T + 12m',
            action: 'Mandatory L2 Lead Escalation',
            details: 'Ticket escalated to Tier-2 Shift Supervisor with raw PowerShell command line attached.',
            status: 'compliant'
          },
          {
            time: 'T + 25m',
            action: 'Supervised Remediation',
            details: 'Tier-2 confirms malicious payload, purges cached hashes, validates DC logs.',
            status: 'contained'
          }
        ],
        metrics: {
          containmentTime: '5 minutes',
          dwellTime: '25 minutes',
          decisionDebtAccrued: '0 pts',
          blastRadius: '1 Isolated Host'
        }
      },
      regulatoryBaseline: {
        title: 'Supervisory Regulatory Baseline (CERT-In / NCIIPC / NIST)',
        badge: 'REGULATORY_BASELINE',
        badgeColor: 'cyan',
        steps: [
          {
            time: 'T + 00m',
            action: 'Automated Playbook Trigger',
            details: 'SOAR playbook automatically isolates endpoint and generates volatile memory dump.',
            status: 'optimal'
          },
          {
            time: 'T + 02m',
            action: 'Credential Invalidation & Session Termination',
            details: 'Active Directory revokes Kerberos Ticket-Granting Service (TGS) tokens for all logged-in accounts on host.',
            status: 'optimal'
          },
          {
            time: 'T + 10m',
            action: 'Independent Forensic Verification & Audit Trail',
            details: 'Volatile RAM and forensic timeline cryptographically hashed and sent to immutable evidence store.',
            status: 'optimal'
          },
          {
            time: 'T + 15m',
            action: 'Regulatory Threat Notice Generated',
            details: 'Pre-formatted incident report queued for CERT-In/NCIIPC 6-hour reporting compliance.',
            status: 'optimal'
          }
        ],
        metrics: {
          containmentTime: 'Instant (Automated < 60s)',
          dwellTime: 'Under 2 minutes',
          decisionDebtAccrued: '0 pts (Gold Standard)',
          blastRadius: 'Zero Cross-Host Contamination'
        }
      }
    }
  }
];
