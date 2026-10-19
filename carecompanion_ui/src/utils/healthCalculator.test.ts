import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHealthScore, getRatingText, generateHealthAssessment } from './healthCalculator.ts';

test('calculates health score with optimal inputs', () => {
  const score = calculateHealthScore({
    age: 32,
    weight: 68,
    sleepHours: 7.5,
    bpVibe: 'normal',
    exercise: 'daily',
    habits: ['plant-forward', 'water-tracker', 'smoke-free', 'mindful'],
  });

  // 65 + 10 (sleep) + 8 (bp) + 9 (exercise) + 5 + 4 + 4 + 3 = 108 -> clamped to 99
  assert.equal(score, 99);
  assert.equal(getRatingText(score), 'Peak Vitality!');
});

test('calculates baseline score matching reference screen values (~82)', () => {
  const score = calculateHealthScore({
    age: 32,
    weight: 68,
    sleepHours: 7.5,
    bpVibe: 'normal',
    exercise: 'daily',
    habits: [], // without all habit bonuses
  });

  // 65 + 10 + 8 + 9 = 92
  assert.ok(score >= 80 && score <= 95);
});

test('generates assessment with milestones and action plan', () => {
  const assessment = generateHealthAssessment({
    age: 32,
    weight: 68,
    sleepHours: 7.5,
    bpVibe: 'normal',
    exercise: 'daily',
    habits: ['water-tracker', 'smoke-free'],
  });

  assert.ok(assessment.score > 70);
  assert.ok(assessment.milestones.length >= 2);
  assert.equal(assessment.actionPlan.length, 3);
  assert.ok(assessment.sleepScore >= 75);
});

test('penalizes short sleep and high blood pressure', () => {
  const score = calculateHealthScore({
    age: 45,
    weight: 90,
    sleepHours: 5,
    bpVibe: 'high',
    exercise: 'starter',
    habits: [],
  });

  // 65 - 10 - 6 + 2 = 51
  assert.ok(score <= 55);
  assert.equal(getRatingText(score), 'Ready for Growth');
});
