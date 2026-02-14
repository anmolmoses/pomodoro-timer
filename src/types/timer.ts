/**
 * Timer-specific types used by TimerContext, useTimer, and useStats.
 * Re-exports shared foundation types and defines additional types needed by hooks.
 */
import {
  TimerState as _TimerState,
  PomodoroSettings,
  PomodoroContextValue,
  TimerPhase,
  TimerStatus,
} from './index';

// Re-export foundation types under the names consumers expect
export type TimerState = _TimerState;
export type TimerSettings = PomodoroSettings;
export type TimerContextValue = PomodoroContextValue;

// ============ WORKER MESSAGES ============

export type WorkerOutMessage =
  | { type: 'TICK'; payload: { now: number } }
  | { type: 'PHASE_COMPLETE' }
  | { type: 'SYNC'; payload: { remainingSeconds: number } };

export type WorkerInMessage =
  | { type: 'START'; payload: { durationSeconds: number; now: number } }
  | { type: 'PAUSE' }
  | { type: 'RESUME'; payload: { now: number } }
  | { type: 'STOP' };

// ============ STATS ============

/** Breakdown of focus stats for a single day */
export interface DailyBreakdown {
  date: string; // ISO date string YYYY-MM-DD
  totalFocusMinutes: number;
  sessionsCompleted: number;
  phases: {
    [TimerPhase.Focus]: number;
    [TimerPhase.ShortBreak]: number;
    [TimerPhase.LongBreak]: number;
  };
}

/** Aggregated statistics overview */
export interface StatsOverview {
  totalFocusMinutes: number;
  totalSessions: number;
  currentStreak: number; // consecutive days with at least one session
  longestStreak: number;
  dailyAverage: number; // average focus minutes per active day
  dailyBreakdown: DailyBreakdown[];
}
