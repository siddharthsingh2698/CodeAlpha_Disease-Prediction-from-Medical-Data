# Product Requirements Document (PRD)
## Multi-Disease Prediction System from Medical Data

---

### 1. Document Overview
* **Project Name**: Multi-Disease Clinical Risk Prediction Platform
* **Version**: 1.0.0
* **Status**: Approved / Ready for Implementation
* **Target Audience**: Data Scientists, Machine Learning Engineers, Clinical Researchers, Healthcare Evaluators

---

### 2. Executive Summary & Vision
Early detection of chronic and life-threatening medical conditions significantly improves patient survival rates, mitigates long-term complications, and lowers healthcare expenditure. 

The **Multi-Disease Prediction System** is a unified, machine-learning-driven diagnostic risk assessment tool that leverages structured clinical and patient data to predict the likelihood of three major diseases:
1. **Cardiovascular / Heart Disease**
2. **Type 2 Diabetes**
3. **Breast Cancer (Malignant vs. Benign)**

By training and comparing four robust classification algorithms—**Logistic Regression, Support Vector Machine (SVM), Random Forest, and XGBoost**—the platform identifies the optimal model for each disease domain and delivers calibrated risk scores alongside interpretability explanations (via SHAP and feature importances) through an intuitive clinical dashboard.

---

### 3. Problem Statement & Scope

#### 3.1 The Problem
Clinical diagnostics often require evaluating dozens of interrelated biomarkers (e.g., fasting glucose, blood pressure, lipid panels, cellular nuclei characteristics, exercise stress test metrics). Manual assessment can be time-consuming, prone to cognitive overload, and subject to inter-observer variability. An automated, explainable decision-support tool can serve as a dependable second opinion for healthcare providers and an early-stage screening assistant.

#### 3.2 In-Scope
* Standardized ingestion and preprocessing of three benchmark UCI Machine Learning Repository medical datasets.
* Comparative benchmark training across four key classification algorithms:
  * Logistic Regression (Baseline linear model, high interpretability)
  * Support Vector Machine (SVM with RBF/Linear kernels, effective in high-dimensional boundaries)
  * Random Forest Classifier (Bagging ensemble, handles non-linearities and feature interactions)
  * Extreme Gradient Boosting (XGBoost, state-of-the-art boosting with regularized trees)
* Rigorous cross-validation, hyperparameter optimization, and medical metric evaluation (Accuracy, Sensitivity/Recall, Specificity, Precision, F1-Score, ROC-AUC).
* Production-ready inference pipelines encapsulated with feature scalers and imputers to prevent data leakage.
* Model interpretability (Global feature importance and Local SHAP explanations).
* Interactive Web Application (Streamlit) for single-patient triage and batch screening.

#### 3.3 Out-of-Scope (Version 1.0)
* Direct integration with hospital Electronic Health Record (EHR) systems via HL7/FHIR (planned for v2.0).
* Prescriptive medical treatment recommendations or drug dosage planning (strictly predictive risk screening).
* Analysis of unstructured diagnostic modalities (e.g., DICOM MRI/CT scans, raw pathology histopathology slides).

---

### 4. User Personas

| Persona | Role | Primary Objective | Key Needs |
| :--- | :--- | :--- | :--- |
| **Dr. Sarah (Clinician)** | Primary Care Physician | Quick diagnostic verification during patient consults | Fast inference (<200ms), high recall (minimize false negatives), clear feature attribution |
| **Patient Alex** | Health-Conscious Individual | Self-screening risk evaluation from routine lab results | Simple input forms, understandable risk categories (Low/Moderate/High), clear non-medical jargon disclaimer |
| **Data Scientist Maya** | Healthcare ML Researcher | Model benchmarking and pipeline audits | Transparent metrics, confusion matrices, ROC/PR curves, reproducible seeds, modular code |

---

### 5. Datasets Specification

The system integrates three standard, well-validated medical benchmark datasets from the UCI Machine Learning Repository:

