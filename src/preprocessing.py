"""
Preprocessing pipelines for Heart Disease, Diabetes, and Breast Cancer datasets.
Builds leakage-free Scikit-Learn pipelines.
"""
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.impute import SimpleImputer
from src.config import (
    HEART_NUMERIC_COLS, HEART_CATEGORICAL_COLS,
    DIABETES_COLS, DIABETES_ZERO_AS_MISSING
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
        # If numpy array
        # assuming order matches DIABETES_COLS
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
