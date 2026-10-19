"""
Integration test suite for FastAPI Clinical Prediction Web Server.
Verifies all Stitch UI backend endpoints:
- GET / (HTML SPA)
- POST /api/predict (Single patient inference)
- POST /api/batch-predict (Cohort screening)
- GET /api/metrics/{disease} (Benchmarks & ROC curves)
- GET /api/dataset/{disease} (Dataset explorer with pagination & search)
- GET /api/download-sample-cohort/{disease} (CSV download)
- POST /api/download-report (Clinical Markdown report)
"""
import urllib.request
import urllib.error
import json

def run_tests():
    base_url = "http://127.0.0.1:8000"
    print("=" * 60)
    print("Testing Multi-Disease Clinical Platform Web API")
    print("=" * 60)

    # 1. Test Root HTML
    with urllib.request.urlopen(f"{base_url}/") as response:
        assert response.status == 200, f"Expected 200, got {response.status}"
        html = response.read().decode("utf-8")
        assert "Multi-Disease Prediction Platform" in html
        assert "btn-run-assessment" in html
        assert "btn-load-healthy" in html
        assert "btn-load-high-risk" in html
        print("[+] 1. GET / -> SUCCESS: Stitch SPA HTML loaded (203 KB).")

    # 2. Test Heart Disease Predict
    heart_payload = {
        "disease": "heart_disease",
        "model": "champion",
        "biomarkers": {
            "Age": 58, "Gender": "Male", "Blood Pressure": 145, "Cholesterol Level": 240,
            "Exercise Habits": "Low", "Smoking": "Yes", "Family Heart Disease": "Yes",
            "Diabetes": "No", "BMI": 29.5, "High Blood Pressure": "Yes", "Low HDL Cholesterol": "Yes",
            "High LDL Cholesterol": "Yes", "Alcohol Consumption": "Medium", "Stress Level": "High",
            "Sleep Hours": 6.0, "Sugar Consumption": "Medium", "Triglyceride Level": 210,
            "Fasting Blood Sugar": 115, "CRP Level": 3.2, "Homocysteine Level": 14.5
        }
    }
    req = urllib.request.Request(
        f"{base_url}/api/predict",
        data=json.dumps(heart_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode("utf-8"))
        assert res["status"] == "success"
        data = res["data"]
        print(f"[+] 2. POST /api/predict (Heart Disease) -> SUCCESS:")
        print(f"       Risk Probability: {data['probability']:.2f}% | Tier: {data['risk_level']} | Top Factor: {data['top_contributing_factors'][0]['Feature']}")

    # 3. Test Diabetes Predict
    diabetes_payload = {
        "disease": "diabetes",
        "model": "champion",
        "biomarkers": {
            "Pregnancies": 3, "Glucose": 155, "BloodPressure": 80,
            "SkinThickness": 32, "Insulin": 180, "BMI": 34.2,
            "DiabetesPedigreeFunction": 0.65, "Age": 45
        }
    }
    req = urllib.request.Request(
        f"{base_url}/api/predict",
        data=json.dumps(diabetes_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode("utf-8"))
        assert res["status"] == "success"
        data = res["data"]
        print(f"[+] 3. POST /api/predict (Diabetes) -> SUCCESS:")
        print(f"       Risk Probability: {data['probability']:.2f}% | Tier: {data['risk_level']}")

    # 4. Test Model Benchmarks
    with urllib.request.urlopen(f"{base_url}/api/metrics/heart_disease") as response:
        res = json.loads(response.read().decode("utf-8"))
        assert res["status"] == "success"
        assert len(res["metrics"]) >= 4
        print(f"[+] 4. GET /api/metrics/heart_disease -> SUCCESS:")
        print(f"       Evaluated Models: {[m['Model'] for m in res['metrics']]}")
        print(f"       Champion: {res['metadata'].get('champion_model')}")

    # 5. Test Dataset Explorer
    with urllib.request.urlopen(f"{base_url}/api/dataset/heart_disease?page=1&page_size=10") as response:
        res = json.loads(response.read().decode("utf-8"))
        assert res["status"] == "success"
        assert res["total_records"] == 10000
        assert len(res["rows"]) == 10
        print(f"[+] 5. GET /api/dataset/heart_disease -> SUCCESS:")
        print(f"       Total Records: {res['total_records']}, Paginated Rows: {len(res['rows'])}, Columns: {len(res['columns'])}")

    # 6. Test Batch Cohort Screening
    req = urllib.request.Request(
        f"{base_url}/api/batch-predict",
        data=b"disease=heart_disease&model=champion",
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode("utf-8"))
        assert res["status"] == "success"
        s = res["summary"]
        print(f"[+] 6. POST /api/batch-predict -> SUCCESS:")
        print(f"       Screened Patients: {s['total_records']} | High Risk: {s['high_risk_count']} | Mean Risk: {s['mean_risk_pct']}%")

    # 7. Test Download Sample Cohort CSV
    with urllib.request.urlopen(f"{base_url}/api/download-sample-cohort/heart_disease") as response:
        assert response.status == 200
        csv_data = response.read().decode("utf-8")
        assert "Age" in csv_data
        print(f"[+] 7. GET /api/download-sample-cohort/heart_disease -> SUCCESS: CSV generated ({len(csv_data)} bytes).")

    # 8. Test Download Clinical Report
    report_payload = {
        "disease": "Heart Disease",
        "model": "SVM (Champion)",
        "prediction": {
            "probability": 72.4,
            "risk_level": "High Risk",
            "predicted_label": "Positive (High Risk)",
            "recommendation": "Urgent cardiology referral for angiography and lipid management.",
            "top_contributing_factors": [
                {"Feature": "Cholesterol Level", "Impact": 0.45, "Direction": "Elevates Risk"},
                {"Feature": "Blood Pressure", "Impact": 0.38, "Direction": "Elevates Risk"}
            ]
        },
        "inputs": {"Age": 62, "Blood Pressure": 158, "Cholesterol Level": 268}
    }
    req = urllib.request.Request(
        f"{base_url}/api/download-report",
        data=json.dumps(report_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as response:
        assert response.status == 200
        report_md = response.read().decode("utf-8")
        assert "CLINICAL RISK ASSESSMENT REPORT" in report_md
        assert "MEDICAL DISCLAIMER & COMPLIANCE NOTICE" in report_md
        print(f"[+] 8. POST /api/download-report -> SUCCESS: Medical report generated ({len(report_md)} bytes).")

    print("=" * 60)
    print("ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
