export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';
export type TimerState = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  workDuration: number;      // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // sessions before long break
}

export interface TimerContextValue {
  remaining: number;         // seconds
  total: number;             // seconds
  phase: TimerPhase;
  state: TimerState;
  sessionsCompleted: number;
  streak: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}

export interface SettingsContextValue {
  settings: TimerSettings;
  updateSettings: (s: Partial<TimerSettings>) => void;
}

export type MobileTab = 'timer' | 'stats' | 'settings';
