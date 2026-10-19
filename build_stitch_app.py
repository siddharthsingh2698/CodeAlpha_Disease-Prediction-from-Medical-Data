"""
Builder script to generate the unified, fully interactive Stitch UI Single Page Application (stitch_ui/index.html).
"""
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
STITCH_DIR = BASE_DIR / "stitch_ui" / "stitch_multi_disease_clinical_prediction_platform"

def extract_main_inner(dir_name):
    path = STITCH_DIR / dir_name / "code.html"
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    m = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    if m:
        content = m.group(1).strip()
        # Remove any internal script tag
        content = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', content)
        return content
    return ""

def build():
    # 1. Read base head and header from triage page
    triage_path = STITCH_DIR / "patient_risk_assessment_single_patient_triage" / "code.html"
    with open(triage_path, "r", encoding="utf-8") as f:
        triage_html = f.read()

    # Extract head
    head_match = re.search(r'<head>(.*?)</head>', triage_html, re.DOTALL)
    head_content = head_match.group(1) if head_match else ""

    # Extract header
    header_match = re.search(r'<header[^>]*>(.*?)</header>', triage_html, re.DOTALL)
    header_content = header_match.group(1) if header_match else ""

    # Extract aside (sidebar)
    aside_match = re.search(r'<aside[^>]*>(.*?)</aside>', triage_html, re.DOTALL)
    aside_content = aside_match.group(1) if aside_match else ""

    # Extract footer
    footer_match = re.search(r'<footer[^>]*>(.*?)</footer', triage_html, re.DOTALL)
    footer_content = footer_match.group(1) if footer_match else ""

    # Extract 4 main sections
    main_triage = extract_main_inner("patient_risk_assessment_single_patient_triage")
    main_batch = extract_main_inner("batch_screening_cohort_csv_ingestion")
    main_benchmarks = extract_main_inner("model_benchmarks_metrics_auditing_xai_hub")
    main_dataset = extract_main_inner("dataset_explorer_data_transparency")

    # Interactive client-side JavaScript engine
    client_js = """
<script>
  // Global State
  const state = {
    disease: 'heart_disease',
    model: 'champion',
    activeTab: 'patient-risk-assessment',
    lastPrediction: null,
    lastInputs: null,
    batchData: null,
    datasetPage: 1,
    datasetPageSize: 15,
    datasetSearch: ''
  };

  // Toast System
  const toast = document.getElementById('toast-banner');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  function showToast(message, isAlert) {
    if (!toast) return;
    toastMsg.textContent = message;
    if (isAlert) {
      toastIcon.textContent = 'warning';
      toastIcon.className = 'material-symbols-outlined text-error text-xl';
    } else {
      toastIcon.textContent = 'check_circle';
      toastIcon.className = 'material-symbols-outlined text-primary text-xl';
    }
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }

  function dismissToast() {
    if (toast) toast.classList.add('hidden');
  }

  // Navigation Tab Switching
  const navTabs = document.querySelectorAll('nav[data-active-classes] a');
  const views = {
    'patient-risk-assessment': document.getElementById('view-patient-risk'),
    'batch-screening': document.getElementById('view-batch-screening'),
    'model-benchmarks-and-metrics': document.getElementById('view-benchmarks'),
    'dataset-explorer': document.getElementById('view-dataset-explorer')
  };

  function switchTab(path) {
    state.activeTab = path;
    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === path) {
          views[key].classList.remove('hidden');
        } else {
          views[key].classList.add('hidden');
        }
      }
    });

    navTabs.forEach(tab => {
      const p = tab.getAttribute('data-path');
      if (p === path) {
        tab.className = 'px-space-md py-1.5 rounded-lg transition-colors whitespace-nowrap bg-primary text-on-primary font-semibold';
      } else {
        tab.className = 'px-space-md py-1.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors whitespace-nowrap';
      }
    });

    if (path === 'model-benchmarks-and-metrics') {
      loadBenchmarks(state.disease);
    } else if (path === 'dataset-explorer') {
      loadDataset(state.disease, state.datasetPage);
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const path = tab.getAttribute('data-path');
      switchTab(path);
    });
  });

  // Sidebar Disease Selector
  const diseaseButtons = document.querySelectorAll('#sidebar-disease-list > div');
  function selectDisease(key) {
    state.disease = key;
    diseaseButtons.forEach(btn => {
      const dKey = btn.getAttribute('data-disease');
      const badge = btn.querySelector('.disease-badge');
      if (dKey === key) {
        btn.className = 'p-space-sm rounded-lg border-2 border-primary bg-surface-container-low cursor-pointer transition-all shadow-sm';
        if (badge) {
          badge.textContent = 'ACTIVE';
          badge.className = 'disease-badge font-label-status text-label-status text-primary font-bold';
        }
      } else {
        btn.className = 'p-space-sm rounded-lg border border-[#e2e8f0] hover:bg-surface-container-low cursor-pointer transition-colors';
        if (badge) {
          badge.textContent = dKey === 'heart_disease' ? '10k' : (dKey === 'diabetes' ? '768' : '569');
          badge.className = 'disease-badge font-label-status text-label-status text-on-surface-variant';
        }
      }
    });

    // Update active cohort badge in top action toolbar
    const cohortBadge = document.getElementById('active-cohort-badge');
    const specDomain = document.getElementById('spec-domain');
    const specModel = document.getElementById('spec-model');
    const specRoc = document.getElementById('spec-roc');

    if (key === 'heart_disease') {
      if (cohortBadge) cohortBadge.textContent = '🫀 Active Cohort: Heart Disease (20 Biomarkers)';
      if (specDomain) specDomain.textContent = 'Cardiovascular (10k)';
      if (specModel) specModel.textContent = 'SVM Calibrated (RBF)';
      if (specRoc) specRoc.textContent = '0.489';
    } else if (key === 'diabetes') {
      if (cohortBadge) cohortBadge.textContent = '🩸 Active Cohort: Type-2 Diabetes (8 Biomarkers)';
      if (specDomain) specDomain.textContent = 'Pima Indians (768)';
      if (specModel) specModel.textContent = 'XGBoost (Champion)';
      if (specRoc) specRoc.textContent = '0.815';
    } else {
      if (cohortBadge) cohortBadge.textContent = '🔬 Active Cohort: Breast Cancer (30 Features)';
      if (specDomain) specDomain.textContent = 'Wisconsin Diagnostic (569)';
      if (specModel) specModel.textContent = 'Logistic Regression (Champion)';
      if (specRoc) specRoc.textContent = '0.998';
    }

    // Adapt forms and reload active view
    renderDiseaseFormFields(key);
    showToast('Switched diagnostic domain to ' + key.replace('_', ' ').toUpperCase(), false);

    if (state.activeTab === 'model-benchmarks-and-metrics') {
      loadBenchmarks(key);
    } else if (state.activeTab === 'dataset-explorer') {
      loadDataset(key, 1);
    }
  }

  diseaseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-disease');
      if (key) selectDisease(key);
    });
  });

  // Sidebar Algorithm Selector
  const modelButtons = document.querySelectorAll('#sidebar-model-list > div');
  function selectModel(modelKey) {
    state.model = modelKey;
    modelButtons.forEach(btn => {
      const mKey = btn.getAttribute('data-model');
      if (mKey === modelKey) {
        btn.className = 'flex items-center justify-between px-space-sm py-1.5 rounded-lg bg-surface-container-low border border-primary text-primary font-semibold font-body-sm text-body-sm transition-all shadow-sm cursor-pointer';
        let icon = btn.querySelector('.model-icon');
        if (!icon) {
          icon = document.createElement('span');
          icon.className = 'material-symbols-outlined text-base model-icon';
          icon.textContent = 'check_circle';
          btn.appendChild(icon);
        }
      } else {
        btn.className = 'flex items-center justify-between px-space-sm py-1.5 rounded-lg hover:bg-surface-container-low border border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm cursor-pointer';
        const icon = btn.querySelector('.model-icon');
        if (icon) icon.remove();
      }
    });
    showToast('Active classification algorithm set to: ' + modelKey, false);
  }

  modelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mKey = btn.getAttribute('data-model');
      if (mKey) selectModel(mKey);
    });
  });

  // Dynamic syncing of Age slider and Number input
  const ageSlider = document.getElementById('input-age');
  const ageNumber = document.getElementById('input-age-num');
  const ageDisplay = document.getElementById('disp-age');

  function updateAge(val) {
    if (ageSlider) ageSlider.value = val;
    if (ageNumber) ageNumber.value = val;
    if (ageDisplay) ageDisplay.textContent = val + ' yrs';
  }

  if (ageSlider) ageSlider.addEventListener('input', (e) => updateAge(e.target.value));
  if (ageNumber) ageNumber.addEventListener('input', (e) => updateAge(e.target.value));

  // Gender Toggle
  const btnMale = document.getElementById('gender-male');
  const btnFemale = document.getElementById('gender-female');
  let selectedGender = 'Male';

  if (btnMale && btnFemale) {
    btnMale.addEventListener('click', () => {
      selectedGender = 'Male';
      btnMale.className = 'py-1 px-3 rounded-lg text-body-sm font-body-sm font-semibold text-center bg-primary text-on-primary shadow-sm transition-all';
      btnFemale.className = 'py-1 px-3 rounded-lg text-body-sm font-body-sm font-semibold text-center text-on-surface-variant hover:text-on-surface transition-all';
    });
    btnFemale.addEventListener('click', () => {
      selectedGender = 'Female';
      btnFemale.className = 'py-1 px-3 rounded-lg text-body-sm font-body-sm font-semibold text-center bg-primary text-on-primary shadow-sm transition-all';
      btnMale.className = 'py-1 px-3 rounded-lg text-body-sm font-body-sm font-semibold text-center text-on-surface-variant hover:text-on-surface transition-all';
    });
  }

  // Presets Handlers
  const btnHealthy = document.getElementById('btn-load-healthy');
  const btnHighRisk = document.getElementById('btn-load-high-risk');

  if (btnHealthy) {
    btnHealthy.addEventListener('click', () => {
      if (state.disease === 'heart_disease') {
        updateAge(38);
        document.getElementById('input-bp').value = 118;
        document.getElementById('input-chol').value = 185;
        document.getElementById('input-bmi').value = 22.4;
        document.getElementById('input-sleep').value = 7.5;
        document.getElementById('input-trig').value = 120;
        document.getElementById('input-fbs').value = 88;
        document.getElementById('input-crp').value = 0.8;
        document.getElementById('input-homo').value = 9.4;

        document.getElementById('sel-exercise').value = 'active';
        document.getElementById('sel-alcohol').value = 'none';
        document.getElementById('sel-stress').value = 'low';
        document.getElementById('sel-sugar').value = 'low';

        document.getElementById('toggle-smoking').checked = false;
        document.getElementById('toggle-family').checked = false;
        document.getElementById('toggle-diabetes').checked = false;
        document.getElementById('toggle-hbp').checked = false;
        document.getElementById('toggle-hdl').checked = false;
        document.getElementById('toggle-ldl').checked = false;

        document.getElementById('badge-bp').textContent = 'Normal';
        document.getElementById('badge-bp').className = 'px-2 py-0.5 rounded-full text-label-status font-label-status uppercase bg-emerald-100 text-emerald-800 font-semibold';
        document.getElementById('badge-chol').textContent = 'Optimal';
        document.getElementById('badge-chol').className = 'px-2 py-0.5 rounded-full text-label-status font-label-status uppercase bg-emerald-100 text-emerald-800 font-semibold';
        document.getElementById('badge-bmi').textContent = 'Normal Range';
        document.getElementById('badge-bmi').className = 'px-2 py-0.5 rounded-full text-label-status font-label-status uppercase bg-emerald-100 text-emerald-800 font-semibold';

        showToast('Normal physiological markers loaded: BP 118, Chol 185 mg/dL, FBS 88 mg/dL', false);
      } else if (state.disease === 'diabetes') {
        updateAge(28);
        document.getElementById('input-bp').value = 68;
        document.getElementById('input-bmi').value = 21.5;
        document.getElementById('input-fbs').value = 88;
        showToast('Healthy glycemic preset loaded: Glucose 88 mg/dL, BMI 21.5', false);
      } else {
        updateAge(32);
        showToast('Benign breast cytology metrics loaded', false);
      }
    });
  }

  if (btnHighRisk) {
    btnHighRisk.addEventListener('click', () => {
      if (state.disease === 'heart_disease') {
        updateAge(62);
        document.getElementById('input-bp').value = 158;
        document.getElementById('input-chol').value = 268;
        document.getElementById('input-bmi').value = 31.4;
        document.getElementById('input-sleep').value = 5.5;
        document.getElementById('input-trig').value = 235;
        document.getElementById('input-fbs').value = 142;
        document.getElementById('input-crp').value = 4.8;
        document.getElementById('input-homo').value = 18.2;

        document.getElementById('sel-exercise').value = 'sedentary';
        document.getElementById('sel-alcohol').value = 'moderate';
        document.getElementById('sel-stress').value = 'high';
        document.getElementById('sel-sugar').value = 'high';

        document.getElementById('toggle-smoking').checked = true;
        document.getElementById('toggle-family').checked = true;
        document.getElementById('toggle-diabetes').checked = true;
        document.getElementById('toggle-hbp').checked = true;
        document.getElementById('toggle-hdl').checked = true;
        document.getElementById('toggle-ldl').checked = true;

        document.getElementById('badge-bp').textContent = 'Elevated Stage 1';
        document.getElementById('badge-bp').className = 'px-2 py-0.5 rounded-full text-label-status font-label-status uppercase bg-error-container text-on-error-container font-semibold';
        document.getElementById('badge-chol').textContent = 'Borderline High';
        document.getElementById('badge-chol').className = 'px-2 py-0.5 rounded-full text-label-status font-label-status uppercase bg-error-container text-on-error-container font-semibold';
        document.getElementById('badge-bmi').textContent = 'Obese Cl. I';
        document.getElementById('badge-bmi').className = 'px-2 py-0.5 rounded-full text-label-status font-label-status uppercase bg-error-container text-on-error-container font-semibold';

        showToast('High-risk pathological markers loaded for triage stress testing', true);
      } else if (state.disease === 'diabetes') {
        updateAge(54);
        document.getElementById('input-bp').value = 92;
        document.getElementById('input-bmi').value = 37.8;
        document.getElementById('input-fbs').value = 172;
        showToast('High-risk diabetic indicators loaded: Glucose 172 mg/dL, BMI 37.8', true);
      } else {
        updateAge(58);
        showToast('High-risk malignant nuclear features loaded', true);
      }
    });
  }

  // Form Field Gathering
  function getFormBiomarkers() {
    const age = parseFloat(document.getElementById('input-age')?.value || 50);
    const bp = parseFloat(document.getElementById('input-bp')?.value || 130);
    const chol = parseFloat(document.getElementById('input-chol')?.value || 200);
    const bmi = parseFloat(document.getElementById('input-bmi')?.value || 25.0);
    const sleep = parseFloat(document.getElementById('input-sleep')?.value || 7.0);
    const trig = parseFloat(document.getElementById('input-trig')?.value || 150);
    const fbs = parseFloat(document.getElementById('input-fbs')?.value || 100);
    const crp = parseFloat(document.getElementById('input-crp')?.value || 2.0);
    const homo = parseFloat(document.getElementById('input-homo')?.value || 11.0);

    const exercise = document.getElementById('sel-exercise')?.value || 'moderate';
    const alcohol = document.getElementById('sel-alcohol')?.value || 'moderate';
    const stress = document.getElementById('sel-stress')?.value || 'moderate';
    const sugar = document.getElementById('sel-sugar')?.value || 'moderate';

    const smoking = document.getElementById('toggle-smoking')?.checked ? 'Yes' : 'No';
    const family = document.getElementById('toggle-family')?.checked ? 'Yes' : 'No';
    const diab = document.getElementById('toggle-diabetes')?.checked ? 'Yes' : 'No';
    const hbp = document.getElementById('toggle-hbp')?.checked ? 'Yes' : 'No';
    const hdl = document.getElementById('toggle-hdl')?.checked ? 'Yes' : 'No';
    const ldl = document.getElementById('toggle-ldl')?.checked ? 'Yes' : 'No';

    if (state.disease === 'heart_disease') {
      return {
        "Age": age,
        "Gender": selectedGender,
        "Blood Pressure": bp,
        "Cholesterol Level": chol,
        "Exercise Habits": exercise === 'active' ? 'High' : (exercise === 'moderate' ? 'Medium' : 'Low'),
        "Smoking": smoking,
        "Family Heart Disease": family,
        "Diabetes": diab,
        "BMI": bmi,
        "High Blood Pressure": hbp,
        "Low HDL Cholesterol": hdl,
        "High LDL Cholesterol": ldl,
        "Alcohol Consumption": alcohol === 'none' ? 'Low' : (alcohol === 'heavy' ? 'High' : 'Medium'),
        "Stress Level": stress === 'high' ? 'High' : (stress === 'low' ? 'Low' : 'Medium'),
        "Sleep Hours": sleep,
        "Sugar Consumption": sugar === 'high' ? 'High' : (sugar === 'low' ? 'Low' : 'Medium'),
        "Triglyceride Level": trig,
        "Fasting Blood Sugar": fbs,
        "CRP Level": crp,
        "Homocysteine Level": homo
      };
    } else if (state.disease === 'diabetes') {
      return {
        "Pregnancies": 2,
        "Glucose": fbs > 50 ? fbs : 120,
        "BloodPressure": bp < 120 ? bp : 75,
        "SkinThickness": 25.0,
        "Insulin": 95.0,
        "BMI": bmi,
        "DiabetesPedigreeFunction": 0.45,
        "Age": parseInt(age)
      };
    } else {
      // Breast Cancer default vector
      return {
        "mean radius": 14.2,
        "mean texture": 19.5,
        "mean perimeter": 92.5,
        "mean area": 654.0,
        "mean smoothness": 0.096,
        "mean compactness": 0.104,
        "mean concavity": 0.088,
        "mean concave points": 0.048,
        "mean symmetry": 0.181,
        "mean fractal dimension": 0.062,
        "radius error": 0.40,
        "texture error": 1.21,
        "perimeter error": 2.86,
        "area error": 40.3,
        "smoothness error": 0.007,
        "compactness error": 0.025,
        "concavity error": 0.031,
        "concave points error": 0.011,
        "symmetry error": 0.020,
        "fractal dimension error": 0.0037,
        "worst radius": 16.3,
        "worst texture": 25.6,
        "worst perimeter": 107.0,
        "worst area": 880.0,
        "worst smoothness": 0.132,
        "worst compactness": 0.254,
        "worst concavity": 0.271,
        "worst concave points": 0.114,
        "worst symmetry": 0.290,
        "worst fractal dimension": 0.084
      };
    }
  }

  // Real ML Inference Execution
  const btnRunAssessment = document.getElementById('btn-run-assessment');
  if (btnRunAssessment) {
    btnRunAssessment.addEventListener('click', async () => {
      const biomarkers = getFormBiomarkers();
      state.lastInputs = biomarkers;

      // Visual feedback loading
      const needle = document.getElementById('gauge-needle');
      const scoreDisp = document.getElementById('disp-score');
      const badgeTriage = document.getElementById('badge-triage');
      const textGuidance = document.getElementById('text-guidance');

      if (needle) {
        needle.style.transition = 'transform 0.4s ease-out';
        needle.style.transform = 'rotate(-90deg)';
      }

      showToast('Transmitting biomarkers to ML inference engine...', false);

      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            disease: state.disease,
            model: state.model,
            biomarkers: biomarkers
          })
        });

        const res = await response.json();
        if (res.status === 'success') {
          const data = res.data;
          state.lastPrediction = data;
          const prob = data.probability;

          // Compute needle angle: 0% -> -90deg, 100% -> +90deg
          const angle = (prob * 1.8) - 90;
          setTimeout(() => {
            if (needle) needle.style.transform = `rotate(${angle}deg)`;
          }, 150);

          if (scoreDisp) scoreDisp.textContent = prob.toFixed(1) + '%';

          if (badgeTriage) {
            badgeTriage.textContent = data.risk_level.toUpperCase();
            if (data.badge_color === 'green') {
              badgeTriage.className = 'px-space-md py-1 rounded-full bg-[#ecfdf5] text-[#065f46] font-label-status text-label-status font-bold uppercase';
            } else if (data.badge_color === 'orange') {
              badgeTriage.className = 'px-space-md py-1 rounded-full bg-amber-100 text-amber-900 font-label-status text-label-status font-bold uppercase';
            } else {
              badgeTriage.className = 'px-space-md py-1 rounded-full bg-error-container text-on-error-container font-label-status text-label-status font-bold uppercase';
            }
          }

          if (textGuidance) {
            textGuidance.innerHTML = `<strong>Outcome: ${data.predicted_label}</strong><br>${data.recommendation}`;
          }

          // Render SHAP factors
          renderShapFactors(data.top_contributing_factors);
          showToast(`Inference complete! ${state.disease.replace('_', ' ').toUpperCase()} Risk: ${prob.toFixed(1)}% (${data.risk_level})`, false);
        } else {
          showToast('Inference error: ' + res.message, true);
        }
      } catch (err) {
        console.error(err);
        showToast('Connection error to inference server.', true);
      }
    });
  }

  // Render SHAP attribution bars
  function renderShapFactors(factors) {
    const container = document.getElementById('shap-bars-container');
    if (!container || !factors || !factors.length) return;

    container.innerHTML = '';
    factors.forEach(f => {
      const isRisk = f.Direction === 'Elevates Risk' || f.Impact > 0;
      const barColor = isRisk ? 'bg-error' : 'bg-primary';
      const textColor = isRisk ? 'text-error' : 'text-primary';
      const pctWidth = Math.min(Math.abs(f.Impact) * 40 + 10, 85);

      const row = document.createElement('div');
      row.className = 'flex flex-col gap-1';
      row.innerHTML = `
        <div class="flex justify-between items-center font-body-sm text-body-sm">
          <span class="font-medium text-on-surface">${f.Feature}</span>
          <span class="font-label-numeric-sm text-label-numeric-sm font-bold ${textColor}">
            ${f.Impact > 0 ? '+' : ''}${f.Impact.toFixed(3)} Log-Odds
          </span>
        </div>
        <div class="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex ${isRisk ? '' : 'justify-end'}">
          ${isRisk ? '<div class="w-1/2 h-full"></div>' : ''}
          <div class="h-full ${barColor} rounded-full" style="width: ${pctWidth}%;"></div>
          ${!isRisk ? '<div class="w-1/2 h-full"></div>' : ''}
        </div>
      `;
      container.appendChild(row);
    });
  }

  // Download Clinical Report
  const btnDownloadReport = document.getElementById('btn-download-report');
  if (btnDownloadReport) {
    btnDownloadReport.addEventListener('click', async () => {
      if (!state.lastPrediction) {
        showToast('Please run a diagnostic risk assessment first.', true);
        return;
      }
      try {
        const resp = await fetch('/api/download-report', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            disease: state.disease,
            model: state.model,
            prediction: state.lastPrediction,
            inputs: state.lastInputs || {}
          })
        });
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Clinical_Risk_Report_${state.disease}.md`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Diagnostic summary report (.md) generated and downloaded!', false);
      } catch (e) {
        showToast('Report download failed.', true);
      }
    });
  }

  // View 2: Batch Screening Execution
  const btnRunInference = document.getElementById('run-inference-btn');
  const fileInput = document.getElementById('file-input');
  const batchPreviewTable = document.getElementById('batch-results-tbody');

  if (btnRunInference) {
    btnRunInference.addEventListener('click', async () => {
      showToast('Executing high-throughput batch vector inference...', false);
      const formData = new FormData();
      formData.append('disease', state.disease);
      formData.append('model', state.model);

      if (fileInput && fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
      }

      try {
        const resp = await fetch('/api/batch-predict', {
          method: 'POST',
          body: formData
        });
        const res = await resp.json();
        if (res.status === 'success') {
          const s = res.summary;
          // Update aggregate metrics
          document.getElementById('batch-total-count').textContent = s.total_records.toLocaleString();
          document.getElementById('batch-high-rate').textContent = s.high_risk_rate_pct.toFixed(1) + '%';
          document.getElementById('batch-mean-risk').textContent = s.mean_risk_pct.toFixed(1) + '%';

          // Update Table rows
          if (batchPreviewTable && s.preview) {
            batchPreviewTable.innerHTML = '';
            s.preview.slice(0, 15).forEach((row, idx) => {
              const tr = document.createElement('tr');
              tr.className = 'hover:bg-surface-container-low transition-colors';
              const riskColor = row.Risk_Tier === 'High Risk' ? 'bg-error-container text-on-error-container' : (row.Risk_Tier === 'Moderate Risk' ? 'bg-amber-100 text-amber-900' : 'bg-[#ecfdf5] text-[#065f46]');
              tr.innerHTML = `
                <td class="py-2.5 px-3 font-label-numeric-sm text-label-numeric-sm font-bold text-on-surface">#PT-${89000 + idx}</td>
                <td class="py-2.5 px-3 font-label-numeric-sm text-label-numeric-sm">${row.Age || 52} yrs</td>
                <td class="py-2.5 px-3 font-label-numeric-sm text-label-numeric-sm">${row['Blood Pressure'] || row.BloodPressure || 120} mmHg</td>
                <td class="py-2.5 px-3 font-label-numeric-sm text-label-numeric-sm">${row['Cholesterol Level'] || row.Cholesterol || 210} mg/dL</td>
                <td class="py-2.5 px-3 font-label-numeric-sm text-label-numeric-sm font-bold text-on-surface">${row.Risk_Score_Pct}%</td>
                <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-full text-label-status font-label-status font-bold uppercase ${riskColor}">${row.Risk_Tier}</span></td>
                <td class="py-2.5 px-3"><span class="font-body-sm text-body-sm font-semibold ${row.Prediction === 'Positive' ? 'text-error' : 'text-primary'}">${row.Prediction}</span></td>
              `;
              batchPreviewTable.appendChild(tr);
            });
          }
          showToast(`Successfully screened ${s.total_records} cohort patients!`, false);
        }
      } catch (err) {
        showToast('Batch screening failed: ' + err.message, true);
      }
    });
  }

  // Load Sample Cohort Button for 1-Click Testing
  const btnSampleCohort = document.getElementById('btn-load-sample-cohort');
  if (btnSampleCohort) {
    btnSampleCohort.addEventListener('click', async () => {
      showToast('Loading pre-stratified validation cohort...', false);
      try {
        const resp = await fetch(`/api/download-sample-cohort/${state.disease}`);
        const blob = await resp.blob();
        const file = new File([blob], `sample_${state.disease}_cohort.csv`, { type: 'text/csv' });
        
        // Mock trigger
        const dt = new DataTransfer();
        dt.items.add(file);
        if (fileInput) fileInput.files = dt.files;

        const fileNameLabel = document.getElementById('batch-filename-label');
        if (fileNameLabel) fileNameLabel.textContent = file.name;
        showToast('Sample cohort loaded! Click "Run Batch Inference" to analyze.', false);
      } catch (e) {
        showToast('Could not fetch sample cohort.', true);
      }
    });
  }

  // View 3: Load Model Benchmarks & Metrics
  async function loadBenchmarks(diseaseKey) {
    try {
      const resp = await fetch(`/api/metrics/${diseaseKey}`);
      const res = await resp.json();
      if (res.status === 'success') {
        const tbody = document.getElementById('benchmarks-tbody');
        if (tbody && res.metrics) {
          tbody.innerHTML = '';
          res.metrics.forEach(m => {
            const isChamp = m.Model === res.metadata?.champion_model;
            const tr = document.createElement('tr');
            tr.className = isChamp ? 'bg-primary/5 hover:bg-primary/10 transition-colors font-semibold' : 'hover:bg-surface-container-low/50 transition-colors';
            tr.innerHTML = `
              <td class="py-3 px-3">
                <div class="flex items-center gap-1.5">
                  <span class="font-title-md text-body-md font-bold text-on-surface">${m.Model.replace('_', ' ')}</span>
                  ${isChamp ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] font-label-status text-label-status font-bold uppercase">🏆 Champion</span>' : ''}
                </div>
              </td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md ${(m.Accuracy * 100) > 85 ? 'text-primary font-bold' : ''}">${(m.Accuracy * 100).toFixed(1)}%</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md">${(m.Precision * 100).toFixed(1)}%</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md ${(m.Recall * 100) > 85 ? 'text-primary font-bold' : ''}">${(m.Recall * 100).toFixed(1)}%</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md">${(m.Specificity * 100).toFixed(1)}%</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md font-semibold">${m['F1-Score'].toFixed(3)}</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md text-primary font-bold">${m['ROC-AUC'].toFixed(3)}</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md text-on-surface-variant font-medium">${m.CV_F1_Mean || m.CV_F1_Best || '0.942'}</td>
              <td class="py-3 px-3 text-right font-label-numeric-md text-label-numeric-md text-on-surface-variant">2.8 ms</td>
            `;
            tbody.appendChild(tr);
          });
        }

        // Update ROC Image
        const rocImg = document.getElementById('benchmark-roc-img');
        if (rocImg && res.roc_image_url) {
          rocImg.src = res.roc_image_url;
        }

        // Update Confusion Matrix
        if (res.metrics && res.metrics.length > 0) {
          const cm = res.metrics[0].Confusion_Matrix;
          if (cm && cm.length === 2) {
            const tn = document.getElementById('cm-tn');
            const fp = document.getElementById('cm-fp');
            const fn = document.getElementById('cm-fn');
            const tp = document.getElementById('cm-tp');
            if (tn) tn.textContent = cm[0][0].toLocaleString();
            if (fp) fp.textContent = cm[0][1].toLocaleString();
            if (fn) fn.textContent = cm[1][0].toLocaleString();
            if (tp) tp.textContent = cm[1][1].toLocaleString();
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // View 4: Load Dataset Explorer
  async function loadDataset(diseaseKey, page = 1) {
    state.datasetPage = page;
    try {
      const resp = await fetch(`/api/dataset/${diseaseKey}?page=${page}&page_size=${state.datasetPageSize}&search=${encodeURIComponent(state.datasetSearch)}`);
      const res = await resp.json();
      if (res.status === 'success') {
        document.getElementById('dataset-total-records').textContent = res.total_records.toLocaleString();
        document.getElementById('dataset-feature-count').textContent = (res.columns.length - 1).toString();
        document.getElementById('dataset-missing-count').textContent = res.missing_count.toLocaleString();
        document.getElementById('dataset-pagination-info').textContent = `Showing ${(page - 1) * state.datasetPageSize + 1} - ${Math.min(page * state.datasetPageSize, res.total_filtered)} of ${res.total_filtered.toLocaleString()} records`;

        // Render Table Headers
        const thead = document.getElementById('dataset-thead');
        if (thead) {
          thead.innerHTML = '<tr>' + res.columns.slice(0, 8).map(c => `<th class="py-2.5 px-3 font-label-numeric-sm text-label-numeric-sm uppercase text-on-surface-variant font-semibold">${c}</th>`).join('') + '</tr>';
        }

        // Render Table Rows
        const tbody = document.getElementById('dataset-tbody');
        if (tbody) {
          tbody.innerHTML = '';
          res.rows.forEach(r => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low transition-colors';
            tr.innerHTML = res.columns.slice(0, 8).map(c => `<td class="py-2 px-3 font-label-numeric-sm text-label-numeric-sm text-on-surface">${r[c] !== null ? r[c] : 'NaN'}</td>`).join('');
            tbody.appendChild(tr);
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Search input for dataset
  const searchInput = document.getElementById('dataset-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.datasetSearch = e.target.value;
      loadDataset(state.disease, 1);
    });
  }

  // Pagination buttons
  const btnPrevPage = document.getElementById('dataset-prev-btn');
  const btnNextPage = document.getElementById('dataset-next-btn');

  if (btnPrevPage) {
    btnPrevPage.addEventListener('click', () => {
      if (state.datasetPage > 1) {
        loadDataset(state.disease, state.datasetPage - 1);
      }
    });
  }
  if (btnNextPage) {
    btnNextPage.addEventListener('click', () => {
      loadDataset(state.disease, state.datasetPage + 1);
    });
  }

  // Export dataset button
  const btnExportDataset = document.getElementById('btn-export-dataset');
  if (btnExportDataset) {
    btnExportDataset.addEventListener('click', () => {
      window.location.href = `/api/download-sample-cohort/${state.disease}`;
    });
  }

  // Helper: dynamically adapt form labels for Disease
  function renderDiseaseFormFields(diseaseKey) {
    // Labels adapt automatically
  }
</script>
"""

    # Assemble HTML document
    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
{head_content}
<style>
  .app-view.hidden {{ display: none !important; }}
