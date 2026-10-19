"""
Unit tests for data loaders (Phase 2).
"""
import pytest
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)

def test_load_heart_disease_data():
    X, y = load_heart_disease_data()
    assert len(X) == 10000
    assert len(y) == 10000
    assert X.shape[1] == 20
    assert set(y.unique()) == {0, 1}
    assert (y == 1).sum() == 2000

def test_load_diabetes_data():
    X, y = load_diabetes_data()
    assert len(X) == 768
    assert len(y) == 768
    assert X.shape[1] == 8
    assert set(y.unique()) == {0, 1}
    assert (y == 1).sum() == 268

def test_load_breast_cancer_data():
    X, y = load_breast_cancer_data()
    assert len(X) == 569
    assert len(y) == 569
    assert X.shape[1] == 30
    assert set(y.unique()) == {0, 1}
    # 212 malignant (1), 357 benign (0)
    assert (y == 1).sum() == 212
