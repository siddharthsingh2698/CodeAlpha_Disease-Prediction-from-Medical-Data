/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export const Screen1HealthCheck: React.FC = () => {
  const { healthInputs, updateHealthInputs, calculateAndGoToInsights, isAnalyzing, t } = useApp();

  const handleHabitToggle = (habitKey: string) => {
    const exists = healthInputs.habits.includes(habitKey);
    const updated = exists
      ? healthInputs.habits.filter(h => h !== habitKey)
      : [...healthInputs.habits, habitKey];
    updateHealthInputs({ habits: updated });
  };

  const availableHabits = [
    { key: 'plant-forward', label: t('s1.habit.plant') },
    { key: 'coffee-lover', label: t('s1.habit.coffee') },
    { key: 'water-tracker', label: t('s1.habit.water') },
    { key: 'smoke-free', label: t('s1.habit.smoke') },
    { key: 'mindful', label: t('s1.habit.mindful') },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Top Header Section */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          {t('s1.badge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-2 font-headline">
          {t('s1.heading')}
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant font-normal leading-relaxed">
          {t('s1.subheading')}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {/* Left Column: Sliders and Blood Pressure (2 cols) */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-8 relative z-10">
            {/* Age Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-base font-semibold text-on-surface flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-secondary-container dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[18px]">
                    calendar_today
                  </span>
                  {t('s1.age')}
                </label>
                <span className="text-base font-bold text-primary dark:text-[#6bd8cb] bg-primary-container/20 dark:bg-primary-container/40 px-3.5 py-1 rounded-full">
                  {healthInputs.age} yrs
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="100"
                value={healthInputs.age}
                onChange={e => updateHealthInputs({ age: Number(e.target.value) })}
                className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                aria-label="Adjust Age"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-medium">
                <span>18 yrs</span>
                <span>50 yrs</span>
                <span>100 yrs</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-base font-semibold text-on-surface flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-secondary-container dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[18px]">
                    fitness_center
                  </span>
                  {t('s1.weight')}
                </label>
                <span className="text-base font-bold text-primary dark:text-[#6bd8cb] bg-primary-container/20 dark:bg-primary-container/40 px-3.5 py-1 rounded-full">
                  {healthInputs.weight} kg
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={healthInputs.weight}
                onChange={e => updateHealthInputs({ weight: Number(e.target.value) })}
                className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                aria-label="Adjust Weight"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-medium">
                <span>40 kg</span>
                <span>95 kg</span>
                <span>150 kg</span>
              </div>
            </div>

            {/* Daily Sleep Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-base font-semibold text-on-surface flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-secondary-container dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[18px]">
                    bedtime
                  </span>
                  {t('s1.sleep')}
                </label>
                <span className="text-base font-bold text-primary dark:text-[#6bd8cb] bg-primary-container/20 dark:bg-primary-container/40 px-3.5 py-1 rounded-full">
                  {healthInputs.sleepHours} hrs
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={healthInputs.sleepHours}
                onChange={e => updateHealthInputs({ sleepHours: Number(e.target.value) })}
                className="w-full accent-primary h-2 bg-surface-container-high dark:bg-surface-container rounded-lg cursor-pointer"
                aria-label="Adjust Daily Sleep"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant px-1 font-medium">
                <span>3 hrs</span>
                <span>7.5 hrs (Sweet spot)</span>
                <span>12 hrs</span>
              </div>
            </div>

            {/* Blood Pressure Vibe */}
            <div className="space-y-3 pt-2">
              <label className="text-base font-semibold text-on-surface flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-secondary-container dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[18px]">
                  speed
                </span>
                {t('s1.bp')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateHealthInputs({ bpVibe: 'normal' })}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all cursor-pointer ${
                    healthInputs.bpVibe === 'normal'
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/40'
                      : 'bg-surface-container-low dark:bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t('s1.bp.normal')}
                </button>
                <button
                  type="button"
                  onClick={() => updateHealthInputs({ bpVibe: 'high' })}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all cursor-pointer ${
                    healthInputs.bpVibe === 'high'
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/40'
                      : 'bg-surface-container-low dark:bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t('s1.bp.high')}
                </button>
                <button
                  type="button"
                  onClick={() => updateHealthInputs({ bpVibe: 'unsure' })}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all cursor-pointer ${
                    healthInputs.bpVibe === 'unsure'
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/40'
                      : 'bg-surface-container-low dark:bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t('s1.bp.unsure')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exercise Frequency and Lifestyle Habits */}
        <div className="flex flex-col gap-6">
          {/* Exercise Frequency Card */}
          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-6 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex-1">
            <label className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-secondary-container dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[18px]">
                directions_run
              </span>
              {t('s1.exercise')}
            </label>

            <div className="space-y-3">
              {[
                { key: 'daily', title: t('s1.ex.active'), desc: t('s1.ex.activeDesc') },
                { key: 'moderate', title: t('s1.ex.moderate'), desc: t('s1.ex.moderateDesc') },
                { key: 'starter', title: t('s1.ex.starter'), desc: t('s1.ex.starterDesc') },
              ].map(opt => {
                const isSelected = healthInputs.exercise === opt.key;
                return (
                  <label
                    key={opt.key}
                    onClick={() => updateHealthInputs({ exercise: opt.key as any })}
                    className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-primary-container/15 dark:bg-primary-container/25 border-primary/40 shadow-xs'
                        : 'bg-surface-container-low dark:bg-surface-container/60 border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exercise"
                      checked={isSelected}
                      onChange={() => updateHealthInputs({ exercise: opt.key as any })}
                      className="w-5 h-5 accent-primary cursor-pointer shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{opt.title}</p>
                      <p className="text-xs text-on-surface-variant">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Lifestyle Habits Card */}
          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-2xl p-6 shadow-sm border border-surface-container/60 dark:border-surface-variant/30">
            <label className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-secondary-container dark:bg-[#0d5149] text-on-secondary-container dark:text-[#85f8e6] flex items-center justify-center material-symbols-outlined text-[18px]">
                restaurant
              </span>
              {t('s1.habits')}
            </label>

            <div className="flex flex-wrap gap-2.5">
              {availableHabits.map(habit => {
                const isSelected = healthInputs.habits.includes(habit.key);
                return (
                  <button
                    key={habit.key}
                    type="button"
                    onClick={() => handleHabitToggle(habit.key)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container shadow-xs scale-102'
                        : 'bg-surface-container-low dark:bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {habit.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Hero Banner */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-primary-container/40 via-surface-container-low dark:via-surface-container to-secondary-container/40 rounded-3xl p-8 sm:p-12 text-center shadow-sm border border-primary-container/30">
        <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mb-4 shadow-md animate-bounce">
          <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2 font-headline">
          {t('s1.cta.title')}
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mb-6 leading-relaxed">
          {t('s1.cta.desc')}
        </p>
        <button
          onClick={calculateAndGoToInsights}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-[#00524b] text-on-primary text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
        >
          {isAnalyzing ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Evaluating Biomarkers...</span>
            </>
          ) : (
            <>
              <span>✨ {t('s1.cta.btn')}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
