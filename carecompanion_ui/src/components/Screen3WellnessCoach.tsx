/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Screen3WellnessCoach: React.FC = () => {
  const {
    todayGoals,
    toggleGoal,
    waterIntake,
    addWater,
    sleepFeeling,
    setSleepFeeling,
    reminders,
    toggleReminder,
    chatMessages,
    sendMessageToCoach,
    isCoachTyping,
    t,
  } = useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [customWaterModal, setCustomWaterModal] = useState(false);
  const [customWaterAmount, setCustomWaterAmount] = useState('350');

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim()) return;
    sendMessageToCoach(inputQuestion);
    setInputQuestion('');
  };

  const waterGoal = 2500;
  const waterPercent = Math.min(100, Math.round((waterIntake / waterGoal) * 100));

  const daysOfWeek = [
    { label: 'MON', done: '4/4', status: 'checked' },
    { label: 'TUE', done: '4/4', status: 'checked' },
    { label: 'WED', done: '4/4', status: 'checked' },
    { label: 'THU', done: '4/4', status: 'checked' },
    { label: 'FRI', done: '3/4', status: 'today', isToday: true },
    { label: 'SAT', done: '--', status: 'upcoming' },
    { label: 'SUN', done: '--', status: 'upcoming' },
  ];

  return (
    <div className="flex flex-col w-full pb-24 md:pb-16 animate-in fade-in duration-300">
      {/* Hero Section / Header Banner */}
      <section className="w-full bg-gradient-to-br from-surface-container-low via-surface dark:via-[#131c1f] to-surface-container dark:to-[#1a252a] py-10 sm:py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b border-surface-container/60 dark:border-surface-variant/30">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-24 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-[11px] uppercase tracking-wider font-bold">
                {t('s3.stepBadge')}
              </span>
              <span className="text-on-surface-variant text-xs sm:text-sm font-medium">
                {t('s3.companionBadge')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-on-surface font-headline tracking-tight">
              {t('s3.title')}
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {t('s3.desc')}
            </p>
          </div>

          {/* Quick Streak Summary Card */}
          <div className="bg-surface-container-lowest dark:bg-[#151e22] p-5 sm:p-6 rounded-2xl shadow-lg border border-surface-container/60 dark:border-surface-variant/30 flex items-center gap-5 min-w-[280px]">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-on-primary-container text-[28px] sm:text-[32px]">
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant font-medium">
                {t('s3.streakTitle')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl text-primary dark:text-[#6bd8cb] font-bold font-headline">
                  {t('s3.streakDays')}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {t('s3.onFire')}
                </span>
              </div>
              <span className="text-xs text-secondary font-semibold mt-0.5">
                {t('s3.personalBest')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Habits, Water & Sleep (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* 7-Day Streak & Habit Tracker Card */}
          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
                  {t('s3.momentumTitle')}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {t('s3.momentumDesc')}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low dark:bg-surface-container px-3.5 py-1.5 rounded-full self-start">
                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                <span className="text-xs font-semibold text-on-surface">
                  {t('s3.weekRange')}
                </span>
              </div>
            </div>

            {/* Days of the week header & check grid */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {daysOfWeek.map(day => (
                <div
                  key={day.label}
                  className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl transition-all ${
                    day.isToday
                      ? 'bg-primary-container ring-2 ring-primary text-on-primary-container shadow-md'
                      : day.status === 'upcoming'
                      ? 'bg-surface-container-low dark:bg-surface-container/40 opacity-60'
                      : 'bg-surface-container-low dark:bg-surface-container'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${day.isToday ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                    {day.label}
                  </span>
                  <div
                    className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center shadow-xs ${
                      day.isToday || day.status === 'checked'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                      {day.status === 'upcoming' ? 'remove' : 'check'}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold ${day.isToday ? 'text-on-primary-container' : 'text-primary dark:text-[#6bd8cb]'}`}>
                    {day.done}
                  </span>
                </div>
              ))}
            </div>

            {/* Today's Goals Checklist */}
            <div className="flex flex-col gap-3 mt-2">
              <span className="text-base font-bold text-on-surface font-headline">
                {t('s3.todayGoals')}
              </span>
              {todayGoals.map(goal => (
                <label
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low dark:bg-surface-container/60 hover:bg-surface-container transition-all cursor-pointer group border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoal(goal.id)}
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                    <span
                      className={`text-sm sm:text-base font-medium transition-all ${
                        goal.completed
                          ? 'line-through text-on-surface-variant'
                          : 'text-on-surface'
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                      goal.completed
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {goal.completed ? t('s3.completed') : t('s3.pending')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sub-grid: Water Intake & Sleep Quality Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Water Intake Counter */}
            <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-on-surface font-headline">
                    {t('s3.waterTitle')}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 dark:bg-secondary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      water_drop
                    </span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {t('s3.waterGoal')}
                </p>

                <div className="my-6 flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-secondary dark:text-[#6bd8cb] font-headline">
                    {waterIntake.toLocaleString()}
                  </span>
                  <span className="text-base text-on-surface-variant font-medium">
                    / {waterGoal.toLocaleString()} ml
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-3.5 rounded-full bg-surface-container-low dark:bg-surface-container overflow-hidden mb-6">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${waterPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => addWater(250)}
                  className="py-2.5 px-2 rounded-xl bg-surface-container-low dark:bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-xs sm:text-sm font-semibold text-on-surface transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> {t('s3.add250')}
                </button>
                <button
                  type="button"
                  onClick={() => addWater(500)}
                  className="py-2.5 px-2 rounded-xl bg-surface-container-low dark:bg-surface-container hover:bg-secondary-container hover:text-on-secondary-container text-xs sm:text-sm font-semibold text-on-surface transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> {t('s3.add500')}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomWaterModal(true)}
                  className="py-2.5 px-2 rounded-xl bg-primary text-on-primary hover:bg-[#00524b] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> {t('s3.custom')}
                </button>
              </div>
            </div>

            {/* Sleep Quality Log */}
            <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-on-surface font-headline">
                    {t('s3.sleepTitle')}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed dark:bg-tertiary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-[22px]">
                      bedtime
                    </span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {t('s3.lastNight')}
                </p>

                <div className="my-5 flex items-center justify-between bg-surface-container-low dark:bg-surface-container p-4 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant font-medium">
                      {t('s3.sleepScore')}
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-tertiary dark:text-[#c0c1ff] font-headline">
                      88 / 100
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12">
                    <span className="w-2.5 h-7 rounded bg-tertiary/30"></span>
                    <span className="w-2.5 h-10 rounded bg-tertiary/60"></span>
                    <span className="w-2.5 h-12 rounded bg-tertiary"></span>
                    <span className="w-2.5 h-9 rounded bg-tertiary/70"></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-on-surface-variant font-semibold">
                  {t('s3.wokeUp')}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { key: 'tired', emoji: '😴', label: t('s3.mood.tired') },
                    { key: 'ok', emoji: '😌', label: t('s3.mood.ok') },
                    { key: 'fresh', emoji: '⚡', label: t('s3.mood.fresh') },
                    { key: 'super', emoji: '🚀', label: t('s3.mood.super') },
                  ].map(m => {
                    const isSelected = sleepFeeling === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSleepFeeling(m.key as any)}
                        className={`p-2.5 rounded-xl text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container ring-2 ring-primary shadow-xs'
                            : 'bg-surface-container-low dark:bg-surface-container hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="text-xl">{m.emoji}</span>
                        <span className="font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Wellness Coach & Recommendations (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* AI Coach Card */}
          <div className="bg-gradient-to-b from-primary via-[#005c54] to-[#004d46] rounded-3xl p-6 text-on-primary shadow-xl relative overflow-hidden flex flex-col gap-5 border border-primary/20">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-fixed/20 blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-white text-[24px]">psychology</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-headline">
                  {t('s3.aiTitle')}
                </h3>
                <span className="text-xs text-primary-fixed">
                  {t('s3.aiSubtitle')}
                </span>
              </div>
            </div>

            {/* Daily Insight Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col gap-2 border border-white/10">
              <div className="flex items-center gap-2 text-primary-fixed text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                {t('s3.dailyInsight')}
              </div>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
                {t('s3.dailyInsightText')}
              </p>
            </div>

            {/* Suggestions Chips */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-primary-fixed font-semibold">
                {t('s3.askCoach')}
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { text: t('s3.chip1') },
                  { text: t('s3.chip2') },
                  { text: t('s3.chip3') },
                ].map(chip => (
                  <button
                    key={chip.text}
                    type="button"
                    onClick={() => sendMessageToCoach(chip.text)}
                    className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all text-left flex items-center justify-between cursor-pointer border border-white/10 group"
                  >
                    <span>{chip.text}</span>
                    <span className="material-symbols-outlined text-[16px] text-white/60 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Chat Message Feed (Last few messages) */}
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white/25 text-white ml-6 text-right'
                      : 'bg-white/10 text-white/95 mr-4'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
              {isCoachTyping && (
                <div className="p-2.5 rounded-xl bg-white/10 text-white/80 mr-6 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>CareCompanion AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Interactive Ask input box */}
            <form onSubmit={handleSendChat} className="relative mt-1">
              <input
                type="text"
                value={inputQuestion}
                onChange={e => setInputQuestion(e.target.value)}
                placeholder={t('s3.chatPlaceholder')}
                className="w-full bg-white/15 border border-white/20 placeholder-white/60 text-white rounded-xl py-3 pl-4 pr-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim()}
                className="absolute right-2 top-1.5 w-9 h-9 rounded-lg bg-white text-primary flex items-center justify-center hover:bg-primary-fixed transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Send health question"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
            </form>
          </div>

          {/* Quick Tips & Reminders Card */}
          <div className="bg-surface-container-lowest dark:bg-[#151e22] rounded-3xl p-6 shadow-sm border border-surface-container/60 dark:border-surface-variant/30 flex flex-col gap-4">
            <h3 className="text-base font-bold text-on-surface font-headline">
              {t('s3.remindersTitle')}
            </h3>

            <div className="space-y-3">
              {reminders.map(rem => (
                <div
                  key={rem.id}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-surface-container-low dark:bg-surface-container transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${rem.colorClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{rem.icon}</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-on-surface truncate">
                      {rem.title}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {rem.timeDisplay}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      rem.enabled
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {rem.enabled ? t('s3.remindersOn') : t('s3.remindersOff')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation Photo Tile */}
          <div
            className="rounded-3xl overflow-hidden shadow-sm relative h-48 flex flex-col justify-end p-6 bg-cover bg-center border border-surface-container/50"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLScn2wF2BBKbS7iF7qi6T4HTnzLTEJNCCE_VzG98tXktcZIqee7REXAzricWaGs5F1VGvoZpNCtW3l4eOVymHa_75ecxABqSGcrRzPDhMBYC4jUn5PF45htgPxTOnpalqLmyMcmtdJ1I_7ng-YDLaBya4pJAXR_wZD4AOOAqn0mgPmK2hZreTpN5YTwTrH7LPFqMgFMhrnGTXyosxtDSvs45EKWO4BS3TIK-XUvJCadRS1_NY4YO1UA')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-1 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                {t('s3.inspiration')}
              </span>
              <p className="text-sm sm:text-base font-bold font-headline leading-snug">
                "Small daily improvements over time lead to stunning results."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Water Dialog Modal */}
      {customWaterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest dark:bg-[#1a252a] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-surface-container dark:border-surface-variant">
            <h4 className="text-lg font-bold text-on-surface font-headline mb-2">
              Log Custom Hydration
            </h4>
            <p className="text-xs text-on-surface-variant mb-4">
              Enter milliliters of water or herbal tea consumed.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={customWaterAmount}
                onChange={e => setCustomWaterAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low dark:bg-surface-container border border-surface-container-high text-on-surface text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-bold text-on-surface-variant">ml</span>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCustomWaterModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = Number(customWaterAmount);
                  if (val > 0) addWater(val);
                  setCustomWaterModal(false);
                }}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-[#00524b]"
              >
                Add Water
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
