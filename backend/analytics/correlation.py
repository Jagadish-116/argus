from typing import List, Dict, Set
from datetime import datetime, timezone
from models import (
    Alert, Asset, CandidateIncidentFinding, FindingEvidence, ConcernLevelEnum, SeverityEnum
)

def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

SEVERITY_ORDER = {
    SeverityEnum.LOW: 1,
    SeverityEnum.MEDIUM: 2,
    SeverityEnum.HIGH: 3,
    SeverityEnum.CRITICAL: 4
}

ATTACK_CHAIN_CATEGORIES = {
    "reconnaissance", "scanning", "brute force", "intrusion", "privilege escalation",
    "malware activity", "exfiltration", "policy violation", "audit discrepancy"
}

class IncidentCorrelator:
    def __init__(self, alerts: List[Alert], assets: List[Asset]):
        self.alerts = alerts
        self.assets = {ast.asset_id: ast for ast in assets}

    def analyze_entity(self, entity_id: str) -> List[CandidateIncidentFinding]:
        findings: List[CandidateIncidentFinding] = []
        entity_alerts = [al for al in self.alerts if al.entity_id == entity_id]
        
        if len(entity_alerts) < 2:
            return findings

        entity_alerts.sort(key=lambda x: parse_iso(x.timestamp))
        
        # Sliding window analysis for correlation clusters
        n = len(entity_alerts)
        visited_alert_ids: Set[str] = set()

        for i in range(n):
            if entity_alerts[i].alert_id in visited_alert_ids:
                continue

            window = [entity_alerts[i]]
            t0 = parse_iso(entity_alerts[i].timestamp)
            
            for j in range(i + 1, n):
                t_j = parse_iso(entity_alerts[j].timestamp)
                # Look within a 6-hour max sliding window
                if (t_j - t0).total_seconds() <= 6 * 3600:
                    window.append(entity_alerts[j])
                else:
                    break

            if len(window) < 2:
                continue

            # Evaluate Multi-Factor Relationship Indicators
            matched_factors = []
            
            # Factor 1: Same Asset
            asset_ids = set(al.asset_id for al in window)
            if len(asset_ids) == 1:
                matched_factors.append("same_asset")

            # Factor 2: Same Account/User
            user_ids = set(al.user_id for al in window if al.user_id)
            if len(user_ids) == 1 and None not in user_ids:
                matched_factors.append("same_user")

            # Factor 3: High Temporal Proximity (< 2 hours max spread between consecutive alerts)
            max_delta_secs = max(
                (parse_iso(window[k+1].timestamp) - parse_iso(window[k].timestamp)).total_seconds()
                for k in range(len(window)-1)
            )
            if max_delta_secs <= 2 * 3600:
                matched_factors.append("temporal_proximity")

            # Factor 4: Severity Progression (Starts LOW/MED and escalates to HIGH/CRITICAL)
            severities = [SEVERITY_ORDER[al.severity] for al in window]
            if len(severities) >= 2 and severities[-1] > severities[0] and severities[-1] >= 3:
                matched_factors.append("severity_progression")

            # Factor 5: Related Alert Categories / Attack Chain Sequence
            categories = [al.category.lower() for al in window]
            if len(set(categories)) >= 2:
                matched_factors.append("related_alert_categories")

            # MINIMUM MULTI-FACTOR THRESHOLD: Require AT LEAST 2 matched relationship factors!
            if len(matched_factors) >= 2:
                # Link Strength Determination
                if len(matched_factors) >= 4:
                    link_strength = ConcernLevelEnum.HIGH
                elif len(matched_factors) >= 2:
                    link_strength = ConcernLevelEnum.MEDIUM
                else:
                    link_strength = ConcernLevelEnum.LOW

                # Mark alerts as visited to prevent duplicate sub-window clusters
                for al in window:
                    visited_alert_ids.add(al.alert_id)

                ast_id = window[0].asset_id if len(asset_ids) == 1 else None
                ast = self.assets.get(ast_id) if ast_id else None
                ast_name = ast.asset_name if ast else (ast_id or "Multiple Assets")
                
                u_id = window[0].user_id if len(user_ids) == 1 else None
                
                factor_names_human = ", ".join(matched_factors)
                
                finding = CandidateIncidentFinding(
                    finding_id=f"IR01-{entity_id}-{i}",
                    entity_id=entity_id,
                    rule_code="IR-01",
                    title="Candidate Incident — Potentially related alerts. Human verification required.",
                    concern_level=link_strength,
                    link_strength=link_strength,
                    matched_factors=matched_factors,
                    explanation=(
                        f"Candidate Incident — Potentially related alerts. Human verification required. "
                        f"Identified a cluster of {len(window)} alerts on asset '{ast_name}' "
                        f"matching {len(matched_factors)} explainable relationship indicators ({factor_names_human}) "
                        f"with {link_strength.value} link strength."
                    ),
                    asset_id=ast_id,
                    user_id=u_id,
                    related_alert_ids=[al.alert_id for al in window],
                    time_window_start=window[0].timestamp,
                    time_window_end=window[-1].timestamp,
                    evidence=FindingEvidence(
                        alert_ids=[al.alert_id for al in window],
                        asset_ids=list(asset_ids),
                        raw_snippets=[
                            {
                                "alert_id": al.alert_id,
                                "title": al.title,
                                "severity": al.severity.value,
                                "category": al.category,
                                "user_id": al.user_id,
                                "timestamp": al.timestamp
                            }
                            for al in window
                        ]
                    )
                )
                findings.append(finding)
        return findings
