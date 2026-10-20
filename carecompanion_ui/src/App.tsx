/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Screen1HealthCheck } from './components/Screen1HealthCheck';
import { Screen2HealthInsights } from './components/Screen2HealthInsights';
import { Screen3WellnessCoach } from './components/Screen3WellnessCoach';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';

const MainApp: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  // Support direct screen parameter or autostart for testing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam === '2' || screenParam === 'insights') {
      setCurrentScreen('2-your-health-insights');
    } else if (screenParam === '3' || screenParam === 'coach') {
      setCurrentScreen('3-wellness-coach');
    }
  }, [setCurrentScreen]);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#11181b] text-on-surface flex flex-col font-body transition-colors duration-200">
      <Header />

      <main className="w-full pt-20 flex-1">
        {currentScreen === '1-health-check-input' && <Screen1HealthCheck />}
        {currentScreen === '2-your-health-insights' && <Screen2HealthInsights />}
        {currentScreen === '3-wellness-coach' && <Screen3WellnessCoach />}
      </main>

      <Footer />

      {/* Global Interactive Modals */}
      <AuthModal />
      <ProfileModal />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
