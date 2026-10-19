"""
Unit tests for single-patient predictor and risk scoring.
"""
import pytest
from src.predictor import predict_patient_risk

def test_heart_disease_prediction():
    patient = {
        "Age": 55.0,
        "Gender": "Male",
        "Blood Pressure": 140.0,
        "Cholesterol Level": 220.0,
        "Exercise Habits": "Medium",
        "Smoking": "No",
        "Family Heart Disease": "No",
        "Diabetes": "No",
        "BMI": 27.5,
        "High Blood Pressure": "No",
        "Low HDL Cholesterol": "No",
        "High LDL Cholesterol": "No",
        "Alcohol Consumption": "Low",
        "Stress Level": "Medium",
        "Sleep Hours": 7.0,
        "Sugar Consumption": "Medium",
        "Triglyceride Level": 150.0,
        "Fasting Blood Sugar": 95.0,
        "CRP Level": 1.5,
        "Homocysteine Level": 10.0
    }
    res = predict_patient_risk("heart_disease", patient, model_type="champion")
    assert "prediction" in res
    assert 0.0 <= res["probability"] <= 100.0
    assert res["risk_level"] in ["Low Risk", "Moderate Risk (Borderline)", "High Risk (Clinical Review Required)"]

def test_diabetes_prediction():
    patient = {
        "Pregnancies": 2,
        "Glucose": 120.0,
        "BloodPressure": 75.0,
        "SkinThickness": 25.0,
        "Insulin": 90.0,
        "BMI": 26.0,
        "DiabetesPedigreeFunction": 0.40,
        "Age": 35
    }
    res = predict_patient_risk("diabetes", patient, model_type="champion")
    assert "prediction" in res
    assert 0.0 <= res["probability"] <= 100.0
    assert res["predicted_label"] in ["Positive / Indicated", "Negative / Not Indicated"]

def test_breast_cancer_prediction():
    # Healthy / benign profile
    patient = {
        "mean radius": 11.5,
        "mean texture": 14.2,
        "mean perimeter": 73.0,
        "mean area": 405.0,
        "mean smoothness": 0.085,
        "mean compactness": 0.060,
        "mean concavity": 0.020,
        "mean concave points": 0.015,
        "mean symmetry": 0.170,
        "mean fractal dimension": 0.058,
        "radius error": 0.32,
        "texture error": 1.05,
        "perimeter error": 2.2,
        "area error": 24.5,
        "smoothness error": 0.006,
        "compactness error": 0.018,
        "concavity error": 0.015,
        "concave points error": 0.008,
        "symmetry error": 0.016,
        "fractal dimension error": 0.0028,
        "worst radius": 12.8,
        "worst texture": 18.5,
        "worst perimeter": 82.0,
        "worst area": 500.0,
        "worst smoothness": 0.115,
        "worst compactness": 0.120,
        "worst concavity": 0.065,
        "worst concave points": 0.045,
        "worst symmetry": 0.230,
        "worst fractal dimension": 0.072
    }
    res = predict_patient_risk("breast_cancer", patient, model_type="champion")
    assert "prediction" in res
    assert 0.0 <= res["probability"] <= 100.0
