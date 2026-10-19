"""
Unit tests for Report Generator component (Phase 6).
"""
import pytest
from app.components.report_generator import generate_patient_report_markdown

def test_generate_patient_report_markdown():
    res = {
        "predicted_label": "Positive / Indicated",
        "probability": 78.45,
        "risk_level": "High Risk (Clinical Review Required)",
        "recommendation": "Immediate clinical follow-up strongly recommended.",
        "top_contributing_factors": [
            {"Feature": "Glucose", "Impact": 0.42, "Direction": "Elevates Risk"},
            {"Feature": "BMI", "Impact": 0.18, "Direction": "Elevates Risk"}
        ]
    }
    inputs = {
        "Glucose": 160.0,
        "BMI": 33.5,
        "Age": 48
    }

    report = generate_patient_report_markdown("Diabetes", "XGBoost", res, inputs)
    assert isinstance(report, str)
    assert "# CLINICAL RISK ASSESSMENT REPORT" in report
    assert "DIABETES" in report
    assert "78.45%" in report
    assert "High Risk" in report
    assert "Glucose" in report
    assert "MEDICAL DISCLAIMER" in report
