"""
Unit tests for data preprocessing pipelines and processed dataset partitions (Phase 3).
"""
import pytest
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from src.preprocessing import (
    get_heart_preprocessor, get_diabetes_preprocessor,
    get_breast_cancer_preprocessor, replace_zeros_with_nan,
    get_heart_pipeline, get_diabetes_pipeline, get_breast_cancer_pipeline
)
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)
from src.config import DATA_PROCESSED_DIR

def test_replace_zeros_with_nan():
    data = pd.DataFrame({
        "Glucose": [0, 100, 120],
        "BloodPressure": [70, 0, 80],
        "Age": [25, 30, 35]
    })
    res = replace_zeros_with_nan(data)
    assert np.isnan(res.loc[0, "Glucose"])
    assert res.loc[1, "Glucose"] == 100
    assert np.isnan(res.loc[1, "BloodPressure"])
    assert res.loc[0, "BloodPressure"] == 70
    assert res.loc[0, "Age"] == 25

def test_heart_preprocessor_shape():
    X, _ = load_heart_disease_data()
    sample = X.head(10)
    prep = get_heart_preprocessor()
    transformed = prep.fit_transform(sample)
    assert transformed.shape[0] == 10
    assert transformed.shape[1] > 10

def test_diabetes_preprocessor_shape():
    X, _ = load_diabetes_data()
    sample = X.head(10)
    prep = get_diabetes_preprocessor()
    transformed = prep.fit_transform(sample)
    assert transformed.shape == (10, 8)

def test_breast_cancer_preprocessor_shape():
    X, _ = load_breast_cancer_data()
    sample = X.head(10)
    prep = get_breast_cancer_preprocessor()
    transformed = prep.fit_transform(sample)
    assert transformed.shape == (10, 30)

def test_pipelines_with_classifier():
    X_diab, y_diab = load_diabetes_data()
    pipe = get_diabetes_pipeline(classifier=LogisticRegression())
    pipe.fit(X_diab.head(50), y_diab.head(50))
    preds = pipe.predict(X_diab.tail(10))
    assert len(preds) == 10
    assert set(preds).issubset({0, 1})

def test_processed_files_exist():
    expected_files = [
        "heart_train.csv", "heart_test.csv",
        "diabetes_train.csv", "diabetes_test.csv",
        "breast_cancer_train.csv", "breast_cancer_test.csv"
    ]
    for fname in expected_files:
        fpath = DATA_PROCESSED_DIR / fname
        assert fpath.exists(), f"Missing processed file: {fname}"
        df = pd.read_csv(fpath)
        assert len(df) > 0
