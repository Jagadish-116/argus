// frontend/src/types.js
/**
 * ARGUS Data Models & Core Schema Definitions
 */

export const EntityTypes = {
  BANKING: 'Banking & Financial Services',
  ENERGY: 'Critical Energy & Power Grid',
  HEALTHCARE: 'Healthcare & Critical Care Infrastructure',
  GOVERNMENT: 'Government & Defense Contractor'
};

export const SeverityLevels = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO'
};

export const NegativeSpaceTypes = {
  MISSING_CONTAINMENT: 'MISSING_CONTAINMENT',
  MISSING_ESCALATION: 'MISSING_ESCALATION',
  PREMATURE_CLOSURE: 'PREMATURE_CLOSURE',
  EVIDENCE_VACUUM: 'EVIDENCE_VACUUM',
  SUPPRESSION_ANOMALY: 'SUPPRESSION_ANOMALY',
  UNVERIFIED_DOWNGRADE: 'UNVERIFIED_DOWNGRADE'
};

export const GamingFlags = {
  TEMPLATE_REPETITION: 'TEMPLATE_REPETITION',
  VELOCITY_ARTIFICIALITY: 'VELOCITY_ARTIFICIALITY',
  CHERRY_PICKING: 'CHERRY_PICKING',
  MASS_DISMISSAL: 'MASS_DISMISSAL'
};
