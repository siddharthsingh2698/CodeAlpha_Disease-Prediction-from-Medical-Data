/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProfileModal: React.FC = () => {
  const { isProfileModalOpen, closeProfileModal, user, updateUser, t } = useApp();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [waterGoal, setWaterGoal] = useState(user.waterGoal);
  const [sleepGoal, setSleepGoal] = useState(user.sleepGoal);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  if (!isProfileModalOpen) return null;

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      avatar,
      bio,
      waterGoal: Number(waterGoal) || 2500,
      sleepGoal: Number(sleepGoal) || 8,
    });
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      closeProfileModal();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-surface-container dark:border-surface-variant relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeProfileModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="relative inline-block mx-auto mb-3">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-primary shadow-md mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
            {t('profile.title')}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Presets Selection */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              {t('profile.avatar')}
            </label>
            <div className="grid grid-cols-6 gap-2 py-1">
              {AVATAR_PRESETS.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`w-full aspect-square rounded-full overflow-hidden transition-all ${
                    avatar === url
                      ? 'ring-3 ring-primary scale-105 shadow-sm'
                      : 'opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                >
                  <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Custom Avatar URL option */}
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={customAvatarInput}
                onChange={e => setCustomAvatarInput(e.target.value)}
                placeholder="Or paste custom image link (https://...)"
                className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  if (customAvatarInput.trim()) {
                    setAvatar(customAvatarInput.trim());
                    setCustomAvatarInput('');
                  }
                }}
                disabled={!customAvatarInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-xs font-semibold text-on-surface disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {t('profile.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Biography & Health Goals */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {t('profile.bio')}
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Share what wellness means to you, daily intentions, or dietary focus..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none leading-relaxed"
            />
          </div>

          {/* Goals Tuning */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Water Target (ml)
              </label>
              <input
                type="number"
                min="1000"
                max="5000"
                step="250"
                value={waterGoal}
                onChange={e => setWaterGoal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Sleep Target (hrs)
              </label>
              <input
                type="number"
                min="4"
                max="12"
                step="0.5"
                value={sleepGoal}
                onChange={e => setSleepGoal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-[#00524b] text-on-primary text-sm font-bold shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {showSavedFeedback ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{t('profile.savedToast')}</span>
                </>
              ) : (
                <span>{t('profile.save')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
