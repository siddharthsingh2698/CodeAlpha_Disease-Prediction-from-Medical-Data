/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="w-full bg-surface-container-low dark:bg-[#131c1f] py-8 border-t border-surface-container/60 dark:border-surface-variant/30 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-on-surface-variant text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[14px]">favorite</span>
          </div>
          <span>{t('footer.text')}</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-on-surface-variant">
          <span>Privacy Secured</span>
          <span>•</span>
          <span>Wellness Snapshot v2.4</span>
        </div>
      </div>
    </footer>
  );
};
