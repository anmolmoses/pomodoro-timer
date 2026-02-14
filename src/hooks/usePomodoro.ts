import { useReducer, useState, useEffect, useRef, useCallback } from 'react';
import {
  TimerPhase,
  TimerStatus,
  PomodoroSettings,
  PomodoroContextValue,
  INITIAL_TIMER_STATE,
  PHASE_LABELS,
} from '../types';
import { timerReducer } from '../reducers/timerReducer';
import {
  formatTime,
  getPhaseDuration,
  getNextPhase,
  sendNotification,
  playChime,
  loadSettings,
  saveSettings,
} from '../utils';

/**
 * Core Pomodoro timer hook.
 * Manages timer state, settings, interval ticking, phase transitions,
 * notifications, and audio.
 */
export function usePomodoroEngine(): PomodoroContextValue {
  const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER_STATE);
  const [settings, setSettings] = useState<PomodoroSettings>(loadSettings);

  // Keep a ref to settings/state so interval callback sees latest values
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const stateRef = useRef(state);
  stateRef.current = state;

  // ---- Interval for TICK ----
  useEffect(() => {
    if (state.status !== TimerStatus.Running) return;

    const id = setInterval(() => {
      dispatch({ type: 'TICK', payload: { now: Date.now() } });
    }, 1000);

    return () => clearInterval(id);
  }, [state.status]);

  // ---- Detect phase completion (remainingSeconds hits 0 while running/idle-after-skip) ----
  useEffect(() => {
    if (
      state.remainingSeconds <= 0 &&
      state.phase !== TimerPhase.Idle &&
      state.status !== TimerStatus.Paused &&
      state.totalSeconds > 0
    ) {
      // Fire notifications & sound
      if (settingsRef.current.notificationsEnabled) {
        sendNotification(state.phase);
      }
      if (settingsRef.current.soundEnabled) {
        playChime();
      }

      // Complete the phase (updates session counters)
      dispatch({ type: 'PHASE_COMPLETE' });
    }
  }, [state.remainingSeconds, state.phase, state.status, state.totalSeconds]);

  // ---- Auto-transition after PHASE_COMPLETE ----
  // When status becomes Idle after a non-Idle phase with 0 remaining, auto-start next
  const prevPhaseRef = useRef(state.phase);
  const prevStatusRef = useRef(state.status);

  useEffect(() => {
    const justCompleted =
      prevStatusRef.current !== TimerStatus.Idle &&
      state.status === TimerStatus.Idle &&
      state.totalSeconds > 0 &&
      state.remainingSeconds === 0;

    prevStatusRef.current = state.status;
    const prevPhase = prevPhaseRef.current;
    prevPhaseRef.current = state.phase;

    if (!justCompleted) return;

    // Determine next phase using the *previous* phase (before PHASE_COMPLETE reset cycle)
    const nextPhase = getNextPhase(
      prevPhase,
      // For focus phases, completedSessions is already incremented by PHASE_COMPLETE
      // For break phases, use current completedSessions
      state.completedSessions,
      settingsRef.current.longBreakInterval
    );

    const shouldAutoStart =
      (prevPhase === TimerPhase.Focus && settingsRef.current.autoStartBreaks) ||
      (prevPhase !== TimerPhase.Focus && settingsRef.current.autoStartFocus);

    if (shouldAutoStart) {
      const duration = getPhaseDuration(nextPhase, settingsRef.current);
      dispatch({ type: 'START', payload: { phase: nextPhase, durationSeconds: duration } });
    }
  }, [state.status, state.totalSeconds, state.remainingSeconds, state.completedSessions]);

  // ---- Persist settings on every change ----
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // ---- Computed values ----
  const progress = state.totalSeconds > 0
    ? 1 - state.remainingSeconds / state.totalSeconds
    : 0;

  const displayTime = state.phase === TimerPhase.Idle && state.totalSeconds === 0
    ? formatTime(getPhaseDuration(TimerPhase.Focus, settings))
    : formatTime(state.remainingSeconds);

  const phaseLabel = PHASE_LABELS[state.phase];

  // ---- Actions ----
  const start = useCallback(() => {
    const phase = TimerPhase.Focus;
    const duration = getPhaseDuration(phase, settingsRef.current);
    dispatch({ type: 'START', payload: { phase, durationSeconds: duration } });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const skip = useCallback(() => {
    dispatch({ type: 'SKIP' });
  }, []);

  const updateSettings = useCallback((patch: Partial<PomodoroSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
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
}
