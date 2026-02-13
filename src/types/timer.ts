/**
 * Shared types for the FocusFlow timer application.
 * Used across services, components, and hooks.
 */

export type SessionType = 'work' | 'break' | 'longBreak';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerSession {
  id: string;
  type: SessionType;
  duration: number;        // planned duration in seconds
  elapsed: number;         // actual elapsed in seconds
  completed: boolean;      // true if ran to completion (not skipped/cancelled)
  startedAt: string;       // ISO 8601 timestamp
  completedAt: string;     // ISO 8601 timestamp
}

export interface DailyBreakdown {
  date: string;            // YYYY-MM-DD local date
  sessions: number;
  minutes: number;
}

export interface StatsOverview {
  totalSessions: number;
  totalMinutes: number;
  todaySessions: number;
  todayMinutes: number;
  averagePerDay: number;
}
