/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HealthCheckInputs {
  age: number;
  weight: number;
  sleepHours: number;
  bpVibe: 'normal' | 'high' | 'unsure';
  exercise: 'daily' | 'moderate' | 'starter';
  habits: string[];
}

export interface Milestone {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
}

export interface FocusArea {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
}

export interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  timeTag: string;
  icon: string;
  completed: boolean;
}

export interface HealthAssessment {
  score: number;
  ratingText: string;
  description: string;
  milestones: Milestone[];
  focusAreas: FocusArea[];
  actionPlan: ActionPlanItem[];
  sleepScore: number;
}

export function calculateHealthScore(inputs: HealthCheckInputs): number {
  let score = 65;

  // Sleep evaluation
  if (inputs.sleepHours >= 7 && inputs.sleepHours <= 8.5) {
    score += 10;
  } else if (inputs.sleepHours >= 6.5 && inputs.sleepHours < 7) {
    score += 6;
  } else if (inputs.sleepHours >= 8.5 && inputs.sleepHours <= 9.5) {
    score += 5;
  } else if (inputs.sleepHours < 6) {
    score -= 10;
  }

  // Blood pressure vibe
  if (inputs.bpVibe === 'normal') {
    score += 8;
  } else if (inputs.bpVibe === 'high') {
    score -= 6;
  }

  // Exercise frequency
  if (inputs.exercise === 'daily') {
    score += 9;
  } else if (inputs.exercise === 'moderate') {
    score += 6;
  } else if (inputs.exercise === 'starter') {
    score += 2;
  }

  // Positive habits
  if (inputs.habits.includes('smoke-free')) score += 5;
  if (inputs.habits.includes('water-tracker')) score += 4;
  if (inputs.habits.includes('plant-forward')) score += 4;
  if (inputs.habits.includes('mindful')) score += 3;
  if (inputs.habits.includes('coffee-lover')) score += 1;

  // Clamp score between 25 and 99
  return Math.min(99, Math.max(25, Math.round(score)));
}

export function getRatingText(score: number): string {
  if (score >= 85) return 'Peak Vitality!';
  if (score >= 75) return 'Looking Great!';
  if (score >= 60) return 'Good Balance';
  return 'Ready for Growth';
}

export function generateHealthAssessment(inputs: HealthCheckInputs): HealthAssessment {
  const score = calculateHealthScore(inputs);
  const ratingText = getRatingText(score);

  const milestones: Milestone[] = [];
  const focusAreas: FocusArea[] = [];

  // Determine milestones
  if (inputs.habits.includes('water-tracker')) {
    milestones.push({
      id: 'm-hydration',
      title: 'Hydration Goal Smashed',
      badge: '5 day streak',
      description: 'You averaged 2.4 liters of water daily, improving your alertness and energy levels significantly throughout the afternoons.',
      icon: 'water_drop',
    });
  }

  if (inputs.sleepHours >= 7) {
    milestones.push({
      id: 'm-sleep',
      title: 'Restorative Sleep Quality',
      badge: 'Consistent',
      description: `Averaging ${inputs.sleepHours} hours of uninterrupted sleep. Your body clock is synchronizing beautifully with your morning schedule.`,
      icon: 'bedtime',
    });
  } else {
    focusAreas.push({
      id: 'f-sleep',
      title: 'Restorative Rest Calibration',
      badge: 'High Impact',
      description: `You logged ${inputs.sleepHours} hours of sleep. Aiming for 7.5 to 8 hours can noticeably elevate cellular repair and daytime clarity.`,
      icon: 'bedtime',
    });
  }

  if (inputs.exercise === 'daily' || inputs.exercise === 'moderate') {
    milestones.push({
      id: 'm-steps',
      title: 'Daily Step Target Met',
      badge: 'Active Habit',
      description: 'You exceeded 8,500 steps on 6 out of 7 days, boosting cardiovascular endurance and overall mood.',
      icon: 'directions_walk',
    });
  } else {
    focusAreas.push({
      id: 'f-movement',
      title: 'Gentle Daily Movement Pacing',
      badge: 'Easy start',
      description: 'Incorporating a 12-minute brisk walk after lunch creates an effortless bridge into active daily circulation.',
      icon: 'directions_walk',
    });
  }

  if (inputs.habits.includes('smoke-free')) {
    milestones.push({
      id: 'm-smokefree',
      title: 'Clean Lungs & Vitality',
      badge: 'Health Shield',
      description: 'Your smoke-free routine provides sustained arterial health and optimal cellular oxygenation.',
      icon: 'favorite',
    });
  }

  // Always supply standard focus areas if fewer than 2
  if (focusAreas.length < 2) {
    focusAreas.push({
      id: 'f-screen',
      title: 'Late Evening Screen Time',
      badge: 'Easy tweak',
      description: 'Using devices 30 minutes before bed can slightly delay melatonin release. Try swapping scrolling for reading a physical book.',
      icon: 'phone_iphone',
    });
  }
  if (focusAreas.length < 2) {
    focusAreas.push({
      id: 'f-stretch',
      title: 'Mid-day Stretching Routine',
      badge: 'Optional boost',
      description: 'Desk posture has caused slight neck tension. Introducing a 5-minute mid-day stretch will alleviate stiffness and refresh focus.',
      icon: 'self_improvement',
    });
  }

  // Daily action plan items tailored to user
  const actionPlan: ActionPlanItem[] = [
    {
      id: 'act-1',
      title: 'Morning Herbal Infusion',
      description: 'Start with warm lemon water or green tea before your first coffee.',
      timeTag: '5 mins',
      icon: 'coffee',
      completed: true,
    },
    {
      id: 'act-2',
      title: 'Digital Sunset at 9 PM',
      description: 'Put phones away 30 minutes before sleep to ensure deep rest.',
      timeTag: 'Evening Routine',
      icon: 'timer',
      completed: false,
    },
    {
      id: 'act-3',
      title: 'Desk Posture Reset',
      description: 'Do two 5-minute neck and shoulder mobility stretches during work hours.',
      timeTag: '10 mins',
      icon: 'self_improvement',
      completed: false,
    },
  ];

  const sleepScore = Math.min(98, Math.max(50, Math.round(inputs.sleepHours * 11 + (inputs.habits.includes('mindful') ? 5 : 0))));

  return {
    score,
    ratingText,
    description: 'Based on your daily check-ins, you are maintaining a fantastic balance across hydration, restorative rest, and daily movement. Keep shining!',
    milestones: milestones.slice(0, 3),
    focusAreas: focusAreas.slice(0, 2),
    actionPlan,
    sleepScore,
  };
}
