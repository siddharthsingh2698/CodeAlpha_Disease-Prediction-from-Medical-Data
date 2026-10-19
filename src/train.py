"""
Training and benchmarking module for the 4 classification algorithms
across Heart Disease, Diabetes, and Breast Cancer datasets.
"""
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from src.config import (
    RANDOM_STATE, TEST_SIZE, CV_FOLDS,
    SAVED_MODELS_DIR, METRICS_DIR
)
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)
from src.preprocessing import (
    get_heart_preprocessor, get_diabetes_preprocessor, get_breast_cancer_preprocessor
)
from src.evaluate import evaluate_model

def get_classifiers():
    """
    Returns dictionary of the 4 benchmark classification algorithms.
    """
    return {
        "Logistic_Regression": LogisticRegression(
            max_iter=1000, random_state=RANDOM_STATE, class_weight="balanced"
        ),
        "SVM": SVC(
            kernel="rbf", probability=True, random_state=RANDOM_STATE,
            class_weight="balanced", cache_size=1000, max_iter=3000
        ),
        "Random_Forest": RandomForestClassifier(
            n_estimators=100, max_depth=10, random_state=RANDOM_STATE,
            class_weight="balanced", n_jobs=-1
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100, max_depth=5, learning_rate=0.08,
            random_state=RANDOM_STATE, eval_metric="logloss", n_jobs=-1
        )
    }

def train_disease_models(disease_name: str):
    """
    Trains and benchmarks all 4 models for the given disease.
    Saves models and comparative performance metrics.
    """
    print(f"\n==========================================", flush=True)
    print(f"[>] Training models for: {disease_name.upper()}", flush=True)
    print(f"==========================================", flush=True)
    
    # 1. Load data
    name_clean = disease_name.lower().replace(" ", "_")
    if "heart" in name_clean:
        X, y = load_heart_disease_data()
        preprocessor = get_heart_preprocessor()
    elif "diabetes" in name_clean:
        X, y = load_diabetes_data()
        preprocessor = get_diabetes_preprocessor()
    elif "breast" in name_clean or "cancer" in name_clean:
        X, y = load_breast_cancer_data()
        preprocessor = get_breast_cancer_preprocessor()
    else:
        raise ValueError(f"Unknown disease: {disease_name}")

    # 2. Stratified Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, stratify=y, random_state=RANDOM_STATE
    )
    print(f"Dataset split: Train shape = {X_train.shape}, Test shape = {X_test.shape}", flush=True)
    print(f"Target distribution - Positive: {y.sum()}, Negative: {len(y) - y.sum()}", flush=True)

    classifiers = get_classifiers()
    results = []
    trained_pipelines = {}

    cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)

    for algo_name, clf in classifiers.items():
        print(f"--> Training {algo_name}...", flush=True)
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", clf)
        ])

        # CV scoring (use subsample for large datasets on SVM to keep training fast)
        try:
            if len(X_train) > 2000 and algo_name == "SVM":
                sample_idx = np.random.RandomState(RANDOM_STATE).choice(len(X_train), size=2000, replace=False)
                cv_scores = cross_val_score(pipeline, X_train.iloc[sample_idx], y_train.iloc[sample_idx], cv=cv, scoring="f1", n_jobs=-1)
            else:
                cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="f1", n_jobs=-1)
            cv_mean = float(np.mean(cv_scores))
            cv_std = float(np.std(cv_scores))
        except Exception:
            cv_mean = 0.0
            cv_std = 0.0
        
        # Fit on full training set
        pipeline.fit(X_train, y_train)

        # Evaluate on held-out test set
        metrics = evaluate_model(pipeline, X_test, y_test, model_name=algo_name)
        metrics["CV_F1_Mean"] = round(cv_mean, 4)
        metrics["CV_F1_Std"] = round(cv_std, 4)
        results.append(metrics)
        trained_pipelines[algo_name] = pipeline

        # Save individual model pipeline
        model_file = SAVED_MODELS_DIR / f"{name_clean}_{algo_name}.joblib"
        joblib.dump(pipeline, model_file)
        print(f"    Test Accuracy: {metrics['Accuracy']:.4f} | Recall: {metrics['Recall']:.4f} | F1: {metrics['F1-Score']:.4f} | ROC-AUC: {metrics['ROC-AUC']:.4f}", flush=True)

    # 3. Create Comparative DataFrame
    results_df = pd.DataFrame(results)
    
    # Select Champion Model (priority: balanced F1-score & Recall)
    results_df = results_df.sort_values(by=["F1-Score", "Recall", "ROC-AUC"], ascending=False).reset_index(drop=True)
    champion_algo = results_df.iloc[0]["Model"]
    champion_pipeline = trained_pipelines[champion_algo]
    
    # Save champion model
    champion_file = SAVED_MODELS_DIR / f"{name_clean}_champion.joblib"
    joblib.dump(champion_pipeline, champion_file)
    
    # Save metrics CSV
    metrics_csv = METRICS_DIR / f"{name_clean}_metrics.csv"
    results_df.to_csv(metrics_csv, index=False)
    
    # Save metadata info
    metadata = {
        "disease": disease_name,
        "champion_model": champion_algo,
        "champion_metrics": results_df.iloc[0].drop("Confusion_Matrix").to_dict(),
        "total_samples": len(X),
        "test_samples": len(X_test),
        "feature_columns": X.columns.tolist()
    }
    with open(METRICS_DIR / f"{name_clean}_metadata.json", "w") as f:
        json.dump(metadata, f, indent=4)

    print(f"[*] Champion Model for {disease_name}: {champion_algo}", flush=True)
    print(f"Metrics saved to {metrics_csv}", flush=True)
    return results_df

def train_all_diseases():
    """
    Executes training across Heart Disease, Diabetes, and Breast Cancer.
    """
    diseases = ["heart_disease", "diabetes", "breast_cancer"]
    all_summaries = {}
    for disease in diseases:
        all_summaries[disease] = train_disease_models(disease)
    print("\n[+] All models successfully trained and serialized!", flush=True)
    return all_summaries

if __name__ == "__main__":
    train_all_diseases()
