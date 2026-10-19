# Implementation Roadmap & Execution Plan
## Multi-Disease Prediction System from Medical Data

---

### 1. Plan Overview & Objectives
This document defines the structured, phased implementation roadmap for developing, training, evaluating, and deploying the **Multi-Disease Prediction System** across **Heart Disease**, **Diabetes**, and **Breast Cancer** using **Logistic Regression, SVM, Random Forest, and XGBoost**.

---

### 2. Execution Phases & Milestones

```mermaid
flowchart LR
    P1["Phase 1:<br/>Setup & Scaffolding"] --> P2["Phase 2:<br/>Data Acquisition & EDA"]
    P2 --> P3["Phase 3:<br/>Preprocessing Pipelines"]
    P3 --> P4["Phase 4:<br/>Model Training & Tuning"]
    P4 --> P5["Phase 5:<br/>Explainability (SHAP)"]
    P5 --> P6["Phase 6:<br/>Streamlit Web UI"]
    P6 --> P7["Phase 7:<br/>Testing & Validation"]
    P7 --> P8["Phase 8:<br/>Documentation & Release"]
```

---

### Phase 1: Environment Setup & Project Scaffolding
* **Objective**: Establish the Python virtual environment, dependencies, and clean modular directory structure.
* **Tasks**:
  1. Initialize project folder structure as specified in [architecture.md](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/architecture.md):
     - `data/raw`, `data/processed`
     - `models/saved_models`, `models/metrics`
     - `src/`, `app/`, `tests/`, `notebooks/`
  2. Create `requirements.txt` containing pinned versions:
     - `numpy`, `pandas`, `scipy`, `scikit-learn`, `xgboost`, `shap`, `matplotlib`, `seaborn`, `plotly`, `streamlit`, `joblib`, `pytest`.
  3. Create global configuration file `src/config.py`:
     - Centralize dataset paths, model hyperparameters grid, disease feature mappings, random seed (`RANDOM_STATE = 42`), and clinical risk thresholds.
* **Deliverables**:
  - `requirements.txt`
  - `src/config.py`
  - Fully scaffolded directory tree.

---

### Phase 2: Data Acquisition & Exploratory Data Analysis (EDA)
* **Objective**: Ingest the 3 UCI benchmark datasets, inspect distributions, missing values, class balance, and feature correlations.
* **Tasks**:
  1. Implement automated data acquisition in `src/data_loader.py`:
     - **Heart Disease**: UCI Cleveland Heart Disease dataset (303 rows, 13 features).
     - **Diabetes**: UCI Pima Indians Diabetes dataset (768 rows, 8 features).
     - **Breast Cancer**: UCI Wisconsin Diagnostic Breast Cancer dataset (569 rows, 30 features, directly loadable from `sklearn.datasets.load_breast_cancer` or UCI CSV).
  2. Perform Exploratory Data Analysis (EDA):
     - Check class distribution imbalance (e.g. Diabetes: ~35% positive / 65% negative).
     - Analyze zero-value anomalies in the Diabetes dataset (e.g., Insulin = 0, Glucose = 0).
     - Generate feature correlation heatmaps and identify multicollinearity.
  3. Store raw datasets securely in `data/raw/`.
* **Deliverables**:
  - `src/data_loader.py`
  - `data/raw/heart.csv`, `data/raw/diabetes.csv`, `data/raw/breast_cancer.csv`
  - Data validation logs confirming sample counts and schema integrity.

---

### Phase 3: Preprocessing & Leakage-Free Pipeline Construction
* **Objective**: Build reusable Scikit-Learn transformers and pipelines that prevent data leakage during cross-validation.
* **Tasks**:
  1. Implement `src/preprocessing.py`:
     - **Diabetes Preprocessing**: Replace invalid zero entries (`Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`) with `NaN`, followed by median imputation (`SimpleImputer(strategy='median')`).
     - **Heart Disease Preprocessing**: Handle categorical encoding for chest pain (`cp`), resting ECG (`restecg`), thalassemia (`thal`), and scaling for continuous features (`trestbps`, `chol`, `thalach`, `oldpeak`).
     - **Breast Cancer Preprocessing**: Apply `StandardScaler` across all 30 nuclear morphology continuous features.
  2. Partition all datasets into **80% Training** and **20% Testing** splits using `StratifiedShuffleSplit` with fixed `random_state=42`.
  3. Encapsulate feature transformers inside `sklearn.pipeline.Pipeline` objects so transformations are computed only on training folds.
