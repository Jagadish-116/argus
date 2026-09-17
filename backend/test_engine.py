import sys
import os
from datetime import datetime, timezone

sys.path.append(os.path.dirname(__file__))

from data_generator import generate_synthetic_data
from data_loader import DataLoader
from engine import ArgusEngine
from models import Alert, Case, Asset, SeverityEnum, ConcernLevelEnum, AssetCriticalityEnum
from analytics.execution_gaps import ExecutionGapAnalyzer
from analytics.negative_space import NegativeSpaceAssessor
from analytics.correlation import IncidentCorrelator

def test_argus_engine_corrections():
    print("==========================================================")
    print("  ARGUS CORE ANALYTICS ENGINE — CORRECTIONS TEST SUITE   ")
    print("==========================================================")
    
    # Force fresh data generation
    generate_synthetic_data()
    loader = DataLoader()
    engine = ArgusEngine(loader)
    
    # -------------------------------------------------------------------------
    # TEST 1: EG-02 Multi-Indicator Premature Closure
    # -------------------------------------------------------------------------
    print("\n--- [TEST 1] EG-02 Multi-Indicator Premature Closure ---")
    
    # Find fast case with strong notes and escalation in CSE Beta
    fast_well_handled_case = None
    for c in loader.cases.values():
        if c.entity_id == "CSE-BETA" and c.escalation_flag:
            t_created = datetime.fromisoformat(c.created_at.replace("Z", "+00:00"))
            t_closed = datetime.fromisoformat(c.closed_at.replace("Z", "+00:00"))
            duration_secs = (t_closed - t_created).total_seconds()
            if duration_secs < 300 and len(c.investigation_notes) > 50:
                fast_well_handled_case = c
                break
                
    assert fast_well_handled_case is not None, "Test case fast_well_handled_case in CSE Beta not found"
    
    # Check if EG-02 flagged it
    eg02_findings = [eg for eg in engine.execution_gaps if eg.rule_code == "EG-02"]
    eg02_case_ids = set(c_id for eg in eg02_findings for c_id in eg.evidence.case_ids)
    
    assert fast_well_handled_case.case_id not in eg02_case_ids, (
        f"FAILED: Fast-closed case ({fast_well_handled_case.case_id}) WITH strong investigation notes and escalation should NOT be flagged as premature closure!"
    )
    print(f"[PASSED] Case {fast_well_handled_case.case_id} closed in 2 minutes WITH strong investigation notes & escalation was NOT flagged as premature closure.")
    
    # Verify that cases with weak notes or missing escalation DO get flagged
    alpha_eg02_cases = [eg for eg in eg02_findings if eg.entity_id == "CSE-ALPHA"]
    assert len(alpha_eg02_cases) > 0, "FAILED: CSE Alpha cases with weak notes/unescalated should be flagged under EG-02"
    for eg in alpha_eg02_cases:
        assert eg.title == "Possible premature closure — supervisory verification required", f"Invalid EG-02 title: {eg.title}"
    print("[PASSED] EG-02 correctly flagged cases with duration < 5m AND weak notes/missing escalation under title 'Possible premature closure — supervisory verification required'.")

    # -------------------------------------------------------------------------
    # TEST 2: NS-02 Missing Expected Process Evidence (Dynamic Mutation)
    # -------------------------------------------------------------------------
    print("\n--- [TEST 2] NS-02 Missing Expected Process Evidence ---")
    
    # Create test alert requiring process evidence
    test_alert = Alert(
        alert_id="ALT-TEST-NS02",
        entity_id="CSE-BETA",
        asset_id="AST-BETA-DC01",
        user_id="sys_admin",
        timestamp="2026-09-12T12:00:00Z",
        severity=SeverityEnum.CRITICAL,
        category="Privilege Escalation",
        title="Domain Admin Created",
        raw_details="Test alert for NS-02 evidence test"
    )
    loader.alerts[test_alert.alert_id] = test_alert
    
    # Run negative space analysis WITHOUT process evidence (no matching case)
    ns_assessor = NegativeSpaceAssessor(
        assets=list(loader.assets.values()),
        alerts=list(loader.alerts.values()),
        cases=list(loader.cases.values())
    )
    ns_findings_before = ns_assessor.analyze_entity("CSE-BETA")
    ns02_before = [ns for ns in ns_findings_before if ns.rule_code == "NS-02" and test_alert.alert_id in ns.evidence.alert_ids]
    
    assert len(ns02_before) == 1, "FAILED: Missing process evidence (absent case) should trigger NS-02 finding"
    assert ns02_before[0].title == "Expected process evidence absent — verification required", f"Invalid NS-02 title: {ns02_before[0].title}"
    print("[PASSED] Removing/absent process evidence created NS-02 finding with title 'Expected process evidence absent — verification required'.")
    
    # Restore process evidence (Add matching escalated case)
    test_case = Case(
        case_id="CAS-TEST-NS02",
        alert_ids=[test_alert.alert_id],
        entity_id="CSE-BETA",
        analyst_id="ANL-401",
        created_at="2026-09-12T12:01:00Z",
        closed_at="2026-09-12T12:15:00Z",
        resolution_status="Closed - Escalated",
        investigation_notes="Escalation process evidence recorded properly.",
        escalation_flag=True,
        escalation_timestamp="2026-09-12T12:05:00Z"
    )
    loader.cases[test_case.case_id] = test_case
    
    # Re-run negative space analysis WITH process evidence
    ns_assessor_after = NegativeSpaceAssessor(
        assets=list(loader.assets.values()),
        alerts=list(loader.alerts.values()),
        cases=list(loader.cases.values())
    )
    ns_findings_after = ns_assessor_after.analyze_entity("CSE-BETA")
    ns02_after = [ns for ns in ns_findings_after if ns.rule_code == "NS-02" and test_alert.alert_id in ns.evidence.alert_ids]
    
    assert len(ns02_after) == 0, "FAILED: Restoring expected process evidence should remove NS-02 finding"
    print("[PASSED] Restoring process evidence successfully removed the NS-02 finding.")

    # -------------------------------------------------------------------------
    # TEST 3: IR-01 Candidate Incident Reconstruction (Multi-Factor Matching)
    # -------------------------------------------------------------------------
    print("\n--- [TEST 3] IR-01 Multi-Factor Candidate Incident Matching ---")
    
    # Weak scenario: Alerts sharing ONLY 1 factor (same asset 5 hours apart, different users, no severity progression, same category)
    weak_alert1 = Alert(
        alert_id="ALT-WEAK-01",
        entity_id="CSE-TEST",
        asset_id="AST-WEAK-01",
        user_id="user_a",
        timestamp="2026-09-12T01:00:00Z",
        severity=SeverityEnum.LOW,
        category="Audit Log",
        title="Audit Event A",
        raw_details="Details A"
    )
    weak_alert2 = Alert(
        alert_id="ALT-WEAK-02",
        entity_id="CSE-TEST",
        asset_id="AST-WEAK-01",
        user_id="user_b", # Different user
        timestamp="2026-09-12T05:30:00Z", # 4.5 hours apart
        severity=SeverityEnum.LOW, # No severity progression
        category="Audit Log",
        title="Audit Event B",
        raw_details="Details B"
    )
    
    correlator_weak = IncidentCorrelator(alerts=[weak_alert1, weak_alert2], assets=[])
    weak_cand = correlator_weak.analyze_entity("CSE-TEST")
    assert len(weak_cand) == 0, "FAILED: Alerts sharing only 1 weak factor should NOT create a candidate incident!"
    print("[PASSED] Alerts sharing only 1 weak factor did NOT trigger Candidate Incident.")
    
    # Strong scenario: Alerts matching MULTIPLE factors (same asset, same user, <15m apart, severity progression LOW -> HIGH -> CRITICAL)
    strong_alert1 = Alert(
        alert_id="ALT-STRONG-01",
        entity_id="CSE-TEST2",
        asset_id="AST-STRONG-01",
        user_id="compromised_user",
        timestamp="2026-09-12T10:00:00Z",
        severity=SeverityEnum.LOW,
        category="Reconnaissance",
        title="Port Scan",
        raw_details="Details 1"
    )
    strong_alert2 = Alert(
        alert_id="ALT-STRONG-02",
        entity_id="CSE-TEST2",
        asset_id="AST-STRONG-01",
        user_id="compromised_user",
        timestamp="2026-09-12T10:05:00Z",
        severity=SeverityEnum.HIGH,
        category="Brute Force",
        title="Failed Logins",
        raw_details="Details 2"
    )
    strong_alert3 = Alert(
        alert_id="ALT-STRONG-03",
        entity_id="CSE-TEST2",
        asset_id="AST-STRONG-01",
        user_id="compromised_user",
        timestamp="2026-09-12T10:14:00Z",
        severity=SeverityEnum.CRITICAL,
        category="Privilege Escalation",
        title="Domain Admin Created",
        raw_details="Details 3"
    )
    
    correlator_strong = IncidentCorrelator(alerts=[strong_alert1, strong_alert2, strong_alert3], assets=[])
    strong_cand = correlator_strong.analyze_entity("CSE-TEST2")
    
    assert len(strong_cand) == 1, "FAILED: Alerts matching multiple strong factors SHOULD create a candidate incident!"
    cand = strong_cand[0]
    assert cand.link_strength == ConcernLevelEnum.HIGH, f"Expected HIGH link strength, got {cand.link_strength}"
    assert "same_asset" in cand.matched_factors
    assert "same_user" in cand.matched_factors
    assert "temporal_proximity" in cand.matched_factors
    assert "severity_progression" in cand.matched_factors
    assert cand.title == "Candidate Incident — Potentially related alerts. Human verification required.", f"Invalid CI title: {cand.title}"
    
    print(f"[PASSED] Alerts matching {len(cand.matched_factors)} strong factors created Candidate Incident with {cand.link_strength.value} link strength.")
    print("  Matched Factors:", cand.matched_factors)
    print("  Title:", cand.title)

    print("\n==========================================================")
    print("  ALL CORRECTION TESTS PASSED SUCCESSFULLY (100%)         ")
    print("==========================================================")

if __name__ == "__main__":
    test_argus_engine_corrections()
