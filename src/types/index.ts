// SHARED FOUNDATION — DO NOT MODIFY
// This file is managed by the Tech Lead
// Re-exported here for reference; actual source is the foundation commit

export enum TimerPhase {
  Idle = 'idle',
  Focus = 'focus',
  ShortBreak = 'shortBreak',
  LongBreak = 'longBreak',
}

export enum TimerStatus {
  Idle = 'idle',
  Running = 'running',
  Paused = 'paused',
}

export interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartFocus: false,
  notificationsEnabled: true,
  soundEnabled: true,
};

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  totalSeconds: number;
  remainingSeconds: number;
  completedSessions: number;
  totalCompletedSessions: number;
  lastTickTimestamp: number | null;
}

export const INITIAL_TIMER_STATE: TimerState = {
  phase: TimerPhase.Idle,
  status: TimerStatus.Idle,
  totalSeconds: 0,
  remainingSeconds: 0,
  completedSessions: 0,
  totalCompletedSessions: 0,
  lastTickTimestamp: null,
};

export type TimerAction =
  | { type: 'START'; payload: { phase: TimerPhase; durationSeconds: number } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'SKIP' }
  | { type: 'TICK'; payload: { now: number } }
  | { type: 'PHASE_COMPLETE' }
  | { type: 'SET_REMAINING'; payload: { remaining: number } };

export interface PomodoroContextValue {
  state: TimerState;
  settings: PomodoroSettings;
  progress: number;
  displayTime: string;
  phaseLabel: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  updateSettings: (patch: Partial<PomodoroSettings>) => void;
}

export interface TimerRingProps {
  progress: number;
  phase: TimerPhase;
  displayTime: string;
  phaseLabel: string;
  status: TimerStatus;
}

export interface ControlsProps {
  status: TimerStatus;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export interface SessionTrackerProps {
  completedSessions: number;
  totalRequired: number;
  currentPhase: TimerPhase;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onUpdate: (patch: Partial<PomodoroSettings>) => void;
}

export const PHASE_COLORS: Record<TimerPhase, { ring: string; glow: string; accent: string }> = {
  [TimerPhase.Idle]:       { ring: '#94a3b8', glow: 'rgba(148,163,184,0.3)', accent: 'slate' },
  [TimerPhase.Focus]:      { ring: '#f43f5e', glow: 'rgba(244,63,94,0.3)',   accent: 'rose' },
  [TimerPhase.ShortBreak]: { ring: '#34d399', glow: 'rgba(52,211,153,0.3)',  accent: 'emerald' },
  [TimerPhase.LongBreak]:  { ring: '#60a5fa', glow: 'rgba(96,165,250,0.3)', accent: 'blue' },
};

export const PHASE_LABELS: Record<TimerPhase, string> = {
  [TimerPhase.Idle]: 'Ready',
  [TimerPhase.Focus]: 'Focus',
  [TimerPhase.ShortBreak]: 'Short Break',
  [TimerPhase.LongBreak]: 'Long Break',
};
