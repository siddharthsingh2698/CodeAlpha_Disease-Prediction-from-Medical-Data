# Disease-Prediction-from-Medical-Data

[![CI Pipeline](https://github.com/siddharthsingh2698/Disease-Prediction-from-Medical-Data/actions/workflows/ci.yml/badge.svg)](https://github.com/siddharthsingh2698/Disease-Prediction-from-Medical-Data/actions/workflows/ci.yml)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-orange.svg)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-red.svg)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/SHAP-Explainable_AI-brightgreen.svg)](https://shap.readthedocs.io/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.32+-ff4b4b.svg)](https://streamlit.io/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end, clinically-oriented **Multi-Disease Prediction Platform** that predicts diagnostic risk probabilities for **Heart Disease**, **Diabetes**, and **Breast Cancer** using structured patient biomarkers and four core classification algorithms:
- **Logistic Regression** (Optimized linear probabilistic model)
- **Support Vector Machine (SVM)** (Optimized with RBF/Linear kernels)
- **Random Forest Classifier** (Bagging ensemble of decision trees)
- **Extreme Gradient Boosting (XGBoost)** (Regularized gradient boosting)

---

## 🌟 Key Capabilities

* **Multi-Disease Coverage**: Unified risk assessment across 3 critical medical conditions:
  * **Cardiovascular / Heart Disease** ($N = 10,000$ patient records, 20 clinical & lifestyle biomarkers).
  * **Type-2 Diabetes** (UCI Pima Indians dataset, 8 physiological indicators with zero-imputation).
  * **Breast Cancer (Malignant vs. Benign)** (UCI Wisconsin Diagnostic dataset, 30 cellular nuclear features).
* **4-Way Algorithm Benchmarking**: Simultaneously trains and validates Logistic Regression, SVM, Random Forest, and XGBoost using **5-Fold Stratified Cross-Validation**.
* **Automatic Champion Model Selection**: Ranks models by balanced F1-Score, Sensitivity/Recall (minimizing false negatives in clinical context), and ROC-AUC.
* **Explainable AI (SHAP)**: Integrated with **SHAP (SHapley Additive exPlanations)** to break down individual patient risk factors and highlight which specific biomarkers drove the prediction.
* **Batch Screening (CSV)**: High-throughput batch inference allows clinicians to upload full patient cohorts and export screened results with assigned risk categories.
* **Exportable Diagnostic Reports**: Generates downloadable clinical diagnostic summaries in Markdown with complete patient inputs, risk percentages, and driving factors.
* **Interactive Healthcare Dashboard**: Built with **Streamlit** featuring real-time risk gauges, side-by-side benchmark tables, interactive confusion matrices, and multi-model ROC curves.

---

## 📁 Repository Structure

```plaintext
Disease-Prediction-from-Medical-Data/
├── .github/workflows/
│   └── ci.yml                          # Continuous Integration test pipeline
├── data/
│   ├── raw/                            # Raw benchmark datasets
│   │   ├── heart_disease.csv           # 10,000 patient cardiovascular records
│   │   ├── diabetes.csv                # Pima Indians diabetes dataset
│   │   └── breast_cancer.csv           # Wisconsin diagnostic breast cancer dataset
│   └── processed/                      # Stratified 80/20 train/test partitions
├── models/
│   ├── saved_models/                   # 12 tuned .joblib pipelines + 3 champions
│   └── metrics/                        # Benchmark metrics CSVs & metadata JSONs
├── notebooks/
│   ├── 01_exploratory_data_analysis.ipynb # Complete EDA notebook
│   ├── diabetes.ipynb                  # Exploratory analysis for Diabetes
│   ├── breast-cancer.ipynb             # Exploratory analysis for Breast Cancer
│   └── diabetes.csv                    # Local data copy for notebook execution
├── reports/
│   ├── eda_summary_report.md           # Statistical data profiling report
│   ├── model_benchmarks_report.md      # Hyperparameter tuning benchmark report
│   ├── explainability_report.md        # SHAP interpretability report
│   └── figures/                        # High-resolution ROC, SHAP & EDA plots
├── src/
│   ├── config.py                       # Global paths, thresholds, and parameters
│   ├── data_loader.py                  # Dataset ingestion and target formatting
│   ├── preprocessing.py                # Leakage-free Scikit-Learn transformers
│   ├── train.py                        # Model tuning with 5-fold CV & GridSearchCV
│   ├── evaluate.py                     # Medical metrics & ROC curve plotter
│   ├── explainability.py               # SHAP explainers and factor attribution
│   └── predictor.py                    # Unified single-patient inference engine
├── app/
│   ├── main.py                         # Streamlit application entry point
│   ├── components/
│   │   ├── input_forms.py              # Patient clinical input widgets & presets
│   │   ├── visualizers.py              # Risk gauge meter & benchmark charts
│   │   └── report_generator.py         # Clinical diagnostic report export helper
│   └── styles/
│       └── custom.css                  # Modern healthcare UI theme
├── tests/
│   ├── test_data_loader.py             # Data ingestion integrity tests
│   ├── test_preprocessing.py           # Preprocessing pipeline tests
│   ├── test_predictor.py               # Inference and probability scoring tests
│   ├── test_explainability.py          # SHAP attribution tests
│   └── test_report_generator.py        # Diagnostic report generator tests
├── prd.md                              # Product Requirements Document
├── architecture.md                     # System Architecture Document
├── plan.md                             # Step-by-Step Implementation Roadmap
├── requirements.txt                    # Project Python dependencies
├── Dockerfile                          # Containerization specification
└── README.md                           # Documentation
```

---

## 🏆 Benchmark Performance Results

All models evaluated on held-out test splits ($20\%$) using 5-Fold Stratified Cross-Validation:

| Disease Domain | Champion Algorithm | Test Accuracy | Sensitivity / Recall | F1-Score | ROC-AUC | Best Hyperparameters |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Breast Cancer** | **Logistic Regression** | **99.12%** | **97.62%** | **98.80%** | **0.9977** | `C=0.1, solver='liblinear'` |
| **Diabetes** | **XGBoost Classifier** | **75.97%** | **81.48%** | **70.40%** | **0.8147** | `lr=0.04, depth=3, pos_weight=2.0` |
| **Heart Disease** | **SVM Classifier** | **20.00%** | **100.0%** | **33.33%** | **0.4886** | `C=0.5, gamma='auto'` |

*(Full details and ROC Curves available in `reports/model_benchmarks_report.md`)*

---

## 🚀 Quickstart Guide

### 1. Local Setup
```bash
# Clone the repository
git clone https://github.com/siddharthsingh2698/Disease-Prediction-from-Medical-Data.git
cd Disease-Prediction-from-Medical-Data

# Install dependencies
pip install -r requirements.txt
```

### 2. Run Test Suite
```bash
python -m pytest
```

### 3. Launch the Web Application
```bash
streamlit run app/main.py
```
Open your browser at `http://localhost:8501`.

---

## 🐳 Running with Docker

Build and run the containerized application with a single command:
```bash
# Build the Docker image
docker build -t disease-predictor .

# Run the container
docker run -p 8501:8501 disease-predictor
```
Access the application at `http://localhost:8501`.

---

## ⚠️ Clinical Disclaimer
This application is designed solely for educational, academic, and clinical decision-support research. It is **not** a certified medical diagnostic device and must not replace professional clinical diagnosis, clinical consultation, or laboratory testing by a qualified healthcare provider.
