import statistics
from typing import List, Dict
from datetime import datetime
from models import (
    Entity, Asset, Alert, Case, ExecutionGapFinding, NegativeSpaceFinding,
    CandidateIncidentFinding, EntitySupervisoryIndicators, ConcernLevelEnum, SeverityEnum
)

def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

class IndicatorCalculator:
    def __init__(
        self,
        entities: List[Entity],
        assets: List[Asset],
        alerts: List[Alert],
        cases: List[Case],
        execution_gaps: List[ExecutionGapFinding],
        negative_spaces: List[NegativeSpaceFinding],
        candidate_incidents: List[CandidateIncidentFinding]
    ):
        self.entities = {e.entity_id: e for e in entities}
        self.assets = assets
        self.alerts = alerts
        self.cases = cases
        self.execution_gaps = execution_gaps
        self.negative_spaces = negative_spaces
        self.candidate_incidents = candidate_incidents

    def calculate_indicators_for_entity(self, entity_id: str) -> EntitySupervisoryIndicators:
        entity = self.entities[entity_id]
        
        entity_cases = [c for c in self.cases if c.entity_id == entity_id]
        entity_alerts = [al for al in self.alerts if al.entity_id == entity_id]
        entity_assets = [ast for ast in self.assets if ast.entity_id == entity_id]
        
        alert_dict = {al.alert_id: al for al in entity_alerts}
        
        # 1. Missing Escalation Calculation (EG-01 / NS-02)
        crit_high_alerts = [al for al in entity_alerts if al.severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH]]
        total_critical_alerts = len(crit_high_alerts)
        
        unescalated_count = 0
        for c in entity_cases:
            if not c.escalation_flag:
                for a_id in c.alert_ids:
                    if a_id in alert_dict and alert_dict[a_id].severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH]:
                        unescalated_count += 1
                        break
                        
        unescalated_ratio = round(unescalated_count / total_critical_alerts, 3) if total_critical_alerts > 0 else 0.0
        
        if unescalated_ratio >= 0.15:
            missing_esc_concern = ConcernLevelEnum.HIGH
        elif unescalated_ratio >= 0.05:
            missing_esc_concern = ConcernLevelEnum.MEDIUM
        else:
            missing_esc_concern = ConcernLevelEnum.LOW

        # 2. Premature Closure Pattern (EG-02 Multi-Indicator)
        eg02_findings = [eg for eg in self.execution_gaps if eg.entity_id == entity_id and eg.rule_code == "EG-02"]
        rapid_closure_count = len(eg02_findings)
        
        closure_times_mins = []
        for c in entity_cases:
            t_created = parse_iso(c.created_at)
            t_closed = parse_iso(c.closed_at)
            duration_mins = (t_closed - t_created).total_seconds() / 60.0
            closure_times_mins.append(duration_mins)
            
        median_closure_mins = round(statistics.median(closure_times_mins), 1) if closure_times_mins else 0.0
        
        if rapid_closure_count >= 5 or (median_closure_mins < 5.0 and rapid_closure_count >= 2):
            premature_closure_concern = ConcernLevelEnum.HIGH
        elif rapid_closure_count >= 1 or median_closure_mins < 10.0:
            premature_closure_concern = ConcernLevelEnum.MEDIUM
        else:
            premature_closure_concern = ConcernLevelEnum.LOW

        # 3. Repeated Un-remediated Alerts (EG-04)
        eg04_gaps = [eg for eg in self.execution_gaps if eg.entity_id == entity_id and eg.rule_code == "EG-04"]
        repeated_unremediated_count = sum(len(eg.evidence.alert_ids) for eg in eg04_gaps)
        
        if repeated_unremediated_count >= 8:
            repeated_concern = ConcernLevelEnum.HIGH
        elif repeated_unremediated_count >= 3:
            repeated_concern = ConcernLevelEnum.MEDIUM
        else:
            repeated_concern = ConcernLevelEnum.LOW

        # 4. Investigation Evidence Quality (EG-03 Template Notes)
        eg03_gaps = [eg for eg in self.execution_gaps if eg.entity_id == entity_id and eg.rule_code == "EG-03"]
        template_cluster_count = sum(len(eg.evidence.case_ids) for eg in eg03_gaps)
        
        if template_cluster_count >= 5:
            investigation_quality_concern = ConcernLevelEnum.HIGH
        elif template_cluster_count >= 1:
            investigation_quality_concern = ConcernLevelEnum.MEDIUM
        else:
            investigation_quality_concern = ConcernLevelEnum.LOW

        # 5. Monitoring Coverage Concern (NS-01 Critical Asset Telemetry Void)
        ns01_findings = [ns for ns in self.negative_spaces if ns.entity_id == entity_id and ns.rule_code == "NS-01"]
        telemetry_void_asset_count = len(ns01_findings)
        
        if telemetry_void_asset_count >= 1:
            monitoring_concern = ConcernLevelEnum.HIGH
        else:
            monitoring_concern = ConcernLevelEnum.LOW

        # 6. Candidate Incident Concern (IR-01)
        cand_incidents = [ci for ci in self.candidate_incidents if ci.entity_id == entity_id]
        high_strength_incidents = [ci for ci in cand_incidents if ci.link_strength == ConcernLevelEnum.HIGH]
        
        if high_strength_incidents or (cand_incidents and unescalated_count > 0):
            candidate_concern = ConcernLevelEnum.HIGH
        elif cand_incidents:
            candidate_concern = ConcernLevelEnum.MEDIUM
        else:
            candidate_concern = ConcernLevelEnum.LOW

        # Qualitative Supervisory Summary Statement
        concerns = []
        if missing_esc_concern == ConcernLevelEnum.HIGH:
            concerns.append(f"high un-escalated critical alert ratio ({round(unescalated_ratio*100, 1)}%)")
        if premature_closure_concern == ConcernLevelEnum.HIGH:
            concerns.append(f"multi-indicator premature closure patterns ({rapid_closure_count} flagged cases)")
        if template_cluster_count > 0:
            concerns.append(f"{template_cluster_count} template-driven repetitive investigation cases")
        if telemetry_void_asset_count > 0:
            concerns.append(f"{telemetry_void_asset_count} critical assets with telemetry voids")
            
        if concerns:
            summary_stmt = (
                f"{entity.name} shows elevated supervisory concern relative to the peer cohort "
                f"due to {', '.join(concerns)}."
            )
        else:
            summary_stmt = (
                f"{entity.name} demonstrates consistent operational discipline and low supervisory concern "
                f"across all evaluated rule baselines."
            )

        return EntitySupervisoryIndicators(
            entity_id=entity_id,
            entity_name=entity.name,
            reported_closure_rate=entity.reported_kpi_closure_rate,
            reported_mttr_mins=entity.reported_kpi_mttr_mins,
            unescalated_critical_ratio=unescalated_ratio,
            unescalated_critical_count=unescalated_count,
            total_critical_alerts=total_critical_alerts,
            median_serious_closure_mins=median_closure_mins,
            rapid_closure_count=rapid_closure_count,
            repeated_unremediated_count=repeated_unremediated_count,
            template_cluster_count=template_cluster_count,
            telemetry_void_asset_count=telemetry_void_asset_count,
            missing_escalation_concern=missing_esc_concern,
            premature_closure_concern=premature_closure_concern,
            repeated_alerts_concern=repeated_concern,
            investigation_quality_concern=investigation_quality_concern,
            monitoring_coverage_concern=monitoring_concern,
            candidate_incident_concern=candidate_concern,
            supervisory_summary=summary_stmt
        )
