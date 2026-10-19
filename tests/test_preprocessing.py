"""
Unit tests for data preprocessing pipelines.
"""
import pytest
import numpy as np
import pandas as pd
from src.preprocessing import (
    get_heart_preprocessor, get_diabetes_preprocessor,
    get_breast_cancer_preprocessor, replace_zeros_with_nan
)
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)

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
