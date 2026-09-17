import sys
import os
sys.path.append(os.path.dirname(__file__))

from data_loader import DataLoader
from engine import ArgusEngine

def test_dynamic_recalculation():
    print("==========================================================")
    print("  ARGUS CORE ENGINE — DYNAMIC DATASET MUTATION TEST       ")
    print("==========================================================")
    
    # 1. Baseline Run
    loader = DataLoader()
    engine = ArgusEngine(loader)
    
    alpha_base = engine.entity_indicators["CSE-ALPHA"]
    print(f"BASELINE CSE Alpha Unescalated Ratio: {alpha_base.unescalated_critical_ratio * 100}% ({alpha_base.missing_escalation_concern.value} concern)")
    print(f"BASELINE CSE Alpha Telemetry Void Assets: {alpha_base.telemetry_void_asset_count} ({alpha_base.monitoring_coverage_concern.value} concern)")

    # 2. Mutate dataset in memory: Fix all unescalated cases in CSE Alpha & add alerts to unmonitored assets
    for c in loader.cases.values():
        if c.entity_id == "CSE-ALPHA":
            c.escalation_flag = True # Mark all cases escalated
            
    # Add telemetry alert to AST-ALPHA-DC01 and AST-ALPHA-HIST
    from models import Alert, SeverityEnum
    new_al1 = Alert(
        alert_id="ALT-ALPHA-FIX01",
        entity_id="CSE-ALPHA",
        asset_id="AST-ALPHA-DC01",
        timestamp="2026-09-11T10:00:00Z",
        severity=SeverityEnum.MEDIUM,
        category="Auth Log",
        title="Normal Service Auth",
        raw_details="Telemetry restored"
    )
    new_al2 = Alert(
        alert_id="ALT-ALPHA-FIX02",
        entity_id="CSE-ALPHA",
        asset_id="AST-ALPHA-HIST",
        timestamp="2026-09-11T10:00:00Z",
        severity=SeverityEnum.MEDIUM,
        category="SCADA Telemetry",
        title="Normal Historian Heartbeat",
        raw_details="Telemetry restored"
    )
    loader.alerts[new_al1.alert_id] = new_al1
    loader.alerts[new_al2.alert_id] = new_al2

    # 3. Re-run Analytics Engine on mutated dataset
    engine.run_all_analytics()
    
    alpha_mutated = engine.entity_indicators["CSE-ALPHA"]
    print("\n--- AFTER DATASET MUTATION (Remediated Escalations & Restored Telemetry) ---")
    print(f"MUTATED CSE Alpha Unescalated Ratio: {alpha_mutated.unescalated_critical_ratio * 100}% ({alpha_mutated.missing_escalation_concern.value} concern)")
    print(f"MUTATED CSE Alpha Telemetry Void Assets: {alpha_mutated.telemetry_void_asset_count} ({alpha_mutated.monitoring_coverage_concern.value} concern)")

    # Assertions
    assert alpha_mutated.unescalated_critical_ratio == 0.0, "Expected 0% unescalated ratio after mutation"
    assert alpha_mutated.missing_escalation_concern == "LOW", "Expected LOW concern after mutation"
    assert alpha_mutated.telemetry_void_asset_count == 0, "Expected 0 telemetry void assets after mutation"
    assert alpha_mutated.monitoring_coverage_concern == "LOW", "Expected LOW concern after mutation"
    
    print("\n==========================================================")
    print("  [SUCCESS] DYNAMIC RECALCULATION VERIFIED: 0% HARDCODING ")
    print("==========================================================")

if __name__ == "__main__":
    test_dynamic_recalculation()
