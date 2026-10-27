import urllib.request
import json

base = "http://127.0.0.1:8000"
endpoints = [
    "/health",
    "/",
    "/api/merchants/",
    "/api/merchants/PAYTM_M_1001",
    "/api/demand/forecast/PAYTM_M_1001",
    "/api/inventory/recommendations/PAYTM_M_1001",
    "/api/retention/insights/PAYTM_M_1001",
    "/api/cashflow/projection/PAYTM_M_1001",
    "/api/scorer/credit-health/PAYTM_M_1001",
    "/api/competitor/radar/PAYTM_M_1001",
    "/api/actions/pending/PAYTM_M_1001"
]

print("=== VERIFYING DUKAANSAATHI AI HTTP ENDPOINTS ===")
success = 0
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            status = resp.status
            print(f"[PASS] {status} : {ep} (size: {len(data)} bytes)")
            success += 1
    except Exception as e:
        print(f"[FAIL] {ep} : {str(e)}")

# Test Voice Copilot POST
try:
    copilot_url = base + "/api/copilot/query"
    payload = json.dumps({"merchant_id": "PAYTM_M_1001", "text_query": "Bhaiya, aaj kya bikega?"}).encode("utf-8")
    req = urllib.request.Request(copilot_url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"[PASS] 200 : /api/copilot/query -> Intent: {data.get('detected_intent')}")
        success += 1
except Exception as e:
    print(f"[FAIL] /api/copilot/query : {str(e)}")

# Test Shelf Scanner POST
try:
    shelf_url = base + "/api/inventory/scan-shelf?merchant_id=PAYTM_M_1001"
    req = urllib.request.Request(shelf_url, data=b"", headers={"Content-Type": "multipart/form-data; boundary=boundary"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"[PASS] 200 : /api/inventory/scan-shelf -> Fullness: {data.get('shelf_fullness_pct')}%")
        success += 1
except Exception as e:
    print(f"[FAIL] /api/inventory/scan-shelf : {str(e)}")

print(f"\nResult: {success} / {len(endpoints) + 2} endpoints verified successfully!")
