from typing import List
from datetime import datetime
from models import (
    Case, Alert, Asset, PrioritisedCase, FindingEvidence, ConcernLevelEnum, SeverityEnum, ExecutionGapFinding
)

def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

class CasePrioritiser:
    def __init__(self, cases: List[Case], alerts: List[Alert], assets: List[Asset], execution_gaps: List[ExecutionGapFinding]):
        self.cases = cases
        self.alerts = {al.alert_id: al for al in alerts}
        self.assets = {ast.asset_id: ast for ast in assets}
        self.execution_gaps = execution_gaps

    def prioritisation_cases_for_entity(self, entity_id: str, top_n: int = 5) -> List[PrioritisedCase]:
        entity_cases = [c for c in self.cases if c.entity_id == entity_id]
        
        scored_cases = []
        for c in entity_cases:
            if not c.alert_ids:
                continue
                
            primary_al = self.alerts.get(c.alert_ids[0])
            if not primary_al:
                continue
                
            ast = self.assets.get(primary_al.asset_id)
            ast_name = ast.asset_name if ast else primary_al.asset_id
            
            score = 0
            reasons = []
            
            # 1. Severity weight
            if primary_al.severity == SeverityEnum.CRITICAL:
                score += 40
                reasons.append("Contains CRITICAL severity alert")
            elif primary_al.severity == SeverityEnum.HIGH:
                score += 25
                reasons.append("Contains HIGH severity alert")
                
            # 2. Asset Criticality
            if ast and ast.criticality.value == "CRITICAL":
                score += 30
                reasons.append(f"Involves Critical Asset ({ast_name})")
                
            # 3. Execution Gap Present
            c_gaps = [eg for eg in self.execution_gaps if c.case_id in eg.evidence.case_ids]
            if c_gaps:
                score += 25
                gap_types = ", ".join(set(eg.rule_code for eg in c_gaps))
                reasons.append(f"Identified Execution Gap ({gap_types})")
                
            # 4. Un-escalated flag
            if not c.escalation_flag and primary_al.severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH]:
                score += 15
                reasons.append("High/Critical alert unescalated")
                
            # 5. Rapid closure
            t_created = parse_iso(c.created_at)
            t_closed = parse_iso(c.closed_at)
            duration_mins = round((t_closed - t_created).total_seconds() / 60.0, 1)
            if duration_mins < 5.0 and primary_al.severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH]:
                score += 10
                reasons.append(f"Closed in only {duration_mins} mins")

            priority_lvl = ConcernLevelEnum.HIGH if score >= 60 else (ConcernLevelEnum.MEDIUM if score >= 35 else ConcernLevelEnum.LOW)
            
            scored_cases.append({
                "score": score,
                "case": c,
                "primary_alert": primary_al,
                "asset_name": ast_name,
                "duration_mins": duration_mins,
                "reasons": reasons,
                "priority_level": priority_lvl
            })
            
        # Sort descending by score
        scored_cases.sort(key=lambda x: x["score"], reverse=True)
        
        results = []
        for rank, item in enumerate(scored_cases[:top_n], start=1):
            c = item["case"]
            al = item["primary_alert"]
            
            results.append(PrioritisedCase(
                rank=rank,
                case_id=c.case_id,
                entity_id=entity_id,
                primary_alert_id=al.alert_id,
                asset_name=item["asset_name"],
                severity=al.severity,
                priority_level=item["priority_level"],
                justification_reasons=item["reasons"],
                investigation_duration_mins=item["duration_mins"],
                escalated=c.escalation_flag,
                evidence=FindingEvidence(
                    alert_ids=c.alert_ids,
                    case_ids=[c.case_id],
                    asset_ids=[al.asset_id],
                    raw_snippets=[{"case": c.model_dump(), "alert": al.model_dump()}]
                )
            ))
            
        return results
