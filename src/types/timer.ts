// Timer state machine states
export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break';

// Session types — distinguish short vs long break for styling/stats
export type SessionType = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;      // minutes
  shortBreak: number;        // minutes
  longBreak: number;         // minutes
  longBreakInterval: number; // work sessions before long break
}

export interface TimerSession {
  id: string;
  startedAt: string; // ISO 8601
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
  | { type: 'COMPLETE' }
  | { type: 'RESET_ACK' };
