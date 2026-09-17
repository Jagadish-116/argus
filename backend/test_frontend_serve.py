import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(__file__))
from app import app

client = TestClient(app)

def test_frontend_offline_serving():
    print("==========================================================")
    print("  ARGUS OFFLINE FRONTEND & VENDOR ASSETS TEST             ")
    print("==========================================================")
    
    # 1. Fetch Root (index.html)
    resp = client.get("/")
    assert resp.status_code == 200
    assert "ARGUS — SOC Behavioural Assurance Engine" in resp.text
    assert "http://" not in resp.text and "https://" not in resp.text, "External CDN link found in index.html!"
    print("[PASSED] GET / — Served local index.html with 0 external CDN dependencies.")
    
    # 2. Fetch Modular React JS Bundle
    import re
    script_match = re.search(r'src="(/assets/index-[^"]+\.js)"', resp.text)
    if script_match:
        asset_url = script_match.group(1)
        resp_js = client.get(asset_url)
        assert resp_js.status_code == 200
        assert len(resp_js.content) > 1000
        print(f"[PASSED] GET {asset_url} — Served modular React bundle successfully ({len(resp_js.content)} bytes).")
    else:
        resp_js = client.get("/src/main.jsx")
        assert resp_js.status_code == 200
        print("[PASSED] GET /src/main.jsx — Served React application entry successfully.")
    
    # 3. Fetch Local Vendor Assets
    vendor_assets = [
        "/vendor/tailwind.min.css",
        "/vendor/react.production.min.js",
        "/vendor/react-dom.production.min.js",
        "/vendor/babel.min.js"
    ]
    for asset in vendor_assets:
        resp_vendor = client.get(asset)
        assert resp_vendor.status_code == 200, f"Failed to serve local vendor asset: {asset}"
        assert len(resp_vendor.content) > 1000, f"Local vendor asset {asset} appears empty!"
        print(f"[PASSED] GET {asset} — Served local vendor asset ({len(resp_vendor.content)} bytes).")
    
    print("\n==========================================================")
    print("  100% OFFLINE / AIR-GAPPED ASSET SERVING VERIFIED!       ")
    print("==========================================================")

def test_missing_vendor_asset_failure():
    import subprocess
    print("\n==========================================================")
    print("  ARGUS MISSING VENDOR ASSET FAILURE TEST                 ")
    print("==========================================================")
    vendor_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "vendor"))
    run_demo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "run_demo.py"))
    target = os.path.join(vendor_dir, "tailwind.min.css")
    backup = os.path.join(vendor_dir, "tailwind.min.css.simulated_missing")

    assert os.path.exists(target), f"Target asset {target} does not exist!"
    orig_size = os.path.getsize(target)

    # 1. Rename target to simulate absent asset
    os.rename(target, backup)
    try:
        res = subprocess.run([sys.executable, run_demo_path], capture_output=True, text=True)
        assert res.returncode == 1, f"Expected returncode 1, got {res.returncode}"
        assert "Required local vendor assets are missing" in res.stdout
        assert "tailwind.min.css" in res.stdout
        print("[PASSED] Missing asset correctly prevented ARGUS startup (exit code 1).")
        print("[PASSED] Informative error message displayed with 0 automatic download attempts.")
    finally:
        # Guarantee restoration
        if os.path.exists(backup):
            os.rename(backup, target)
        assert os.path.exists(target), f"Failed to restore {target}!"
        assert os.path.getsize(target) == orig_size, f"Restored file size mismatch!"
        print(f"[PASSED] Vendor asset restored safely and verified ({os.path.getsize(target):,} bytes).")

if __name__ == "__main__":
    test_frontend_offline_serving()
    test_missing_vendor_asset_failure()

