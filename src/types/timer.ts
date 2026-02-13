export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break';

export type SessionType = 'work' | 'break';

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
  type: SessionType;
  completed: boolean;
}

// Messages sent TO the worker
export type WorkerInMessage =
  | { type: 'START'; duration: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' };

// Messages received FROM the worker
export type WorkerOutMessage =
  | { type: 'TICK'; remaining: number }
  | { type: 'COMPLETE' };

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
