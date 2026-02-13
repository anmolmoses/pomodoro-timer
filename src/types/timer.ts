export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break';

export interface TimerSettings {
  workDuration: number;      // minutes
  shortBreak: number;        // minutes
  longBreak: number;         // minutes
  longBreakInterval: number; // every Nth work session triggers long break
}

export interface TimerSession {
  id: string;
  startedAt: string; // ISO string
  duration: number;  // seconds
  type: 'work' | 'break';
  completed: boolean;
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
  settings: TimerSettings;
  setSettings: (s: Partial<TimerSettings>) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
}
