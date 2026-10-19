# Phase 5: Explainable AI (XAI) & SHAP Interpretability Report
## Multi-Disease Prediction System

---

### 1. The Need for Explainable AI in Clinical Healthcare
Machine learning models applied to diagnostic risk prediction must not function as uninterpretable "black boxes". Clinicians and healthcare evaluators require verifiable evidence detailing:
1. **Global Transparency**: Which physiological biomarkers drive overall disease risk across the patient cohort?
2. **Local Patient Accountability**: Which specific lab results pushed an individual patient's score into the high-risk threshold?

To satisfy clinical governance, the system implements **SHAP (SHapley Additive exPlanations)** grounded in cooperative game theory:
$$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \left[ f(S \cup \{i\}) - f(S) \right]$$
where $\phi_i(x)$ is the marginal contribution of biomarker $i$ towards elevating or mitigating disease risk.

---

### 2. Global Biomarker Importance Findings

#### 2.1 Type-2 Diabetes (Champion: XGBoost)
* **Generated Plot**: [`reports/figures/diabetes_shap_summary.png`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/reports/figures/diabetes_shap_summary.png)
* **Dominant Risk Factors**:
  1. **Glucose**: Primary driver; concentrations $>140\text{ mg/dL}$ exert massive positive Shapley values, shifting predicted risk from baseline ($34.9\%$) to $>80\%$.
  2. **BMI**: Secondary driver; values $>30\text{ kg/m}^2$ significantly compound risk.
  3. **Age**: Synergistic risk multiplier with glucose elevation.
  4. **DiabetesPedigreeFunction**: Highlights genetic predisposition impact.

#### 2.2 Breast Cancer (Champion: Logistic Regression)
* **Generated Plot**: [`reports/figures/breast_cancer_shap_summary.png`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/reports/figures/breast_cancer_shap_summary.png)
* **Dominant Risk Factors**:
  1. **Mean Concave Points**: Strongest single discriminator; reflects severe nuclear indentation indicative of malignancy.
  2. **Worst Perimeter / Worst Radius**: Geometric enlargement attributes displaying strong positive coefficient weights.
  3. **Worst Texture**: Nuclear chromatin granularity contributing significantly to probability calibration.

#### 2.3 Heart Disease (Champion: Support Vector Machine)
* **Generated Plot**: [`reports/figures/heart_disease_shap_summary.png`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/reports/figures/heart_disease_shap_summary.png)
* **Dominant Risk Factors**:
  1. **Homocysteine Level & CRP**: Elevated inflammatory markers show direct association with cardiovascular vulnerability.
  2. **Blood Pressure & Fasting Blood Sugar**: Primary vascular strain biomarkers.
  3. **Exercise Habits**: Protective factor reducing cardiovascular risk odds.

---

### 3. Patient-Level Risk Decomposition
In the web dashboard, every single-patient assessment generates a real-time attribution breakdown:
* **Risk-Elevating Factors (Red)**: Biomarkers exceeding healthy clinical ranges that push probability upwards.
* **Protective Factors (Green)**: Optimal physiological indicators (e.g. normal blood pressure, young age, high exercise habits) mitigating probability.

---

### 4. Deliverables Index
1. **Core Explainability Engine**: [`src/explainability.py`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/src/explainability.py)
2. **Global SHAP Summary Visualizations**:
   * [`reports/figures/diabetes_shap_summary.png`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/reports/figures/diabetes_shap_summary.png)
   * [`reports/figures/breast_cancer_shap_summary.png`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/reports/figures/breast_cancer_shap_summary.png)
   * [`reports/figures/heart_disease_shap_summary.png`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/reports/figures/heart_disease_shap_summary.png)
3. **Automated Unit Tests**: [`tests/test_explainability.py`](file:///c:/Users/sidd5/OneDrive/Desktop/disease%20predictrion/tests/test_explainability.py) ($15/15$ test assertions passing).
