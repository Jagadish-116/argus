// src/data/ghostScenarios.js

export const ghostScenarios = [
  {
    id: 'SCENARIO-FIN-BREACH-01',
    title: 'Operation Velvet Vault — Multi-Stage Financial Espionage',
    targetEntityId: 'entity-alpha',
    targetAssetName: 'SWIFT-PROD-GW02 & FIN-DB-PRIMARY',
    threatActor: 'APT-41 Derivative (Financially Motivated)',
    totalTimelineMinutes: 380,
    stages: [
      {
        stageIndex: 1,
        timeOffset: 'T + 00:00',
        timestamp: '14:02:15',
        mitreTactic: 'TA0001: Initial Access',
        mitreTechnique: 'T1566.001 Spearphishing Attachment',
        attackerAction: 'Executive Assistant opened spoofed vendor invoice PDF executing macro dropper',
        ioc: 'SHA256: 8f2c...e19a (invoice_payment_spec.pdf)',
        socAlphaState: {
          status: 'IGNORED',
          label: 'Silently Blocked at Mail Gateway; Zero Host Follow-up',
          durationSec: 0,
          color: 'crimson',
          alertTriggered: true,
          actionTaken: 'Mail gateway quarantined file. No endpoint investigation conducted to see if user opened downloaded payload.'
        },
        socBetaState: {
          status: 'DETECTED_AND_TRIAGED',
          label: 'Endpoint Isolated & Host Scanned',
          durationSec: 420,
          color: 'emerald',
          alertTriggered: true,
          actionTaken: 'Analyst immediately isolated machine, retrieved Outlook temp folder, verified macro execution attempted.'
        }
      },
      {
        stageIndex: 2,
        timeOffset: 'T + 00:21',
        timestamp: '14:23:10',
        mitreTactic: 'TA0006: Credential Access',
        mitreTechnique: 'T1003.001 LSASS Memory Dumping',
        attackerAction: 'Injected PowerShell script invoked MiniDumpWriteDump targeting lsass.exe to steal local admin hashes',
        ioc: 'powershell.exe -enc JABzACAAPQAgAE4AZQB3...',
        socAlphaState: {
          status: 'PREMATURELY_CLOSED',
          label: 'Closed as "Routine Backup Script" in 3m 24s',
          durationSec: 204,
          color: 'crimson',
          alertTriggered: true,
          actionTaken: 'Analyst R.K. assumed script was scheduled IT backup without inspecting parent process ID or memory dump target. ZERO containment executed.'
        },
        socBetaState: {
          status: 'CONTAINED',
          label: 'Host Disconnected within 6 minutes',
          durationSec: 360,
          color: 'emerald',
          alertTriggered: true,
          actionTaken: 'EDR kill-switch triggered. Memory snapshot taken for offline reverse engineering. Attack path completely blocked.'
        }
      },
      {
        stageIndex: 3,
        timeOffset: 'T + 01:08',
        timestamp: '15:10:04',
        mitreTactic: 'TA0008: Lateral Movement',
        mitreTechnique: 'T1558.003 Kerberoasting',
        attackerAction: 'Stolen hashes used to request Kerberos TGS tickets for SPNs associated with Domain Controller and SWIFT gateway',
        ioc: 'Event ID 4769: Ticket Options 0x40810000',
        socAlphaState: {
          status: 'SUPPRESSED',
          label: 'Suppressed as "Vulnerability Scan" for 24 Hours',
          durationSec: 288,
          color: 'crimson',
          alertTriggered: true,
          actionTaken: 'Analyst silenced future Kerberoasting alerts for 24h, creating a blind operational window for the adversary.'
        },
        socBetaState: {
          status: 'HALTED_PREVIOUSLY',
          label: 'Attack Previously Neutralized at Stage 2',
          durationSec: 0,
          color: 'slate',
          alertTriggered: false,
          actionTaken: 'Host was already air-gapped; adversary never attained network lateral traversal capability.'
        }
      },
      {
        stageIndex: 4,
        timeOffset: 'T + 02:40',
        timestamp: '16:42:19',
        mitreTactic: 'TA0005: Defense Evasion',
        mitreTechnique: 'T1070.001 Clear Windows Event Logs',
        attackerAction: 'Wevtutil.exe executed to wipe Security log channels on intermediate jump host',
        ioc: 'wevtutil.exe cl Security',
        socAlphaState: {
          status: 'UNNOTICED',
          label: 'Missed Entirely (No Alert Generated Due to Alert Fatigue)',
          durationSec: 0,
          color: 'crimson',
          alertTriggered: false,
          actionTaken: 'Alert rules for log clearing were disabled on staging jump hosts due to high volume of test cluster rebuilds.'
        },
        socBetaState: {
          status: 'HALTED_PREVIOUSLY',
          label: 'Attack Previously Neutralized at Stage 2',
          durationSec: 0,
          color: 'slate',
          alertTriggered: false,
          actionTaken: 'Adversary was unable to reach intermediate jump hosts.'
        }
      },
      {
        stageIndex: 5,
        timeOffset: 'T + 04:43',
        timestamp: '18:45:20',
        mitreTactic: 'TA0010: Exfiltration',
        mitreTechnique: 'T1197 BITS Jobs Data Transfer',
        attackerAction: '4.2 GB of SWIFT transaction ledger logs compressed into encrypted split archives and exfiltrated via BITSAdmin',
        ioc: 'bitsadmin.exe /transfer swift_sync ...',
        socAlphaState: {
          status: 'LATE_ESCALATION',
          label: 'Escalated 3.2 Hours After Data Egress Commenced',
          durationSec: 11520,
          color: 'amber',
          alertTriggered: true,
          actionTaken: 'Alert finally acknowledged after boundary firewall alert. Data had already left the corporate perimeter. Breach declared.'
        },
        socBetaState: {
          status: 'PREVENTED',
          label: 'Zero Data Loss (Contained at Perimeter & Host)',
          durationSec: 0,
          color: 'emerald',
          alertTriggered: false,
          actionTaken: 'Defense-in-depth protocols completely halted adversary kill chain.'
        }
      }
    ]
  }
];
