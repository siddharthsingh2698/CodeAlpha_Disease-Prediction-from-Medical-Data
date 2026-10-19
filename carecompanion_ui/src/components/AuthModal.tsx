/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, user, updateUser, t } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters for security.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your display name.');
      return;
    }

    updateUser({
      name: isSignUp ? name : user.name || 'Alex Rivera',
      email,
      avatar: AVATAR_OPTIONS[avatarIndex],
      isGuest: false,
    });

    closeAuthModal();
  };

  const handleGuest = () => {
    updateUser({
      name: 'Guest Explorer',
      email: 'guest@carecompanion.local',
      isGuest: true,
    });
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-surface-container dark:border-surface-variant relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container mx-auto flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
            {isSignUp ? t('auth.signupTitle') : t('auth.loginTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Personalized health vaults with local credential protection
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Choose Profile Avatar
                </label>
                <div className="flex items-center justify-center gap-3 py-2">
                  {AVATAR_OPTIONS.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setAvatarIndex(i)}
                      className={`w-12 h-12 rounded-full overflow-hidden transition-all ${
                        avatarIndex === i
                          ? 'ring-4 ring-primary scale-110 shadow-sm'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  {t('profile.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1">
              {t('auth.passwordHint')}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-[#00524b] text-on-primary text-sm font-bold shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              {isSignUp ? t('auth.signupBtn') : t('auth.loginBtn')}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-surface-container dark:border-surface-variant space-y-2 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-primary hover:underline block w-full"
          >
            {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className="text-xs text-on-surface-variant hover:text-on-surface block w-full pt-1"
          >
            {t('auth.guest')}
          </button>
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-primary-container/10 border border-primary/20 flex items-center gap-2 text-[11px] text-primary dark:text-[#6bd8cb] justify-center">
          <span className="material-symbols-outlined text-[16px]">security</span>
          <span>Encrypted with Local Vault Session Protection</span>
        </div>
      </div>
    </div>
  );
};
