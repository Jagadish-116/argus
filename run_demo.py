#!/usr/bin/env python3
"""
ARGUS — SOC Behavioural Assurance Engine
Single Local Application Launcher (100% Offline / Air-Gapped)

Normal startup: python run_demo.py
Optional one-time asset setup (requires Internet): python backend/vendor_assets.py
"""

import sys
import os
import uvicorn

# ---------------------------------------------------------------------------
# Ensure backend directory is in Python path
# ---------------------------------------------------------------------------
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
vendor_dir = os.path.join(frontend_dir, "vendor")
sys.path.insert(0, backend_dir)

REQUIRED_VENDOR_ASSETS = [
    "tailwind.min.css",
    "react.production.min.js",
    "react-dom.production.min.js",
    "babel.min.js",
]


def check_vendor_assets():
    """
    Verify required local vendor assets exist.
    ARGUS never downloads anything at runtime. Assets must ship with the project.
    If any asset is missing, exit with a clear error and no network access.
    """
    missing = []
    for filename in REQUIRED_VENDOR_ASSETS:
        filepath = os.path.join(vendor_dir, filename)
        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            missing.append(filepath)

    if missing:
        print("\n  [ERROR] Required local vendor assets are missing:")
        for path in missing:
            print(f"    MISSING: {path}")
        print()
        print("  ARGUS requires these files to be present in frontend/vendor/")
        print("  to run fully offline without any Internet connection.")
        print()
        print("  If you are setting up ARGUS for the first time on a machine")
        print("  that currently has Internet access, run this ONCE to fetch them:")
        print()
        print("    python backend/vendor_assets.py")
        print()
        print("  After that, ARGUS will start and run fully offline.")
        print("  The vendor_assets.py script is NOT required for normal operation.")
        sys.exit(1)

    print("  All required local vendor assets confirmed present.")


def main():
    from data_generator import generate_synthetic_data

    print("==========================================================")
    print("  ARGUS -- SOC BEHAVIOURAL ASSURANCE ENGINE               ")
    print("  Tagline: Evidence-based supervisory assurance for SOC.  ")
    print("==========================================================")

    print("\n[1/3] Verifying local vendor assets (no Internet access)...")
    check_vendor_assets()

    print("\n[2/3] Checking synthetic dataset...")
    generate_synthetic_data()

    print("\n[3/3] Launching ARGUS Local Engine & Web UI...")
    print("----------------------------------------------------------")
    print("  -> ARGUS Web Application UI: http://127.0.0.1:8000/")
    print("  -> ARGUS Backend API Root:   http://127.0.0.1:8000/api/overview")
    print("  -> OpenAPI Documentation:    http://127.0.0.1:8000/docs")
    print("----------------------------------------------------------")
    print("Press Ctrl+C to terminate application.\n")

    # Change working directory to backend so uvicorn imports resolve cleanly
    os.chdir(backend_dir)
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=False)


if __name__ == "__main__":
    main()
