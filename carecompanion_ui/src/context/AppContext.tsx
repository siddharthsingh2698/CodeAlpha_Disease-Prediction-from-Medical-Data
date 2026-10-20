/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ScreenId,
  DiseaseKey,
  ModelKey,
  ClinicalTool,
  UserProfile,
  ActivityNotification,
  DailyHabitGoal,
  ScheduledReminder,
  CoachChatMessage,
  AppContextType,
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
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Product designer focusing on gentle habits, hydration consistency, and restorative morning sleep.',
  age: 32,
  weight: 68,
  waterGoal: 2500,
  sleepGoal: 8,
  isGuest: false,
  memberSince: 'Oct 2024',
};

const INITIAL_HEALTH_INPUTS: HealthCheckInputs = {
  age: 32,
  weight: 68,
  sleepHours: 7.5,
  bpVibe: 'normal',
  exercise: 'daily',
  habits: ['plant-forward', 'water-tracker'],
};

const INITIAL_GOALS: DailyHabitGoal[] = [
  {
    id: 'g-1',
    title: 'Morning Hydration (500ml water right after waking)',
    completed: true,
    category: 'hydration',
  },
  {
    id: 'g-2',
    title: '15-minute brisk walk after lunch',
    completed: true,
    category: 'movement',
  },
  {
    id: 'g-3',
    title: 'Take daily magnesium & vitamin D supplement',
    completed: true,
    category: 'nutrition',
  },
  {
    id: 'g-4',
    title: 'Wind-down screen-free routine (30 mins before bed)',
    completed: false,
    category: 'sleep',
  },
];

