"""
ARGUS — SOC Behavioural Assurance Engine
OPTIONAL Developer Bootstrap Utility

PURPOSE:
  This script is NOT part of normal ARGUS operation.
  It is a ONE-TIME setup tool for fetching the required JavaScript/CSS vendor
  assets when deploying ARGUS to a new machine that currently has Internet access.

  After running this script, ARGUS will run fully offline / air-gapped.

USAGE:
  python backend/vendor_assets.py

  Run this ONCE on a machine with Internet access.
  The downloaded files in frontend/vendor/ should then be transferred
  to the target air-gapped machine as part of the ARGUS project package.

DO NOT call this script from run_demo.py or any runtime code.
"""

import os
import urllib.request

VENDOR_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "vendor"))
os.makedirs(VENDOR_DIR, exist_ok=True)

ASSETS = {
    "react.production.min.js": "https://unpkg.com/react@18/umd/react.production.min.js",
    "react-dom.production.min.js": "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
    "babel.min.js": "https://unpkg.com/@babel/standalone/babel.min.js",
    "tailwind.min.css": "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
}


def download_vendor_assets():
    print(f"[OPTIONAL SETUP] Fetching vendor assets into {VENDOR_DIR}...")
    for filename, url in ASSETS.items():
        filepath = os.path.join(VENDOR_DIR, filename)
        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            print(f"  Downloading {filename} ...")
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req) as response, open(filepath, "wb") as out_file:
                    out_file.write(response.read())
                print(f"  Saved {filename} ({os.path.getsize(filepath):,} bytes)")
            except Exception as e:
                print(f"  ERROR downloading {filename}: {e}")
        else:
            print(f"  Already present: {filename} ({os.path.getsize(filepath):,} bytes) — skipped.")
    print("\n[OPTIONAL SETUP] Done. ARGUS can now be started offline with: python run_demo.py")


if __name__ == "__main__":
    download_vendor_assets()
