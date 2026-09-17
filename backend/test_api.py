import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(__file__))

from app import app, engine
from test_engine import test_argus_engine_corrections

client = TestClient(app)

def test_api_endpoints():
    print("==========================================================")
    print("  ARGUS FASTAPI BACKEND — ENDPOINT VERIFICATION TEST SUITE ")
    print("==========================================================")

    # 1. Root Endpoint Test
    resp_root = client.get("/")
    assert resp_root.status_code == 200
    print("[PASSED] GET / — API Root online.")

    # 2. Overview Endpoint Test
    resp_overview = client.get("/api/overview")
    assert resp_overview.status_code == 200
    data_overview = resp_overview.json()
    assert "entities" in data_overview
    assert "peer_benchmark" in data_overview
    assert len(data_overview["entities"]) == 3
    
    alpha_overview = next(e for e in data_overview["entities"] if e["entity_id"] == "CSE-ALPHA")
    assert alpha_overview["missing_escalation_concern"] == "HIGH"
    assert alpha_overview["premature_closure_concern"] == "HIGH"
    assert "security_score" not in alpha_overview # No fake security score
    print(f"[PASSED] GET /api/overview — Returned 3 CSEs with calculated metrics & peer benchmark.")

    # 3. Entity Details Endpoint Test
    resp_entity = client.get("/api/entity/CSE-ALPHA")
    assert resp_entity.status_code == 200
    data_entity = resp_entity.json()
    assert "indicators" in data_entity
    assert "execution_gaps" in data_entity
    assert "negative_spaces" in data_entity
    assert "candidate_incidents" in data_entity
    assert "prioritised_cases" in data_entity
    assert "trend_analysis" in data_entity
    print(f"[PASSED] GET /api/entity/CSE-ALPHA — Returned detailed entity profile & trend series.")

    # 4. Finding Drill-Down Endpoint Test
    # Pick first execution gap finding ID dynamically
    first_gap_id = data_entity["execution_gaps"][0]["finding_id"]
    resp_finding = client.get(f"/api/finding/{first_gap_id}")
    assert resp_finding.status_code == 200
    data_finding = resp_finding.json()
    assert data_finding["finding_id"] == first_gap_id
    assert "evidence" in data_finding
    assert "human_verification_notice" in data_finding
    print(f"[PASSED] GET /api/finding/{first_gap_id} — Returned evidence drill-down & raw record references.")

    # 5. Candidate Incident Reconstruction Endpoint Test
    first_incident_id = data_entity["candidate_incidents"][0]["finding_id"]
    resp_incident = client.get(f"/api/candidate-incident/{first_incident_id}")
    assert resp_incident.status_code == 200
    data_incident = resp_incident.json()
    assert data_incident["incident_id"] == first_incident_id
    assert "link_strength" in data_incident
    assert "matched_factors" in data_incident
    assert "chronological_alerts" in data_incident
    assert "expected_vs_observed_response" in data_incident
    assert "human_verification_requirement" in data_incident
    print(f"[PASSED] GET /api/candidate-incident/{first_incident_id} — Returned incident reconstruction & link strength factors.")

    # 6. Asset Coverage Endpoint Test
    resp_assets = client.get("/api/assets/CSE-ALPHA")
    assert resp_assets.status_code == 200
    data_assets = resp_assets.json()
    assert "assets" in data_assets
    assert "critical_asset_count" in data_assets
    assert "telemetry_void_count" in data_assets
    assert data_assets["telemetry_void_count"] == 2
    assert "supervisory_notice" in data_assets
    print(f"[PASSED] GET /api/assets/CSE-ALPHA — Returned asset inventory & 2 telemetry void assets.")

    # 7. Dynamic API Recalculation Verification Test
    print("\n--- [DYNAMIC RECALCULATION API TEST] ---")
    
    # Save original state
    orig_cases = {k: v.model_dump() for k, v in engine.data_loader.cases.items()}
    
    # Mutate in memory: escalate all CSE Alpha cases
    for c in engine.data_loader.cases.values():
        if c.entity_id == "CSE-ALPHA":
            c.escalation_flag = True
            
    # Re-run engine analytics
    engine.run_all_analytics()
    
    # Call API again
    resp_overview_mutated = client.get("/api/overview")
    data_overview_mutated = resp_overview_mutated.json()
    alpha_mutated = next(e for e in data_overview_mutated["entities"] if e["entity_id"] == "CSE-ALPHA")
    
    assert alpha_mutated["unescalated_critical_ratio"] == 0.0
    assert alpha_mutated["missing_escalation_concern"] == "LOW"
    print(f"[PASSED] Dynamic Recalculation — API instantly reflected memory mutation (0.0% unescalated ratio, LOW concern).")

    # Restore original state
    from models import Case
    engine.data_loader.cases = {k: Case(**v) for k, v in orig_cases.items()}
    engine.run_all_analytics()
    print("[PASSED] Dataset state restored successfully.")

    # 8. Engine Step-4 Regression Test
    print("\n--- [ENGINE REGRESSION TEST] ---")
    test_argus_engine_corrections()
    print("[PASSED] Step-4 Engine regression suite passed 100%.")

    print("\n==========================================================")
    print("  ALL API ENDPOINT & REGRESSION TESTS PASSED (100%)       ")
    print("==========================================================")

if __name__ == "__main__":
    test_api_endpoints()
