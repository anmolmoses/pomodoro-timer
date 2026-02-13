import React, { createContext, useContext } from 'react';
import type { TimerContextValue } from '../types/timer';
import { useTimer } from '../hooks/useTimer';

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const timer = useTimer();
  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
}

export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimerContext must be used within a <TimerProvider>');
  }
  return ctx;
}
