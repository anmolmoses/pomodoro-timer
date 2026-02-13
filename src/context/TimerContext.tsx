import React, { createContext, useContext, type ReactNode } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { TimerContextValue } from '../types/timer';

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const timer = useTimer();

  return (
    <TimerContext.Provider value={timer}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimerContext must be used within a <TimerProvider>');
  }
  return ctx;
}