const INITIAL_REMINDERS: ScheduledReminder[] = [
  {
    id: 'r-1',
    title: 'Evening Hydration Check',
    timeDisplay: 'In 2 hours (8:00 PM)',
    enabled: true,
    icon: 'notifications_active',
    colorClass: 'bg-secondary-container text-on-secondary-container',
  },
  {
    id: 'r-2',
    title: 'Wind-Down Notification',
    timeDisplay: 'Tonight at 10:15 PM',
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
    title: 'Streak Protected!',
    message: 'You reached day 5 of your wellness streak! 2 days to your all-time record.',
    timeAgo: '10m ago',
    read: false,
    type: 'achievement',
    icon: 'local_fire_department',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('1-health-check-input');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clinical Platform state
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKey>('heart_disease');
  const [selectedModel, setSelectedModel] = useState<ModelKey>('champion');
  const [clinicalResult, setClinicalResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeClinicalTool, setActiveClinicalTool] = useState<ClinicalTool>('none');

  // Core Wellness State
  const [healthInputs, setHealthInputs] = useState<HealthCheckInputs>(INITIAL_HEALTH_INPUTS);
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>(() =>
    generateHealthAssessment(INITIAL_HEALTH_INPUTS)
  );

  // Sync dark mode class
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
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateHealthInputs = (inputs: Partial<HealthCheckInputs>) => {
    setHealthInputs(prev => ({ ...prev, ...inputs }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      // Also sync age and weight into health inputs
      if (updates.age !== undefined || updates.weight !== undefined) {
        setHealthInputs(h => ({
          ...h,
          age: updates.age ?? h.age,
          weight: updates.weight ?? h.weight,
        }));
      }
      return updated;
    });
    showToast('Profile updated successfully!');
  };

  // Convert inputs to ML backend biomarkers
  const buildBiomarkerPayload = (inputs: HealthCheckInputs) => {
    const isHighBP = inputs.bpVibe === 'high';
    const isNormalBP = inputs.bpVibe === 'normal';
    const systolicBP = isHighBP ? 158 : isNormalBP ? 118 : 132;
    const chol = isHighBP ? 265 : 188;
    const bmi = Number((inputs.weight / (1.75 * 1.75)).toFixed(1));
    const isSmoker = !inputs.habits.includes('smoke-free');

    if (selectedDisease === 'heart_disease') {
      return {
        "Age": inputs.age,
        "Gender": "Male",
        "Blood Pressure": systolicBP,
        "Cholesterol Level": chol,
        "Exercise Habits": inputs.exercise === 'daily' ? 'High' : (inputs.exercise === 'moderate' ? 'Medium' : 'Low'),
        "Smoking": isSmoker ? 'Yes' : 'No',
        "Family Heart Disease": isHighBP ? 'Yes' : 'No',
        "Diabetes": 'No',
        "BMI": bmi,
        "High Blood Pressure": isHighBP ? 'Yes' : 'No',
        "Low HDL Cholesterol": isHighBP ? 'Yes' : 'No',
        "High LDL Cholesterol": isHighBP ? 'Yes' : 'No',
        "Alcohol Consumption": 'Low',
        "Stress Level": inputs.habits.includes('mindful') ? 'Low' : (isHighBP ? 'High' : 'Medium'),
        "Sleep Hours": inputs.sleepHours,
        "Sugar Consumption": inputs.habits.includes('plant-forward') ? 'Low' : 'Medium',
        "Triglyceride Level": isHighBP ? 220 : 130,
        "Fasting Blood Sugar": isHighBP ? 138 : 90,
        "CRP Level": isHighBP ? 4.2 : 1.1,
        "Homocysteine Level": isHighBP ? 16.5 : 9.5
      };
    } else if (selectedDisease === 'diabetes') {
      return {
        "Pregnancies": 2,
        "Glucose": isHighBP ? 168 : 95,
        "BloodPressure": isHighBP ? 88 : 70,
        "SkinThickness": 25.0,
        "Insulin": isHighBP ? 185.0 : 80.0,
        "BMI": bmi,
        "DiabetesPedigreeFunction": isHighBP ? 0.75 : 0.35,
        "Age": inputs.age
      };
    } else {
      // Breast Cancer
      return {
        "mean radius": isHighBP ? 17.8 : 12.4,
        "mean texture": isHighBP ? 23.4 : 16.2,
        "mean perimeter": isHighBP ? 118.0 : 80.5,
        "mean area": isHighBP ? 980.0 : 475.0,
        "mean smoothness": isHighBP ? 0.115 : 0.088,
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
        "worst radius": isHighBP ? 21.5 : 14.1,
        "worst texture": 25.6,
        "worst perimeter": 107.0,
        "worst area": 880.0,
        "worst smoothness": 0.132,
        "worst compactness": 0.254,
        "worst concavity": 0.271,
        "worst concave points": 0.114,
        "worst symmetry": 0.290,
        "worst fractal dimension": 0.084
      };
    }
  };

  // Full Real ML Assessment
  const calculateAndGoToInsights = async () => {
    setIsAnalyzing(true);
    showToast(`Evaluating biomarkers with ${selectedModel.replace('_', ' ')}...`);

    let assessment = generateHealthAssessment(healthInputs);

    try {
      const payload = {
        disease: selectedDisease,
        model: selectedModel,
        biomarkers: buildBiomarkerPayload(healthInputs)
      };

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const res = await response.json();
      if (res.status === 'success') {
        const data = res.data;
        setClinicalResult(data);

        // Compute score: 100 - risk probability
        const mlScore = Math.max(5, Math.min(99, Math.round(100 - data.probability)));
        assessment = {
          ...assessment,
          score: mlScore,
          ratingText: data.risk_level,
          description: `${data.predicted_label}: ${data.recommendation}`,
        };

        // Add SHAP factors to milestones / focus areas
        if (data.top_contributing_factors && data.top_contributing_factors.length > 0) {
          const topFactor = data.top_contributing_factors[0];
          assessment.focusAreas = [
            {
              id: 'f-shap',
              title: `Primary Factor: ${topFactor.Feature}`,
              badge: `${topFactor.Direction}`,
              description: `Attribution impact: ${topFactor.Impact > 0 ? '+' : ''}${topFactor.Impact.toFixed(3)} Log-Odds.`,
              icon: 'insights',
            },
            ...assessment.focusAreas.slice(0, 1),
          ];
        }
      }
    } catch (err: any) {
      console.warn('API predict fallback:', err);
    } finally {
      setIsAnalyzing(false);
    }

    setHealthAssessment(assessment);
    setCurrentScreen('2-your-health-insights');
    addNotification({
      title: 'Clinical Assessment Complete',
      message: `Computed calibrated wellness score: ${assessment.score}/100 (${assessment.ratingText}).`,
      type: 'score',
      icon: 'auto_awesome',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preset Handlers
  const loadHealthyPreset = () => {
    updateHealthInputs({
      age: 32,
      weight: 66,
      sleepHours: 8.0,
      bpVibe: 'normal',
      exercise: 'daily',
      habits: ['plant-forward', 'smoke-free', 'water-tracker', 'mindful'],
    });
    showToast('Loaded Healthy Baseline: BP Normal, Sleep 8h, Smoke-Free, Active');
  };

  const loadHighRiskPreset = () => {
    updateHealthInputs({
      age: 62,
      weight: 96,
      sleepHours: 5.5,
      bpVibe: 'high',
      exercise: 'starter',
      habits: ['coffee-lover'],
    });
    showToast('Loaded Elevated Risk Profile: BP Elevated, Sleep 5.5h, Sedentary');
  };

  // Download Clinical Report
  const downloadReport = async () => {
    try {
      showToast('Generating clinical diagnostic markdown summary...');
      const response = await fetch('/api/download-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: selectedDisease,
          model: selectedModel,
          prediction: clinicalResult || {
            probability: 100 - healthAssessment.score,
            risk_level: healthAssessment.ratingText,
            predicted_label: healthAssessment.ratingText,
            recommendation: healthAssessment.description,
          },
          inputs: buildBiomarkerPayload(healthInputs),
        }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Clinical_Risk_Report_${selectedDisease}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Diagnostic report downloaded successfully!');
    } catch (e: any) {
      showToast(`Report download error: ${e.message}`);
    }
  };

  // Habit Goals
  const [todayGoals, setTodayGoals] = useState<DailyHabitGoal[]>(INITIAL_GOALS);

  const toggleGoal = (id: string) => {
    setTodayGoals(prev =>
      prev.map(goal => {
        if (goal.id === id) {
          const nextState = !goal.completed;
          if (nextState) {
            addNotification({
              title: 'Goal Accomplished!',
              message: `Completed "${goal.title}". Great momentum!`,
              type: 'habit',
              icon: 'check_circle',
            });
          }
          return { ...goal, completed: nextState };
        }
        return goal;
      })
    );
  };

  // Water intake
  const [waterIntake, setWaterIntake] = useState<number>(1750);

  const addWater = (amount: number) => {
    setWaterIntake(prev => {
      const next = Math.max(0, prev + amount);
      addNotification({
        title: 'Water Logged',
        message: `Added +${amount} ml. Current daily total: ${next.toLocaleString()} / 2,500 ml.`,
        type: 'water',
        icon: 'water_drop',
      });
      return next;
    });
  };

  const resetWater = () => {
    setWaterIntake(0);
    showToast('Daily water intake reset to 0 ml.');
  };

  // Sleep Quality
  const [sleepFeeling, setSleepFeeling] = useState<'tired' | 'ok' | 'fresh' | 'super'>('fresh');

  const handleSetSleepFeeling = (feeling: 'tired' | 'ok' | 'fresh' | 'super') => {
    setSleepFeeling(feeling);
    addNotification({
      title: 'Sleep Feeling Logged',
      message: `You marked today's waking state as "${feeling.toUpperCase()}". Sleep metrics updated.`,
      type: 'achievement',
      icon: 'bedtime',
    });
  };

  // Reminders
  const [reminders, setReminders] = useState<ScheduledReminder[]>(INITIAL_REMINDERS);

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextState = !r.enabled;
          addNotification({
            title: `Reminder ${nextState ? 'Activated' : 'Paused'}`,
            message: `"${r.title}" is now ${nextState ? 'active' : 'turned off'}.`,
            type: 'reminder',
            icon: 'notifications_active',
          });
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  // AI Wellness Coach Chat
  const [chatMessages, setChatMessages] = useState<CoachChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'coach',
      text: "Hello! I'm your CareCompanion wellness guide. I've analyzed your check-in: 7.5 hours of sleep, 68 kg weight, and daily workouts. How can I support your routine today?",
      timestamp: 'Just now',
    },
  ]);
  const [isCoachTyping, setIsCoachTyping] = useState<boolean>(false);

  const sendMessageToCoach = (text: string) => {
    if (!text.trim()) return;

    const userMsg: CoachChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsCoachTyping(true);

    setTimeout(() => {
      let reply = "That's a fantastic focus. Maintaining your consistent daily sleep and hydration habits will significantly boost your daytime energy!";
      const lower = text.toLowerCase();

      if (lower.includes('heart') || lower.includes('cardio') || lower.includes('bp') || lower.includes('blood pressure')) {
        reply = `For cardiovascular health with ${selectedModel.replace('_', ' ')}, keeping systolic pressure under 120 mmHg and sodium under 2,000 mg/day directly reduces arterial strain.`;
      } else if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('glucose')) {
        reply = "For optimal glycemic control, pairing fiber-rich vegetables with protein slows gastric emptying and keeps post-prandial spikes minimal.";
      } else if (lower.includes('hydration') || lower.includes('water')) {
        reply = `With your current intake of ${waterIntake} ml towards your 2,500 ml target, try drinking one glass every 90 minutes for cellular absorption!`;
      } else if (lower.includes('sleep') || lower.includes('wind-down') || lower.includes('bed')) {
        reply = "For deep restorative sleep, keep lighting warm and dim from 9:00 PM. A chamomile infusion paired with reading signals melatonin release.";
      } else if (lower.includes('stretch') || lower.includes('desk') || lower.includes('neck')) {
        reply = "Here is your 5-min desk stretch: 1. Chin tucks (10 reps), 2. Shoulder blade squeezes (15s hold), 3. Seated spinal twist. Alleviates stiffness instantly!";
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

  // Notifications
  const [notifications, setNotifications] = useState<ActivityNotification[]>(INITIAL_NOTIFICATIONS);

  const addNotification = (notif: Omit<ActivityNotification, 'id' | 'timeAgo' | 'read'>) => {
    const newEntry: ActivityNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timeAgo: 'Just now',
      read: false,
    };
    setNotifications(prev => [newEntry, ...prev.slice(0, 19)]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

        // Clinical
        selectedDisease,
        setSelectedDisease,
        selectedModel,
        setSelectedModel,
        clinicalResult,
        isAnalyzing,
        loadHealthyPreset,
        loadHighRiskPreset,
        downloadReport,
        toastMessage,
        setToastMessage,
        activeClinicalTool,
        setActiveClinicalTool,
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
