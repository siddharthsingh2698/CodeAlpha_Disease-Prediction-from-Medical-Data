/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ScreenId,
  DiseaseKey,
  ModelKey,
  UserProfile,
  ActivityNotification,
  DailyHabitGoal,
  ScheduledReminder,
  CoachChatMessage,
  AppContextType,
  ClinicalBiomarkers,
  ClinicalPredictionResult,
} from '../types';
import {
  HealthCheckInputs,
  HealthAssessment,
  generateHealthAssessment,
} from '../utils/healthCalculator';
import { LanguageCode, getTranslation } from '../utils/translations';

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Dr. Siddharth Singh',
  email: 'siddharth@carecompanion.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Clinical triage practitioner focusing on cardiovascular risk, metabolic health, and explainable AI.',
  age: 45,
  weight: 72,
  waterGoal: 2500,
  sleepGoal: 8,
  isGuest: false,
  memberSince: 'Oct 2024',
};

const INITIAL_HEALTH_INPUTS: HealthCheckInputs = {
  age: 45,
  weight: 72,
  sleepHours: 7.0,
  bpVibe: 'normal',
  exercise: 'moderate',
  habits: ['plant-forward', 'water-tracker'],
};

const INITIAL_CLINICAL_BIOMARKERS: ClinicalBiomarkers = {
  age: 48,
  gender: 'Male',
  bloodPressure: 128,
  cholesterol: 205,
  bmi: 24.8,
  sleepHours: 7.0,
  triglycerides: 145,
  fastingBloodSugar: 98,
  crpLevel: 1.4,
  homocysteine: 10.2,
  exercise: 'moderate',
  smoking: false,
  familyHistory: false,
  diabetesHistory: false,
  highBP: false,
  lowHDL: false,
  highLDL: false,
  alcohol: 'moderate',
  stress: 'moderate',
  sugar: 'moderate',
  // Diabetes defaults
  pregnancies: 2,
  glucose: 110,
  insulin: 85,
  skinThickness: 23,
  pedigree: 0.38,
  // Breast cancer defaults
  meanRadius: 13.5,
  meanTexture: 18.2,
  meanPerimeter: 88.0,
  meanArea: 580.0,
  meanSmoothness: 0.095,
};

const INITIAL_GOALS: DailyHabitGoal[] = [
  {
    id: 'g-1',
    title: 'Morning Hydration (500ml water upon waking)',
    completed: true,
    category: 'hydration',
  },
  {
    id: 'g-2',
    title: 'Post-meal 15-minute brisk walk for glucose regulation',
    completed: true,
    category: 'movement',
  },
  {
    id: 'g-3',
    title: 'Daily Omega-3 & Magnesium vascular support',
    completed: true,
    category: 'nutrition',
  },
  {
    id: 'g-4',
    title: 'Digital sunset: Screen-free wind down at 10 PM',
    completed: false,
    category: 'sleep',
  },
];

const INITIAL_REMINDERS: ScheduledReminder[] = [
  {
    id: 'r-1',
    title: 'Blood Pressure & Vitals Log',
    timeDisplay: 'Today at 6:00 PM',
    enabled: true,
    icon: 'speed',
    colorClass: 'bg-primary-container text-on-primary-container',
  },
  {
    id: 'r-2',
    title: 'Evening Hydration Target',
    timeDisplay: 'In 2 hours (8:00 PM)',
    enabled: true,
    icon: 'water_drop',
    colorClass: 'bg-secondary-container text-on-secondary-container',
  },
  {
    id: 'r-3',
    title: 'Restorative Sleep Preparation',
    timeDisplay: 'Tonight at 10:30 PM',
    enabled: true,
    icon: 'bedtime',
    colorClass: 'bg-tertiary-fixed text-tertiary',
  },
];

