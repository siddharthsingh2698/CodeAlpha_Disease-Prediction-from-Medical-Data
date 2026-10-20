/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const Screen2HealthInsights: React.FC = () => {
  const {
    healthAssessment,
    setCurrentScreen,
    selectedDisease,
    selectedModel,
    downloadReport,
    setToastMessage,
    t,
  } = useApp();

  const [actionItems, setActionItems] = useState(healthAssessment.actionPlan);
  const [toast, setToast] = useState<string | null>(null);

  // Clinical Deep-Dive tools state
  const [activeTab, setActiveTab] = useState<'none' | 'batch' | 'benchmarks' | 'dataset'>('none');

  // Batch screening state
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchSummary, setBatchSummary] = useState<any>(null);

  // Benchmarks state
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [champion, setChampion] = useState('');
  const [rocUrl, setRocUrl] = useState('');

  // Dataset explorer state
  const [datasetData, setDatasetData] = useState<any>(null);
  const [datasetPage, setDatasetPage] = useState(1);
  const [datasetSearch, setDatasetSearch] = useState('');

  const toggleAction = (id: string) => {
    setActionItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.completed;
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const completedCount = actionItems.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / actionItems.length) * 100);

  // Score circular gauge math
  const circumference = 452;
  const strokeOffset = circumference - (circumference * healthAssessment.score) / 100;

  const handleDownloadPDF = async () => {
    // 1. Download clinical report markdown
    await downloadReport();

    // 2. Open printable clinical snapshot
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CareCompanion Clinical Diagnostic Assessment</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #191c1e; background: #fff; }
            h1 { color: #00685f; font-size: 26px; }
            .score-box { background: #e0f2f1; padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 24px; }
            .score { font-size: 44px; font-weight: bold; color: #00685f; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
            .badge { background: #008378; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; }
          </style>
        </head>
        <body>
          <h1>CareCompanion — Clinical Risk & Wellness Assessment</h1>
          <p><strong>Clinical Domain:</strong> ${selectedDisease.toUpperCase()} | <strong>Algorithm:</strong> ${selectedModel}</p>
          <div class="score-box">
            <div>Calibrated Wellness Score</div>
            <div class="score">${healthAssessment.score} / 100</div>
            <div><strong>${healthAssessment.ratingText}</strong></div>
          </div>
          <h2>Diagnostic Recommendation</h2>
          <p>${healthAssessment.description}</p>
          <h2>Key Health Milestones</h2>
          ${healthAssessment.milestones.map(m => `
            <div class="card">
              <strong>${m.title}</strong> — <span class="badge">${m.badge}</span>
              <p>${m.description}</p>
            </div>
          `).join('')}
          <h2>Focus Recommendations & SHAP Attributions</h2>
          ${healthAssessment.focusAreas.map(f => `
            <div class="card">
              <strong>${f.title}</strong> — <span class="badge">${f.badge}</span>
              <p>${f.description}</p>
            </div>
          `).join('')}
          <p style="margin-top: 40px; font-size: 11px; color: #64748b;">Generated on ${new Date().toLocaleString()} via CareCompanion Multi-Disease Platform.</p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }

    setToast(t('s2.pdfDownloaded', 'Diagnostic summary and report (.md) downloaded!'));
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch benchmarks when activeTab === 'benchmarks'
  useEffect(() => {
    if (activeTab === 'benchmarks') {
      fetch(`/api/metrics/${selectedDisease}`)
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            setBenchmarks(res.metrics || []);
            setChampion(res.metadata?.champion_model || '');
            setRocUrl(res.roc_image_url || '');
          }
        })
        .catch(console.error);
    }
  }, [activeTab, selectedDisease]);

  // Fetch dataset when activeTab === 'dataset'
  useEffect(() => {
    if (activeTab === 'dataset') {
      fetch(`/api/dataset/${selectedDisease}?page=${datasetPage}&page_size=10&search=${encodeURIComponent(datasetSearch)}`)
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            setDatasetData(res);
          }
        })
        .catch(console.error);
    }
  }, [activeTab, selectedDisease, datasetPage, datasetSearch]);

  const runBatchInference = async () => {
    setBatchLoading(true);
    setToast('Running high-throughput vector inference...');
    const formData = new FormData();
    formData.append('disease', selectedDisease);
    formData.append('model', selectedModel);
    if (batchFile) formData.append('file', batchFile);

    try {
      const resp = await fetch('/api/batch-predict', { method: 'POST', body: formData });
      const res = await resp.json();
      if (res.status === 'success') {
        setBatchSummary(res.summary);
        setToast(`Screened ${res.summary.total_records} cohort patients!`);
      }
    } catch (e: any) {
      setToast('Batch inference error: ' + e.message);
    } finally {
      setBatchLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const loadSampleCohort = async () => {
    try {
      const resp = await fetch(`/api/download-sample-cohort/${selectedDisease}`);
      const blob = await resp.blob();
      const file = new File([blob], `sample_${selectedDisease}_cohort.csv`, { type: 'text/csv' });
      setBatchFile(file);
      setToast('Sample cohort loaded! Click "Execute Batch Screening".');
      setTimeout(() => setToast(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Top Summary Banner / Overall Score Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full pt-6 sm:pt-10">
        <div className="bg-gradient-to-br from-primary-container/20 via-surface-container-lowest dark:via-[#151e22] to-surface-container-low dark:to-[#1a252a] p-6 sm:p-10 lg:p-12 rounded-3xl shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Decorative background blur circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary-fixed/20 dark:bg-secondary/10 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col gap-4 max-w-xl z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-semibold w-max mx-auto lg:mx-0">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              {t('s2.badge')} • {selectedModel.replace('_', ' ')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-on-surface font-headline tracking-tight">
              {t('s2.heading')}
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {healthAssessment.description}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-[#00524b] text-on-primary rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                {t('s2.download')} (.md / Print)
              </button>
              <button
                onClick={() => setCurrentScreen('1-health-check-input')}
                className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest dark:bg-surface-container text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-variant transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                {t('s2.adjust')}
              </button>
            </div>
          </div>

          {/* Circular Score Gauge Component */}
          <div className="relative flex items-center justify-center p-6 bg-surface-container-lowest dark:bg-[#1a252a] rounded-full shadow-lg border border-surface-container/60 dark:border-surface-variant/40 z-10 shrink-0">
            <svg className="w-44 h-44 transform -rotate-90">
              <circle
                className="text-surface-container dark:text-surface-container-high"
                cx="88"
                cy="88"
                r="72"
                stroke="currentColor"
                strokeWidth="14"
                fill="transparent"
              />
              <circle
                className="text-primary transition-all duration-1000 ease-out"
                cx="88"
                cy="88"
                r="72"
                stroke="currentColor"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-primary dark:text-[#6bd8cb] font-headline">
                {healthAssessment.score}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">
                {t('s2.scoreOutOf')}
              </span>
              <span className="text-sm font-bold text-secondary dark:text-[#85f8e6] mt-1 max-w-[140px] truncate">
                {healthAssessment.ratingText}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Insights Grid: Milestones & Areas for Improvement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Positive Milestones */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-secondary text-[26px]">check_circle</span>
                {t('s2.milestones')}
              </h2>
              <span className="text-sm text-secondary font-bold">
                {healthAssessment.milestones.length} {t('s2.done')}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {healthAssessment.milestones.map(m => (
                <div
                  key={m.id}
                  className="bg-secondary-fixed/15 dark:bg-[#0d5149]/25 border border-secondary/20 dark:border-secondary/30 p-5 sm:p-6 rounded-2xl shadow-xs flex items-start gap-4 transition-all hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">{m.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-base font-bold text-on-surface font-headline">{m.title}</h3>
                      <span className="text-xs font-bold text-on-secondary-container dark:text-[#85f8e6] bg-secondary-container/80 dark:bg-[#0d5149] px-2.5 py-0.5 rounded-full">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Recommendations & SHAP Explainability */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-tertiary text-[26px]">lightbulb</span>
                {t('s2.focusAreas')} & Risk Drivers
              </h2>
              <span className="text-sm text-tertiary font-bold">
                {healthAssessment.focusAreas.length} {t('s2.focusCount')}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {healthAssessment.focusAreas.map(f => (
                <div
                  key={f.id}
                  className="bg-surface-container-high dark:bg-[#202d33] border border-surface-container-highest/60 dark:border-surface-variant/40 p-5 sm:p-6 rounded-2xl shadow-xs flex items-start gap-4 transition-all hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">{f.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-base font-bold text-on-surface font-headline">{f.title}</h3>
                      <span className="text-xs font-semibold text-on-surface-variant bg-surface-variant dark:bg-surface-container-high px-2.5 py-0.5 rounded-full">
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* Photo Card / Daily Wisdom */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-sm h-44 bg-cover bg-center flex items-end p-6 border border-surface-container/50"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVFSHD4pH8S93NnacjSwAaDMb7TChg58EGbaVX12yRMImgWLlVBpb7VEYO0u-vKjX7YqM-AoK9wxMRpuMSC5TrtYd4Y6I0OUSx9rtAnPP0qNXPzNPg_FpIhY1T9I1yFqeJ_yMbMpoS28PJwbm85opRTjwvOOnIpL4Wx9FMrbReX2skWYZfYVFbn36hePVPqdfI1RruqtdGTvgc1YByf6zMw71Gs1z6NZOY_7yo-LgFDv9nhCdnL2rd0A')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="relative z-10 text-white flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {t('s2.dailyWisdom')}
                  </span>
                  <p className="text-base font-bold text-white font-headline leading-snug">
                    {t('s2.quote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Daily Recommendations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-12">
        <div className="bg-surface-container-lowest dark:bg-[#151e22] p-6 sm:p-10 rounded-3xl shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                {t('s2.tailored')}
              </span>
              <h2 className="text-2xl font-bold text-on-surface font-headline mt-1">
                {t('s2.actionPlan')}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-on-surface-variant">
                {t('s2.progress')}
              </span>
              <div className="w-32 h-3 bg-surface-container dark:bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-primary">
                {completedCount}/{actionItems.length} {t('s2.done')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {actionItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleAction(item.id)}
                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 relative group ${
                  item.completed
                    ? 'bg-primary-container/10 dark:bg-primary-container/20 border-primary shadow-xs'
                    : 'bg-surface-container-low dark:bg-[#1a252a] border-transparent hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.completed
                        ? 'bg-primary border-primary text-on-primary'
                        : 'border-outline/50 group-hover:border-primary'
                    }`}
                  >
                    {item.completed && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className={`text-base font-bold font-headline ${item.completed ? 'text-primary dark:text-[#6bd8cb] line-through' : 'text-on-surface'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <span className="text-xs font-bold text-primary">
                  {item.timeTag}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-surface-container dark:border-surface-variant gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(activeTab === 'batch' ? 'none' : 'batch')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  activeTab === 'batch'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                📂 Batch Screening (CSV)
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'benchmarks' ? 'none' : 'benchmarks')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  activeTab === 'benchmarks'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                📊 Model Benchmarks
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'dataset' ? 'none' : 'dataset')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  activeTab === 'dataset'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                📁 Dataset Explorer
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentScreen('3-wellness-coach');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary hover:bg-[#00524b] text-on-primary text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
            >
              <span>{t('nav.step3')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* EXPANDABLE CLINICAL DEEP DIVE SECTION */}
      {activeTab === 'batch' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-6 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest dark:bg-[#151e22] p-6 sm:p-8 rounded-3xl shadow-sm border border-primary/30">
            <h3 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_shared</span>
              Cohort Batch Screening
            </h3>
            <div className="flex flex-wrap items-center gap-3 my-4">
              <label className="cursor-pointer px-4 py-2 bg-surface-container-low dark:bg-surface-container rounded-xl text-xs font-semibold border">
                <span>{batchFile ? batchFile.name : 'Choose Cohort CSV...'}</span>
                <input type="file" accept=".csv" onChange={e => e.target.files && setBatchFile(e.target.files[0])} className="hidden" />
              </label>
              <button onClick={loadSampleCohort} className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl cursor-pointer">
                Load Validation Cohort Sample
              </button>
              <button onClick={runBatchInference} disabled={batchLoading} className="px-6 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50">
                {batchLoading ? 'Executing...' : 'Run Batch Inference'}
              </button>
            </div>
            {batchSummary && (
              <div className="grid grid-cols-3 gap-4 my-4 text-center">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <div className="text-xl font-bold">{batchSummary.total_records}</div>
                  <span className="text-xs text-on-surface-variant">Screened Patients</span>
                </div>
                <div className="p-3 bg-error-container/30 rounded-xl">
                  <div className="text-xl font-bold text-error">{batchSummary.high_risk_rate_pct}%</div>
                  <span className="text-xs text-on-surface-variant">High-Risk Rate</span>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <div className="text-xl font-bold text-primary">{batchSummary.mean_risk_pct}%</div>
                  <span className="text-xs text-on-surface-variant">Mean Risk</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'benchmarks' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-6 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest dark:bg-[#151e22] p-6 sm:p-8 rounded-3xl shadow-sm border border-primary/30">
            <h3 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">leaderboard</span>
              Model Benchmarks Leaderboard (Champion: {champion})
            </h3>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b font-bold text-on-surface-variant">
                    <th className="py-2">Model</th>
                    <th className="py-2 text-right">Accuracy</th>
                    <th className="py-2 text-right">Precision</th>
                    <th className="py-2 text-right">Recall</th>
                    <th className="py-2 text-right">F1-Score</th>
                    <th className="py-2 text-right">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {benchmarks.map((m, idx) => (
                    <tr key={idx} className={m.Model === champion ? 'bg-primary/10 font-bold' : ''}>
                      <td className="py-2">{m.Model}</td>
                      <td className="py-2 text-right">{(m.Accuracy * 100).toFixed(1)}%</td>
                      <td className="py-2 text-right">{(m.Precision * 100).toFixed(1)}%</td>
                      <td className="py-2 text-right">{(m.Recall * 100).toFixed(1)}%</td>
                      <td className="py-2 text-right">{m['F1-Score'].toFixed(3)}</td>
                      <td className="py-2 text-right text-primary font-bold">{m['ROC-AUC'].toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rocUrl && (
              <div className="mt-4 max-w-lg mx-auto rounded-xl overflow-hidden border">
                <img src={rocUrl} alt="ROC Curves" className="w-full h-auto" />
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'dataset' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-6 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest dark:bg-[#151e22] p-6 sm:p-8 rounded-3xl shadow-sm border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">database</span>
                Dataset Transparency ({datasetData ? datasetData.total_records.toLocaleString() : '...'} Records)
              </h3>
              <input
                type="text"
                placeholder="Search records..."
                value={datasetSearch}
                onChange={e => { setDatasetSearch(e.target.value); setDatasetPage(1); }}
                className="px-3 py-1 text-xs border rounded-full bg-surface-container-low"
              />
            </div>
            {datasetData && (
              <div className="overflow-x-auto my-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b font-bold">
                      {datasetData.columns.slice(0, 7).map((c: string, i: number) => (
                        <th key={i} className="py-2 px-2">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {datasetData.rows.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface-container-low">
                        {datasetData.columns.slice(0, 7).map((c: string, i: number) => (
                          <td key={i} className="py-1.5 px-2 font-mono">{r[c] !== null ? String(r[c]) : 'null'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-3 text-xs">
                  <button onClick={() => setDatasetPage(p => Math.max(1, p - 1))} disabled={datasetPage <= 1} className="px-3 py-1 bg-surface-container-low rounded cursor-pointer disabled:opacity-40">Previous</button>
                  <span>Page {datasetPage}</span>
                  <button onClick={() => setDatasetPage(p => p + 1)} className="px-3 py-1 bg-surface-container-low rounded cursor-pointer">Next</button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Download summary toast notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-8 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-secondary-fixed text-[22px]">task_alt</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
};
