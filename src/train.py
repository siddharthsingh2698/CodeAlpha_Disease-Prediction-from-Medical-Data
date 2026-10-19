"""
Phase 4: Advanced Model Training, Hyperparameter Tuning & Cross-Validation Benchmarking.
Tunes Logistic Regression, SVM, Random Forest, and XGBoost across Heart Disease, Diabetes, and Breast Cancer.
"""
import json
import joblib
import warnings
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
warnings.filterwarnings("ignore")
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from src.config import (
    RANDOM_STATE, TEST_SIZE, CV_FOLDS,
    SAVED_MODELS_DIR, METRICS_DIR, BASE_DIR
)
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)
from src.preprocessing import (
    get_heart_preprocessor, get_diabetes_preprocessor, get_breast_cancer_preprocessor
)
from src.evaluate import evaluate_model, plot_disease_roc_curves

FIGURES_DIR = BASE_DIR / "reports" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

def get_tuning_configs():
    """
    Returns base estimators and parameter grids for hyperparameter optimization.
    """
    configs = {
        "Logistic_Regression": {
            "estimator": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE, class_weight="balanced"),
            "params": {
                "classifier__C": [0.1, 1.0, 5.0],
                "classifier__solver": ["lbfgs", "liblinear"]
            }
        },
        "SVM": {
            "estimator": SVC(kernel="rbf", probability=True, random_state=RANDOM_STATE, class_weight="balanced", cache_size=1000, max_iter=3000),
            "params": {
                "classifier__C": [0.5, 1.0, 3.0],
                "classifier__gamma": ["scale", "auto"]
            }
        },
        "Random_Forest": {
            "estimator": RandomForestClassifier(random_state=RANDOM_STATE, class_weight="balanced", n_jobs=-1),
            "params": {
                "classifier__n_estimators": [100, 150],
                "classifier__max_depth": [6, 12, None],
                "classifier__min_samples_split": [2, 5]
            }
        },
        "XGBoost": {
            "estimator": XGBClassifier(random_state=RANDOM_STATE, eval_metric="logloss", n_jobs=-1),
            "params": {
                "classifier__learning_rate": [0.04, 0.08, 0.15],
                "classifier__max_depth": [3, 5],
                "classifier__scale_pos_weight": [1.0, 2.0]
            }
        }
    }
    return configs