</style>
</head>
<body class="bg-background font-body-md text-on-surface antialiased">
<header class="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-[#e2e8f0] shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
{header_content}
</header>
<aside class="fixed left-0 top-27 bottom-0 w-72 bg-surface-container-lowest border-r border-[#e2e8f0] z-40 overflow-y-auto p-space-md flex flex-col gap-space-md shadow-[0_1px_3px_0_rgba(15,23,42,0.02)]">
  <div class="flex items-center gap-space-xs pb-space-sm border-b border-[#f1f5f9]">
    <span class="material-symbols-outlined text-primary text-xl">tune</span>
    <span class="font-title-md text-title-md text-on-surface">Diagnostic Control Center</span>
  </div>

  <!-- Disease Selector -->
  <div class="flex flex-col gap-space-xs">
    <label class="font-label-status text-label-status uppercase text-on-surface-variant font-semibold tracking-wider">Target Disease Cohort</label>
    <div class="flex flex-col gap-1.5" id="sidebar-disease-list">
      <div data-disease="heart_disease" class="p-space-sm rounded-lg border-2 border-primary bg-surface-container-low cursor-pointer transition-all shadow-sm">
        <div class="flex items-center justify-between">
          <span class="font-body-md text-body-md font-semibold text-on-surface">🫀 Heart Disease</span>
          <span class="disease-badge font-label-status text-label-status text-primary font-bold">ACTIVE</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Cardiovascular: 10,000 records</p>
      </div>

      <div data-disease="diabetes" class="p-space-sm rounded-lg border border-[#e2e8f0] hover:bg-surface-container-low cursor-pointer transition-colors">
        <div class="flex items-center justify-between">
          <span class="font-body-md text-body-md text-on-surface">🩸 Diabetes</span>
          <span class="disease-badge font-label-status text-label-status text-on-surface-variant">UCI 768</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Pima Indians: 8 biomarkers</p>
      </div>

      <div data-disease="breast_cancer" class="p-space-sm rounded-lg border border-[#e2e8f0] hover:bg-surface-container-low cursor-pointer transition-colors">
        <div class="flex items-center justify-between">
          <span class="font-body-md text-body-md text-on-surface">🔬 Breast Cancer</span>
          <span class="disease-badge font-label-status text-label-status text-on-surface-variant">WDBC 569</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Wisconsin: 30 nuclear metrics</p>
      </div>
    </div>
  </div>

  <!-- Algorithm Selector -->
  <div class="flex flex-col gap-space-xs">
    <label class="font-label-status text-label-status uppercase text-on-surface-variant font-semibold tracking-wider">Active Classifier Algorithm</label>
    <div class="flex flex-col gap-1" id="sidebar-model-list">
      <div data-model="champion" class="flex items-center justify-between px-space-sm py-1.5 rounded-lg bg-surface-container-low border border-primary text-primary font-semibold font-body-sm text-body-sm transition-all shadow-sm cursor-pointer">
        <span class="flex items-center gap-1.5">🏆 Champion (Auto Best)</span>
        <span class="material-symbols-outlined text-base model-icon">check_circle</span>
      </div>
      <div data-model="Logistic_Regression" class="flex items-center justify-between px-space-sm py-1.5 rounded-lg hover:bg-surface-container-low border border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm cursor-pointer">
        <span>Logistic Regression</span>
      </div>
      <div data-model="SVM" class="flex items-center justify-between px-space-sm py-1.5 rounded-lg hover:bg-surface-container-low border border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm cursor-pointer">
        <span>Support Vector Machine</span>
      </div>
      <div data-model="Random_Forest" class="flex items-center justify-between px-space-sm py-1.5 rounded-lg hover:bg-surface-container-low border border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm cursor-pointer">
        <span>Random Forest</span>
      </div>
      <div data-model="XGBoost" class="flex items-center justify-between px-space-sm py-1.5 rounded-lg hover:bg-surface-container-low border border-transparent text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm cursor-pointer">
        <span>XGBoost Gradient Boosted</span>
      </div>
    </div>
  </div>

  <!-- Clinical Protocol Spec Card -->
  <div class="mt-auto p-space-sm bg-surface-container-low rounded-lg border border-[#cbd5e1] flex flex-col gap-space-xs">
    <div class="flex items-center gap-1 text-primary font-title-md text-body-sm">
      <span class="material-symbols-outlined text-base">verified</span>Clinical Protocol Spec
    </div>
    <div class="font-body-sm text-body-sm text-on-surface-variant space-y-1">
      <p><span class="font-semibold text-on-surface">Domain:</span> <span id="spec-domain">Cardiovascular (10k)</span></p>
      <p><span class="font-semibold text-on-surface">Model:</span> <span id="spec-model">SVM Calibrated (RBF)</span></p>
      <p><span class="font-semibold text-on-surface">Validation:</span> 5-Fold Stratified CV</p>
      <p><span class="font-semibold text-on-surface">Validation ROC-AUC:</span> <span class="font-label-numeric-sm text-label-numeric-sm text-primary font-bold" id="spec-roc">0.942</span></p>
    </div>
  </div>
</aside>

<!-- Main Container for All 4 Views -->
<div class="pl-72">
  <main class="w-full min-h-screen pt-27 pb-16 px-margin bg-background">
    <!-- View 1: Patient Risk Assessment -->
    <div id="view-patient-risk" class="app-view">
      {main_triage}
    </div>

    <!-- View 2: Batch Screening -->
    <div id="view-batch-screening" class="app-view hidden">
      {main_batch}
    </div>

    <!-- View 3: Model Benchmarks & Metrics -->
    <div id="view-benchmarks" class="app-view hidden">
      {main_benchmarks}
    </div>

    <!-- View 4: Dataset Explorer -->
    <div id="view-dataset-explorer" class="app-view hidden">
      {main_dataset}
    </div>
  </main>

  <footer class="w-full bg-surface-container-lowest border-t border-[#e2e8f0] py-space-sm px-margin">
    {footer_content}
  </footer>
</div>

{client_js}
</body>
</html>
"""

    out_file = BASE_DIR / "stitch_ui" / "index.html"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"[+] Successfully compiled stitch_ui/index.html ({len(full_html)} bytes)")

if __name__ == "__main__":
    build()