* **Deliverables**:
  - `src/preprocessing.py` containing modular functions: `get_heart_pipeline()`, `get_diabetes_pipeline()`, `get_breast_cancer_pipeline()`.
  - Cleaned train/test split datasets saved in `data/processed/`.

---

### Phase 4: Model Training, Hyperparameter Tuning & Benchmarking
* **Objective**: Train and tune 4 algorithms per disease (12 total models), compare performance, and select champion models.
* **Tasks**:
  1. Implement `src/train.py` for training the 4 required classifiers:
     - **Logistic Regression**: Tuning regularization parameter $C \in [0.01, 0.1, 1, 10]$, solvers (`lbfgs`, `liblinear`).
     - **Support Vector Machine (SVM)**: Tuning kernel (`linear`, `rbf`), $C \in [0.1, 1, 10]$, $\gamma \in [\text{'scale'}, \text{'auto'}, 0.01, 0.1]$, with `probability=True`.
     - **Random Forest**: Tuning `n_estimators` [100, 200], `max_depth` [None, 5, 10], `min_samples_split` [2, 5].
     - **XGBoost**: Tuning `learning_rate` [0.01, 0.05, 0.1], `max_depth` [3, 5, 7], `n_estimators` [100, 200].
  2. Implement 5-Fold Stratified Cross-Validation (`StratifiedKFold(n_splits=5)`) and `GridSearchCV` / `RandomizedSearchCV`.
  3. Implement `src/evaluate.py` to calculate:
     - Accuracy, Precision, Recall / Sensitivity, Specificity, F1-Score, ROC-AUC.
     - Generate Confusion Matrix and ROC Curve figures.
  4. Select the **Champion Model** for each disease based on F1-Score and Recall (prioritizing the minimization of false negatives in clinical context).
  5. Serialize trained champion pipelines and all baseline models to `models/saved_models/` using `joblib`.
  6. Export benchmark metrics to `models/metrics/` (CSV and JSON summaries).
* **Deliverables**:
  - `src/train.py` & `src/evaluate.py`
  - 12 trained and evaluated models saved in `models/saved_models/`
  - Comprehensive benchmark results: `models/metrics/*_metrics.csv`

---

### Phase 5: Model Explainability & Interpretability (SHAP)
* **Objective**: Provide clinical transparency into why a prediction was made for both global feature importance and single-patient predictions.
* **Tasks**:
  1. Implement `src/explainability.py`:
     - Global feature importance extraction from Tree models (feature importance attributes) and Linear models (coefficients).
     - Integration of **SHAP (SHapley Additive exPlanations)**:
       - `shap.TreeExplainer` for Random Forest and XGBoost.
       - `shap.LinearExplainer` / `shap.KernelExplainer` for Logistic Regression and SVM.
  2. Implement local prediction waterfall/force plot generator:
     - Given a patient's input vector, calculate individual feature contributions to the final risk probability.
     - Highlight the top 3 positive contributors (factors elevating disease risk) and top 3 negative contributors (protective factors).
* **Deliverables**:
  - `src/explainability.py` with standalone functions: `get_feature_importances()`, `generate_shap_explanation()`, `plot_patient_risk_factors()`.

---

