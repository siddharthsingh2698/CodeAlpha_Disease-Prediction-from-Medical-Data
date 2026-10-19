"""
Data loading and dataset acquisition module for Multi-Disease Prediction.
"""
import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer
import urllib.request
from src.config import (
    HEART_RAW_PATH, DIABETES_RAW_PATH, BREAST_CANCER_RAW_PATH,
    HEART_TARGET_COL, DIABETES_TARGET_COL, BREAST_CANCER_TARGET_COL
)

def load_heart_disease_data():
    """
    Loads heart disease dataset from data/raw/heart_disease.csv.
    Returns:
        X (pd.DataFrame): features
        y (pd.Series): binary target (1 = Disease, 0 = No Disease)
    """
    if not HEART_RAW_PATH.exists():
        raise FileNotFoundError(f"Heart disease dataset not found at {HEART_RAW_PATH}")
    
    df = pd.read_csv(HEART_RAW_PATH)
    # Map target: 'Yes' -> 1, 'No' -> 0
    y = df[HEART_TARGET_COL].map({"Yes": 1, "No": 0, 1: 1, 0: 0}).astype(int)
    X = df.drop(columns=[HEART_TARGET_COL])
    return X, y

def load_diabetes_data():
    """
    Loads diabetes dataset from data/raw/diabetes.csv.
    If not found, downloads from benchmark repository.
    Returns:
        X (pd.DataFrame): features
        y (pd.Series): binary target (1 = Diabetic, 0 = Non-Diabetic)
    """
    if not DIABETES_RAW_PATH.exists():
        url = "https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv"
        df = pd.read_csv(url)
        df.to_csv(DIABETES_RAW_PATH, index=False)
    else:
        df = pd.read_csv(DIABETES_RAW_PATH)
        
    y = df[DIABETES_TARGET_COL].astype(int)
    X = df.drop(columns=[DIABETES_TARGET_COL])
    return X, y

def load_breast_cancer_data():
    """
    Loads Wisconsin Diagnostic Breast Cancer dataset.
    Returns:
        X (pd.DataFrame): 30 continuous features
        y (pd.Series): binary target (1 = Malignant, 0 = Benign)
    """
    if not BREAST_CANCER_RAW_PATH.exists():
        bc = load_breast_cancer(as_frame=True)
        df = bc.frame
        df.to_csv(BREAST_CANCER_RAW_PATH, index=False)
    else:
        df = pd.read_csv(BREAST_CANCER_RAW_PATH)
        
    # In sklearn load_breast_cancer: 0 = Malignant, 1 = Benign
    # For clinical intuition (1 = Disease / Malignant, 0 = Healthy / Benign):
    # We invert 0 and 1 so 1 = Malignant
    raw_target = df[BREAST_CANCER_TARGET_COL].astype(int)
    # If the original has 357 ones and 212 zeros, invert it:
    if (raw_target == 1).sum() > (raw_target == 0).sum():
        y = 1 - raw_target
    else:
        y = raw_target
        
    X = df.drop(columns=[BREAST_CANCER_TARGET_COL])
    return X, y
