# Comprehensive Exploratory Data Analysis (EDA) Report
## Multi-Disease Prediction System

---

### 1. Executive Summary
This document provides exploratory data profiling, distribution analysis, anomaly detection, and correlation structure across the three benchmark medical datasets:
1. **Heart Disease Dataset** (Cardiovascular screening, $N = 10,000$)
2. **Diabetes Dataset** (Pima Indians Diagnostic, $N = 768$)
3. **Breast Cancer Dataset** (Wisconsin Diagnostic, $N = 569$)

---

### 2. Dataset Overview & Dimensionality

| Dataset | Total Records | Feature Count | Target Variable | Class Breakdown (Neg / Pos) | Class Balance |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Heart Disease** | 10,000 | 20 | `Heart Disease Status` | 8,000 No (80.0%) / 2,000 Yes (20.0%) | Moderately Imbalanced (4:1) |
| **Diabetes** | 768 | 8 | `Outcome` | 500 Neg (65.1%) / 268 Pos (34.9%) | Mildly Imbalanced (1.87:1) |
| **Breast Cancer** | 569 | 30 | `target` (Malignant=1) | 357 Benign (62.7%) / 212 Malignant (37.3%) | Mildly Imbalanced (1.68:1) |

---

### 3. Key Findings & Domain Observations

#### 3.1 Diabetes Dataset: Physiological Zero-Value Anomalies
In human physiology, values of $0$ for blood glucose, diastolic blood pressure, skinfold thickness, serum insulin, and BMI are incompatible with life. These indicate missing or uncollected lab records:
* **Insulin**: 374 zeros (48.7% of total records)
* **SkinThickness**: 227 zeros (29.6% of total records)
* **BMI**: 11 zeros (1.4% of total records)
* **BloodPressure**: 35 zeros (4.6% of total records)
* **Glucose**: 5 zeros (0.7% of total records)
* **Clinical Remedy**: In the preprocessing pipeline, these values are transformed to `NaN` and imputed using class-stratified or median imputation (`SimpleImputer(strategy='median')`), ensuring valid physiological distributions.

#### 3.2 Heart Disease Dataset: Cardiovascular Risk Drivers
* **Prevalence**: 20% positive diagnosis rate across the cohort of 10,000 patients.
* **Correlations**: Homocysteine levels, CRP (C-Reactive Protein), systolic/diastolic blood pressure, and cholesterol exhibit positive correlation with cardiovascular risk.
* **Lifestyle Factors**: Low exercise habits, smoking, and high stress levels show elevated odds ratios for disease presence.

#### 3.3 Breast Cancer Dataset: Strong Nuclear Collinearity
* High multicollinearity is observed between radius, perimeter, and area ($r > 0.95$), which is geometrically expected.
* Extreme separation between benign and malignant cases is apparent on `mean concave points` and `mean concavity`, explaining the very high sensitivity ($>97\%$) achieved by linear and RBF SVM models.

---

### 4. Visualizations Index
The following visualization figures were automatically generated and saved in `reports/figures/`:
1. `class_distributions.png`: Target class distribution across all three disease cohorts.
2. `diabetes_zero_anomalies.png`: Breakdown of invalid zero biomarker measurements in Diabetes.
3. `heart_disease_correlations.png`: Correlation matrix across numerical cardiovascular indicators.
4. `breast_cancer_correlations.png`: Nuclear feature collinearity heatmap.
5. `biomarker_distributions.png`: Density distributions comparing positive vs negative cohorts for key diagnostic biomarkers.
