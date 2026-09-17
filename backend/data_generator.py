import json
import os
from datetime import datetime, timedelta, timezone

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

def generate_synthetic_data():
    base_time = datetime(2026, 9, 10, 8, 0, 0, tzinfo=timezone.utc)
    
    # -------------------------------------------------------------------------
    # 1. ENTITIES
    # -------------------------------------------------------------------------
    entities = [
        {
            "entity_id": "CSE-ALPHA",
            "name": "Alpha Power Grid Corp",
            "sector": "Power & Energy",
            "total_assets": 145,
            "reported_kpi_closure_rate": 0.98,
            "reported_kpi_mttr_mins": 3.8
        },
        {
            "entity_id": "CSE-BETA",
            "name": "Beta Grid Transmission Ltd",
            "sector": "Power & Energy",
            "total_assets": 120,
            "reported_kpi_closure_rate": 0.82,
            "reported_kpi_mttr_mins": 14.2
        },
        {
            "entity_id": "CSE-GAMMA",
            "name": "Gamma Nuclear Infrastructure",
            "sector": "Nuclear & Energy",
            "total_assets": 95,
            "reported_kpi_closure_rate": 0.95,
            "reported_kpi_mttr_mins": 4.2
        }
    ]
    
    # -------------------------------------------------------------------------
    # 2. ASSETS
    # -------------------------------------------------------------------------
    assets = [
        # CSE Alpha Assets
        {"asset_id": "AST-ALPHA-DC01", "entity_id": "CSE-ALPHA", "asset_name": "Primary Domain Controller", "criticality": "CRITICAL", "ip_address": "10.0.1.5", "department": "Core IT"},
        {"asset_id": "AST-ALPHA-HIST", "entity_id": "CSE-ALPHA", "asset_name": "SCADA Historian Server", "criticality": "CRITICAL", "ip_address": "10.0.2.10", "department": "OT Operations"},
        {"asset_id": "AST-ALPHA-SCADA", "entity_id": "CSE-ALPHA", "asset_name": "Substation Control Server", "criticality": "CRITICAL", "ip_address": "10.0.2.15", "department": "OT Operations"},
        {"asset_id": "AST-ALPHA-GW", "entity_id": "CSE-ALPHA", "asset_name": "Perimeter Security Gateway", "criticality": "HIGH", "ip_address": "10.0.0.1", "department": "Network Security"},
        {"asset_id": "AST-ALPHA-WS01", "entity_id": "CSE-ALPHA", "asset_name": "Engineer Workstation 01", "criticality": "MEDIUM", "ip_address": "10.0.3.44", "department": "Engineering"},
        
        # CSE Beta Assets
        {"asset_id": "AST-BETA-DC01", "entity_id": "CSE-BETA", "asset_name": "Domain Controller Beta", "criticality": "CRITICAL", "ip_address": "10.1.1.5", "department": "IT Dept"},
        {"asset_id": "AST-BETA-EMS", "entity_id": "CSE-BETA", "asset_name": "Energy Management System", "criticality": "CRITICAL", "ip_address": "10.1.2.8", "department": "Grid Control"},
        {"asset_id": "AST-BETA-WS04", "entity_id": "CSE-BETA", "asset_name": "Operator Terminal 04", "criticality": "MEDIUM", "ip_address": "10.1.3.12", "department": "Operations"},
        
        # CSE Gamma Assets
        {"asset_id": "AST-GAMMA-DC01", "entity_id": "CSE-GAMMA", "asset_name": "Central Identity Server", "criticality": "CRITICAL", "ip_address": "10.2.1.5", "department": "IT Admin"},
        {"asset_id": "AST-GAMMA-MON", "entity_id": "CSE-GAMMA", "asset_name": "Reactor Monitoring Node", "criticality": "CRITICAL", "ip_address": "10.2.2.99", "department": "Reactor Operations"},
        {"asset_id": "AST-GAMMA-WS09", "entity_id": "CSE-GAMMA", "asset_name": "Admin Workstation 09", "criticality": "LOW", "ip_address": "10.2.3.88", "department": "Administration"}
    ]
    
    # AST-ALPHA-DC01 and AST-ALPHA-HIST have ZERO alerts (NS-01: Telemetry void)
    
    alerts = []
    cases = []
    
    alert_counter = 8000
    case_counter = 4000

    # -------------------------------------------------------------------------
    # 3. CSE ALPHA (Gaming KPIs, Multi-Indicator EG-02, IR-01 Candidate Incident)
    # -------------------------------------------------------------------------
    # A) Candidate Incident Correlation (3 related alerts on AST-ALPHA-GW matching 4 factors)
    gw_incident_alerts = [
        ("Network Reconnaissance", "Port scan detected from remote IP 185.220.101.5", "MEDIUM", "Intrusion / Escalation", base_time + timedelta(hours=1)),
        ("Privilege Escalation", "Unauthorized root privilege granted to account admin_temp", "CRITICAL", "Intrusion / Escalation", base_time + timedelta(hours=2)),
        ("Data Exfiltration Indicator", "Unusual outbound transfer of 4.2GB to external IP", "HIGH", "Exfiltration", base_time + timedelta(hours=3))
    ]
    for title, details, sev, cat, t_stamp in gw_incident_alerts:
        alert_counter += 1
        a_id = f"ALT-ALPHA-{alert_counter}"
        alerts.append({
            "alert_id": a_id,
            "entity_id": "CSE-ALPHA",
            "asset_id": "AST-ALPHA-GW",
            "user_id": "admin_temp",
            "timestamp": t_stamp.isoformat(),
            "severity": sev,
            "category": cat,
            "title": title,
            "raw_details": details
        })
        case_counter += 1
        # GW cases: Closed in 3 mins with generic notes & no escalation -> EG-02 Premature Closure!
        cases.append({
            "case_id": f"CAS-ALPHA-{case_counter}",
            "alert_ids": [a_id],
            "entity_id": "CSE-ALPHA",
            "analyst_id": "ANL-902",
            "created_at": (t_stamp + timedelta(seconds=10)).isoformat(),
            "closed_at": (t_stamp + timedelta(seconds=190)).isoformat(), # 3 mins
            "resolution_status": "Closed - Resolved",
            "investigation_notes": "Reviewed alert.", # Weak < 45 chars & generic note!
            "escalation_flag": False,
            "escalation_timestamp": None
        })

    # B) 11 Repeated Malware Alerts on AST-ALPHA-SCADA
    for i in range(11):
        alert_counter += 1
        a_id = f"ALT-ALPHA-{alert_counter}"
        t_stamp = base_time + timedelta(hours=4 + i * 2)
        alerts.append({
            "alert_id": a_id,
            "entity_id": "CSE-ALPHA",
            "asset_id": "AST-ALPHA-SCADA",
            "user_id": "op_scada",
            "timestamp": t_stamp.isoformat(),
            "severity": "HIGH",
            "category": "Malware Activity",
            "title": "Repeated Trojan.Win32 Malware Execution Signature",
            "raw_details": f"Signature match in C:\\SCADA\\temp\\loader_{i}.exe"
        })
        case_counter += 1
        is_unescalated = i < 3
        cases.append({
            "case_id": f"CAS-ALPHA-{case_counter}",
            "alert_ids": [a_id],
            "entity_id": "CSE-ALPHA",
            "analyst_id": "ANL-903",
            "created_at": (t_stamp + timedelta(seconds=15)).isoformat(),
            "closed_at": (t_stamp + timedelta(seconds=210)).isoformat(),
            "resolution_status": "Closed - False Positive",
            "investigation_notes": "File quarantined by antivirus. False positive marked." if not is_unescalated else "Quick check.",
            "escalation_flag": not is_unescalated,
            "escalation_timestamp": (t_stamp + timedelta(seconds=120)).isoformat() if not is_unescalated else None
        })

    # C) 11 Additional Escalated High/Critical Alerts for Alpha
    for i in range(11):
        alert_counter += 1
        a_id = f"ALT-ALPHA-{alert_counter}"
        t_stamp = base_time + timedelta(hours=30 + i * 2)
        alerts.append({
            "alert_id": a_id,
            "entity_id": "CSE-ALPHA",
            "asset_id": "AST-ALPHA-WS01",
            "user_id": "eng_user",
            "timestamp": t_stamp.isoformat(),
            "severity": "CRITICAL" if i % 2 == 0 else "HIGH",
            "category": "Policy Violation",
            "title": f"Unauthorized Software Execution #{i+1}",
            "raw_details": "Execution of unsigned binary detected."
        })
        case_counter += 1
        cases.append({
            "case_id": f"CAS-ALPHA-{case_counter}",
            "alert_ids": [a_id],
            "entity_id": "CSE-ALPHA",
            "analyst_id": "ANL-902",
            "created_at": (t_stamp + timedelta(seconds=20)).isoformat(),
            "closed_at": (t_stamp + timedelta(seconds=248)).isoformat(),
            "resolution_status": "Closed - Escalated to SOC Lead",
            "investigation_notes": "Escalated for policy review.",
            "escalation_flag": True,
            "escalation_timestamp": (t_stamp + timedelta(seconds=100)).isoformat()
        })

    # -------------------------------------------------------------------------
    # 4. CSE BETA (Disciplined Entity: Fast closure with STRONG investigation + escalation)
    # -------------------------------------------------------------------------
    for i in range(25):
        alert_counter += 1
        a_id = f"ALT-BETA-{alert_counter}"
        t_stamp = base_time + timedelta(hours=1 + i * 2)
        asset_id = "AST-BETA-DC01" if i % 2 == 0 else ("AST-BETA-EMS" if i < 22 else "AST-BETA-WS04")
        
        alerts.append({
            "alert_id": a_id,
            "entity_id": "CSE-BETA",
            "asset_id": asset_id,
            "user_id": f"user_beta_{i}",
            "timestamp": t_stamp.isoformat(),
            "severity": "CRITICAL" if i < 10 else "HIGH",
            "category": "Authentication Anomaly" if i % 2 == 0 else "System Integrity",
            "title": f"Suspicious Activity Logged #{i+1}",
            "raw_details": f"Detailed forensic telemetry capture for asset {asset_id}"
        })
        
        case_counter += 1
        is_unescalated = (i == 0)
        
        # Test case: Case i=1 is closed in 2 minutes (120s), BUT has thorough notes (>60 chars) AND is correctly escalated!
        is_fast_well_handled = (i == 1)
        duration_mins = 2.0 if is_fast_well_handled else 14.2
        
        cases.append({
            "case_id": f"CAS-BETA-{case_counter}",
            "alert_ids": [a_id],
            "entity_id": "CSE-BETA",
            "analyst_id": "ANL-401" if i % 2 == 0 else "ANL-402",
            "created_at": (t_stamp + timedelta(seconds=30)).isoformat(),
            "closed_at": (t_stamp + timedelta(minutes=duration_mins)).isoformat(),
            "resolution_status": "Closed - Resolved" if is_unescalated else "Closed - Escalated to Incident Response",
            "investigation_notes": (
                "Verified automated threat response playbook trigger. Host isolated automatically by EDR policy. "
                "SOC Tier 2 lead notified immediately for secondary containment review."
            ) if is_fast_well_handled else (
                f"Full forensic review completed by analyst. Isolated host {asset_id}. "
                f"Cross-checked firewall telemetry and logged evidence."
            ),
            "escalation_flag": not is_unescalated,
            "escalation_timestamp": (t_stamp + timedelta(seconds=45)).isoformat() if not is_unescalated else None
        })

    # -------------------------------------------------------------------------
    # 5. CSE GAMMA (Template-Driven Repetitive Notes: 8% unescalated, 9 template cluster cases)
    # -------------------------------------------------------------------------
    template_note = "Alert investigated per SOP-402. No abnormal activity identified. Closing case per standard operational procedures."
    
    for i in range(25):
        alert_counter += 1
        a_id = f"ALT-GAMMA-{alert_counter}"
        t_stamp = base_time + timedelta(hours=2 + i * 2)
        
        alerts.append({
            "alert_id": a_id,
            "entity_id": "CSE-GAMMA",
            "asset_id": "AST-GAMMA-MON" if i % 2 == 0 else "AST-GAMMA-DC01",
            "user_id": "op_gamma",
            "timestamp": t_stamp.isoformat(),
            "severity": "CRITICAL" if i < 8 else "HIGH",
            "category": "Audit Discrepancy",
            "title": f"Reactor Monitoring Log Discrepancy #{i+1}",
            "raw_details": "Event correlation mismatch detected in reactor telemetry."
        })
        
        case_counter += 1
        is_unescalated = (i in [0, 1])
        is_template = (i < 9)
        
        cases.append({
            "case_id": f"CAS-GAMMA-{case_counter}",
            "alert_ids": [a_id],
            "entity_id": "CSE-GAMMA",
            "analyst_id": "ANL-777" if is_template else "ANL-778",
            "created_at": (t_stamp + timedelta(seconds=15)).isoformat(),
            "closed_at": (t_stamp + timedelta(seconds=252)).isoformat(),
            "resolution_status": "Closed - Resolved",
            "investigation_notes": template_note if is_template else "Individual manual review completed for reactor log.",
            "escalation_flag": not is_unescalated,
            "escalation_timestamp": (t_stamp + timedelta(seconds=120)).isoformat() if not is_unescalated else None
        })

    # Save to JSON files
    with open(os.path.join(DATA_DIR, "entities.json"), "w") as f:
        json.dump(entities, f, indent=2)
        
    with open(os.path.join(DATA_DIR, "assets.json"), "w") as f:
        json.dump(assets, f, indent=2)
        
    with open(os.path.join(DATA_DIR, "alerts.json"), "w") as f:
        json.dump(alerts, f, indent=2)
        
    with open(os.path.join(DATA_DIR, "cases.json"), "w") as f:
        json.dump(cases, f, indent=2)
        
    print(f"Synthetic data generated successfully in {DATA_DIR}:")
    print(f"  Entities: {len(entities)}")
    print(f"  Assets: {len(assets)}")
    print(f"  Alerts: {len(alerts)}")
    print(f"  Cases: {len(cases)}")

if __name__ == "__main__":
    generate_synthetic_data()