#### 5.1 Heart Disease Dataset (Cleveland UCI)
* **Target**: Presence of heart disease (Binary: `0 = Absence (<50% diameter narrowing)`, `1 = Presence (>50% diameter narrowing)`).
* **Sample Count**: 303 patient records.
* **Feature Dimensionality**: 13 predictive clinical features:
  1. `age`: Age in years
  2. `sex`: Sex (1 = male, 0 = female)
  3. `cp`: Chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic)
  4. `trestbps`: Resting blood pressure (in mm Hg on admission to the hospital)
  5. `chol`: Serum cholesterol in mg/dl
  6. `fbs`: Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  7. `restecg`: Resting electrocardiographic results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)
  8. `thalach`: Maximum heart rate achieved during exercise
  9. `exang`: Exercise-induced angina (1 = yes, 0 = no)
  10. `oldpeak`: ST depression induced by exercise relative to rest
  11. `slope`: The slope of the peak exercise ST segment
  12. `ca`: Number of major vessels (0-3) colored by fluoroscopy
  13. `thal`: Thalassemia (1 = normal, 2 = fixed defect, 3 = reversible defect)

#### 5.2 Diabetes Dataset (Pima Indians Diabetes UCI)
* **Target**: Diabetes onset within 5 years (`0 = Non-Diabetic`, `1 = Diabetic`).
* **Sample Count**: 768 female patient records.
* **Feature Dimensionality**: 8 clinical/physiological features:
  1. `Pregnancies`: Number of times pregnant
  2. `Glucose`: Plasma glucose concentration at 2 hours in an oral glucose tolerance test
  3. `BloodPressure`: Diastolic blood pressure (mm Hg)
  4. `SkinThickness`: Triceps skin fold thickness (mm)
  5. `Insulin`: 2-Hour serum insulin (mu U/ml)
  6. `BMI`: Body mass index (weight in kg/(height in m)^2)
  7. `DiabetesPedigreeFunction`: Genetic diabetes pedigree score
  8. `Age`: Age in years
  * *Critical Preprocessing Rule*: Clinically impossible zero values in Glucose, BloodPressure, SkinThickness, Insulin, and BMI must be treated as missing data and appropriately imputed (e.g., median imputation by class/subgroup).

#### 5.3 Breast Cancer Dataset (Wisconsin Diagnostic UCI)
* **Target**: Diagnosis (`0 = Benign`, `1 = Malignant`).
* **Sample Count**: 569 instances.
* **Feature Dimensionality**: 30 continuous real-valued features computed from a digitized image of a fine needle aspirate (FNA) of a breast mass:
  * 10 core morphological attributes: radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, fractal dimension.
  * Computed in 3 statistical tiers for each cell nucleus: Mean (`_mean`), Standard Error (`_se`), and "Worst" or largest (`_worst`).

---

### 6. Functional Requirements

#### 6.1 Data Ingestion & Preprocessing (FR-01 to FR-04)
* **FR-01 (Automated Ingestion)**: System must load datasets from local storage or programmatically download/cache them from UCI repositories.
* **FR-02 (Data Sanitization & Cleaning)**: Handle anomalies, duplicate records, non-standard representations (`?`, `null`, `NaN`), and domain-specific invalid zeros.
* **FR-03 (Feature Transformation & Scaling)**: Standardize continuous features via `StandardScaler` / `RobustScaler` fit strictly on the training partition to prevent data leakage.
* **FR-04 (Encapsulated Pipelines)**: All transformation artifacts (imputers, scalers, encoders) must be chained within Scikit-Learn `Pipeline` objects and persisted alongside the trained estimator.

#### 6.2 Model Training, Benchmarking & Selection (FR-05 to FR-08)
* **FR-05 (Multi-Algorithm Training)**: For every disease module, the system must train:
  1. Logistic Regression (with L1/L2 regularization tuning)
  2. Support Vector Machine (Linear & RBF kernel optimization)
  3. Random Forest (Tuning trees, max depth, min samples split)
  4. XGBoost (Tuning learning rate, subsample, max depth, colsample)
