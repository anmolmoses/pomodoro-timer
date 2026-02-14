export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break';

export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;          // minutes
  shortBreakDuration: number;    // minutes
  longBreakDuration: number;     // minutes
  shortBreak: number;            // alias — minutes (used by useTimer hook)
  longBreak: number;             // alias — minutes (used by useTimer hook)
  longBreakInterval: number;     // every Nth work session triggers long break
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

export interface TimerSession {
  id: string;
  startedAt: string;   // ISO string
  completedAt: string; // ISO string
  duration: number;    // planned duration in seconds
  elapsed: number;     // actual elapsed seconds
  type: 'work' | 'break';
  completed: boolean;
}

export interface StatsOverview {
  totalSessions: number;
  totalMinutes: number;
  todaySessions: number;
  todayMinutes: number;
  averagePerDay: number;
}

export interface DailyBreakdown {
  date: string;
  sessions: number;
  minutes: number;
}

export interface SettingsContextValue {
  settings: TimerSettings;
  updateSettings: (patch: Partial<TimerSettings>) => void;
}

// Messages sent TO the worker
export type WorkerInMessage =
  | { type: 'START'; duration: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' };

// Messages sent FROM the worker
export type WorkerOutMessage =
  | { type: 'TICK'; remaining: number }
  | { type: 'COMPLETE' };

export interface TimerContextValue {
  remaining: number;
  totalDuration: number;
  state: TimerState;
  sessionCount: number;
  sessionsCompleted: number;
  settings: TimerSettings;
  setSettings: (s: Partial<TimerSettings>) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  showCelebration: boolean;
}
