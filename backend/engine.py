from typing import Dict, List, Any, Optional
from datetime import datetime
from data_loader import DataLoader
from analytics.execution_gaps import ExecutionGapAnalyzer
from analytics.negative_space import NegativeSpaceAssessor
from analytics.correlation import IncidentCorrelator
from analytics.indicators import IndicatorCalculator
from analytics.prioritisation import CasePrioritiser
from models import (
    EntitySupervisoryIndicators, ExecutionGapFinding, NegativeSpaceFinding,
    CandidateIncidentFinding, PrioritisedCase
)

def parse_iso(dt_str: str) -> datetime:
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

class ArgusEngine:
    def __init__(self, data_loader: DataLoader = None):
        self.data_loader = data_loader or DataLoader()
        self.run_all_analytics()

    def run_all_analytics(self):
        entities = list(self.data_loader.entities.values())
        assets = list(self.data_loader.assets.values())
        alerts = list(self.data_loader.alerts.values())
        cases = list(self.data_loader.cases.values())
        
        # Instantiate Analyzers
        self.gap_analyzer = ExecutionGapAnalyzer(cases=cases, alerts=alerts, assets=assets)
        self.negative_assessor = NegativeSpaceAssessor(assets=assets, alerts=alerts, cases=cases)
        self.correlator = IncidentCorrelator(alerts=alerts, assets=assets)
        
        # Calculate Findings per entity
        self.execution_gaps: List[ExecutionGapFinding] = []
        self.negative_spaces: List[NegativeSpaceFinding] = []
        self.candidate_incidents: List[CandidateIncidentFinding] = []
        
        for e in entities:
            self.execution_gaps.extend(self.gap_analyzer.analyze_entity(e.entity_id))
            self.negative_spaces.extend(self.negative_assessor.analyze_entity(e.entity_id))
            self.candidate_incidents.extend(self.correlator.analyze_entity(e.entity_id))
            
        # Instantiate Indicator Calculator & Prioritiser
        self.indicator_calc = IndicatorCalculator(
            entities=entities,
            assets=assets,
            alerts=alerts,
            cases=cases,
            execution_gaps=self.execution_gaps,
            negative_spaces=self.negative_spaces,
            candidate_incidents=self.candidate_incidents
        )
        
        self.prioritiser = CasePrioritiser(
            cases=cases,
            alerts=alerts,
            assets=assets,
            execution_gaps=self.execution_gaps
        )
        
        # Pre-compute Entity Indicators
        self.entity_indicators: Dict[str, EntitySupervisoryIndicators] = {}
        for e in entities:
            self.entity_indicators[e.entity_id] = self.indicator_calc.calculate_indicators_for_entity(e.entity_id)

    def get_supervisory_overview(self) -> List[EntitySupervisoryIndicators]:
        return list(self.entity_indicators.values())

    def get_entity_findings(self, entity_id: str) -> Dict[str, Any]:
        indicators = self.entity_indicators.get(entity_id)
        gaps = [eg for eg in self.execution_gaps if eg.entity_id == entity_id]
        negative = [ns for ns in self.negative_spaces if ns.entity_id == entity_id]
        incidents = [ci for ci in self.candidate_incidents if ci.entity_id == entity_id]
        top_cases = self.prioritiser.prioritisation_cases_for_entity(entity_id, top_n=5)
        
        # Simple trend analysis calculated honestly from raw alert timestamps
        entity_alerts = [al for al in self.data_loader.alerts.values() if al.entity_id == entity_id]
        daily_trends = {}
        for al in entity_alerts:
            day_str = al.timestamp.split("T")[0]
            daily_trends.setdefault(day_str, {"date": day_str, "alert_count": 0, "execution_gap_count": 0})
            daily_trends[day_str]["alert_count"] += 1

        for eg in gaps:
            # Match finding timestamp from raw evidence snippet if available
            if eg.evidence.raw_snippets:
                snippet = eg.evidence.raw_snippets[0]
                ts = None
                if "alert" in snippet and isinstance(snippet["alert"], dict):
                    ts = snippet["alert"].get("timestamp")
                elif "case" in snippet and isinstance(snippet["case"], dict):
                    ts = snippet["case"].get("created_at")
                if ts:
                    day_str = ts.split("T")[0]
                    if day_str in daily_trends:
                        daily_trends[day_str]["execution_gap_count"] += 1

        trend_series = sorted(daily_trends.values(), key=lambda x: x["date"])
        
        return {
            "indicators": indicators,
            "execution_gaps": gaps,
            "negative_spaces": negative,
            "candidate_incidents": incidents,
            "prioritised_cases": top_cases,
            "trend_analysis": trend_series
        }

    def get_finding_by_id(self, finding_id: str) -> Optional[Dict[str, Any]]:
        # Search execution gaps
        for eg in self.execution_gaps:
            if eg.finding_id == finding_id:
                return {
                    "finding_type": "EXECUTION_GAP",
                    "finding_id": eg.finding_id,
                    "entity_id": eg.entity_id,
                    "rule_code": eg.rule_code,
                    "title": eg.title,
                    "concern_level": eg.concern_level,
                    "explanation": eg.explanation,
                    "evidence": eg.evidence,
                    "affected_records": {
                        "alert_ids": eg.evidence.alert_ids,
                        "case_ids": eg.evidence.case_ids,
                        "asset_ids": eg.evidence.asset_ids
                    },
                    "human_verification_notice": "Supervisory verification required. Findings reflect operational evidence gaps under configured rules."
                }

        # Search negative space findings
        for ns in self.negative_spaces:
            if ns.finding_id == finding_id:
                return {
                    "finding_type": "NEGATIVE_SPACE",
                    "finding_id": ns.finding_id,
                    "entity_id": ns.entity_id,
                    "rule_code": ns.rule_code,
                    "title": ns.title,
                    "concern_level": ns.concern_level,
                    "asset_id": ns.asset_id,
                    "asset_name": ns.asset_name,
                    "explanation": ns.explanation,
                    "evidence": ns.evidence,
                    "affected_records": {
                        "alert_ids": ns.evidence.alert_ids,
                        "case_ids": ns.evidence.case_ids,
                        "asset_ids": ns.evidence.asset_ids
                    },
                    "human_verification_notice": "Supervisory verification required. Absence of process or telemetry evidence requires entity verification."
                }

        return None

    def get_candidate_incident_by_id(self, incident_id: str) -> Optional[Dict[str, Any]]:
        for ci in self.candidate_incidents:
            if ci.finding_id == incident_id:
                # Fetch raw chronological alert objects
                chrono_alerts = [
                    self.data_loader.alerts[a_id].model_dump()
                    for a_id in ci.related_alert_ids
                    if a_id in self.data_loader.alerts
                ]
                chrono_alerts.sort(key=lambda x: parse_iso(x["timestamp"]))

                # Fetch associated cases and execution gaps
                assoc_cases = []
                for a_id in ci.related_alert_ids:
                    for c in self.data_loader.cases.values():
                        if a_id in c.alert_ids and c.model_dump() not in assoc_cases:
                            assoc_cases.append(c.model_dump())

                ident_gaps = [
                    eg.model_dump()
                    for eg in self.execution_gaps
                    if any(a_id in eg.evidence.alert_ids for a_id in ci.related_alert_ids)
                ]

                # Determine observed response summary
                if assoc_cases:
                    escalated = any(c["escalation_flag"] for c in assoc_cases)
                    notes_summary = assoc_cases[0]["investigation_notes"]
                    obs_resp = f"Closed in case management ({'Escalated' if escalated else 'Unescalated'}). Notes: '{notes_summary}'"
                else:
                    obs_resp = "No formal case management record observed."

                return {
                    "incident_id": ci.finding_id,
                    "entity_id": ci.entity_id,
                    "rule_code": ci.rule_code,
                    "title": ci.title,
                    "link_strength": ci.link_strength,
                    "matched_factors": ci.matched_factors,
                    "explanation": ci.explanation,
                    "asset_id": ci.asset_id,
                    "user_id": ci.user_id,
                    "time_window": {
                        "start": ci.time_window_start,
                        "end": ci.time_window_end
                    },
                    "chronological_alerts": chrono_alerts,
                    "associated_cases": assoc_cases,
                    "expected_vs_observed_response": {
                        "expected_response": "Standard Critical Sector Incident Escalation & Forensic Isolation Playbook",
                        "observed_response": obs_resp,
                        "identified_execution_gaps": ident_gaps
                    },
                    "prioritisation_reason": (
                        f"Prioritised due to {ci.link_strength.value} Link Strength across {len(ci.matched_factors)} relationship indicators "
                        f"identified in the historical evidence set."
                    ),
                    "human_verification_requirement": (
                        "Human supervisor verification required. Link Strength is based on matched relationship indicators. "
                        "Correlation does not prove alerts belong to the same attack."
                    ),
                    "evidence": ci.evidence
                }
        return None

    def get_assets_coverage(self, entity_id: str) -> Optional[Dict[str, Any]]:
        entity = self.data_loader.entities.get(entity_id)
        if not entity:
            return None

        entity_assets = [ast for ast in self.data_loader.assets.values() if ast.entity_id == entity_id]
        entity_alerts = [al for al in self.data_loader.alerts.values() if al.entity_id == entity_id]

        asset_alert_counts = {}
        for al in entity_alerts:
            asset_alert_counts[al.asset_id] = asset_alert_counts.get(al.asset_id, 0) + 1

        ns_findings = [ns for ns in self.negative_spaces if ns.entity_id == entity_id]
        ns01_asset_ids = set(ns.asset_id for ns in ns_findings if ns.rule_code == "NS-01")
        ns02_asset_ids = set(ns.asset_id for ns in ns_findings if ns.rule_code == "NS-02")

        asset_records = []
        for ast in entity_assets:
            count = asset_alert_counts.get(ast.asset_id, 0)
            if ast.asset_id in ns01_asset_ids:
                status = "TELEMETRY_VOID"
                status_label = "Possible monitoring blind spot — verification required"
            elif ast.asset_id in ns02_asset_ids:
                status = "PROCESS_EVIDENCE_ABSENT"
                status_label = "Expected process evidence absent — verification required"
            else:
                status = "ACTIVE_MONITORING"
                status_label = "Normal telemetry & process records observed"

            asset_records.append({
                "asset_id": ast.asset_id,
                "asset_name": ast.asset_name,
                "criticality": ast.criticality.value,
                "ip_address": ast.ip_address,
                "department": ast.department,
                "observed_alert_count": count,
                "expected_monitoring_baseline": "24/7 SIEM Syslog & Case Management Audit Logging",
                "coverage_status": status,
                "coverage_status_label": status_label
            })

        critical_assets = [a for a in asset_records if a["criticality"] == "CRITICAL"]
        telemetry_void_assets = [a for a in critical_assets if a["coverage_status"] == "TELEMETRY_VOID"]
        process_gap_assets = [a for a in asset_records if a["coverage_status"] == "PROCESS_EVIDENCE_ABSENT"]

        return {
            "entity_id": entity_id,
            "entity_name": entity.name,
            "total_assets": len(entity_assets),
            "critical_asset_count": len(critical_assets),
            "telemetry_void_count": len(telemetry_void_assets),
            "process_evidence_absent_count": len(process_gap_assets),
            "assets": asset_records,
            "negative_space_findings": [ns.model_dump() for ns in ns_findings],
            "supervisory_notice": "Possible monitoring blind spot — verification required. Absence of monitoring evidence requires entity verification."
        }


if __name__ == "__main__":
    engine = ArgusEngine()
    print("=== ARGUS ENGINE STANDALONE TEST ===")
    for ind in engine.get_supervisory_overview():
        print(f"\n--- {ind.entity_name} ({ind.entity_id}) ---")
        print(f"Reported KPI Closure Rate: {ind.reported_closure_rate * 100}% | MTTR: {ind.reported_mttr_mins}m")
        print(f"Unescalated Critical Alert Ratio: {ind.unescalated_critical_ratio * 100}% ({ind.missing_escalation_concern.value} concern)")
        print(f"Median Serious Case Closure: {ind.median_serious_closure_mins}m ({ind.premature_closure_concern.value} concern)")
        print(f"Template Cluster Count: {ind.template_cluster_count} ({ind.investigation_quality_concern.value} concern)")
        print(f"Telemetry Void Asset Count: {ind.telemetry_void_asset_count} ({ind.monitoring_coverage_concern.value} concern)")
        print(f"Supervisory Summary: {ind.supervisory_summary}")
