import React, { createContext, useContext } from 'react';
import { PomodoroContextValue, INITIAL_TIMER_STATE, DEFAULT_SETTINGS, PHASE_LABELS, TimerPhase } from '../types';
import { formatTime, getPhaseDuration } from '../utils';
import { usePomodoroEngine } from '../hooks/usePomodoro';

// Default context value (never actually used if provider is present)
const defaultValue: PomodoroContextValue = {
  state: INITIAL_TIMER_STATE,
  settings: DEFAULT_SETTINGS,
  progress: 0,
  displayTime: formatTime(getPhaseDuration(TimerPhase.Focus, DEFAULT_SETTINGS)),
  phaseLabel: PHASE_LABELS[TimerPhase.Idle],
  start: () => {},
  pause: () => {},
  resume: () => {},
  reset: () => {},
  skip: () => {},
  updateSettings: () => {},
};

const PomodoroContext = createContext<PomodoroContextValue>(defaultValue);

/**
 * Context provider — wraps the app and exposes all timer state + actions.
 */
export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const value = usePomodoroEngine();

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

/**
 * Consumer hook — use in any component under PomodoroProvider.
 */
export function usePomodoro(): PomodoroContextValue {
  const ctx = useContext(PomodoroContext);
  return ctx;
}
