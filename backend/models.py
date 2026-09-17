from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SeverityEnum(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class AssetCriticalityEnum(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class ConcernLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Entity(BaseModel):
    entity_id: str
    name: str
    sector: str
    total_assets: int
    reported_kpi_closure_rate: float  # e.g. 0.98 for 98%
    reported_kpi_mttr_mins: float     # e.g. 3.8 mins


class Asset(BaseModel):
    asset_id: str
    entity_id: str
    asset_name: str
    criticality: AssetCriticalityEnum
    ip_address: str
    department: str


class Alert(BaseModel):
    alert_id: str
    entity_id: str
    asset_id: str
    user_id: Optional[str] = None
    timestamp: str  # ISO 8601 format
    severity: SeverityEnum
    category: str
    title: str
    raw_details: str


class Case(BaseModel):
    case_id: str
    alert_ids: List[str]
    entity_id: str
    analyst_id: str
    created_at: str  # ISO 8601 format
    closed_at: str   # ISO 8601 format
    resolution_status: str  # e.g. "Closed - Resolved", "Closed - False Positive"
    investigation_notes: str
    escalation_flag: bool
    escalation_timestamp: Optional[str] = None


class FindingEvidence(BaseModel):
    alert_ids: List[str] = []
    case_ids: List[str] = []
    asset_ids: List[str] = []
    raw_snippets: List[Dict[str, Any]] = []


class ExecutionGapFinding(BaseModel):
    finding_id: str
    entity_id: str
    rule_code: str  # EG-01, EG-02, EG-03, EG-04
    title: str
    concern_level: ConcernLevelEnum
    explanation: str
    evidence: FindingEvidence


class NegativeSpaceFinding(BaseModel):
    finding_id: str
    entity_id: str
    rule_code: str  # NS-01, NS-02
    title: str      # NS-01: "Possible monitoring blind spot — verification required", NS-02: "Expected process evidence absent — verification required"
    concern_level: ConcernLevelEnum
    asset_id: str
    asset_name: str
    explanation: str
    evidence: FindingEvidence


class CandidateIncidentFinding(BaseModel):
    finding_id: str
    entity_id: str
    rule_code: str = "IR-01"
    title: str = "Candidate Incident — Potentially related alerts. Human verification required."
    concern_level: ConcernLevelEnum
    link_strength: ConcernLevelEnum # LOW, MEDIUM, HIGH
    matched_factors: List[str]      # e.g. ["same_asset", "same_user", "temporal_proximity", "severity_progression"]
    explanation: str
    asset_id: Optional[str] = None
    user_id: Optional[str] = None
    related_alert_ids: List[str]
    time_window_start: str
    time_window_end: str
    evidence: FindingEvidence


class EntitySupervisoryIndicators(BaseModel):
    entity_id: str
    entity_name: str
    
    # Traditional self-reported KPIs
    reported_closure_rate: float
    reported_mttr_mins: float
    
    # Raw Calculated Metrics
    unescalated_critical_ratio: float  # e.g. 0.24 = 24%
    unescalated_critical_count: int
    total_critical_alerts: int
    median_serious_closure_mins: float
    rapid_closure_count: int           # closures < threshold for high/crit with evidence weakness
    repeated_unremediated_count: int
    template_cluster_count: int
    telemetry_void_asset_count: int
    
    # Transparent Rule-Based Supervisory Concern Levels
    missing_escalation_concern: ConcernLevelEnum
    premature_closure_concern: ConcernLevelEnum
    repeated_alerts_concern: ConcernLevelEnum
    investigation_quality_concern: ConcernLevelEnum
    monitoring_coverage_concern: ConcernLevelEnum
    candidate_incident_concern: ConcernLevelEnum
    
    # Qualitative Positioning Statement
    supervisory_summary: str


class PrioritisedCase(BaseModel):
    rank: int
    case_id: str
    entity_id: str
    primary_alert_id: str
    asset_name: str
    severity: SeverityEnum
    priority_level: ConcernLevelEnum
    justification_reasons: List[str]
    investigation_duration_mins: float
    escalated: bool
    evidence: FindingEvidence
