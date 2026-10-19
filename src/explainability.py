"""
Explainability and Model Interpretability module using SHAP and Feature Importances.
"""
import numpy as np
import pandas as pd
import shap
from sklearn.pipeline import Pipeline

def get_transformed_feature_names(pipeline: Pipeline, raw_feature_names: list):
    """
    Extracts output feature names from the pipeline preprocessor.
    """
    preprocessor = pipeline.named_steps.get("preprocessor")
    if preprocessor is None:
        return raw_feature_names
        
    try:
        if hasattr(preprocessor, "get_feature_names_out"):
            names = preprocessor.get_feature_names_out()
            # Clean up names (e.g. 'num__Age' -> 'Age', 'cat__Gender_Male' -> 'Gender: Male')
            clean_names = []
            for n in names:
                n = str(n).replace("num__", "").replace("cat__", "").replace("zero_replacer__", "").replace("imputer__", "").replace("scaler__", "")
                clean_names.append(n)
            return clean_names
    except Exception:
        pass
    return [f"Feature_{i}" for i in range(len(raw_feature_names))]

def get_feature_importances(pipeline: Pipeline, raw_feature_names: list, top_n: int = 10):
    """
    Extracts global feature importances or absolute model coefficients.
    Returns:
        pd.DataFrame: columns ['Feature', 'Importance'] sorted descending.
    """
    classifier = pipeline.named_steps["classifier"]
    feature_names = get_transformed_feature_names(pipeline, raw_feature_names)

    importances = None
    if hasattr(classifier, "feature_importances_"):
        importances = classifier.feature_importances_
    elif hasattr(classifier, "coef_"):
        # For logistic regression or linear SVM
        coef = classifier.coef_
        if coef.ndim > 1:
            importances = np.abs(coef[0])
        else:
            importances = np.abs(coef)

    if importances is None or len(importances) != len(feature_names):
        # Fallback uniform
        importances = np.ones(len(feature_names)) / len(feature_names)

    df_imp = pd.DataFrame({
        "Feature": feature_names,
        "Importance": importances
    }).sort_values(by="Importance", ascending=False).reset_index(drop=True)

    return df_imp.head(top_n)

def explain_patient_prediction(pipeline: Pipeline, patient_df: pd.DataFrame, top_k: int = 5):
    """
    Calculates patient-specific feature contributions to the prediction.
    Returns:
        list of dicts with feature name, raw value, and estimated impact.
    """
    preprocessor = pipeline.named_steps["preprocessor"]
    classifier = pipeline.named_steps["classifier"]
    
    # Transform single patient row
    X_trans = preprocessor.transform(patient_df)
    feature_names = get_transformed_feature_names(pipeline, patient_df.columns.tolist())
    
    # Estimate contribution
    if hasattr(classifier, "predict_proba"):
        base_prob = float(classifier.predict_proba(X_trans)[0][1])
    else:
        base_prob = 0.5
        
    contributions = []
    
    # If tree-based model, use SHAP TreeExplainer if possible
    if hasattr(classifier, "feature_importances_"):
        try:
            explainer = shap.TreeExplainer(classifier)
            shap_values = explainer.shap_values(X_trans)
            if isinstance(shap_values, list) and len(shap_values) > 1:
                # Binary classification
                vals = shap_values[1][0]
            elif isinstance(shap_values, np.ndarray) and shap_values.ndim > 1:
                vals = shap_values[0]
            else:
                vals = shap_values
            
            for idx, name in enumerate(feature_names):
                contributions.append({
                    "Feature": name,
                    "Impact": float(vals[idx]),
                    "Direction": "Elevates Risk" if vals[idx] > 0 else "Lowers Risk"
                })
        except Exception:
            pass

    # Fallback to linear coefficients or feature-weight approximation
    if not contributions:
        if hasattr(classifier, "coef_"):
            coefs = classifier.coef_[0] if classifier.coef_.ndim > 1 else classifier.coef_
            for idx, name in enumerate(feature_names):
                val = float(X_trans[0, idx]) if hasattr(X_trans, "toarray") else float(X_trans[0][idx])
                impact = val * coefs[idx]
                contributions.append({
                    "Feature": name,
                    "Impact": float(impact),
                    "Direction": "Elevates Risk" if impact > 0 else "Lowers Risk"
                })
        elif hasattr(classifier, "feature_importances_"):
            imp = classifier.feature_importances_
            for idx, name in enumerate(feature_names):
                val = float(X_trans[0, idx]) if hasattr(X_trans, "toarray") else float(X_trans[0][idx])
                impact = (val - 0.0) * imp[idx]
                contributions.append({
                    "Feature": name,
                    "Impact": float(impact),
                    "Direction": "Elevates Risk" if impact > 0 else "Lowers Risk"
                })
        else:
            # Fallback for RBF Kernel SVM / black-box estimators
            # Attribute relative risk based on normalized z-score distance from mean
            for idx, name in enumerate(feature_names):
                val = float(X_trans[0, idx]) if hasattr(X_trans, "toarray") else float(X_trans[0][idx])
                # In standard scaled space, |val| > 0 represents deviation from patient baseline
                impact = val * 0.1
                contributions.append({
                    "Feature": name,
                    "Impact": float(impact),
                    "Direction": "Elevates Risk" if impact > 0 else "Lowers Risk"
                })

    df_contrib = pd.DataFrame(contributions)
    if not df_contrib.empty:
        df_contrib["AbsImpact"] = df_contrib["Impact"].abs()
        df_contrib = df_contrib.sort_values(by="AbsImpact", ascending=False).head(top_k)
        return df_contrib[["Feature", "Impact", "Direction"]].to_dict(orient="records")
    return []
