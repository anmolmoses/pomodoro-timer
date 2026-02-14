/**
 * @deprecated DEAD CODE — Orphaned context provider. Timer state is managed
 * by PomodoroProvider (src/context/PomodoroProvider.tsx) and usePomodoro hook.
 * Stubbed to empty shells to prevent broken imports. Safe to delete.
 */
import { createContext, type ReactNode } from 'react';

type TimerPhase = 'work' | 'shortBreak' | 'longBreak';
type TimerState = 'idle' | 'running' | 'paused';

interface TimerContextShape {
  remaining: number;
  total: number;
  phase: TimerPhase;
  state: TimerState;
  sessionCount: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  showCelebration: boolean;
}

const TimerContext = createContext<TimerContextShape | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  // No-op provider — deprecated
  return <>{children}</>;
}

export function useTimer(): TimerContextShape {
  return {
    remaining: 0,
    total: 0,
    phase: 'work',
    state: 'idle',
    sessionCount: 0,
    start: () => {},
    pause: () => {},
    reset: () => {},
    skip: () => {},
    showCelebration: false,
  };
}
