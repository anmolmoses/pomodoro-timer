/** Timer state machine states */
export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break';

/** Session type */
export type SessionType = 'work' | 'shortBreak' | 'longBreak';

/** Timer settings (all durations in minutes) */
export interface TimerSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

/** A recorded timer session */
export interface TimerSession {
  id: string;
  startedAt: string; // ISO 8601
  duration: number; // seconds
  type: 'work' | 'break';
  completed: boolean;
}

/** Messages sent TO the worker */
export type WorkerInMessage =
  | { type: 'START'; duration: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' };

/** Messages sent FROM the worker */
export type WorkerOutMessage =
  | { type: 'TICK'; remaining: number }
  | { type: 'COMPLETE' };

/** Context value exposed to consumers */
export interface TimerContextValue {
  /** Seconds remaining */
  remaining: number;
  /** Total duration of current phase in seconds */
  totalDuration: number;
  /** Current timer state */
  state: TimerState;
  /** Current session type */
  sessionType: SessionType;
  /** Completed work sessions in current streak */
  sessionCount: number;
  /** Timer settings */
  settings: TimerSettings;
  /** Update settings */
  setSettings: (s: Partial<TimerSettings>) => void;
  /** Start a work session */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Resume from pause */
  resume: () => void;
  /** Reset to idle */
  reset: () => void;
  /** Skip to next phase */
  skip: () => void;
}
