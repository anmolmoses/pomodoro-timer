export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break';

export type SessionType = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

export interface TimerSession {
  id: string;
  startedAt: string;
  duration: number;
  type: SessionType;
  completed: boolean;
}

export interface TimerWorkerMessage {
  type: 'START' | 'PAUSE' | 'RESUME' | 'RESET';
  duration?: number;
}

export interface TimerWorkerResponse {
  type: 'TICK' | 'COMPLETE';
  remaining?: number;
}

export interface TimerContextValue {
  remaining: number;
  totalDuration: number;
  state: TimerState;
  sessionType: SessionType;
  sessionCount: number;
  settings: TimerSettings;
  updateSettings: (s: Partial<TimerSettings>) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};
