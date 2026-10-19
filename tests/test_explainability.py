"""
Unit tests for Explainability and SHAP Interpretability (Phase 5).
"""
import pytest
import pandas as pd
from pathlib import Path
from src.predictor import load_disease_model
from src.explainability import (
    get_feature_importances, explain_patient_prediction,
    generate_global_shap_plot
)
from src.data_loader import load_diabetes_data
from src.config import BASE_DIR

def test_feature_importances_diabetes():
    pipeline = load_disease_model("diabetes", "champion")
    X, _ = load_diabetes_data()
    imp_df = get_feature_importances(pipeline, X.columns.tolist(), top_n=5)
    assert isinstance(imp_df, pd.DataFrame)
    assert len(imp_df) == 5
    assert "Feature" in imp_df.columns
    assert "Importance" in imp_df.columns
    assert imp_df["Importance"].iloc[0] >= imp_df["Importance"].iloc[-1]

def test_explain_patient_prediction():
    pipeline = load_disease_model("diabetes", "champion")
    patient = pd.DataFrame([{
        "Pregnancies": 3,
        "Glucose": 165.0,
        "BloodPressure": 80.0,
        "SkinThickness": 30.0,
        "Insulin": 150.0,
        "BMI": 32.0,
        "DiabetesPedigreeFunction": 0.65,
        "Age": 45
    }])
    factors = explain_patient_prediction(pipeline, patient, top_k=3)
    assert len(factors) == 3
    for f in factors:
        assert "Feature" in f
        assert "Impact" in f
        assert f["Direction"] in ["Elevates Risk", "Lowers Risk"]

def test_global_shap_plot_generation(tmp_path):
    out_file = tmp_path / "test_shap.png"
    result_path = generate_global_shap_plot("diabetes", "champion", output_path=out_file)
    assert result_path.exists()
    assert result_path.stat().st_size > 1000
