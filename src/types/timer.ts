/**
 * Timer-specific types used by TimerContext, useTimer, and useStats.
 * Imports shared foundation types and re-exports with domain aliases.
 * Also defines worker message types and stats aggregation types.
 */

import {
  TimerState,
  TimerPhase,
  TimerStatus,
  PomodoroSettings,
  PomodoroContextValue,
} from './index';

// ============ RE-EXPORTS & ALIASES ============

/** Re-export TimerState as-is for hooks/useTimer.ts */
export type { TimerState };

/** Alias for PomodoroSettings — used by hooks/useTimer.ts */
export type TimerSettings = PomodoroSettings;

/** Alias for PomodoroContextValue — used by context/TimerContext.tsx */
export type TimerContextValue = PomodoroContextValue;

// ============ WEB WORKER MESSAGES ============

/** Messages sent FROM the timer worker to the main thread */
export type WorkerOutMessage =
  | { type: 'TICK'; payload: { now: number; remaining: number } }
  | { type: 'PHASE_COMPLETE'; payload: { phase: TimerPhase } }
  | { type: 'SYNC'; payload: { remaining: number; status: TimerStatus } };

/** Messages sent TO the timer worker from the main thread */
export type WorkerInMessage =
  | { type: 'START'; payload: { durationSeconds: number; now: number } }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; payload: { now: number } }
  | { type: 'STOP' }
  | { type: 'SYNC_REQUEST' };

// ============ STATS TYPES ============

/** Daily breakdown of completed sessions — used by hooks/useStats.ts */
export interface DailyBreakdown {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Number of focus sessions completed */
  focusSessions: number;
  /** Total focus minutes */
  focusMinutes: number;
  /** Number of short breaks taken */
  shortBreaks: number;
  /** Number of long breaks taken */
  longBreaks: number;
}

/** Aggregated stats overview — used by hooks/useStats.ts */
export interface StatsOverview {
  /** Total focus sessions completed (all time) */
  totalSessions: number;
  /** Total focus minutes (all time) */
  totalFocusMinutes: number;
  /** Current daily streak */
  currentStreak: number;
  /** Best daily streak */
  bestStreak: number;
  /** Average focus sessions per day */
  averageDaily: number;
  /** Breakdown per day */
  daily: DailyBreakdown[];
}
