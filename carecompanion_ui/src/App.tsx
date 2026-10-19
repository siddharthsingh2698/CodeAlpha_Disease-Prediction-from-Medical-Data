/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Screen1HealthCheck } from './components/Screen1HealthCheck';
import { Screen2HealthInsights } from './components/Screen2HealthInsights';
import { Screen3BatchScreening } from './components/Screen3BatchScreening';
import { Screen4ModelBenchmarks } from './components/Screen4ModelBenchmarks';
import { Screen5DatasetExplorer } from './components/Screen5DatasetExplorer';
import { Screen3WellnessCoach } from './components/Screen3WellnessCoach';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';

const MainApp: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  // Support direct screen parameter for instant testing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam === '2' || screenParam === 'insights') {
      setCurrentScreen('2-your-health-insights');
    } else if (screenParam === '3' || screenParam === 'batch') {
      setCurrentScreen('3-batch-screening');
    } else if (screenParam === '4' || screenParam === 'benchmarks') {
      setCurrentScreen('4-model-benchmarks');
    } else if (screenParam === '5' || screenParam === 'dataset') {
      setCurrentScreen('5-dataset-explorer');
    } else if (screenParam === '6' || screenParam === 'coach') {
      setCurrentScreen('6-wellness-coach');
    }
  }, [setCurrentScreen]);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#11181b] text-on-surface flex flex-col font-body transition-colors duration-200">
      <Header />

      <main className="w-full pt-28 flex-1">
        {currentScreen === '1-health-check-input' && <Screen1HealthCheck />}
        {currentScreen === '2-your-health-insights' && <Screen2HealthInsights />}
        {currentScreen === '3-batch-screening' && <Screen3BatchScreening />}
        {currentScreen === '4-model-benchmarks' && <Screen4ModelBenchmarks />}
        {currentScreen === '5-dataset-explorer' && <Screen5DatasetExplorer />}
        {currentScreen === '6-wellness-coach' && <Screen3WellnessCoach />}
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