### Phase 6: Interactive Web Application (Streamlit UI)
* **Objective**: Build a clean, modern, and user-friendly web interface for real-time disease prediction and clinical exploration.
* **Tasks**:
  1. Implement `app/main.py` with top-level navigation:
     - Disease Selector: **Heart Disease**, **Diabetes**, **Breast Cancer**.
     - Model Selector: Choose between **Champion (Recommended)**, **Logistic Regression**, **SVM**, **Random Forest**, or **XGBoost**.
  2. Implement `app/components/input_forms.py`:
     - Structured clinical input forms with sliders, numeric inputs, and selection boxes.
     - Set realistic clinical default values and boundary ranges (e.g., Blood Pressure: 60-220 mm Hg, Age: 18-100).
     - Add tooltips explaining medical terms (e.g., `cp`: Chest pain type, `thal`: Thalassemia defect).
     - Include "Load Sample Patient" presets (e.g., Healthy Patient profile vs High-Risk Patient profile).
  3. Implement `app/components/visualizers.py`:
     - **Interactive Risk Meter / Gauge**: Low Risk (<35%), Moderate Risk (35-65%), High Risk (>65%).
     - **Attribution Breakdown**: Visual bar chart showing which specific biomarkers contributed most to the risk.
     - **Model Benchmarking Tab**: Display side-by-side performance comparison tables, confusion matrices, and ROC curves.
  4. Implement `app/components/report_generator.py`:
     - One-click summary download (Patient inputs, predicted risk score, risk level, key biomarkers, clinical disclaimer).
  5. Apply professional healthcare UI theme (`app/styles/custom.css`).
* **Deliverables**:
  - Complete, functional Streamlit application in `app/`.

---

### Phase 7: Testing, Verification & Benchmarking
* **Objective**: Ensure code reliability, mathematical consistency, and guardrail verification through automated testing.
* **Tasks**:
  1. Implement `tests/test_preprocessing.py`:
     - Verify zero-imputation in diabetes dataset behaves as expected.
     - Ensure data scaling preserves feature dimensionality.
  2. Implement `tests/test_predictor.py`:
     - Test single-patient inference on each disease pipeline.
     - Verify returned probabilities are within $[0.0, 1.0]$.
     - Test input validation and error handling for out-of-bound inputs.
  3. Run test suite with `pytest`:
     - Verify all test suites pass with zero failures.
* **Deliverables**:
  - Complete test suite in `tests/` with all passing assertions.

---

### Phase 8: Documentation, Packaging & Final Review
* **Objective**: Provide comprehensive user and developer documentation for running, extending, and deploying the solution.
* **Tasks**:
  1. Create a detailed `README.md`:
     - Project overview, architectural highlights, algorithms used.
     - Quickstart setup instructions (virtualenv, dependencies installation, training commands, running Streamlit app).
     - Clinical datasets summary and feature dictionary.
     - Benchmark performance summary table.
  2. Create a `Dockerfile` for containerized deployment.
  3. Perform final verification of all deliverables against [prd.md](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/prd.md) requirements.
* **Deliverables**:
  - Comprehensive `README.md`
  - Production `Dockerfile`
  - Final project sign-off.

---

### 3. Task Tracking & Milestone Schedule

| Milestone | Target Phase | Status | Key Output Artifact |
| :--- | :--- | :--- | :--- |
| **M1: Architecture & PRD Sign-off** | Phase 1 | Completed | `prd.md`, `architecture.md`, `plan.md` |
| **M2: Data Ingestion & Clean Pipelines** | Phase 2 & 3 | Completed | `src/data_loader.py`, `src/preprocessing.py`, `data/processed/` |
| **M3: Model Training & Benchmarks (4 Algos)** | Phase 4 | Completed | `src/train.py`, `models/saved_models/*.joblib`, `models/metrics/*.csv` |
| **M4: Explainability Engine (SHAP)** | Phase 5 | Completed | `src/explainability.py`, `reports/figures/*_shap_summary.png` |
| **M5: Interactive Streamlit Web App** | Phase 6 | Completed | `app/main.py`, `app/components/*`, Batch CSV screening |
| **M6: Testing & Quality Assurance** | Phase 7 | Completed | `tests/test_*.py` (16 passing test assertions) |
| **M7: Final Packaging & Deployment** | Phase 8 | Completed | `README.md`, `Dockerfile`, `.github/workflows/ci.yml` |
