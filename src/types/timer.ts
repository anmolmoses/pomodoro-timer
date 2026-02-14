/**
 * Timer-specific type aliases and additional types.
 *
 * Re-exports core types from the shared foundation (src/types/index.ts)
 * under consumer-expected names, and defines supplementary types
 * required by hooks and context that aren't part of the foundation.
 */

import {
  TimerState as _TimerState,
  TimerPhase,
  TimerStatus,
  PomodoroSettings,
  PomodoroContextValue,
  DEFAULT_SETTINGS,
} from './index';

// ============ RE-EXPORTS ============

/** Re-export TimerState as-is for consumers that import from this file */
export type TimerState = _TimerState;

/** Alias: some consumers reference settings as TimerSettings */
export type TimerSettings = PomodoroSettings;

/** Alias: TimerContext consumers import TimerContextValue */
export type TimerContextValue = PomodoroContextValue;

/** Re-export DEFAULT_SETTINGS so existing consumers don't break */
export { DEFAULT_SETTINGS };

// ============ WORKER MESSAGES ============

/** Messages sent FROM the timer web worker back to the main thread */
export type WorkerOutMessage =
  | { type: 'TICK'; payload: { now: number } }
  | { type: 'PHASE_COMPLETE' }
  | { type: 'SYNC'; payload: { remainingSeconds: number } };

/** Messages sent TO the timer web worker from the main thread */
export type WorkerInMessage =
  | { type: 'START'; payload: { durationSeconds: number; startedAt: number } }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; payload: { startedAt: number } }
  | { type: 'STOP' };

// ============ STATS ============

/** Breakdown of focus stats for a single day */
export interface DailyBreakdown {
  date: string; // ISO date string YYYY-MM-DD
  focusSessions: number;
  totalFocusMinutes: number;
  phases: Record<TimerPhase, number>; // minutes per phase
}

/** Aggregated statistics overview */
export interface StatsOverview {
  totalSessions: number;
  totalFocusMinutes: number;
  currentStreak: number; // consecutive days with >= 1 focus session
  longestStreak: number;
  averageDailyMinutes: number;
  dailyBreakdowns: DailyBreakdown[];
}
