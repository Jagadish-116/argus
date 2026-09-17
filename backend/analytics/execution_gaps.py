from typing import List, Dict
from datetime import datetime, timezone
import statistics
from models import (
    Case, Alert, Asset, ExecutionGapFinding, FindingEvidence, ConcernLevelEnum, SeverityEnum
)

def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

def jaccard_similarity(text1: str, text2: str) -> float:
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 and not words2:
        return 1.0
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return len(intersection) / len(union)

# Generic template note strings commonly used for rubber-stamping
GENERIC_NOTE_SNIPPETS = [
    "reviewed alert", "verified with team", "closed case", "quick check", "resolved", "low risk event cleared"
]

class ExecutionGapAnalyzer:
    def __init__(
        self,
        cases: List[Case],
        alerts: List[Alert],
        assets: List[Asset],
        rapid_closure_threshold_secs: int = 300 # Prototype supervisory heuristic (5 minutes)
    ):
        self.cases = cases
        self.alerts = {a.alert_id: a for a in alerts}
        self.assets = {ast.asset_id: ast for ast in assets}
        self.rapid_closure_threshold_secs = rapid_closure_threshold_secs
        
    def analyze_entity(self, entity_id: str) -> List[ExecutionGapFinding]:
        findings: List[ExecutionGapFinding] = []
        entity_cases = [c for c in self.cases if c.entity_id == entity_id]
        
        # 1. Rule EG-01: Un-escalated High/Critical Alerts
        findings.extend(self._analyze_eg01(entity_id, entity_cases))
        
        # 2. Rule EG-02: Possible Premature Closure (Multi-Indicator)
        findings.extend(self._analyze_eg02(entity_id, entity_cases))
        
        # 3. Rule EG-03: Repetitive / Template Investigation Notes
        findings.extend(self._analyze_eg03(entity_id, entity_cases))
        
        # 4. Rule EG-04: Repeated Un-remediated Alerts on Same Asset (>3 alerts in 48h)
        findings.extend(self._analyze_eg04(entity_id))
        
        return findings

    def _analyze_eg01(self, entity_id: str, cases: List[Case]) -> List[ExecutionGapFinding]:
        findings = []
        for c in cases:
            for a_id in c.alert_ids:
                al = self.alerts.get(a_id)
                if not al:
                    continue
                if al.severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH] and not c.escalation_flag:
                    ast = self.assets.get(al.asset_id)
                    ast_name = ast.asset_name if ast else al.asset_id
                    
                    finding = ExecutionGapFinding(
                        finding_id=f"EG01-{c.case_id}",
                        entity_id=entity_id,
                        rule_code="EG-01",
                        title="Un-escalated High/Critical Alert",
                        concern_level=ConcernLevelEnum.HIGH if al.severity == SeverityEnum.CRITICAL else ConcernLevelEnum.MEDIUM,
                        explanation=(
                            f"Alert {al.alert_id} ({al.severity.value}: {al.title}) on asset '{ast_name}' "
                            f"was closed under case {c.case_id} without supervisory escalation flag."
                        ),
                        evidence=FindingEvidence(
                            alert_ids=[al.alert_id],
                            case_ids=[c.case_id],
                            asset_ids=[al.asset_id],
                            raw_snippets=[
                                {"alert": al.model_dump(), "case": c.model_dump()}
                            ]
                        )
                    )
                    findings.append(finding)
        return findings

    def _analyze_eg02(self, entity_id: str, cases: List[Case]) -> List[ExecutionGapFinding]:
        """
        EG-02: Possible Premature Closure Pattern (Multi-Indicator)
        Requires ALL of:
        1. High or Critical severity alert present
        2. Case closure duration < rapid_closure_threshold_secs (default 300s / 5m prototype heuristic)
        3. AND ONE OR MORE evidence weakness indicators:
           - Brief investigation notes (< 45 chars)
           - Generic / template note phrasing
           - Missing escalation flag despite High/Critical severity
        """
        findings = []
        for c in cases:
            created_dt = parse_iso(c.created_at)
            closed_dt = parse_iso(c.closed_at)
            duration_secs = (closed_dt - created_dt).total_seconds()
            
            # Check if case contains High/Critical alerts
            high_crit_alerts = [
                self.alerts[a_id] for a_id in c.alert_ids 
                if a_id in self.alerts and self.alerts[a_id].severity in [SeverityEnum.CRITICAL, SeverityEnum.HIGH]
            ]
            
            if not high_crit_alerts:
                continue
                
            # Indicator 1 & 2: High/Crit + Duration < threshold
            if duration_secs < self.rapid_closure_threshold_secs:
                notes = (c.investigation_notes or "").strip()
                notes_lower = notes.lower()
                
                # Secondary Evidence Weakness Indicators:
                weakness_reasons = []
                if len(notes) < 45:
                    weakness_reasons.append(f"weak/brief investigation notes ({len(notes)} chars)")
                    
                is_generic = any(snippet in notes_lower for snippet in GENERIC_NOTE_SNIPPETS)
                if is_generic:
                    weakness_reasons.append("generic/template closure reasoning")
                    
                if not c.escalation_flag:
                    weakness_reasons.append("missing escalation despite High/Critical severity")
                    
                # MULTI-INDICATOR CHECK: Only flag if AT LEAST ONE secondary weakness indicator is present!
                if weakness_reasons:
                    mins = round(duration_secs / 60.0, 1)
                    al = high_crit_alerts[0]
                    ast = self.assets.get(al.asset_id)
                    ast_name = ast.asset_name if ast else al.asset_id
                    
                    finding = ExecutionGapFinding(
                        finding_id=f"EG02-{c.case_id}",
                        entity_id=entity_id,
                        rule_code="EG-02",
                        title="Possible premature closure — supervisory verification required",
                        concern_level=ConcernLevelEnum.HIGH if len(weakness_reasons) >= 2 else ConcernLevelEnum.MEDIUM,
                        explanation=(
                            f"Possible premature closure — supervisory verification required. "
                            f"Case {c.case_id} containing {al.severity.value} alert '{al.title}' on '{ast_name}' "
                            f"was closed in {mins} mins (under the {int(self.rapid_closure_threshold_secs/60)}m prototype supervisory heuristic) "
                            f"with combined operational weakness indicators: {', '.join(weakness_reasons)}."
                        ),
                        evidence=FindingEvidence(
                            alert_ids=[a.alert_id for a in high_crit_alerts],
                            case_ids=[c.case_id],
                            asset_ids=[al.asset_id],
                            raw_snippets=[
                                {
                                    "case_duration_seconds": duration_secs,
                                    "threshold_heuristic_seconds": self.rapid_closure_threshold_secs,
                                    "weakness_indicators": weakness_reasons,
                                    "investigation_notes": c.investigation_notes,
                                    "escalated": c.escalation_flag
                                }
                            ]
                        )
                    )
                    findings.append(finding)
        return findings

    def _analyze_eg03(self, entity_id: str, cases: List[Case]) -> List[ExecutionGapFinding]:
        findings = []
        analyst_cases: Dict[str, List[Case]] = {}
        for c in cases:
            analyst_cases.setdefault(c.analyst_id, []).append(c)
            
        for analyst_id, a_cases in analyst_cases.items():
            if len(a_cases) < 3:
                continue
            
            clusters = []
            visited = set()
            for i in range(len(a_cases)):
                if i in visited:
                    continue
                cluster = [a_cases[i]]
                visited.add(i)
                for j in range(i + 1, len(a_cases)):
                    if j in visited:
                        continue
                    sim = jaccard_similarity(a_cases[i].investigation_notes, a_cases[j].investigation_notes)
                    if sim > 0.85:
                        cluster.append(a_cases[j])
                        visited.add(j)
                if len(cluster) >= 3:
                    clusters.append(cluster)
            
            for idx, cl in enumerate(clusters):
                case_ids = [c.case_id for c in cl]
                finding = ExecutionGapFinding(
                    finding_id=f"EG03-{analyst_id}-{idx+1}",
                    entity_id=entity_id,
                    rule_code="EG-03",
                    title="Low Investigation Evidence Quality (Template Notes Cluster)",
                    concern_level=ConcernLevelEnum.HIGH if len(cl) >= 5 else ConcernLevelEnum.MEDIUM,
                    explanation=(
                        f"Analyst {analyst_id} closed {len(cl)} cases using near-identical verbatim investigation notes "
                        f"(>85% text similarity), indicating automated or template-driven closing behavior."
                    ),
                    evidence=FindingEvidence(
                        case_ids=case_ids,
                        raw_snippets=[
                            {"analyst_id": analyst_id, "cluster_size": len(cl), "sample_note": cl[0].investigation_notes}
                        ]
                    )
                )
                findings.append(finding)
        return findings

    def _analyze_eg04(self, entity_id: str) -> List[ExecutionGapFinding]:
        findings = []
        entity_alerts = [al for al in self.alerts.values() if al.entity_id == entity_id]
        
        grouped: Dict[str, List[Alert]] = {}
        for al in entity_alerts:
            key = f"{al.asset_id}:{al.category}"
            grouped.setdefault(key, []).append(al)
            
        for key, a_list in grouped.items():
            if len(a_list) < 3:
                continue
            
            a_list.sort(key=lambda x: parse_iso(x.timestamp))
            
            for i in range(len(a_list)):
                window = [a_list[i]]
                t0 = parse_iso(a_list[i].timestamp)
                for j in range(i + 1, len(a_list)):
                    t_j = parse_iso(a_list[j].timestamp)
                    if (t_j - t0).total_seconds() <= 48 * 3600:
                        window.append(a_list[j])
                    else:
                        break
                        
                if len(window) >= 4:
                    asset_id, category = key.split(":")
                    ast = self.assets.get(asset_id)
                    ast_name = ast.asset_name if ast else asset_id
                    
                    finding = ExecutionGapFinding(
                        finding_id=f"EG04-{asset_id}-{i}",
                        entity_id=entity_id,
                        rule_code="EG-04",
                        title="Repeated Un-remediated Alerts on Asset",
                        concern_level=ConcernLevelEnum.HIGH if len(window) >= 8 else ConcernLevelEnum.MEDIUM,
                        explanation=(
                            f"Asset '{ast_name}' generated {len(window)} repeated alerts for '{category}' "
                            f"within a 48-hour window without effective root-cause remediation."
                        ),
                        evidence=FindingEvidence(
                            alert_ids=[al.alert_id for al in window],
                            asset_ids=[asset_id],
                            raw_snippets=[
                                {"alert_count": len(window), "category": category, "asset_name": ast_name}
                            ]
                        )
                    )
                    findings.append(finding)
                    break
        return findings
