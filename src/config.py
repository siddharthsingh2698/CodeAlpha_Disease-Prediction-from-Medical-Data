"""
Configuration file containing constants, paths, and model hyperparameters
for the Multi-Disease Prediction System.
"""
import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_RAW_DIR = DATA_DIR / "raw"
DATA_PROCESSED_DIR = DATA_DIR / "processed"
MODELS_DIR = BASE_DIR / "models"
SAVED_MODELS_DIR = MODELS_DIR / "saved_models"
METRICS_DIR = MODELS_DIR / "metrics"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"

# Ensure directories exist
for path in [DATA_RAW_DIR, DATA_PROCESSED_DIR, SAVED_MODELS_DIR, METRICS_DIR, NOTEBOOKS_DIR]:
    path.mkdir(parents=True, exist_ok=True)

# Datasets
HEART_RAW_PATH = DATA_RAW_DIR / "heart_disease.csv"
DIABETES_RAW_PATH = DATA_RAW_DIR / "diabetes.csv"
BREAST_CANCER_RAW_PATH = DATA_RAW_DIR / "breast_cancer.csv"

# Global Constants
RANDOM_STATE = 42
TEST_SIZE = 0.20
CV_FOLDS = 5

# Risk Thresholds
RISK_LOW_MAX = 0.35
RISK_MODERATE_MAX = 0.65

# Disease Feature Specifications
HEART_NUMERIC_COLS = [
    "Age", "Blood Pressure", "Cholesterol Level", "BMI",
    "Sleep Hours", "Triglyceride Level", "Fasting Blood Sugar",
    "CRP Level", "Homocysteine Level"
]

HEART_CATEGORICAL_COLS = [
    "Gender", "Exercise Habits", "Smoking", "Family Heart Disease",
    "Diabetes", "High Blood Pressure", "Low HDL Cholesterol",
    "High LDL Cholesterol", "Alcohol Consumption", "Stress Level",
    "Sugar Consumption"
]

HEART_TARGET_COL = "Heart Disease Status"

DIABETES_COLS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]
DIABETES_ZERO_AS_MISSING = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
DIABETES_TARGET_COL = "Outcome"

BREAST_CANCER_TARGET_COL = "target"
