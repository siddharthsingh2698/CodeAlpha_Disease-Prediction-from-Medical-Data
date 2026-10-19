/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from '../utils/translations';
import { HealthCheckInputs, HealthAssessment } from '../utils/healthCalculator';

export type ScreenId =
  | '1-health-check-input'
  | '2-your-health-insights'
  | '3-batch-screening'
  | '4-model-benchmarks'
  | '5-dataset-explorer'
  | '6-wellness-coach';

export type DiseaseKey = 'heart_disease' | 'diabetes' | 'breast_cancer';

export type ModelKey = 'champion' | 'Logistic_Regression' | 'SVM' | 'Random_Forest' | 'XGBoost';

export interface ContributingFactor {
  Feature: string;
  Impact: number;
  Direction: string;
}

export interface ClinicalPredictionResult {
  probability: number;
  risk_level: string;
  predicted_label: string;
  recommendation: string;
  badge_color: string;
  top_contributing_factors: ContributingFactor[];
}

export interface ClinicalBiomarkers {
  age: number;
  gender: 'Male' | 'Female';
  bloodPressure: number;
  cholesterol: number;
  bmi: number;
  sleepHours: number;
  triglycerides: number;
  fastingBloodSugar: number;
  crpLevel: number;
  homocysteine: number;
  exercise: 'active' | 'moderate' | 'sedentary';
  smoking: boolean;
  familyHistory: boolean;
  diabetesHistory: boolean;
  highBP: boolean;
  lowHDL: boolean;
  highLDL: boolean;
  alcohol: 'none' | 'moderate' | 'heavy';
  stress: 'low' | 'moderate' | 'high';
  sugar: 'low' | 'moderate' | 'high';
  // Diabetes specific
  pregnancies?: number;
  glucose?: number;
  insulin?: number;
  skinThickness?: number;
  pedigree?: number;
  // Breast cancer specific
  meanRadius?: number;
  meanTexture?: number;
  meanPerimeter?: number;
  meanArea?: number;
  meanSmoothness?: number;
}

export interface BatchScreeningSummary {
  total_records: number;
  high_risk_count: number;
  moderate_risk_count: number;
  low_risk_count: number;
  high_risk_rate_pct: number;
  mean_risk_pct: number;
  preview: Record<string, any>[];
  columns: string[];
}

export interface ModelBenchmarkItem {
  Model: string;
  Accuracy: number;
  Precision: number;
  Recall: number;
  Specificity: number;
  'F1-Score': number;
  'ROC-AUC': number;
  CV_F1_Mean?: number;
  CV_F1_Best?: number;
  Confusion_Matrix?: number[][];
}

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
  
  // Clinical Prediction Platform extensions
  selectedDisease: DiseaseKey;
  setSelectedDisease: (disease: DiseaseKey) => void;
  selectedModel: ModelKey;
  setSelectedModel: (model: ModelKey) => void;
  clinicalBiomarkers: ClinicalBiomarkers;
  updateClinicalBiomarkers: (inputs: Partial<ClinicalBiomarkers>) => void;
  clinicalResult: ClinicalPredictionResult | null;
  isAssessing: boolean;
  runClinicalAssessment: () => Promise<void>;
  loadHealthyPreset: () => void;
  loadHighRiskPreset: () => void;
  downloadClinicalReport: () => Promise<void>;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;

  // CareCompanion Core Wellness
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
}
