/**
 * PomodoroProvider — the SINGLE context provider for the entire app.
 * No separate SettingsProvider or TimerProvider needed.
 * Combines timer state, settings, and derived values into one context.
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react';
import {
  PomodoroContextValue,
  PomodoroSettings,
  TimerPhase,
  TimerStatus,
  INITIAL_TIMER_STATE,
  PHASE_LABELS,
} from '../types';
import { timerReducer } from '../reducer/timerReducer';
import {
  formatTime,
  loadSettings,
  saveSettings,
  getPhaseDuration,
  getNextPhase,
  sendNotification,
  requestNotificationPermission,
  playChime,
} from '../utils';

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function usePomodoroContext(): PomodoroContextValue {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoroContext must be used within PomodoroProvider');
  return ctx;
}

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER_STATE);
  const [settings, setSettings] = useState<PomodoroSettings>(loadSettings);
  const tickRef = useRef<number | null>(null);

  // Persist settings on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Request notification permission on mount
  useEffect(() => {
    if (settings.notificationsEnabled) {
      requestNotificationPermission();
    }
  }, [settings.notificationsEnabled]);

  // Tick loop — uses timestamp-based drift correction
  useEffect(() => {
    if (state.status === TimerStatus.Running) {
      tickRef.current = window.setInterval(() => {
        dispatch({ type: 'TICK', payload: { now: Date.now() } });
      }, 250); // tick frequently for accuracy, reducer ignores sub-second
    } else {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [state.status]);

  // Phase completion detection
  useEffect(() => {
    if (state.status === TimerStatus.Running && state.remainingSeconds <= 0 && state.totalSeconds > 0) {
      // Phase just completed
      if (settings.soundEnabled) playChime();
      if (settings.notificationsEnabled) sendNotification(state.phase);
      dispatch({ type: 'PHASE_COMPLETE' });

      // Auto-transition to next phase
      const nextPhase = getNextPhase(state.phase, state.completedSessions, settings.longBreakInterval);
      const shouldAutoStart =
        (nextPhase === TimerPhase.Focus && settings.autoStartFocus) ||
        (nextPhase !== TimerPhase.Focus && settings.autoStartBreaks);

      if (shouldAutoStart) {
        const duration = getPhaseDuration(nextPhase, settings);
        // Small delay so user sees the completion state
        setTimeout(() => {
          dispatch({ type: 'START', payload: { phase: nextPhase, durationSeconds: duration } });
        }, 500);
      }
    }
  }, [state.remainingSeconds, state.status, state.totalSeconds, state.phase, state.completedSessions, settings]);

  // --- Actions ---
  const start = useCallback(() => {
    const phase = TimerPhase.Focus;
    const duration = getPhaseDuration(phase, settings);
    dispatch({ type: 'START', payload: { phase, durationSeconds: duration } });
  }, [settings]);

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const skip = useCallback(() => {
    const nextPhase = getNextPhase(state.phase, state.completedSessions, settings.longBreakInterval);
    const duration = getPhaseDuration(nextPhase, settings);
    dispatch({ type: 'PHASE_COMPLETE' });
    dispatch({ type: 'START', payload: { phase: nextPhase, durationSeconds: duration } });
  }, [state.phase, state.completedSessions, settings]);

  const updateSettings = useCallback((patch: Partial<PomodoroSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // --- Derived values ---
  const progress = state.totalSeconds > 0 ? 1 - state.remainingSeconds / state.totalSeconds : 0;
  const displayTime = formatTime(state.remainingSeconds);
  const phaseLabel = PHASE_LABELS[state.phase];

  const value: PomodoroContextValue = {
    state,
    settings,
    progress,
    displayTime,
    phaseLabel,
    start,
    pause,
    resume,
    reset,
    skip,
    updateSettings,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}
