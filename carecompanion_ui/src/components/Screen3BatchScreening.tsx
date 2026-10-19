/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchScreeningSummary } from '../types';

export const Screen3BatchScreening: React.FC = () => {
  const { selectedDisease, selectedModel, setToastMessage } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [batchSummary, setBatchSummary] = useState<BatchScreeningSummary | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setToastMessage(`Attached cohort file: ${e.target.files[0].name}`);
    }
  };

  const loadSampleCohort = async () => {
    setToastMessage('Fetching stratified validation cohort...');
    try {
      const resp = await fetch(`/api/download-sample-cohort/${selectedDisease}`);
      const blob = await resp.blob();
      const file = new File([blob], `sample_${selectedDisease}_cohort.csv`, { type: 'text/csv' });
      setSelectedFile(file);
      setToastMessage('Sample test cohort loaded! Click "Run Batch Inference" to analyze.');
    } catch (e: any) {
      setToastMessage(`Error fetching sample cohort: ${e.message}`);
    }
  };

  const runBatchInference = async () => {
    setIsLoading(true);
    setToastMessage('Running high-throughput batch vector inference across cohort...');

    const formData = new FormData();
    formData.append('disease', selectedDisease);
    formData.append('model', selectedModel);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const resp = await fetch('/api/batch-predict', {
        method: 'POST',
        body: formData,
      });
      const res = await resp.json();
      if (res.status === 'success') {
        setBatchSummary(res.summary);
        setToastMessage(`Screened ${res.summary.total_records} patients successfully!`);
      } else {
        setToastMessage(`Batch inference failed: ${res.message}`);
      }
    } catch (err: any) {
      setToastMessage(`Connection failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 dark:bg-secondary-container/20 text-on-secondary-container dark:text-[#85f8e6] text-xs font-bold mb-3 border border-secondary-container">
          <span className="material-symbols-outlined text-[16px]">folder_shared</span>
          High-Throughput Clinical Ingestion Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface mb-3 font-headline">
          Batch Patient Screening & Risk Stratification
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Screen multi-patient clinical cohorts simultaneously using calibrated {selectedModel.replace('_', ' ')} models.
        </p>
      </div>

      {/* Upload & Action Card */}
      <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              Select or Drop Cohort CSV
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-surface-container-high">
                <span className="material-symbols-outlined text-[18px] text-primary">upload_file</span>
                <span>{selectedFile ? selectedFile.name : 'Browse Cohort CSV File'}</span>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </label>

              <button
                type="button"
                onClick={loadSampleCohort}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-[#6bd8cb] text-xs font-bold transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                <span>Load Sample Validation Cohort</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              onClick={runBatchInference}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-[#00544c] text-on-primary text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Screening Cohort...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Run Batch Inference</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {batchSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">group</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-semibold">Total Patients</span>
              <div className="text-2xl font-extrabold text-on-surface font-headline">
                {batchSummary.total_records.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-semibold">High-Risk Rate</span>
              <div className="text-2xl font-extrabold text-error font-headline">
                {batchSummary.high_risk_rate_pct.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-5 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-semibold">Mean Cohort Risk</span>
              <div className="text-2xl font-extrabold text-primary dark:text-[#6bd8cb] font-headline">
                {batchSummary.mean_risk_pct.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cohort Screening Results Table */}
      {batchSummary && (
        <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container dark:border-surface-variant/30">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
              Patient Cohort Inference Records
            </h2>
            <span className="text-xs text-on-surface-variant font-semibold">
              Showing preview of top 15 records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container dark:border-surface-variant text-on-surface-variant font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Patient ID</th>
                  <th className="py-3 px-3">Age</th>
                  <th className="py-3 px-3">Blood Pressure</th>
                  <th className="py-3 px-3">Cholesterol</th>
                  <th className="py-3 px-3 text-right">Risk Score</th>
                  <th className="py-3 px-3 text-center">Risk Tier</th>
                  <th className="py-3 px-3 text-center">Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60 dark:divide-surface-variant/30">
                {batchSummary.preview.slice(0, 15).map((row, idx) => {
                  const isHigh = row.Risk_Tier === 'High Risk';
                  const isMod = row.Risk_Tier === 'Moderate Risk';
                  return (
                    <tr key={idx} className="hover:bg-surface-container-low dark:hover:bg-surface-container/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-on-surface">#PT-{92000 + idx}</td>
                      <td className="py-3 px-3 font-semibold">{row.Age ?? 54} yrs</td>
                      <td className="py-3 px-3">{row['Blood Pressure'] ?? row.BloodPressure ?? 125} mmHg</td>
                      <td className="py-3 px-3">{row['Cholesterol Level'] ?? row.Cholesterol ?? 210} mg/dL</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-on-surface">
                        {row.Risk_Score_Pct}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isHigh
                            ? 'bg-error-container text-on-error-container'
                            : isMod
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-[#ecfdf5] text-[#065f46]'
                        }`}>
                          {row.Risk_Tier}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={row.Prediction === 'Positive' ? 'text-error' : 'text-primary'}>
                          {row.Prediction}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
