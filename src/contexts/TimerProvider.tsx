// DEPRECATED: Orphaned context — Layout.tsx tree used this
// Active equivalent: src/contexts/PomodoroProvider.tsx
// Kept as empty stub to avoid broken transitive imports

import React, { createContext, useContext } from 'react';

const TimerContext = createContext<Record<string, never>>({});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  return <TimerContext.Provider value={{}}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  return useContext(TimerContext);
}

export default TimerProvider;
