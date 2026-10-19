"""
Preprocessing pipelines for Heart Disease, Diabetes, and Breast Cancer datasets.
Builds leakage-free Scikit-Learn pipelines and manages processed train/test partitions.
"""
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split

from src.config import (
    HEART_NUMERIC_COLS, HEART_CATEGORICAL_COLS,
    DIABETES_COLS, DIABETES_ZERO_AS_MISSING,
    RANDOM_STATE, TEST_SIZE, DATA_PROCESSED_DIR
)
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)

def replace_zeros_with_nan(X):
    """
    Replaces clinically invalid 0 values with NaN for physiological features.
    """
    X_copy = X.copy()
    if isinstance(X_copy, pd.DataFrame):
        for col in DIABETES_ZERO_AS_MISSING:
            if col in X_copy.columns:
                X_copy[col] = X_copy[col].replace(0, np.nan)
    else:
        # If numpy array, match by DIABETES_COLS index
        cols = DIABETES_COLS
        for idx, col in enumerate(cols):
            if col in DIABETES_ZERO_AS_MISSING:
                col_vals = X_copy[:, idx]
                X_copy[col_vals == 0, idx] = np.nan
    return X_copy

def get_heart_preprocessor():
    """
    Returns ColumnTransformer for Heart Disease dataset.
    StandardScaler for numeric, OneHotEncoder for categorical.
    """
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, HEART_NUMERIC_COLS),
            ("cat", categorical_transformer, HEART_CATEGORICAL_COLS)
        ],
        remainder="drop"
    )
    return preprocessor

def get_diabetes_preprocessor():
    """
    Returns Pipeline for Diabetes dataset:
    Zero-to-NaN replacement -> Median Imputation -> StandardScaler.
    """
    preprocessor = Pipeline(steps=[
        ("zero_replacer", FunctionTransformer(replace_zeros_with_nan, validate=False)),
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    return preprocessor

def get_breast_cancer_preprocessor():
    """
    Returns Pipeline for Breast Cancer dataset:
    Median Imputer -> StandardScaler.
    """
    preprocessor = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    return preprocessor

def get_preprocessor(disease_name: str):
    """
    Factory function returning the corresponding preprocessor for disease_name.
    """
    name = disease_name.lower().replace(" ", "_")
    if "heart" in name:
        return get_heart_preprocessor()
    elif "diabetes" in name:
        return get_diabetes_preprocessor()
    elif "breast" in name or "cancer" in name:
        return get_breast_cancer_preprocessor()
    else:
        raise ValueError(f"Unknown disease name: {disease_name}")

def get_heart_pipeline(classifier=None):
    """Constructs a complete end-to-end pipeline for Heart Disease."""
    steps = [("preprocessor", get_heart_preprocessor())]
    if classifier is not None:
        steps.append(("classifier", classifier))
    return Pipeline(steps=steps)

def get_diabetes_pipeline(classifier=None):
    """Constructs a complete end-to-end pipeline for Diabetes."""
    steps = [("preprocessor", get_diabetes_preprocessor())]
    if classifier is not None:
        steps.append(("classifier", classifier))
    return Pipeline(steps=steps)

def get_breast_cancer_pipeline(classifier=None):
    """Constructs a complete end-to-end pipeline for Breast Cancer."""
    steps = [("preprocessor", get_breast_cancer_preprocessor())]
    if classifier is not None:
        steps.append(("classifier", classifier))
    return Pipeline(steps=steps)

def save_processed_datasets():
    """
    Partitions raw datasets into stratified 80% train / 20% test splits
    and serializes them to data/processed/ for reproducible benchmarking.
    """
    DATA_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    datasets = [
        ("heart", load_heart_disease_data, "Heart_Disease_Status"),
        ("diabetes", load_diabetes_data, "Outcome"),
        ("breast_cancer", load_breast_cancer_data, "target")
    ]

    summary = {}
    for name, loader, target_col in datasets:
        X, y = loader()
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=TEST_SIZE, stratify=y, random_state=RANDOM_STATE
        )

        train_df = X_train.copy()
        train_df[target_col] = y_train.values

        test_df = X_test.copy()
        test_df[target_col] = y_test.values

        train_path = DATA_PROCESSED_DIR / f"{name}_train.csv"
        test_path = DATA_PROCESSED_DIR / f"{name}_test.csv"

        train_df.to_csv(train_path, index=False)
        test_df.to_csv(test_path, index=False)

        summary[name] = {
            "train_samples": len(train_df),
            "test_samples": len(test_df),
            "total_samples": len(X),
            "features": X.shape[1]
        }
        print(f"[+] Saved {name.upper()}: Train={len(train_df)}, Test={len(test_df)} to data/processed/")

    return summary

if __name__ == "__main__":
    save_processed_datasets()
