// src/engine/negativeSpaceEngine.js
import { NegativeSpaceTypes } from '../types';

/**
 * Evaluates negative space (what should have happened according to policy/baseline but didn't)
 */
export function analyzeCaseNegativeSpace(caseItem, entityPolicy) {
  const findings = [];

  // Check 1: Missing Containment
  const hasContainment = caseItem.observedActions.some(action => 
    /contain|isolate|quarantine|block|revoke|kill/i.test(action)
  );

  if (!hasContainment && (caseItem.severity === 'CRITICAL' || caseItem.assetCriticality === 'MAXIMUM_CRITICAL')) {
    findings.push({
      type: NegativeSpaceTypes.MISSING_CONTAINMENT,
      severity: 'CRITICAL',
      title: 'Omitted Threat Containment',
      detail: `Asset "${caseItem.asset}" sustained a ${caseItem.severity} alert without host isolation or credential revocation.`,
      regulatoryGrounding: 'CERT-In / NCIIPC Incident Response Guidelines: Mandatory containment within 15 mins for tier-1 alerts.'
    });
  }

  // Check 2: Premature Closure
  if (caseItem.durationMinutes < 5 && (caseItem.severity === 'CRITICAL' || caseItem.severity === 'HIGH')) {
    findings.push({
      type: NegativeSpaceTypes.PREMATURE_CLOSURE,
      severity: 'HIGH',
      title: 'Premature Case Closure',
      detail: `Case closed in ${caseItem.durationMinutes} minutes. Average forensic verification duration for this alert class is 28+ minutes.`,
      regulatoryGrounding: 'Internal SOP Section 12.B: Deep process tree inspection required before closure.'
    });
  }

  // Check 3: Missing Escalation
  const hasEscalation = caseItem.observedActions.some(action => /escalat|lead|supervisor|tier\s*2/i.test(action));
  if (!hasEscalation && caseItem.severity === 'CRITICAL') {
    findings.push({
      type: NegativeSpaceTypes.MISSING_ESCALATION,
      severity: 'CRITICAL',
      title: 'Omitted Supervisory Escalation',
      detail: 'Critical alert resolved unilaterally by Tier-1 analyst without secondary review or shift supervisor verification.',
      regulatoryGrounding: 'Four-Eyes Principle: Critical asset triage mandates dual-party authorization.'
    });
  }

  // Check 4: Evidence Vacuum
  if (caseItem.evidenceQualityScore < 50) {
    findings.push({
      type: NegativeSpaceTypes.EVIDENCE_VACUUM,
      severity: 'MEDIUM',
      title: 'Evidence Vacuum / Insufficient Substantiation',
      detail: `Evidence Quality Score is only ${caseItem.evidenceQualityScore}/100. Notes lack raw telemetry, PCAP hashes, or execution arguments.`,
      regulatoryGrounding: 'Evidence Integrity Standard: Dispositions must reference verifiable telemetry logs.'
    });
  }

  return findings;
}
