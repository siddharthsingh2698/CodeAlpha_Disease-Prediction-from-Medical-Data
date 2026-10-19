# Disease-Prediction-from-Medical-Data

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Machine Learning](https://img.shields.io/badge/Scikit--Learn-1.4+-orange.svg)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-red.svg)](https://xgboost.readthedocs.io/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.32+-ff4b4b.svg)](https://streamlit.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end, clinically-oriented **Multi-Disease Prediction Platform** that predicts diagnostic risk probabilities for **Heart Disease**, **Diabetes**, and **Breast Cancer** using structured patient biomarkers and four core classification algorithms:
- **Support Vector Machine (SVM)**
- **Logistic Regression**
- **Random Forest Classifier**
- **Extreme Gradient Boosting (XGBoost)**

---

## 🌟 Key Features

* **Multi-Disease Coverage**: Unified risk assessment across 3 critical medical conditions:
  * **Cardiovascular / Heart Disease** (10,000 patient records, 20 clinical & lifestyle biomarkers).
  * **Type-2 Diabetes** (UCI Pima Indians dataset, 8 physiological indicators with zero-imputation).
  * **Breast Cancer (Malignant vs. Benign)** (UCI Wisconsin Diagnostic dataset, 30 cellular nuclear features).
* **4-Way Algorithm Benchmarking**: Simultaneously trains and validates Logistic Regression, SVM, Random Forest, and XGBoost using **5-Fold Stratified Cross-Validation**.
* **Automatic Champion Model Selection**: Ranks models by balanced F1-Score, Sensitivity/Recall (minimizing false negatives in clinical context), and ROC-AUC.
* **Explainable AI (XAI)**: Integrated with **SHAP (SHapley Additive exPlanations)** to break down individual patient risk factors and highlight which specific biomarkers drove the prediction.
* **Interactive Healthcare Dashboard**: Built with **Streamlit** featuring:
  * Dynamic biomarker input forms with one-click healthy/high-risk presets.
  * Real-time risk probability gauge meter (Low, Moderate, High risk tiers).
  * Side-by-side model comparison tables, confusion matrices, and ROC curves.
  * Dataset explorer and statistical summaries.

---

## 📁 Repository Structure

```plaintext
Disease-Prediction-from-Medical-Data/
├── data/
│   ├── raw/                            # Raw benchmark datasets
│   │   ├── heart_disease.csv           # 10,000 patient cardiovascular records
│   │   ├── diabetes.csv                # Pima Indians diabetes dataset
│   │   └── breast_cancer.csv           # Wisconsin diagnostic breast cancer dataset
│   └── processed/                      # Cleaned train/test data
├── models/
│   ├── saved_models/                   # Serialized .joblib pipelines (12 models + 3 champions)
│   └── metrics/                        # Benchmark metrics CSVs & metadata JSONs
├── notebooks/
│   ├── diabetes.ipynb                  # Exploratory Data Analysis for Diabetes
│   ├── breast-cancer.ipynb             # Exploratory analysis for Breast Cancer
│   └── diabetes.csv                    # Local data copy for notebook execution
├── src/
│   ├── config.py                       # Global paths, thresholds, and parameters
│   ├── data_loader.py                  # Dataset ingestion and target formatting
│   ├── preprocessing.py                # Leakage-free Scikit-Learn transformers
│   ├── train.py                        # Model training, 5-fold CV & champion selector
│   ├── evaluate.py                     # Medical metrics (Accuracy, Recall, F1, ROC-AUC)
│   ├── explainability.py               # SHAP explainers and factor attribution
│   └── predictor.py                    # Unified single-patient inference engine
├── app/
│   ├── main.py                         # Streamlit application entry point
│   ├── components/
│   │   ├── input_forms.py              # Patient clinical input widgets & presets
│   │   └── visualizers.py              # Risk gauge meter & benchmark charts
│   └── styles/
│       └── custom.css                  # Modern healthcare UI theme
├── tests/
│   └── test_preprocessing.py           # Unit tests for preprocessing pipelines
├── prd.md                              # Product Requirements Document
├── architecture.md                     # System Architecture Document
├── plan.md                             # Step-by-Step Implementation Roadmap
├── requirements.txt                    # Project Python dependencies
└── README.md                           # Documentation
```

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/siddharthsingh2698/Disease-Prediction-from-Medical-Data.git
cd Disease-Prediction-from-Medical-Data
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Train and Benchmark All Models
To train all 4 algorithms across Heart Disease, Diabetes, and Breast Cancer:
```bash
python -m src.train
```
This will train 12 individual models, evaluate them on holdout test sets using 5-Fold Stratified Cross-Validation, select the Champion model for each disease, and serialize artifacts to `models/saved_models/`.

### 4. Launch the Interactive Web Application
```bash
streamlit run app/main.py
```
Open your browser at `http://localhost:8501`.

---

## 📊 Benchmark Results

| Disease Domain | Champion Algorithm | Test Accuracy | Sensitivity / Recall | F1-Score | ROC-AUC |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Heart Disease** | Random Forest / XGBoost | ~85-92% | ~88-94% | ~86-91% | ~0.92+ |
| **Diabetes** | Random Forest / Logistic Reg | ~77-80% | ~76-82% | ~74-78% | ~0.84+ |
| **Breast Cancer** | SVM / Logistic Regression | ~96-98% | ~95-98% | ~96-98% | ~0.99+ |

*(Exact metrics for your run are recorded in `models/metrics/*_metrics.csv`)*

---

## 🔬 Explainable AI (SHAP)
Medical applications require interpretability beyond raw black-box accuracy. The system decomposes predictions into:
* **Positive Risk Drivers**: Specific biomarkers (e.g., Elevated Fasting Glucose > 140 mg/dL, High Blood Pressure, or Concavity > 0.15) pushing the risk score upward.
* **Protective Factors**: Biomarkers (e.g., Optimal BMI, High Exercise Habits, or Normal Sleep) reducing the predicted disease probability.

---

## ⚠️ Clinical Disclaimer
This system is developed strictly for educational, academic, and clinical decision-support research. It is **not** a certified medical diagnostic device and must not replace professional clinical diagnosis, clinical consultation, or laboratory testing by a qualified healthcare provider.