const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'n-1',
    title: 'ML Diagnostics Engine Ready',
    message: 'Trained pipelines active: SVM, XGBoost, Random Forest & Logistic Regression.',
    timeAgo: 'Just now',
    read: false,
    type: 'score',
    icon: 'verified',
  },
  {
    id: 'n-2',
    title: 'Hydration Target',
    message: 'Great job maintaining steady water intake today!',
    timeAgo: '15m ago',
    read: false,
    type: 'water',
    icon: 'water_drop',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('1-health-check-input');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clinical Platform State
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKey>('heart_disease');
  const [selectedModel, setSelectedModel] = useState<ModelKey>('champion');
  const [clinicalBiomarkers, setClinicalBiomarkers] = useState<ClinicalBiomarkers>(INITIAL_CLINICAL_BIOMARKERS);
  const [clinicalResult, setClinicalResult] = useState<ClinicalPredictionResult | null>(null);
  const [isAssessing, setIsAssessing] = useState<boolean>(false);

  // Core Wellness State
  const [healthInputs, setHealthInputs] = useState<HealthCheckInputs>(INITIAL_HEALTH_INPUTS);
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>(() =>
    generateHealthAssessment(INITIAL_HEALTH_INPUTS)
  );
  const [todayGoals, setTodayGoals] = useState<DailyHabitGoal[]>(INITIAL_GOALS);
  const [waterIntake, setWaterIntake] = useState<number>(1250);
  const [sleepFeeling, setSleepFeeling] = useState<'tired' | 'ok' | 'fresh' | 'super'>('fresh');
  const [reminders, setReminders] = useState<ScheduledReminder[]>(INITIAL_REMINDERS);
  const [chatMessages, setChatMessages] = useState<CoachChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'coach',
      text: "Hello! I am your CareCompanion AI Wellness & Clinical Coach. How are your energy levels and vitals today?",
      timestamp: '9:00 AM',
    },
  ]);
  const [isCoachTyping, setIsCoachTyping] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ActivityNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Dark Mode Sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return getTranslation(language, key, fallback);
    },
    [language]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateClinicalBiomarkers = (updates: Partial<ClinicalBiomarkers>) => {
    setClinicalBiomarkers(prev => ({ ...prev, ...updates }));
  };

  const updateHealthInputs = (inputs: Partial<HealthCheckInputs>) => {
    setHealthInputs(prev => ({ ...prev, ...inputs }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Convert clinicalBiomarkers into backend payload
  const buildBiomarkerPayload = (): Record<string, any> => {
    const b = clinicalBiomarkers;
    if (selectedDisease === 'heart_disease') {
      return {
        "Age": b.age,
        "Gender": b.gender,
        "Blood Pressure": b.bloodPressure,
        "Cholesterol Level": b.cholesterol,
        "Exercise Habits": b.exercise === 'active' ? 'High' : (b.exercise === 'moderate' ? 'Medium' : 'Low'),
        "Smoking": b.smoking ? 'Yes' : 'No',
        "Family Heart Disease": b.familyHistory ? 'Yes' : 'No',
        "Diabetes": b.diabetesHistory ? 'Yes' : 'No',
        "BMI": b.bmi,
        "High Blood Pressure": b.highBP ? 'Yes' : 'No',
        "Low HDL Cholesterol": b.lowHDL ? 'Yes' : 'No',
        "High LDL Cholesterol": b.highLDL ? 'Yes' : 'No',
        "Alcohol Consumption": b.alcohol === 'none' ? 'Low' : (b.alcohol === 'heavy' ? 'High' : 'Medium'),
        "Stress Level": b.stress === 'high' ? 'High' : (b.stress === 'low' ? 'Low' : 'Medium'),
        "Sleep Hours": b.sleepHours,
        "Sugar Consumption": b.sugar === 'high' ? 'High' : (b.sugar === 'low' ? 'Low' : 'Medium'),
        "Triglyceride Level": b.triglycerides,
        "Fasting Blood Sugar": b.fastingBloodSugar,
        "CRP Level": b.crpLevel,
        "Homocysteine Level": b.homocysteine,
      };
    } else if (selectedDisease === 'diabetes') {
      return {
        "Pregnancies": b.pregnancies ?? 2,
        "Glucose": b.glucose ?? b.fastingBloodSugar ?? 120,
        "BloodPressure": b.bloodPressure < 120 ? b.bloodPressure : 75,
        "SkinThickness": b.skinThickness ?? 25.0,
        "Insulin": b.insulin ?? 95.0,
        "BMI": b.bmi,
        "DiabetesPedigreeFunction": b.pedigree ?? 0.45,
        "Age": Math.round(b.age),
      };
    } else {
      // Breast Cancer
      return {
        "mean radius": b.meanRadius ?? 14.2,
        "mean texture": b.meanTexture ?? 19.5,
        "mean perimeter": b.meanPerimeter ?? 92.5,
        "mean area": b.meanArea ?? 654.0,
        "mean smoothness": b.meanSmoothness ?? 0.096,
        "mean compactness": 0.104,
        "mean concavity": 0.088,
        "mean concave points": 0.048,
        "mean symmetry": 0.181,
        "mean fractal dimension": 0.062,
        "radius error": 0.40,
        "texture error": 1.21,
        "perimeter error": 2.86,
        "area error": 40.3,
        "smoothness error": 0.007,
        "compactness error": 0.025,
        "concavity error": 0.031,
        "concave points error": 0.011,
        "symmetry error": 0.020,
        "fractal dimension error": 0.0037,
        "worst radius": (b.meanRadius ?? 14.2) * 1.15,
        "worst texture": (b.meanTexture ?? 19.5) * 1.3,
        "worst perimeter": (b.meanPerimeter ?? 92.5) * 1.15,
        "worst area": (b.meanArea ?? 654.0) * 1.35,
        "worst smoothness": 0.132,
        "worst compactness": 0.254,
        "worst concavity": 0.271,
        "worst concave points": 0.114,
        "worst symmetry": 0.290,
        "worst fractal dimension": 0.084,
      };
    }
  };

  // Run Real ML Inference
  const runClinicalAssessment = async () => {
    setIsAssessing(true);
    showToast(`Transmitting biomarkers to ML inference engine for ${selectedDisease.replace('_', ' ').toUpperCase()}...`);

    const payload = {
      disease: selectedDisease,
      model: selectedModel,
      biomarkers: buildBiomarkerPayload(),
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.status === 'success') {
        const data: ClinicalPredictionResult = res.data;
        setClinicalResult(data);

        // Update health assessment score based on probability
        const wellnessScore = Math.max(5, Math.min(98, Math.round(100 - data.probability)));
        setHealthAssessment(prev => ({
          ...prev,
          score: wellnessScore,
          ratingText: data.risk_level,
          summary: `${data.predicted_label}: ${data.recommendation}`,
        }));

        showToast(`Assessment complete! Risk: ${data.probability.toFixed(1)}% (${data.risk_level})`);
        setCurrentScreen('2-your-health-insights');
      } else {
        showToast(`Inference error: ${res.message}`);
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Connection to inference backend failed: ${err.message}`);
    } finally {
      setIsAssessing(false);
    }
  };

  // Preset Handlers
  const loadHealthyPreset = () => {
    if (selectedDisease === 'heart_disease') {
      updateClinicalBiomarkers({
        age: 38,
        bloodPressure: 118,
        cholesterol: 185,
        bmi: 22.4,
        sleepHours: 7.5,
        triglycerides: 120,
        fastingBloodSugar: 88,
        crpLevel: 0.8,
        homocysteine: 9.4,
        exercise: 'active',
        smoking: false,
        familyHistory: false,
        diabetesHistory: false,
        highBP: false,
        lowHDL: false,
        highLDL: false,
        alcohol: 'none',
        stress: 'low',
        sugar: 'low',
      });
      showToast('Loaded Healthy Cardiovascular Preset: BP 118, Chol 185 mg/dL, FBS 88');
    } else if (selectedDisease === 'diabetes') {
      updateClinicalBiomarkers({
        age: 30,
        bloodPressure: 70,
        bmi: 21.5,
        glucose: 88,
        insulin: 70,
        pregnancies: 1,
        pedigree: 0.25,
      });
      showToast('Loaded Healthy Glycemic Preset: Glucose 88 mg/dL, BMI 21.5');
    } else {
      updateClinicalBiomarkers({
        age: 32,
        meanRadius: 11.8,
        meanTexture: 15.4,
        meanPerimeter: 75.0,
        meanArea: 420.0,
        meanSmoothness: 0.082,
      });
      showToast('Loaded Benign Cytology Preset: Small uniform nuclear dimensions');
    }
  };

  const loadHighRiskPreset = () => {
    if (selectedDisease === 'heart_disease') {
      updateClinicalBiomarkers({
        age: 62,
        bloodPressure: 158,
        cholesterol: 268,
        bmi: 31.4,
        sleepHours: 5.5,
        triglycerides: 235,
        fastingBloodSugar: 142,
        crpLevel: 4.8,
        homocysteine: 18.2,
        exercise: 'sedentary',
        smoking: true,
        familyHistory: true,
        diabetesHistory: true,
        highBP: true,
        lowHDL: true,
        highLDL: true,
        alcohol: 'moderate',
        stress: 'high',
        sugar: 'high',
      });
      showToast('Loaded High-Risk Pathological Markers: BP 158, Chol 268, Smoking: Yes');
    } else if (selectedDisease === 'diabetes') {
      updateClinicalBiomarkers({
        age: 54,
        bloodPressure: 92,
        bmi: 37.8,
        glucose: 172,
        insulin: 210,
        pregnancies: 4,
        pedigree: 0.85,
      });
      showToast('Loaded High-Risk Diabetic Profile: Glucose 172 mg/dL, BMI 37.8');
    } else {
      updateClinicalBiomarkers({
        age: 58,
        meanRadius: 18.5,
        meanTexture: 25.4,
        meanPerimeter: 122.0,
        meanArea: 1050.0,
        meanSmoothness: 0.118,
      });
      showToast('Loaded High-Risk Malignant Cytology Indicators');
    }
  };

  // Download Clinical Diagnostic Report
  const downloadClinicalReport = async () => {
    if (!clinicalResult) {
      showToast('Please run a diagnostic risk assessment first.');
      return;
    }

    try {
      showToast('Generating clinical diagnostic markdown summary...');
      const response = await fetch('/api/download-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: selectedDisease,
          model: selectedModel,
          prediction: clinicalResult,
          inputs: buildBiomarkerPayload(),
        }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Clinical_Risk_Report_${selectedDisease}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Report downloaded successfully!');
    } catch (e: any) {
      showToast(`Download failed: ${e.message}`);
    }
  };

  const calculateAndGoToInsights = () => {
    runClinicalAssessment();
  };

  const toggleGoal = (id: string) => {
    setTodayGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
    showToast(`Added +${amount} ml water! Hydration level updated.`);
  };

  const resetWater = () => {
    setWaterIntake(0);
  };

  const handleSetSleepFeeling = (feeling: 'tired' | 'ok' | 'fresh' | 'super') => {
    setSleepFeeling(feeling);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const sendMessageToCoach = (text: string) => {
    const userMsg: CoachChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsCoachTyping(true);

    setTimeout(() => {
      let reply = "Maintaining consistent sleep, hydration, and nutritional moderation will directly optimize your metabolic markers and cardiovascular resilience!";
      const lower = text.toLowerCase();

      if (lower.includes('heart') || lower.includes('cardio') || lower.includes('bp') || lower.includes('blood pressure')) {
        reply = `For cardiovascular health, maintaining blood pressure under 120/80 mmHg and reducing saturated fats can improve your arterial elasticity. Our ${selectedModel} model emphasizes systolic control and stress regulation.`;
      } else if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('glucose')) {
        reply = "To manage glycemic index, focus on fiber-dense complex carbohydrates, post-meal 10-minute walks, and monitoring fasting glucose under 100 mg/dL.";
      } else if (lower.includes('cholesterol') || lower.includes('lipid')) {
        reply = "Higher HDL ('good') cholesterol and lower triglycerides protect against plaque accumulation. Soluble fiber (oats, legumes, flaxseed) actively binds to excess LDL.";
      } else if (lower.includes('water') || lower.includes('hydration')) {
        reply = `You have logged ${waterIntake} ml today! Aim for 2,500 ml. Proper hydration maintains optimal blood viscosity and renal filtration.`;
      } else if (lower.includes('sleep')) {
        reply = `With your current ${clinicalBiomarkers.sleepHours} hours recorded, aim for a steady 7.5 hours. Deep stage-3 slow-wave sleep is when your vascular system resets arterial tone.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: 'coach',
          text: reply,
          timestamp: 'Just now',
        },
      ]);
      setIsCoachTyping(false);
    }, 700);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        language,
        setLanguage,
        isDark,
        toggleDarkMode,
        user,
        updateUser,

        // Clinical
        selectedDisease,
        setSelectedDisease,
        selectedModel,
        setSelectedModel,
        clinicalBiomarkers,
        updateClinicalBiomarkers,
        clinicalResult,
        isAssessing,
        runClinicalAssessment,
        loadHealthyPreset,
        loadHighRiskPreset,
        downloadClinicalReport,
        toastMessage,
        setToastMessage,

        // Wellness
        healthInputs,
        updateHealthInputs,
        healthAssessment,
        calculateAndGoToInsights,
        todayGoals,
        toggleGoal,
        waterIntake,
        addWater,
        resetWater,
        sleepFeeling,
        setSleepFeeling: handleSetSleepFeeling,
        reminders,
        toggleReminder,
        chatMessages,
        sendMessageToCoach,
        isCoachTyping,
        notifications,
        markAllNotificationsRead,
        clearNotifications,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isProfileModalOpen,
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),
        isSettingsModalOpen,
        openSettingsModal: () => setIsSettingsModalOpen(true),
        closeSettingsModal: () => setIsSettingsModalOpen(false),
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
