"""
Inference and Prediction service for Multi-Disease diagnosis.
"""
import joblib
import pandas as pd
import numpy as np
from src.config import SAVED_MODELS_DIR, RISK_LOW_MAX, RISK_MODERATE_MAX
from src.explainability import explain_patient_prediction

def load_disease_model(disease_name: str, model_type: str = "champion"):
    """
    Loads serialized model pipeline from disk.
    Args:
        disease_name: 'heart_disease', 'diabetes', or 'breast_cancer'
        model_type: 'champion', 'Logistic_Regression', 'SVM', 'Random_Forest', 'XGBoost'
    """
    clean_disease = disease_name.lower().replace(" ", "_")
    filename = f"{clean_disease}_{model_type}.joblib"
    model_path = SAVED_MODELS_DIR / filename
    
    if not model_path.exists():
        # Fallback to champion
        model_path = SAVED_MODELS_DIR / f"{clean_disease}_champion.joblib"
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {filename} in {SAVED_MODELS_DIR}")
            
    return joblib.load(model_path)

def predict_patient_risk(disease_name: str, patient_data: dict, model_type: str = "champion"):
    """
    Performs inference for a single patient record.
    Returns:
        dict: prediction, probability, risk_level, badge_color, top_factors
    """
    pipeline = load_disease_model(disease_name, model_type)
    patient_df = pd.DataFrame([patient_data])

    # Predict
    pred_class = int(pipeline.predict(patient_df)[0])
    
    if hasattr(pipeline, "predict_proba"):
        prob = float(pipeline.predict_proba(patient_df)[0][1])
    else:
        prob = float(pred_class)

    # Determine Risk Tier
    if prob < RISK_LOW_MAX:
        risk_level = "Low Risk"
        badge_color = "green"
        recommendation = "Standard periodic wellness screening recommended. Maintain current healthy lifestyle."
    elif prob <= RISK_MODERATE_MAX:
        risk_level = "Moderate Risk (Borderline)"
        badge_color = "orange"
        recommendation = "Follow-up consultation advised within 30-60 days. Monitor key biomarkers closely."
    else:
        risk_level = "High Risk (Clinical Review Required)"
        badge_color = "red"
        recommendation = "Immediate clinical follow-up and formal diagnostic testing strongly recommended."

    # Explainability
    factors = explain_patient_prediction(pipeline, patient_df, top_k=4)

    return {
        "disease": disease_name,
        "model_used": model_type,
        "prediction": pred_class,
        "predicted_label": "Positive / Indicated" if pred_class == 1 else "Negative / Not Indicated",
        "probability": round(prob * 100, 2),
        "risk_level": risk_level,
        "badge_color": badge_color,
        "recommendation": recommendation,
        "top_contributing_factors": factors
    }