* **FR-06 (Stratified Cross-Validation)**: Evaluate models using 5-Fold Stratified Cross-Validation to maintain class distribution proportions across folds.
* **FR-07 (Champion Model Registry)**: Automatically select the champion (best performing) model based on balanced F1-Score and Recall while tracking all competitors in a comparative evaluation table.
* **FR-08 (Model Serialization)**: Persist trained pipeline bundles (`.joblib`) with version metadata, training timestamps, and performance metrics.

#### 6.3 Prediction & Clinical Explainability (FR-09 to FR-11)
* **FR-09 (Calibrated Risk Probability)**: Predictions must output both binary classification (Positive / Negative) and a calibrated probability percentage ($0.0\% - 100.0\%$).
* **FR-10 (Risk Stratification)**: Categorize patient status into:
  * **Low Risk**: $< 35\%$ probability
  * **Moderate Risk / Monitor**: $35\% - 65\%$ probability
  * **High Risk / Urgent Clinical Review**: $> 65\%$ probability
* **FR-11 (Explainable AI - XAI)**: Provide SHAP (SHapley Additive exPlanations) force/waterfall plots or feature importance breakdowns indicating which biomarkers drove the risk up or down for that specific individual.

#### 6.4 User Interface & Reporting (FR-12 to FR-15)
* **FR-12 (Multi-Disease Dashboard)**: Unified Streamlit UI allowing seamless tab-switching between Heart Disease, Diabetes, and Breast Cancer prediction modules.
* **FR-13 (Input Validation & Guardrails)**: Web forms must enforce physiologically valid ranges (e.g., blood pressure between $50 - 250\text{ mm Hg}$, age $1 - 120$) with real-time UI warnings.
* **FR-14 (Model Comparison Hub)**: Interactive analytics tab showcasing ROC Curves, Confusion Matrices, and benchmarking tables across all 4 algorithms for each disease.
* **FR-15 (Medical Summary Export)**: Capability to generate and export an actionable patient summary report (PDF/Text/Markdown) containing input biomarkers, calculated risk score, driving factors, and standard clinical disclaimer.

---

### 7. Non-Functional Requirements

| Metric / Dimension | Specification Requirement |
| :--- | :--- |
| **Diagnostic Sensitivity / Recall** | $\ge 90\%$ on Breast Cancer, $\ge 85\%$ on Heart Disease & Diabetes (minimizing false negatives is primary clinical priority). |
| **ROC-AUC** | $\ge 0.90$ across all final models. |
| **Inference Latency** | $< 200\text{ ms}$ per single-patient prediction. |
| **Reproducibility** | All stochastic operations (train/test splits, cross-validation, tree building) must be governed by fixed random seeds (`seed=42`). |
| **Modularity & Extensibility**| Architecture must allow adding a 4th or 5th disease module (e.g., Kidney disease, Liver disease) without refactoring existing disease modules. |
| **System Security & Privacy** | No patient inputs persisted to unencrypted logs; run locally without sending patient health information (PHI) to 3rd-party external APIs. |
| **Compliance & Disclaimer** | Prominent disclaimer displayed on all pages: *"For Educational and Clinical Decision Support Only. Not a Substitute for Professional Medical Diagnosis."* |

---

### 8. Acceptance Criteria

1. **Model Performance**:
   * All 4 algorithms (Logistic Regression, SVM, Random Forest, XGBoost) successfully trained and benchmarked across Heart Disease, Diabetes, and Breast Cancer datasets.
   * Model comparison metrics (Accuracy, Precision, Recall, F1, ROC-AUC) logged and saved in structured format (`results_summary.csv` or `.json`).
2. **Inference Pipeline**:
   * Model pipelines load from disk and execute deterministic predictions on unseen synthetic patient test vectors without runtime exceptions.
3. **Web Interface**:
   * Fully responsive, professional Streamlit application with intuitive medical theme, error-proof input controls, risk gauges, and feature importance charts.
4. **Code Quality**:
   * PEP-8 compliant Python code, modular architecture with separation of concerns, unit tests for data preprocessing and inference modules.
