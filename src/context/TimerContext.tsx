import React, { createContext, useContext } from 'react';
import { useTimer, type UseTimerReturn } from '../hooks/useTimer';

const TimerContext = createContext<UseTimerReturn | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const timer = useTimer();
  return (
    <TimerContext.Provider value={timer}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext(): UseTimerReturn {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimerContext must be used within a <TimerProvider>');
  }
  return ctx;
}
