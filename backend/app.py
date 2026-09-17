from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import sys

# Ensure backend root is in import path
sys.path.append(os.path.dirname(__file__))

from engine import ArgusEngine

app = FastAPI(
    title="ARGUS — SOC Behavioural Assurance Engine API",
    description="Evidence-based supervisory assurance API for SOC operations.",
    version="1.0.0"
)

# Enable CORS for local dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global engine instance initialized with data
engine = ArgusEngine()


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "ARGUS — SOC Behavioural Assurance Engine API",
        "version": "1.0.0"
    }


@app.get("/api/overview")
def get_overview():
    """
    Returns calculated supervisory indicators and peer benchmark metrics for all CSEs.
    """
    overview_data = engine.get_supervisory_overview()
    
    # Peer benchmark comparison data
    benchmark_matrix = []
    for ind in overview_data:
        benchmark_matrix.append({
            "entity_id": ind.entity_id,
            "entity_name": ind.entity_name,
            "reported_closure_rate_percent": round(ind.reported_closure_rate * 100, 1),
            "reported_mttr_mins": ind.reported_mttr_mins,
            "unescalated_critical_ratio_percent": round(ind.unescalated_critical_ratio * 100, 1),
            "median_serious_closure_mins": ind.median_serious_closure_mins,
            "repeated_unremediated_count": ind.repeated_unremediated_count,
            "template_cluster_count": ind.template_cluster_count,
            "telemetry_void_asset_count": ind.telemetry_void_asset_count,
            "missing_escalation_concern": ind.missing_escalation_concern,
            "premature_closure_concern": ind.premature_closure_concern,
            "supervisory_summary": ind.supervisory_summary
        })
        
    return {
        "entities": overview_data,
        "peer_benchmark": benchmark_matrix,
        "supervisory_notice": "Indicators genuinely calculated from historical SOC evidence datasets using configured supervisory rules."
    }


@app.get("/api/entity/{entity_id}")
def get_entity_details(entity_id: str = Path(..., description="Entity ID e.g. CSE-ALPHA")):
    """
    Returns detailed findings, gaps, negative spaces, candidate incidents, and prioritised cases for a specific entity.
    """
    findings = engine.get_entity_findings(entity_id)
    if not findings["indicators"]:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found.")
    return findings


@app.get("/api/finding/{finding_id}")
def get_finding_drilldown(finding_id: str = Path(..., description="Finding ID e.g. EG01-CAS-ALPHA-4002 or NS01-AST-ALPHA-DC01")):
    """
    Provides evidence drill-down and traceability details for a specific finding ID.
    """
    finding = engine.get_finding_by_id(finding_id)
    if not finding:
        raise HTTPException(status_code=404, detail=f"Finding ID '{finding_id}' not found.")
    return finding


@app.get("/api/candidate-incident/{incident_id}")
def get_candidate_incident_details(incident_id: str = Path(..., description="Incident ID e.g. IR01-CSE-ALPHA-0")):
    """
    Provides detailed reconstruction view data for a candidate incident correlation.
    """
    incident = engine.get_candidate_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Candidate Incident ID '{incident_id}' not found.")
    return incident


@app.get("/api/assets/{entity_id}")
def get_assets_coverage(entity_id: str = Path(..., description="Entity ID e.g. CSE-ALPHA")):
    """
    Returns asset inventory and monitoring coverage/negative space details for an entity.
    """
    coverage = engine.get_assets_coverage(entity_id)
    if not coverage:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found.")
    return coverage


# Mount vendor directory directly at '/vendor' to ensure offline assets are always available
vendor_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "vendor"))
if os.path.exists(vendor_dir):
    app.mount("/vendor", StaticFiles(directory=vendor_dir), name="vendor")

# Mount static frontend files at root '/' (prioritize built modern React dist)
root_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
frontend_raw = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

if os.path.exists(root_dist) and os.path.exists(os.path.join(root_dist, "index.html")):
    frontend_dir = root_dist
elif os.path.exists(frontend_dist) and os.path.exists(os.path.join(frontend_dist, "index.html")):
    frontend_dir = frontend_dist
else:
    frontend_dir = frontend_raw

if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
