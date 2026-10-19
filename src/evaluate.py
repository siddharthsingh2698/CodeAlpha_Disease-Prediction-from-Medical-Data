"""
Evaluation metrics and performance benchmarking for classification models.
"""
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)

def evaluate_model(model, X_test, y_test, model_name: str = "Model"):
    """
    Computes comprehensive diagnostic performance metrics.
    Returns:
        dict: metric scores and confusion matrix.
    """
    y_pred = model.predict(X_test)
    
    # Check if model supports predict_proba
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X_test)[:, 1]
    elif hasattr(model, "decision_function"):
        # Scale decision function to 0-1
        df = model.decision_function(X_test)
        y_proba = 1 / (1 + np.exp(-df))
    else:
        y_proba = y_pred

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    try:
        auc = roc_auc_score(y_test, y_proba)
    except Exception:
        auc = 0.5
        
    cm = confusion_matrix(y_test, y_pred)
    # cm: [[TN, FP], [FN, TP]]
    tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0

    return {
        "Model": model_name,
        "Accuracy": round(float(acc), 4),
        "Precision": round(float(prec), 4),
        "Recall": round(float(rec), 4),
        "Specificity": round(float(specificity), 4),
        "F1-Score": round(float(f1), 4),
        "ROC-AUC": round(float(auc), 4),
        "Confusion_Matrix": cm.tolist()
    }
