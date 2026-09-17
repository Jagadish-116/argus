from typing import List
from models import (
    Asset, Alert, Case, NegativeSpaceFinding, FindingEvidence, ConcernLevelEnum, AssetCriticalityEnum, SeverityEnum
)

class NegativeSpaceAssessor:
    def __init__(self, assets: List[Asset], alerts: List[Alert], cases: List[Case]):
        self.assets = {ast.asset_id: ast for ast in assets}
        self.alerts = alerts
        self.cases = cases

    def analyze_entity(self, entity_id: str) -> List[NegativeSpaceFinding]:
        findings: List[NegativeSpaceFinding] = []
        entity_assets = [ast for ast in self.assets.values() if ast.entity_id == entity_id]
        entity_alerts = [al for al in self.alerts if al.entity_id == entity_id]
        entity_cases = [c for c in self.cases if c.entity_id == entity_id]
        
        # Count alerts per asset
        asset_alert_map = {}
        for al in entity_alerts:
            asset_alert_map.setdefault(al.asset_id, []).append(al)
            
        # 1. Rule NS-01: Telemetry Void (Monitoring Blind Spot)
        # Specifically for critical assets with 0 alert telemetry recorded
        for ast in entity_assets:
            if ast.criticality == AssetCriticalityEnum.CRITICAL:
                logged_alerts = asset_alert_map.get(ast.asset_id, [])
                if len(logged_alerts) == 0:
                    finding = NegativeSpaceFinding(
                        finding_id=f"NS01-{ast.asset_id}",
                        entity_id=entity_id,
                        rule_code="NS-01",
                        title="Possible monitoring blind spot — verification required",
                        concern_level=ConcernLevelEnum.HIGH,
                        asset_id=ast.asset_id,
                        asset_name=ast.asset_name,
                        explanation=(
                            f"Possible monitoring blind spot — verification required. "
                            f"Critical asset '{ast.asset_name}' ({ast.ip_address}, {ast.department}) recorded zero "
                            f"telemetry or alert entries during the evaluation window. "
                            f"Supervisor verification is required to confirm telemetry logging coverage."
                        ),
                        evidence=FindingEvidence(
                            asset_ids=[ast.asset_id],
                            raw_snippets=[
                                {"asset": ast.model_dump(), "observed_alerts": 0}
                            ]
                        )
                    )
                    findings.append(finding)
                    
        # 2. Rule NS-02: Missing Expected Process Evidence
        # Triggered when High/Critical alert or alert sequence exists, but expected escalation/investigation evidence is absent
        for al in entity_alerts:
            if al.severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH]:
                # Find matching cases for this alert
                matching_cases = [c for c in entity_cases if al.alert_id in c.alert_ids]
                
                # Check if case or escalation record is missing
                is_case_missing = len(matching_cases) == 0
                is_escalation_missing = any(not c.escalation_flag for c in matching_cases) if matching_cases else True
                
                if is_case_missing or is_escalation_missing:
                    ast = self.assets.get(al.asset_id)
                    ast_name = ast.asset_name if ast else al.asset_id
                    
                    reason = "investigation case record is absent" if is_case_missing else "formal escalation evidence record is missing"
                    
                    finding = NegativeSpaceFinding(
                        finding_id=f"NS02-{al.alert_id}",
                        entity_id=entity_id,
                        rule_code="NS-02",
                        title="Expected process evidence absent — verification required",
                        concern_level=ConcernLevelEnum.HIGH if al.severity == SeverityEnum.CRITICAL else ConcernLevelEnum.MEDIUM,
                        asset_id=al.asset_id,
                        asset_name=ast_name,
                        explanation=(
                            f"Expected process evidence absent — verification required. "
                            f"{al.severity.value} severity alert '{al.title}' ({al.alert_id}) on asset '{ast_name}' "
                            f"requires process evidence under configured supervisory rules, but {reason}."
                        ),
                        evidence=FindingEvidence(
                            alert_ids=[al.alert_id],
                            case_ids=[c.case_id for c in matching_cases],
                            asset_ids=[al.asset_id],
                            raw_snippets=[
                                {"alert": al.model_dump(), "associated_cases": [c.model_dump() for c in matching_cases]}
                            ]
                        )
                    )
                    findings.append(finding)
                        
        return findings
