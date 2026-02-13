/**
 * useStats — Reactive hook for FocusFlow statistics.
 *
 * Re-fetches stats whenever a session is saved (via custom DOM event)
 * or when the component mounts.
 */

import { useState, useEffect, useCallback } from 'react';
import statsService from '../services/statsService';
import type { StatsOverview, DailyBreakdown } from '../types/timer';

export interface UseStatsReturn {
  stats: StatsOverview;
  currentStreak: number;
  bestStreak: number;
  dailyBreakdown: DailyBreakdown[];
  chartDays: number;
  setChartDays: (days: number) => void;
  recentSessions: ReturnType<typeof statsService.getSessions>;
  refresh: () => void;
}

export function useStats(): UseStatsReturn {
  const [chartDays, setChartDays] = useState(7);
  const [stats, setStats] = useState<StatsOverview>({
    totalSessions: 0,
    totalMinutes: 0,
    todaySessions: 0,
    todayMinutes: 0,
    averagePerDay: 0,
  });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [dailyBreakdown, setDailyBreakdown] = useState<DailyBreakdown[]>([]);
  const [recentSessions, setRecentSessions] = useState<ReturnType<typeof statsService.getSessions>>([]);

  const refresh = useCallback(() => {
    setStats(statsService.getStats());
    setCurrentStreak(statsService.getCurrentStreak());
    setBestStreak(statsService.getBestStreak());
    setDailyBreakdown(statsService.getDailyBreakdown(chartDays));
    // Last 10 sessions, most recent first
    const all = statsService.getSessions();
    setRecentSessions(all.slice(-10).reverse());
  }, [chartDays]);

  // Refresh on mount and when chartDays changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Listen for session-saved events (fired by statsService.saveSession)
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener('focusflow-session-saved', handler);
    return () => window.removeEventListener('focusflow-session-saved', handler);
  }, [refresh]);

  return {
    stats,
    currentStreak,
    bestStreak,
    dailyBreakdown,
    chartDays,
    setChartDays,
    recentSessions,
    refresh,
  };
}

export default useStats;