def train_and_tune_disease(disease_name: str):
    """
    Executes GridSearchCV hyperparameter tuning across the 4 algorithms for a disease.
    Generates ROC curves, saves champion models, and records benchmark metrics.
    """
    print(f"\n==========================================", flush=True)
    print(f"[>] Phase 4 Tuning: {disease_name.upper()}", flush=True)
    print(f"==========================================", flush=True)

    name_clean = disease_name.lower().replace(" ", "_")
    if "heart" in name_clean:
        X, y = load_heart_disease_data()
        preprocessor = get_heart_preprocessor()
        display_title = "Heart Disease"
    elif "diabetes" in name_clean:
        X, y = load_diabetes_data()
        preprocessor = get_diabetes_preprocessor()
        display_title = "Type-2 Diabetes"
    elif "breast" in name_clean or "cancer" in name_clean:
        X, y = load_breast_cancer_data()
        preprocessor = get_breast_cancer_preprocessor()
        display_title = "Breast Cancer"
    else:
        raise ValueError(f"Unknown disease: {disease_name}")

    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, stratify=y, random_state=RANDOM_STATE
    )

    cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    configs = get_tuning_configs()

    results = []
    best_pipelines = {}
    best_hyperparams = {}

    for algo_name, cfg in configs.items():
        print(f"--> Tuning {algo_name} with 5-Fold Stratified CV...", flush=True)
        base_pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", cfg["estimator"])
        ])

        # Use tuning grid
        grid_search = GridSearchCV(
            base_pipeline,
            param_grid=cfg["params"],
            cv=cv,
            scoring="f1",
            n_jobs=-1,
            refit=True
        )

        # For large datasets (Heart), tune on representative sample to keep optimization fast
        if len(X_train) > 3000 and algo_name == "SVM":
            sample_idx = np.random.RandomState(RANDOM_STATE).choice(len(X_train), size=2000, replace=False)
            grid_search.fit(X_train.iloc[sample_idx], y_train.iloc[sample_idx])
            # Refit best estimator on full training set
            best_model = grid_search.best_estimator_
            best_model.fit(X_train, y_train)
        else:
            grid_search.fit(X_train, y_train)
            best_model = grid_search.best_estimator_

        best_pipelines[algo_name] = best_model
        best_hyperparams[algo_name] = {
            k.replace("classifier__", ""): v for k, v in grid_search.best_params_.items()
        }

        # Evaluate on held-out test set
        metrics = evaluate_model(best_model, X_test, y_test, model_name=algo_name)
        metrics["CV_F1_Best"] = round(float(grid_search.best_score_), 4)
        results.append(metrics)

        # Save individual tuned pipeline
        model_file = SAVED_MODELS_DIR / f"{name_clean}_{algo_name}.joblib"
        joblib.dump(best_model, model_file)
        print(f"    Best Params: {best_hyperparams[algo_name]}", flush=True)
        print(f"    Test Acc: {metrics['Accuracy']:.4f} | Recall: {metrics['Recall']:.4f} | F1: {metrics['F1-Score']:.4f} | ROC-AUC: {metrics['ROC-AUC']:.4f}", flush=True)

    # Plot Multi-Model ROC Curves
    roc_out_path = FIGURES_DIR / f"{name_clean}_roc_curves.png"
    plot_disease_roc_curves(best_pipelines, X_test, y_test, display_title, roc_out_path)

    # Rank and select Champion model (priority: balanced F1-Score & Recall)
    results_df = pd.DataFrame(results).sort_values(
        by=["F1-Score", "Recall", "ROC-AUC"], ascending=False
    ).reset_index(drop=True)

    champion_algo = results_df.iloc[0]["Model"]
    champion_pipeline = best_pipelines[champion_algo]

    # Save Champion pipeline
    champion_file = SAVED_MODELS_DIR / f"{name_clean}_champion.joblib"
    joblib.dump(champion_pipeline, champion_file)

    # Save metrics table
    metrics_csv = METRICS_DIR / f"{name_clean}_metrics.csv"
    results_df.to_csv(metrics_csv, index=False)

    # Save rich metadata
    metadata = {
        "disease": display_title,
        "champion_model": champion_algo,
        "champion_metrics": results_df.iloc[0].drop("Confusion_Matrix").to_dict(),
        "best_hyperparameters": best_hyperparams,
        "total_cohort_size": len(X),
        "test_holdout_size": len(X_test),
        "feature_count": X.shape[1]
    }
    with open(METRICS_DIR / f"{name_clean}_metadata.json", "w") as f:
        json.dump(metadata, f, indent=4)

    print(f"[*] Champion Model for {disease_name}: {champion_algo} (Saved to {champion_file.name})", flush=True)
    return results_df

def run_phase_4_benchmarks():
    """
    Executes Phase 4 training across Heart Disease, Diabetes, and Breast Cancer.
    """
    print("\n" + "=" * 60, flush=True)
    print("PHASE 4: HYPERPARAMETER TUNING & BENCHMARK COMPARISON", flush=True)
    print("=" * 60, flush=True)

    diseases = ["heart_disease", "diabetes", "breast_cancer"]
    summaries = {}
    for disease in diseases:
        summaries[disease] = train_and_tune_disease(disease)

    print("\n[+] Phase 4 complete! All 12 models tuned and champion pipelines serialized.", flush=True)
    return summaries

if __name__ == "__main__":
    run_phase_4_benchmarks()
