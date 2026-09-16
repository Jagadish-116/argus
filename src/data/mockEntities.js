// src/data/mockEntities.js
import { EntityTypes, SeverityLevels, NegativeSpaceTypes, GamingFlags } from '../types';

export const mockEntities = [
  {
    id: 'entity-alpha',
    name: 'Apex Global Financial Services',
    shortName: 'Apex Bank',
    sector: EntityTypes.BANKING,
    scale: 'Tier-1 Large Financial Entity (42,000 Seats)',
    socModel: '24/7 Managed Tier-1 & Tier-2 SOC (28 Analysts)',
    dataAssurance: {
      completeness: 94.2,
      provenanceVerified: true,
      hashIntegrity: 'SHA256:d8a2...3f1c [VERIFIED]',
      sourceDiscrepancy: 'SIEM logged 14,200 alerts; 13,380 ingested (5.7% unlinked telemetry)',
      overallEvidenceQuality: 48,
      status: 'AUDITABLE_WITH_CAVEATS'
    },
    traditionalMetrics: {
      mttr: '4.2 mins',
      mttrSeconds: 252,
      closureRate: '97.8%',
      slaAdherence: '98.9%',
      alertsVolume: '14,210 / month',
      statusGrade: 'A+ (Superficial High Performer)'
    },
    argusMetrics: {
      decisionDebt: 82, // High risk
      decisionDebtTrend: '+14% vs last cycle',
      negativeSpaceFindings: 19,
      templateRepetition: '34.8%',
      evidenceVacuumRate: '41.2%',
      averageAttackerDwellWindow: '18.4 hours before true escalation',
      statusGrade: 'CRITICAL_RISK (Gaming & Premature Closures)',
      archetype: 'Elevated Rapid-Closure Pattern'
    },
    policySummary: {
      internalSOP: 'Tier-1 high value assets require L2 escalation if PowerShell execution or credential dump triggers fire.',
      supervisoryBaseline: 'RBI CS-Framework & NCIIPC Baseline: Immediate automated or manual host isolation within 15 min for LSASS / Kerberoast triggers; mandatory forensic memory snapshot.'
    },
    cases: [
      {
        id: 'CASE-ALPHA-101',
        title: 'Mimikatz In-Memory Dump on Core SWIFT Gateway',
        timestamp: '2026-09-11T14:23:10Z',
        severity: SeverityLevels.CRITICAL,
        asset: 'SWIFT-PROD-GW02 (Tier-1 Core Banking)',
        assetCriticality: 'MAXIMUM_CRITICAL',
        assignedAnalyst: 'Analyst_R_K (Tier 1)',
        durationMinutes: 3.4,
        status: 'CLOSED_FALSE_POSITIVE',
        decisionDebtImpact: 34,
        evidenceQualityScore: 32,
        negativeSpaceFlags: [
          {
            type: NegativeSpaceTypes.MISSING_CONTAINMENT,
            severity: 'CRITICAL',
            description: 'SWIFT-PROD-GW02 was never isolated from VLAN 40 despite confirmed LSASS memory handle access.',
            expectedBy: 'Supervisory Regulatory Baseline §4.2'
          },
          {
            type: NegativeSpaceTypes.PREMATURE_CLOSURE,
            severity: 'HIGH',
            description: 'Case closed in 3m 24s. High-severity process injection investigated without checking child processes.',
            expectedBy: 'Internal SOP §12.B'
          },
          {
            type: NegativeSpaceTypes.MISSING_ESCALATION,
            severity: 'CRITICAL',
            description: 'Critical alert on Tier-1 asset resolved by L1 junior without required L2 supervisor sign-off.',
            expectedBy: 'Internal SOP §14.1 & NCIIPC Mandate'
          }
        ],
        gamingSignals: [
          {
            flag: GamingFlags.VELOCITY_ARTIFICIALITY,
            detail: 'Closure speed (204s) is 88% faster than peer average (1,740s) for LSASS injection alerts.'
          }
        ],
        linkStrength: 88,
        linkedCampaign: 'CAMPAIGN-GHOST-FIN-01',
        notes: [
          {
            time: '2026-09-11T14:24:00Z',
            analyst: 'Analyst_R_K',
            content: 'Alert received from CrowdStrike. Checked hostname. Regular backup script scheduled. False positive.'
          },
          {
            time: '2026-09-11T14:26:34Z',
            analyst: 'Analyst_R_K',
            content: 'Ticket marked resolved. Disposition: Routine Administration.'
          }
        ],
        missingActions: [
          'Host Network Isolation (EDR Quarantine)',
          'Privileged Account (svc_swift_backup) Credential Invalidation',
          'Memory Dump Capture to Central Evidence Vault',
          'L2 Security Operations Lead Escalation'
        ],
        observedActions: [
          'Alert Triaged in Dashboard (14:23)',
          'Hostname pinged in active asset registry (14:24)',
          'Ticket marked Closed (14:26)'
        ],
        graphNodes: [
          { id: 'n1', label: 'Alert: LSASS Dump', type: 'alert', severity: 'CRITICAL', time: '14:23:10', detail: 'Process: powershell.exe reading lsass.exe' },
          { id: 'n2', label: 'Triage: Analyst_R_K', type: 'analyst_action', time: '14:24:00', detail: 'Viewed alert summary on dashboard' },
          { id: 'n3', label: 'Negative Space: Quarantine', type: 'missing_action', severity: 'CRITICAL', detail: 'EXPECTED: Host Quarantine (OMITTED)' },
          { id: 'n4', label: 'Negative Space: L2 Escalation', type: 'missing_action', severity: 'CRITICAL', detail: 'EXPECTED: Escalation to Tier 2 Lead (OMITTED)' },
          { id: 'n5', label: 'Closed as False Positive', type: 'disposition', severity: 'HIGH', time: '14:26:34', detail: 'Closed in 3m 24s with zero logs attached' }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Trigger' },
          { from: 'n2', to: 'n3', label: 'Omitted Branch', style: 'dashed_red' },
          { from: 'n2', to: 'n4', label: 'Omitted Branch', style: 'dashed_red' },
          { from: 'n2', to: 'n5', label: 'Observed Path', style: 'solid_crimson' }
        ]
      },
      {
        id: 'CASE-ALPHA-102',
        title: 'Lateral Kerberoasting Attack on Domain Controller Backup',
        timestamp: '2026-09-11T15:10:04Z',
        severity: SeverityLevels.HIGH,
        asset: 'DC-BACKUP-01',
        assetCriticality: 'HIGH',
        assignedAnalyst: 'Analyst_M_P (Tier 1)',
        durationMinutes: 4.8,
        status: 'CLOSED_SUPPRESSED',
        decisionDebtImpact: 26,
        evidenceQualityScore: 38,
        negativeSpaceFlags: [
          {
            type: NegativeSpaceTypes.SUPPRESSION_ANOMALY,
            severity: 'HIGH',
            description: 'TGS ticket storm suppressed as "Known Scheduled Vulnerability Scan" without matching IP to approved scanner whitelist.',
            expectedBy: 'Internal SOP §09.D'
          }
        ],
        gamingSignals: [],
        linkStrength: 79,
        linkedCampaign: 'CAMPAIGN-GHOST-FIN-01',
        notes: [
          {
            time: '2026-09-11T15:12:00Z',
            analyst: 'Analyst_M_P',
            content: 'Multiple SPN requests observed. Assumed Qualys scan. Suppressed for 24h.'
          }
        ],
        missingActions: [
          'Scanner Whitelist Source IP Cross-Check',
          'SPN Target Account Privilege Verification',
          'Kerberos Event 4769 Correlation'
        ],
        observedActions: [
          'Alert acknowledged',
          'Alert Rule Suppressed for 24 hours'
        ],
        graphNodes: [
          { id: 'n1', label: 'Alert: TGS Ticket Burst', type: 'alert', severity: 'HIGH', time: '15:10:04', detail: 'Event 4769 RC4 ticket requested' },
          { id: 'n2', label: 'Negative Space: IP Cross-Check', type: 'missing_action', severity: 'HIGH', detail: 'Scanner verification not performed' },
          { id: 'n3', label: 'Rule Suppressed for 24h', type: 'disposition', severity: 'HIGH', time: '15:14:52', detail: 'Silenced future alerts during active attack' }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Omitted Verification', style: 'dashed_red' },
          { from: 'n1', to: 'n3', label: 'Premature Suppression', style: 'solid_crimson' }
        ]
      },
      {
        id: 'CASE-ALPHA-103',
        title: 'Mass Data Staging via BITS Admin to External IP',
        timestamp: '2026-09-11T18:45:20Z',
        severity: SeverityLevels.CRITICAL,
        asset: 'FIN-DB-PRIMARY',
        assetCriticality: 'MAXIMUM_CRITICAL',
        assignedAnalyst: 'Analyst_R_K (Tier 1)',
        durationMinutes: 6.1,
        status: 'ESCALATED_LATE',
        decisionDebtImpact: 22,
        evidenceQualityScore: 54,
        negativeSpaceFlags: [
          {
            type: NegativeSpaceTypes.MISSING_CONTAINMENT,
            severity: 'CRITICAL',
            description: '4.2 GB staged into ZIP archive and outbound egress commenced 3.2 hours before SOC escalation occurred.',
            expectedBy: 'Supervisory Baseline §6.1'
          }
        ],
        gamingSignals: [],
        linkStrength: 94,
        linkedCampaign: 'CAMPAIGN-GHOST-FIN-01',
        notes: [
          {
            time: '2026-09-11T18:48:00Z',
            analyst: 'Analyst_R_K',
            content: 'High outbound traffic detected. Escalating to Tier 2 after noticing previous cases.'
          }
        ],
        missingActions: [
          'Proactive Outbound Egress Firewall Block',
          'Database Session Termination'
        ],
        observedActions: [
          'Alert observed after 3 hours',
          'Late escalation to Tier 2 Lead'
        ],
        graphNodes: [
          { id: 'n1', label: 'Alert: 4.2GB Exfil Traffic', type: 'alert', severity: 'CRITICAL', time: '18:45:20', detail: 'BITSAdmin outbound transfer' },
          { id: 'n2', label: 'Late Escalation to L2', type: 'disposition', severity: 'HIGH', time: '18:51:26', detail: 'Escalated after data already left boundary' }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Delayed Response (3.2 hr exposure)', style: 'solid_crimson' }
        ]
      }
    ]
  },
  {
    id: 'entity-beta',
    name: 'National Power Grid & SCADA Operations',
    shortName: 'National Grid Infra',
    sector: EntityTypes.ENERGY,
    scale: 'Critical Infrastructure Operator (14 Power Substations, SCADA Tier 0)',
    socModel: 'Specialized Hybrid OT/IT SOC (14 Senior ICS Analysts)',
    dataAssurance: {
      completeness: 98.6,
      provenanceVerified: true,
      hashIntegrity: 'SHA256:88e1...bb20 [VERIFIED]',
      sourceDiscrepancy: 'Cross-validated with historian logs and firewall mirrors; 0.2% variance',
      overallEvidenceQuality: 92,
      status: 'HIGH_ASSURANCE'
    },
    traditionalMetrics: {
      mttr: '28.4 mins',
      mttrSeconds: 1704,
      closureRate: '82.4%',
      slaAdherence: '85.1%',
      alertsVolume: '3,840 / month',
      statusGrade: 'C+ (Appears Slow & Sluggish on standard KPI)'
    },
    argusMetrics: {
      decisionDebt: 21, // Healthy/Low risk
      decisionDebtTrend: '-8% vs last cycle',
      negativeSpaceFindings: 2,
      templateRepetition: '6.4%',
      evidenceVacuumRate: '3.1%',
      averageAttackerDwellWindow: '14.2 minutes',
      statusGrade: 'OPERATIONALLY_RESILIENT (Thorough & Deep Defense)',
      archetype: 'Evidence-Dense Investigative Model'
    },
    policySummary: {
      internalSOP: 'Any anomalous connection traversing IT/OT DMZ requires physical isolation, packet capture, and dual-analyst signoff.',
      supervisoryBaseline: 'NCIIPC Critical Information Infrastructure (CII) Protection Mandate: Immediate OT network segmentation and mandatory raw evidence retention.'
    },
    cases: [
      {
        id: 'CASE-BETA-201',
        title: 'Unauthorized Modbus Function Code Write on Substation RTU',
        timestamp: '2026-09-12T08:15:00Z',
        severity: SeverityLevels.CRITICAL,
        asset: 'SUBSTATION-04-RTU-PRIMARY (SCADA Tier 0)',
        assetCriticality: 'MAXIMUM_CRITICAL',
        assignedAnalyst: 'Lead_ICS_V_Sharma',
        durationMinutes: 31.2,
        status: 'CONTAINED_AND_QUARANTINED',
        decisionDebtImpact: 4,
        evidenceQualityScore: 94,
        negativeSpaceFlags: [],
        gamingSignals: [],
        linkStrength: 96,
        linkedCampaign: 'CAMPAIGN-SCADA-PROBE-04',
        notes: [
          {
            time: '2026-09-12T08:19:00Z',
            analyst: 'Lead_ICS_V_Sharma',
            content: 'Modbus FC 05 (Write Single Coil) detected from non-whitelisted IP 10.14.88.19. Engaging DMZ firewall kill-switch.'
          },
          {
            time: '2026-09-12T08:24:30Z',
            analyst: 'Lead_ICS_V_Sharma',
            content: 'Physical segmentation confirmed. Rolling PCAP buffer extracted (380MB). Escalated to Chief Operations Officer and CERT-In designated POC.'
          },
          {
            time: '2026-09-12T08:46:12Z',
            analyst: 'Deputy_Lead_A_Roy',
            content: 'Secondary review completed. Packet replay shows spoofed master address. Threat neutralized before coil energization.'
          }
        ],
        missingActions: [],
        observedActions: [
          'Alert Triaged within 4 mins',
          'DMZ Firewall Kill-Switch Executed (08:19)',
          '380MB Network PCAP Extracted & Hashed',
          'Dual-Analyst Review & Regulatory Notification Dispatched'
        ],
        graphNodes: [
          { id: 'n1', label: 'Alert: Modbus Write', type: 'alert', severity: 'CRITICAL', time: '08:15:00', detail: 'FC 05 to coil 0x018C' },
          { id: 'n2', label: 'Triage: Lead_ICS_V_Sharma', type: 'analyst_action', time: '08:19:00', detail: 'Immediate IP check & kill-switch' },
          { id: 'n3', label: 'Observed: Host Isolation', type: 'containment', severity: 'EMERALD', time: '08:21:00', detail: 'DMZ firewall drop confirmed' },
          { id: 'n4', label: 'Observed: Forensic PCAP', type: 'evidence', severity: 'EMERALD', time: '08:24:30', detail: '380MB pcap hashed & preserved' },
          { id: 'n5', label: 'Resolved: Zero Breach', type: 'disposition', severity: 'EMERALD', time: '08:46:12', detail: 'Dual sign-off. Resilient operational execution' }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Immediate Triage' },
          { from: 'n2', to: 'n3', label: 'Executed Containment', style: 'solid_emerald' },
          { from: 'n3', to: 'n4', label: 'Evidence Collection', style: 'solid_emerald' },
          { from: 'n4', to: 'n5', label: 'Supervised Sign-off', style: 'solid_emerald' }
        ]
      },
      {
        id: 'CASE-BETA-202',
        title: 'Anomalous SSH Bastion Tunnel to Substation Engineering Station',
        timestamp: '2026-09-12T11:04:18Z',
        severity: SeverityLevels.HIGH,
        asset: 'ENG-WORKSTATION-SUB02',
        assetCriticality: 'HIGH',
        assignedAnalyst: 'Analyst_K_Nair',
        durationMinutes: 24.5,
        status: 'CONTAINED_CREDENTIALS_REVOKED',
        decisionDebtImpact: 6,
        evidenceQualityScore: 89,
        negativeSpaceFlags: [],
        gamingSignals: [],
        linkStrength: 91,
        linkedCampaign: 'CAMPAIGN-SCADA-PROBE-04',
        notes: [
          {
            time: '2026-09-12T11:08:00Z',
            analyst: 'Analyst_K_Nair',
            content: 'SSH reverse tunnel detected on port 4443. Engineer contacted via secure landline to verify work order.'
          },
          {
            time: '2026-09-12T11:15:00Z',
            analyst: 'Analyst_K_Nair',
            content: 'Contractor confirms no remote work scheduled. Account suspended. Bastion session killed.'
          }
        ],
        missingActions: [],
        observedActions: [
          'Out-of-band identity verification performed',
          'Contractor credentials invalidated in Active Directory',
          'Bastion session forcibly terminated'
        ],
        graphNodes: [
          { id: 'n1', label: 'Alert: Reverse SSH Tunnel', type: 'alert', severity: 'HIGH', time: '11:04:18', detail: 'Outbound connect to external VPS' },
          { id: 'n2', label: 'Out-of-Band Verification', type: 'analyst_action', time: '11:08:00', detail: 'Engineer confirmed spoofed identity' },
          { id: 'n3', label: 'Credential Revocation', type: 'containment', severity: 'EMERALD', time: '11:15:00', detail: 'Kerberos tickets purged' }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Verification' },
          { from: 'n2', to: 'n3', label: 'Immediate Action', style: 'solid_emerald' }
        ]
      }
    ]
  },
  {
    id: 'entity-gamma',
    name: 'Metro Health Care Consortium',
    shortName: 'Metro Health Consort',
    sector: EntityTypes.HEALTHCARE,
    scale: 'Regional Hospital Network (12 Hospitals, 18,000 Medical Devices)',
    socModel: 'Outsourced MSSP Provider (Tier-1 Checklist Driven)',
    dataAssurance: {
      completeness: 99.1,
      provenanceVerified: true,
      hashIntegrity: 'SHA256:44b9...ee11 [VERIFIED]',
      sourceDiscrepancy: 'All tickets match SIEM counts precisely',
      overallEvidenceQuality: 62,
      status: 'HIGH_COMPLETENESS_LOW_DEPTH'
    },
    traditionalMetrics: {
      mttr: '12.1 mins',
      mttrSeconds: 726,
      closureRate: '99.4%',
      slaAdherence: '99.7%',
      alertsVolume: '8,920 / month',
      statusGrade: 'A+ (Apparent 100% Procedural Perfection)'
    },
    argusMetrics: {
      decisionDebt: 68, // Elevated risk
      decisionDebtTrend: '+21% vs last cycle',
      negativeSpaceFindings: 11,
      templateRepetition: '89.4%',
      evidenceVacuumRate: '78.2%',
      averageAttackerDwellWindow: '9.8 hours',
      statusGrade: 'ELEVATED_RISK (Robotic Template Compliance)',
      archetype: 'Template-Driven Compliance Mirage'
    },
    policySummary: {
      internalSOP: 'Every ticket must contain mandatory triage checklist fields: [Asset Checked], [IOC Searched], [Disposition Justified].',
      supervisoryBaseline: 'DPDP & Health Ministry Healthcare Security Standard: Clinical telemetry and patient record servers require behavioral correlation.'
    },
    cases: [
      {
        id: 'CASE-GAMMA-301',
        title: 'Suspicious PowerShell Execution on Oncology Ward PACS Server',
        timestamp: '2026-09-10T02:14:22Z',
        severity: SeverityLevels.HIGH,
        asset: 'ONCOLOGY-PACS-01 (Diagnostic Imaging Storage)',
        assetCriticality: 'HIGH',
        assignedAnalyst: 'Contractor_Analyst_07',
        durationMinutes: 12.0,
        status: 'CLOSED_STANDARD_COMPLIANT',
        decisionDebtImpact: 28,
        evidenceQualityScore: 28,
        negativeSpaceFlags: [
          {
            type: NegativeSpaceTypes.EVIDENCE_VACUUM,
            severity: 'HIGH',
            description: 'Checklist completed with verbatim canned text matching 214 previous closures.',
            expectedBy: 'Supervisory Baseline §3.4'
          },
          {
            type: NegativeSpaceTypes.MISSING_CONTAINMENT,
            severity: 'HIGH',
            description: 'PACS Server web application was not isolated; ransomware precursor DLL remained loaded in memory.',
            expectedBy: 'Healthcare Security Guideline'
          }
        ],
        gamingSignals: [
          {
            flag: GamingFlags.TEMPLATE_REPETITION,
            detail: 'Investigation note is 94.7% identical to 214 other closed cases this week. Zero custom indicators referenced.'
          },
          {
            flag: GamingFlags.VELOCITY_ARTIFICIALITY,
            detail: 'Ticket resolution duration is exactly 12m 00s (synthetic timer alignment).'
          }
        ],
        linkStrength: 82,
        linkedCampaign: 'CAMPAIGN-RANSOM-PREP-GAMMA',
        notes: [
          {
            time: '2026-09-10T02:15:00Z',
            analyst: 'Contractor_Analyst_07',
            content: 'STANDARD INVESTIGATION CHECKLIST: [Asset Verified: Yes] [Logs Inspected: Yes] [IOC Match: None] [Action: No malicious activity observed. Closed as benign activity.]'
          },
          {
            time: '2026-09-10T02:26:22Z',
            analyst: 'Contractor_Analyst_07',
            content: 'Ticket resolved per standard procedure.'
          }
        ],
        missingActions: [
          'PACS Web Application Child Process Tree Analysis',
          'Memory Scan for Injected DLLs',
          'DICOM Protocol Anomaly Check'
        ],
        observedActions: [
          'Canned checklist copy-pasted into ticket',
          'Ticket marked Closed exactly at 12m mark'
        ],
        graphNodes: [
          { id: 'n1', label: 'Alert: WebShell Injection', type: 'alert', severity: 'HIGH', time: '02:14:22', detail: 'Encoded PowerShell via Tomcat' },
          { id: 'n2', label: 'Template Checklist Inserted', type: 'analyst_action', time: '02:15:00', detail: 'Verbatim generic response (89% match)' },
          { id: 'n3', label: 'Negative Space: Memory Scan', type: 'missing_action', severity: 'HIGH', detail: 'OMITTED: No child process inspection' },
          { id: 'n4', label: 'Closed at 12:00 mark', type: 'disposition', severity: 'AMBER', time: '02:26:22', detail: 'Procedural compliance without substance' }
        ],
        graphEdges: [
          { from: 'n1', to: 'n2', label: 'Trigger' },
          { from: 'n2', to: 'n3', label: 'Omitted Forensics', style: 'dashed_red' },
          { from: 'n2', to: 'n4', label: 'Robotic Compliance', style: 'solid_amber' }
        ]
      }
    ]
  }
];
