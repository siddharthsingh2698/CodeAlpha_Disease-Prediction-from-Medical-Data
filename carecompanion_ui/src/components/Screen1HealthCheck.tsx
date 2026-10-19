/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export const Screen1HealthCheck: React.FC = () => {
  const {
    selectedDisease,
    selectedModel,
    clinicalBiomarkers,
    updateClinicalBiomarkers,
    runClinicalAssessment,
    isAssessing,
    loadHealthyPreset,
    loadHighRiskPreset,
    t,
  } = useApp();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Top Header Section */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-container/20 text-primary dark:text-[#6bd8cb] text-xs font-bold mb-3 border border-primary/20">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Validated 5-Fold Stratified ML Pipelines Active</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface mb-3 font-headline">
          {selectedDisease === 'heart_disease' && 'Cardiovascular Clinical Risk Triage'}
          {selectedDisease === 'diabetes' && 'Type-2 Diabetes Glycemic Evaluation'}
          {selectedDisease === 'breast_cancer' && 'Wisconsin Diagnostic Cytology Triage'}
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant font-normal leading-relaxed">
          Calibrated diagnostic screening powered by {selectedModel.replace('_', ' ')}. Enter patient biomarkers below or load pre-stratified validation presets.
        </p>
      </div>

      {/* Main Grid: Clinical Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {/* Left 2 Columns: Core Biomarker Sliders */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-7 relative z-10">
            {/* Age & Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Age Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-secondary-container/40 dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[16px]">
                      calendar_today
                    </span>
                    Patient Age
                  </label>
                  <span className="text-sm font-bold text-primary dark:text-[#6bd8cb] bg-primary/10 px-3 py-0.5 rounded-full">
                    {clinicalBiomarkers.age} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="95"
                  value={clinicalBiomarkers.age}
                  onChange={e => updateClinicalBiomarkers({ age: Number(e.target.value) })}
                  className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-medium">
                  <span>18 yrs</span>
                  <span>55 yrs</span>
                  <span>95 yrs</span>
                </div>
              </div>

              {/* Patient Biological Sex */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-secondary-container/40 dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[16px]">
                    wc
                  </span>
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => updateClinicalBiomarkers({ gender: 'Male' })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      clinicalBiomarkers.gender === 'Male'
                        ? 'bg-primary text-on-primary shadow-xs ring-2 ring-primary/40'
                        : 'bg-surface-container-low dark:bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    👨 Male
                  </button>
                  <button
                    type="button"
                    onClick={() => updateClinicalBiomarkers({ gender: 'Female' })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      clinicalBiomarkers.gender === 'Female'
                        ? 'bg-primary text-on-primary shadow-xs ring-2 ring-primary/40'
                        : 'bg-surface-container-low dark:bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    👩 Female
                  </button>
                </div>
              </div>
            </div>

            {/* HEART DISEASE FORM FIELDS */}
            {selectedDisease === 'heart_disease' && (
              <>
                {/* Blood Pressure & Cholesterol */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[16px]">
                          speed
                        </span>
                        Systolic BP (mmHg)
                      </label>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${clinicalBiomarkers.bloodPressure > 140 ? 'bg-error-container text-on-error-container' : 'bg-emerald-100 text-emerald-800'}`}>
                        {clinicalBiomarkers.bloodPressure} mmHg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="200"
                      value={clinicalBiomarkers.bloodPressure}
                      onChange={e => updateClinicalBiomarkers({ bloodPressure: Number(e.target.value) })}
                      className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-medium">
                      <span>90 (Optimal)</span>
                      <span>130 (Pre-HTN)</span>
                      <span>200 (Stage 2)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[16px]">
                          bloodtype
                        </span>
                        Serum Cholesterol (mg/dL)
                      </label>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${clinicalBiomarkers.cholesterol > 240 ? 'bg-error-container text-on-error-container' : 'bg-emerald-100 text-emerald-800'}`}>
                        {clinicalBiomarkers.cholesterol} mg/dL
                      </span>
                    </div>
                    <input
                      type="range"
                      min="130"
                      max="340"
                      value={clinicalBiomarkers.cholesterol}
                      onChange={e => updateClinicalBiomarkers({ cholesterol: Number(e.target.value) })}
                      className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-medium">
                      <span>130 (Desirable)</span>
                      <span>200 (Borderline)</span>
                      <span>340 (High)</span>
                    </div>
                  </div>
                </div>

                {/* BMI & Fasting Glucose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[16px]">
                          monitor_weight
                        </span>
                        Body Mass Index (BMI)
                      </label>
                      <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                        {clinicalBiomarkers.bmi.toFixed(1)} kg/m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min="16.0"
                      max="45.0"
                      step="0.1"
                      value={clinicalBiomarkers.bmi}
                      onChange={e => updateClinicalBiomarkers({ bmi: Number(e.target.value) })}
                      className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[16px]">
                          water_drop
                        </span>
                        Fasting Blood Sugar (mg/dL)
                      </label>
                      <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                        {clinicalBiomarkers.fastingBloodSugar} mg/dL
                      </span>
                    </div>
                    <input
                      type="range"
                      min="65"
                      max="220"
                      value={clinicalBiomarkers.fastingBloodSugar}
                      onChange={e => updateClinicalBiomarkers({ fastingBloodSugar: Number(e.target.value) })}
                      className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Triglycerides, Sleep & Inflammatory Markers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-surface-container/60 border border-surface-container-high dark:border-surface-variant">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase">Triglycerides</span>
                    <div className="flex items-center justify-between mt-1">
                      <input
                        type="number"
                        value={clinicalBiomarkers.triglycerides}
                        onChange={e => updateClinicalBiomarkers({ triglycerides: Number(e.target.value) })}
                        className="w-20 bg-transparent text-sm font-bold text-on-surface focus:outline-none"
                      />
                      <span className="text-[10px] text-on-surface-variant">mg/dL</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-surface-container/60 border border-surface-container-high dark:border-surface-variant">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase">CRP Level</span>
                    <div className="flex items-center justify-between mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={clinicalBiomarkers.crpLevel}
                        onChange={e => updateClinicalBiomarkers({ crpLevel: Number(e.target.value) })}
                        className="w-20 bg-transparent text-sm font-bold text-on-surface focus:outline-none"
                      />
                      <span className="text-[10px] text-on-surface-variant">mg/L</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-surface-container/60 border border-surface-container-high dark:border-surface-variant">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase">Sleep Duration</span>
                    <div className="flex items-center justify-between mt-1">
                      <input
                        type="number"
                        step="0.5"
                        value={clinicalBiomarkers.sleepHours}
                        onChange={e => updateClinicalBiomarkers({ sleepHours: Number(e.target.value) })}
                        className="w-20 bg-transparent text-sm font-bold text-on-surface focus:outline-none"
                      />
                      <span className="text-[10px] text-on-surface-variant">hours/night</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DIABETES FORM FIELDS */}
            {selectedDisease === 'diabetes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Glucose Concentration (mg/dL)</label>
                  <input
                    type="range"
                    min="60"
                    max="220"
                    value={clinicalBiomarkers.glucose ?? 115}
                    onChange={e => updateClinicalBiomarkers({ glucose: Number(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg"
                  />
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>{clinicalBiomarkers.glucose ?? 115} mg/dL</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Serum Insulin (μU/mL)</label>
                  <input
                    type="range"
                    min="15"
                    max="350"
                    value={clinicalBiomarkers.insulin ?? 95}
                    onChange={e => updateClinicalBiomarkers({ insulin: Number(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg"
                  />
                  <div className="flex justify-between text-xs font-bold text-primary">
                    <span>{clinicalBiomarkers.insulin ?? 95} μU/mL</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Diastolic BP (mmHg)</label>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    value={clinicalBiomarkers.bloodPressure}
                    onChange={e => updateClinicalBiomarkers({ bloodPressure: Number(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg"
                  />
                  <span className="text-xs font-bold text-primary">{clinicalBiomarkers.bloodPressure} mmHg</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Diabetes Pedigree Factor</label>
                  <input
                    type="range"
                    min="0.08"
                    max="2.40"
                    step="0.02"
                    value={clinicalBiomarkers.pedigree ?? 0.45}
                    onChange={e => updateClinicalBiomarkers({ pedigree: Number(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg"
                  />
                  <span className="text-xs font-bold text-primary">{clinicalBiomarkers.pedigree ?? 0.45}</span>
                </div>
              </div>
            )}

            {/* BREAST CANCER CYTOLOGY FIELDS */}
            {selectedDisease === 'breast_cancer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Mean Nuclear Radius</label>
                  <input
                    type="range"
                    min="6.0"
                    max="28.0"
                    step="0.1"
                    value={clinicalBiomarkers.meanRadius ?? 14.2}
                    onChange={e => updateClinicalBiomarkers({ meanRadius: Number(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg"
                  />
                  <span className="text-xs font-bold text-primary">{clinicalBiomarkers.meanRadius ?? 14.2} μm</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Mean Nuclear Texture</label>
                  <input
                    type="range"
                    min="9.0"
                    max="39.0"
                    step="0.1"
                    value={clinicalBiomarkers.meanTexture ?? 19.5}
                    onChange={e => updateClinicalBiomarkers({ meanTexture: Number(e.target.value) })}
                    className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg"
                  />
                  <span className="text-xs font-bold text-primary">{clinicalBiomarkers.meanTexture ?? 19.5}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lifestyle & Clinical Risk Toggles */}
        <div className="flex flex-col gap-6">
          {/* Risk Factors & Medical History */}
          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                Clinical Risk Indicators
              </span>
              <div className="space-y-2.5">
                {[
                  { key: 'smoking', label: 'Active Tobacco Smoker', icon: 'smoking_rooms' },
                  { key: 'familyHistory', label: 'Family History of Disease', icon: 'family_restroom' },
                  { key: 'diabetesHistory', label: 'Diagnosed Metabolic Condition', icon: 'healing' },
                  { key: 'highBP', label: 'Pre-existing Hypertension', icon: 'monitor_heart' },
                  { key: 'highLDL', label: 'Elevated LDL / Hyperlipidemia', icon: 'water_drop' },
                ].map(item => {
                  const val = (clinicalBiomarkers as any)[item.key] || false;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => updateClinicalBiomarkers({ [item.key]: !val })}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                        val
                          ? 'bg-error-container/20 border-error/40 text-on-surface'
                          : 'bg-surface-container-low dark:bg-surface-container border-transparent text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">{item.icon}</span>
                        {item.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${val ? 'bg-error text-on-error' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {val ? 'YES' : 'NO'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets Quick Action Bar */}
            <div className="pt-4 border-t border-surface-container dark:border-surface-variant/40 mt-4 flex gap-2">
              <button
                type="button"
                onClick={loadHealthyPreset}
                className="flex-1 py-2 px-3 rounded-xl bg-[#ecfdf5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] text-xs font-bold hover:scale-102 transition-all cursor-pointer text-center"
              >
                ⚡ Healthy Preset
              </button>
              <button
                type="button"
                onClick={loadHighRiskPreset}
                className="flex-1 py-2 px-3 rounded-xl bg-error-container text-on-error-container text-xs font-bold hover:scale-102 transition-all cursor-pointer text-center"
              >
                ⚠️ High Risk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero CTA Button: Run Assessment */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-primary-container/30 via-surface-container-low dark:via-surface-container to-secondary-container/30 rounded-3xl p-8 sm:p-10 text-center shadow-md border border-primary/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2 font-headline">
          Ready for Machine Learning Diagnostic Inference?
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mb-6">
          Transmits the 20 patient biomarkers into the {selectedModel.replace('_', ' ')} pipeline, computes calibrated risk probabilities, and calculates SHAP explainability.
        </p>
        <button
          onClick={runClinicalAssessment}
          disabled={isAssessing}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-[#00544c] text-on-primary text-base font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isAssessing ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
              <span>Executing ML Model Inference...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              <span>✨ Run Diagnostic Risk Assessment</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
