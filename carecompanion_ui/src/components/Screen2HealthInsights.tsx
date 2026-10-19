/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Screen2HealthInsights: React.FC = () => {
  const {
    clinicalResult,
    selectedDisease,
    selectedModel,
    downloadClinicalReport,
    setCurrentScreen,
    t,
  } = useApp();

  // If no clinical assessment has been run yet, use default baseline
  const prob = clinicalResult ? clinicalResult.probability : 19.8;
  const riskLevel = clinicalResult ? clinicalResult.risk_level : 'Low Risk';
  const label = clinicalResult ? clinicalResult.predicted_label : 'Negative / Optimal Range';
  const recommendation = clinicalResult
    ? clinicalResult.recommendation
    : 'Maintain cardiovascular health with routine exercise and balanced Mediterranean diet.';
  const factors = clinicalResult?.top_contributing_factors || [
    { Feature: 'Fasting Blood Sugar', Impact: -0.42, Direction: 'Protective Factor' },
    { Feature: 'Blood Pressure', Impact: -0.35, Direction: 'Protective Factor' },
    { Feature: 'Cholesterol Level', Impact: 0.18, Direction: 'Elevates Risk' },
    { Feature: 'BMI', Impact: -0.22, Direction: 'Protective Factor' },
  ];

  // Circle SVG gauge math (radius = 64, circumference ≈ 402)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  const isHighRisk = prob > 65;
  const isModRisk = prob >= 35 && prob <= 65;
  const badgeClass = isHighRisk
    ? 'bg-error-container text-on-error-container border-error/30'
    : isModRisk
    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300'
    : 'bg-[#ecfdf5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] border-[#a7f3d0]';

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Top Banner: Score & Calibrated Risk Stratification */}
      <div className="bg-gradient-to-br from-primary-container/20 via-surface-container-lowest dark:via-[#151e22] to-secondary-container/20 p-6 sm:p-10 rounded-3xl shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col lg:flex-row items-center justify-between gap-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col max-w-2xl gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}>
              {riskLevel.toUpperCase()}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              ML Pipeline: <strong>{selectedModel.replace('_', ' ')}</strong>
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              Cohort: <strong>{selectedDisease.replace('_', ' ').toUpperCase()}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline tracking-tight">
            Diagnostic Outcome: {label}
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {recommendation}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={downloadClinicalReport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-[#00544c] text-on-primary text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Diagnostic Report (.md)</span>
            </button>

            <button
              onClick={() => setCurrentScreen('6-wellness-coach')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all cursor-pointer border border-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
              <span>Ask AI Wellness Coach</span>
            </button>
          </div>
        </div>

        {/* Circular Gauge Card */}
        <div className="flex flex-col items-center justify-center bg-surface-container-lowest dark:bg-[#151e22] p-6 rounded-2xl shadow-lg border border-surface-container/80 dark:border-surface-variant/40 min-w-[220px]">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-surface-container dark:stroke-surface-container-high"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={isHighRisk ? 'stroke-error' : isModRisk ? 'stroke-amber-500' : 'stroke-primary'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-on-surface font-headline">
                {prob.toFixed(1)}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Calibrated Risk
              </span>
            </div>
          </div>
          <span className="text-xs font-bold mt-2 text-on-surface">
            {isHighRisk ? 'Immediate Review' : isModRisk ? 'Routine Monitoring' : 'Low Baseline Risk'}
          </span>
        </div>
      </div>

      {/* Grid: SHAP Contributing Factors & Clinical Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* SHAP Feature Attribution */}
        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container dark:border-surface-variant/30">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                Explainable AI: Key Contributing Biomarkers
              </h2>
              <span className="text-[11px] font-bold uppercase text-on-surface-variant">SHAP Value</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-6">
              Shows which physiological biomarkers increased (red) or decreased (teal) this patient's predicted risk score.
            </p>

            <div className="space-y-4">
              {factors.map((f, idx) => {
                const isRisk = f.Direction === 'Elevates Risk' || f.Impact > 0;
                const pct = Math.min(Math.abs(f.Impact) * 45 + 15, 95);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-on-surface">{f.Feature}</span>
                      <span className={`font-bold ${isRisk ? 'text-error' : 'text-primary'}`}>
                        {f.Impact > 0 ? '+' : ''}{f.Impact.toFixed(3)} Log-Odds ({f.Direction})
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-low dark:bg-surface-container rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isRisk ? 'bg-error' : 'bg-primary'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clinical Next Steps & Action Plan */}
        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-4 pb-2 border-b border-surface-container dark:border-surface-variant/30">
              <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
              Clinical Decision-Support Next Steps
            </h2>

            <div className="space-y-3">
              {[
                {
                  title: isHighRisk ? 'Schedule Comprehensive Metabolic & Lipid Panel' : 'Routine Annual Bloodwork',
                  desc: 'Evaluate HbA1c, high-sensitivity CRP, and advanced lipid particle sub-fractions.',
                  badge: 'Laboratory',
                },
                {
                  title: isHighRisk ? 'Cardiology / Specialist Clinical Consultation' : 'Lifestyle Optimization Follow-Up',
                  desc: 'Review arterial compliance and resting ECG measurements.',
                  badge: 'Consultation',
                },
                {
                  title: 'Daily Blood Pressure & Hydration Log',
                  desc: 'Track morning and evening systolic/diastolic readings with CareCompanion.',
                  badge: 'Self-Care',
                },
                {
                  title: 'Dietary Sodium & Refined Carbohydrate Reduction',
                  desc: 'Incorporate potassium-rich foods, legumes, and magnesium supplementation.',
                  badge: 'Nutrition',
                },
              ].map((step, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-surface-container-low dark:bg-surface-container/60 border border-surface-container-high dark:border-surface-variant flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-on-surface">{step.title}</h3>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{step.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary shrink-0">
                    {step.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-surface-container dark:border-surface-variant/30 mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentScreen('1-health-check-input')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Adjust Biomarkers
            </button>

            <button
              onClick={() => setCurrentScreen('3-batch-screening')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              Batch Cohort Screening
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
