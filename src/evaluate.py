"""
Evaluation metrics, ROC curve visualization, and performance benchmarking for classification models.
"""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix,
    roc_curve, precision_recall_curve
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

def plot_disease_roc_curves(models_dict: dict, X_test, y_test, disease_title: str, output_path: Path):
    """
    Plots overlaid ROC curves for all 4 classification algorithms.
    """
    plt.figure(figsize=(8, 6))
    colors = ["#2563eb", "#d97706", "#16a34a", "#dc2626"]

    for (name, model), color in zip(models_dict.items(), colors):
        if hasattr(model, "predict_proba"):
            y_proba = model.predict_proba(X_test)[:, 1]
        elif hasattr(model, "decision_function"):
            df = model.decision_function(X_test)
            y_proba = 1 / (1 + np.exp(-df))
        else:
            y_proba = model.predict(X_test)
            
        fpr, tpr, _ = roc_curve(y_test, y_proba)
        auc = roc_auc_score(y_test, y_proba)
        clean_name = name.replace("_", " ")
        plt.plot(fpr, tpr, label=f"{clean_name} (AUC = {auc:.3f})", color=color, linewidth=2.0)

    plt.plot([0, 1], [0, 1], "k--", alpha=0.6, label="Chance Level (AUC = 0.500)")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate (1 - Specificity)", fontsize=11, fontweight="semibold")
    plt.ylabel("True Positive Rate (Sensitivity / Recall)", fontsize=11, fontweight="semibold")
    plt.title(f"Receiver Operating Characteristic (ROC) - {disease_title}", fontsize=12, fontweight="bold", pad=12)
    plt.legend(loc="lower right", frameon=True)
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[+] Saved ROC Curve: {output_path.name}")
