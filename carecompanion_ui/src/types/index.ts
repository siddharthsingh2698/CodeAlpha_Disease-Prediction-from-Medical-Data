/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from '../utils/translations';
import { HealthCheckInputs, HealthAssessment } from '../utils/healthCalculator';

export type ScreenId = '1-health-check-input' | '2-your-health-insights' | '3-wellness-coach';

export type DiseaseKey = 'heart_disease' | 'diabetes' | 'breast_cancer';

export type ModelKey = 'champion' | 'Logistic_Regression' | 'SVM' | 'Random_Forest' | 'XGBoost';

export type ClinicalTool = 'none' | 'batch' | 'benchmarks' | 'dataset';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  age: number;
  weight: number;
  waterGoal: number;
  sleepGoal: number;
  isGuest: boolean;
  memberSince: string;
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'achievement' | 'water' | 'habit' | 'reminder' | 'auth' | 'score';
  icon: string;
}

export interface HabitDayRecord {
  day: string;
  fullDate: string;
  done: number;
  total: number;
  isToday?: boolean;
}

export interface DailyHabitGoal {
  id: string;
  title: string;
  completed: boolean;
  category: 'hydration' | 'movement' | 'nutrition' | 'mindfulness' | 'sleep';
}

export interface ScheduledReminder {
  id: string;
  title: string;
  timeDisplay: string;
  enabled: boolean;
  icon: string;
  colorClass: string;
}

export interface CoachChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  timestamp: string;
}

export interface AppContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  healthInputs: HealthCheckInputs;
  updateHealthInputs: (inputs: Partial<HealthCheckInputs>) => void;
  healthAssessment: HealthAssessment;
  calculateAndGoToInsights: () => void;
  todayGoals: DailyHabitGoal[];
  toggleGoal: (id: string) => void;
  waterIntake: number;
  addWater: (amount: number) => void;
  resetWater: () => void;
  sleepFeeling: 'tired' | 'ok' | 'fresh' | 'super';
  setSleepFeeling: (feeling: 'tired' | 'ok' | 'fresh' | 'super') => void;
  reminders: ScheduledReminder[];
  toggleReminder: (id: string) => void;
  chatMessages: CoachChatMessage[];
  sendMessageToCoach: (text: string) => void;
  isCoachTyping: boolean;
  notifications: ActivityNotification[];
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  t: (key: string, fallback?: string) => string;

  // Real ML Clinical Prediction Platform Extensions
  selectedDisease: DiseaseKey;
  setSelectedDisease: (d: DiseaseKey) => void;
  selectedModel: ModelKey;
  setSelectedModel: (m: ModelKey) => void;
  clinicalResult: any;
  isAnalyzing: boolean;
  loadHealthyPreset: () => void;
  loadHighRiskPreset: () => void;
  downloadReport: () => Promise<void>;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  activeClinicalTool: ClinicalTool;
  setActiveClinicalTool: (tool: ClinicalTool) => void;
}
