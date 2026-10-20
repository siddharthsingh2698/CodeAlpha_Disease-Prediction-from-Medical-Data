/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId, DiseaseKey, ModelKey } from '../types';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../utils/translations';

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

  const navItems: { id: ScreenId; label: string }[] = [
    { id: '1-health-check-input', label: t('nav.step1') },
    { id: '2-your-health-insights', label: t('nav.step2') },
    { id: '3-wellness-coach', label: t('nav.step3') },
  ];

  const diseases: { key: DiseaseKey; label: string; badge: string }[] = [
    { key: 'heart_disease', label: '🫀 Heart Disease', badge: '10k records' },
    { key: 'diabetes', label: '🩸 Diabetes', badge: 'UCI 768' },
    { key: 'breast_cancer', label: '🔬 Breast Cancer', badge: 'WDBC 569' },
  ];

  const models: { key: ModelKey; label: string }[] = [
    { key: 'champion', label: '🏆 Champion (Auto Best)' },
    { key: 'Logistic_Regression', label: 'Logistic Regression' },
    { key: 'SVM', label: 'Support Vector Machine' },
    { key: 'Random_Forest', label: 'Random Forest' },
    { key: 'XGBoost', label: 'XGBoost' },
  ];

  const curDisease = diseases.find(d => d.key === selectedDisease);
  const curModel = models.find(m => m.key === selectedModel);

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

      <header className="fixed top-0 w-full z-40 bg-surface/85 dark:bg-[#11181b]/90 backdrop-blur-xl border-b border-surface-container-high/60 dark:border-surface-variant/40 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-colors duration-200">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentScreen('1-health-check-input')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            aria-label="CareCompanion Home"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <span className="material-symbols-outlined text-on-primary text-[22px]">favorite</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold tracking-tight text-primary font-headline leading-tight">
                {t('nav.brand')}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium hidden sm:inline">
                Clinical Diagnostics & Wellness
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 p-1 bg-surface-container-low/70 dark:bg-surface-container-low/40 rounded-full border border-surface-container/80 dark:border-surface-container-high">
            {navItems.map(item => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`text-[14px] font-medium transition-all duration-200 px-4 py-2 rounded-full cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Disease Selector Dropdown */}
            <div className="relative" ref={diseaseRef}>
              <button
                onClick={() => setIsDiseaseOpen(!isDiseaseOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-[#6bd8cb] text-xs font-bold transition-all border border-primary/20 cursor-pointer"
                title="Select Target Disease"
              >
                <span>{curDisease?.label}</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {isDiseaseOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-2 z-50 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-on-surface-variant px-3 py-1 uppercase tracking-wider">
                    Target Clinical Domain
                  </div>
                  {diseases.map(d => (
                    <button
                      key={d.key}
                      onClick={() => {
                        setSelectedDisease(d.key);
                        setIsDiseaseOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedDisease === d.key
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                      }`}
                    >
                      <span>{d.label}</span>
                      <span className="text-[10px] opacity-75">{d.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Algorithm Selector Dropdown */}
            <div className="relative hidden lg:block" ref={modelRef}>
              <button
                onClick={() => setIsModelOpen(!isModelOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-surface-container-high cursor-pointer"
                title="Select ML Algorithm"
              >
                <span className="truncate max-w-[120px]">{curModel?.label}</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
              </button>

              {isModelOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-2 z-50 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-on-surface-variant px-3 py-1 uppercase tracking-wider">
                    Classifier Algorithm
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

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full bg-surface-container-low dark:bg-surface-container-low/60 hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                aria-label="Select Language"
              >
                <span>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag}</span>
                <span className="hidden sm:inline uppercase text-[11px]">{language}</span>
                <span className="material-symbols-outlined text-[15px] text-on-surface-variant">expand_more</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-[#1a252a] rounded-xl shadow-xl border border-surface-container dark:border-surface-variant p-2 z-50">
                  <div className="text-[11px] font-bold text-on-surface-variant px-3 py-1.5 uppercase tracking-wider">
                    {t('settings.language')}
                  </div>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'bg-primary-container/20 text-primary font-bold'
                          : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {language === lang.code && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Quick Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container-low dark:bg-surface-container-low/60 hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Real-Time Notifications Center Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen && unreadCount > 0) {
                    markAllNotificationsRead();
                  }
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container-low dark:bg-surface-container-low/60 hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-error text-on-error text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-76 sm:w-96 max-w-[calc(100vw-2rem)] bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container dark:border-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                      <h4 className="text-sm font-bold text-on-surface">{t('notif.title')}</h4>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-on-surface-variant hover:text-error transition-colors"
                      >
                        {t('notif.clear')}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2.5 py-2 divide-y divide-surface-container-low dark:divide-surface-container">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-3xl opacity-40 mb-1 block">notifications_off</span>
                        {t('notif.empty')}
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`pt-2.5 first:pt-1 flex items-start gap-3 transition-colors ${
                            !n.read ? 'bg-primary-container/10 -mx-2 px-2 py-2 rounded-xl' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0 text-secondary">
                            <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-on-surface truncate">{n.title}</span>
                              <span className="text-[10px] text-on-surface-variant shrink-0">{n.timeAgo}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/30 hover:ring-primary overflow-hidden transition-all cursor-pointer flex items-center justify-center bg-primary"
                aria-label="User Profile Menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-primary text-[18px] sm:text-[20px]">person</span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-surface-container-lowest dark:bg-[#1a252a] rounded-2xl shadow-2xl border border-surface-container dark:border-surface-variant p-3 z-50">
                  <div className="flex items-center gap-3 p-2 mb-2 border-b border-surface-container dark:border-surface-variant">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                      {t('profile.title')}
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openSettingsModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">settings</span>
                      {t('settings.title')}
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-container/20 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                      {user.isGuest ? t('auth.btnSignIn') : 'Switch Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Header Quick Presets Bar */}
        <div className="bg-surface-container-low/50 dark:bg-surface-container-low/20 border-t border-surface-container-high/60 dark:border-surface-variant/40 px-4 sm:px-6 lg:px-12 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Presets:</span>
            <button
              onClick={loadHealthyPreset}
              className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>⚡ Healthy Preset</span>
            </button>
            <button
              onClick={loadHighRiskPreset}
              className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-bold hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>⚠️ Elevated Risk</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-medium text-[11px]">
            <span>Active Model: <strong className="text-primary">{selectedModel.replace('_', ' ')}</strong></span>
            <span>•</span>
            <span>Cohort: <strong className="text-on-surface">{selectedDisease.replace('_', ' ').toUpperCase()}</strong></span>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface-container-lowest dark:bg-[#1a252a] border-t border-surface-container dark:border-surface-variant p-4 space-y-2 animate-in fade-in duration-200">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentScreen(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  currentScreen === item.id
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container'
                }`}
              >
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
