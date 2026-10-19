/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId, DiseaseKey, ModelKey } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/translations';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    language,
    setLanguage,
    isDark,
    toggleDarkMode,
    user,
    notifications,
    markAllNotificationsRead,
    clearNotifications,
    openProfileModal,
    openSettingsModal,
    openAuthModal,
    selectedDisease,
    setSelectedDisease,
    selectedModel,
    setSelectedModel,
    loadHealthyPreset,
    loadHighRiskPreset,
    toastMessage,
    setToastMessage,
    t,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDiseaseOpen, setIsDiseaseOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const diseaseRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (diseaseRef.current && !diseaseRef.current.contains(e.target as Node)) {
        setIsDiseaseOpen(false);
      }
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setIsModelOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: '1-health-check-input', label: 'Triage Check', icon: 'stethoscope' },
    { id: '2-your-health-insights', label: 'Clinical Insights', icon: 'analytics' },
    { id: '3-batch-screening', label: 'Batch Screening', icon: 'folder_shared' },
    { id: '4-model-benchmarks', label: 'Model Benchmarks', icon: 'monitoring' },
    { id: '5-dataset-explorer', label: 'Dataset Explorer', icon: 'database' },
    { id: '6-wellness-coach', label: 'Wellness Coach', icon: 'smart_toy' },
  ];

  const diseases: { key: DiseaseKey; label: string; records: string }[] = [
    { key: 'heart_disease', label: '🫀 Heart Disease', records: '10,000 records' },
    { key: 'diabetes', label: '🩸 Diabetes', records: 'UCI Pima (768)' },
    { key: 'breast_cancer', label: '🔬 Breast Cancer', records: 'WDBC (569)' },
  ];

  const models: { key: ModelKey; label: string }[] = [
    { key: 'champion', label: '🏆 Champion (Auto Best)' },
    { key: 'Logistic_Regression', label: 'Logistic Regression' },
    { key: 'SVM', label: 'Support Vector Machine' },
    { key: 'Random_Forest', label: 'Random Forest' },
    { key: 'XGBoost', label: 'XGBoost' },
  ];

  const currentDiseaseObj = diseases.find(d => d.key === selectedDisease);
  const currentModelObj = models.find(m => m.key === selectedModel);

  return (
    <>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-lowest dark:bg-[#1a252a] text-on-surface shadow-xl border border-primary/30 max-w-md">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-on-surface-variant hover:text-on-surface ml-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      <header className="fixed top-0 w-full z-40 bg-surface/90 dark:bg-[#11181b]/95 backdrop-blur-xl border-b border-surface-container-high/60 dark:border-surface-variant/40 shadow-xs transition-colors duration-200">
        {/* Main Navbar */}
        <div className="h-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentScreen('1-health-check-input')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1 shrink-0"
            aria-label="CareCompanion Home"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <span className="material-symbols-outlined text-on-primary text-[22px]">favorite</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[19px] font-bold tracking-tight text-primary font-headline leading-tight">
                CareCompanion
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Clinical Diagnostics
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-surface-container-low/70 dark:bg-surface-container-low/40 rounded-full border border-surface-container/80 dark:border-surface-container-high">
            {navItems.map(item => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`text-[13px] font-semibold transition-all duration-200 px-3.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Disease Selector Dropdown */}
            <div className="relative" ref={diseaseRef}>
              <button
                onClick={() => setIsDiseaseOpen(!isDiseaseOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-[#6bd8cb] text-xs font-bold transition-all border border-primary/20 cursor-pointer"
                title="Select Target Disease"
              >
                <span>{currentDiseaseObj?.label}</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {isDiseaseOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-2 z-50 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-on-surface-variant px-3 py-1 uppercase tracking-wider">
                    Target Clinical Cohort
                  </div>
                  {diseases.map(d => (
                    <button
                      key={d.key}
                      onClick={() => {
                        setSelectedDisease(d.key);
                        setIsDiseaseOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex flex-col transition-colors cursor-pointer ${
                        selectedDisease === d.key
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                      }`}
                    >
                      <span className="font-semibold text-sm">{d.label}</span>
                      <span className="text-[10px] opacity-80">{d.records}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative hidden sm:block" ref={modelRef}>
              <button
                onClick={() => setIsModelOpen(!isModelOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-surface-container-high dark:border-surface-variant cursor-pointer"
                title="Select Classifier Architecture"
              >
                <span className="truncate max-w-[120px]">{currentModelObj?.label}</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
              </button>

              {isModelOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-2 z-50 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-on-surface-variant px-3 py-1 uppercase tracking-wider">
                    Active ML Algorithm
                  </div>
                  {models.map(m => (
                    <button
                      key={m.key}
                      onClick={() => {
                        setSelectedModel(m.key);
                        setIsModelOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedModel === m.key
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-full bg-surface-container-low dark:bg-surface-container-low/60 hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-low dark:bg-surface-container-low/60 hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                aria-label="Select Language"
              >
                <span>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag}</span>
                <span className="hidden sm:inline uppercase text-[11px]">{language}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-2 z-50">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container-high/60 transition-colors cursor-pointer focus:outline-none"
                aria-label="User Menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-3 z-50">
                  <div className="flex items-center gap-3 pb-3 border-b border-surface-container dark:border-surface-variant/40">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-on-surface truncate">{user.name}</span>
                      <span className="text-[11px] text-on-surface-variant truncate">{user.email}</span>
                    </div>
                  </div>
                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openProfileModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                      Clinical Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openSettingsModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">settings</span>
                      Platform Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Header Toolbar: Presets & Quick Screen Switching for Mobile/Tablet */}
        <div className="bg-surface-container-low/40 dark:bg-surface-container-low/20 border-t border-surface-container/60 dark:border-surface-variant/30 px-4 sm:px-6 lg:px-12 py-2 flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Presets:</span>
            <button
              onClick={loadHealthyPreset}
              className="px-3 py-1 rounded-full bg-[#ecfdf5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>⚡ Healthy Preset</span>
            </button>
            <button
              onClick={loadHighRiskPreset}
              className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>⚠️ High Risk Preset</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-on-surface-variant">
              Engine: <strong className="text-primary">{selectedModel.replace('_', ' ')}</strong> on <strong className="text-on-surface">{selectedDisease.replace('_', ' ').toUpperCase()}</strong>
            </span>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-surface-container-lowest dark:bg-[#1a252a] border-t border-surface-container dark:border-surface-variant p-4 space-y-2 animate-in fade-in duration-200">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                  currentScreen === item.id
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
