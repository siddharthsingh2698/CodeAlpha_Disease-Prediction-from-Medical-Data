/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../utils/translations';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    isDark,
    toggleDarkMode,
    language,
    setLanguage,
    t,
  } = useApp();

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [pushAlerts, setPushAlerts] = useState(true);

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-surface-container dark:border-surface-variant relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeSettingsModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
            {t('settings.title')}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Accessibility, visual preference & localization controls
          </p>
        </div>

        <div className="space-y-6">
          {/* Seamless Dark Mode Toggle Integration */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low dark:bg-surface-container/60 border border-surface-container-high/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary dark:text-[#6bd8cb]">
                <span className="material-symbols-outlined text-[22px]">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {t('settings.darkMode')}
                </p>
                <p className="text-xs text-on-surface-variant max-w-[180px] sm:max-w-[220px]">
                  {t('settings.darkModeDesc')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                isDark ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
              aria-label="Toggle Dark Mode"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[12px] ${
                  isDark ? 'translate-x-6 text-primary' : 'translate-x-0 text-amber-500'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
            </button>
          </div>

          {/* Multi-Language Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              {t('settings.language')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code as LanguageCode)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    language === lang.code
                      ? 'bg-primary-container/20 dark:bg-primary-container/30 border-primary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-low dark:bg-surface-container border-transparent text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-xs sm:text-sm">{lang.nativeName}</span>
                  </div>
                  {language === lang.code && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Units Selection */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              {t('settings.units')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  unitSystem === 'metric'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low dark:bg-surface-container text-on-surface border-transparent'
                }`}
              >
                {t('settings.unitsMetric')}
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  unitSystem === 'imperial'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low dark:bg-surface-container text-on-surface border-transparent'
                }`}
              >
                {t('settings.unitsImperial')}
              </button>
            </div>
          </div>

          {/* Push Notification Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-container dark:border-surface-variant">
            <span className="text-xs font-semibold text-on-surface">
              {t('settings.notifications')}
            </span>
            <input
              type="checkbox"
              checked={pushAlerts}
              onChange={e => setPushAlerts(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-surface-container dark:border-surface-variant flex justify-end">
          <button
            type="button"
            onClick={closeSettingsModal}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-sm hover:bg-[#00524b] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
