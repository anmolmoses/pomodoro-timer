import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { TimerPhase, TimerState, TimerContextValue } from '../types';
import { useSettings } from './SettingsContext';

const TimerContext = createContext<TimerContextValue | null>(null);

function phaseSeconds(phase: TimerPhase, settings: { workDuration: number; shortBreakDuration: number; longBreakDuration: number }): number {
  switch (phase) {
    case 'work': return settings.workDuration * 60;
    case 'shortBreak': return settings.shortBreakDuration * 60;
    case 'longBreak': return settings.longBreakDuration * 60;
  }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [state, setState] = useState<TimerState>('idle');
  const [remaining, setRemaining] = useState(() => settings.workDuration * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = phaseSeconds(phase, settings);

  // Update remaining when settings change and timer is idle
  useEffect(() => {
    if (state === 'idle') {
      setRemaining(phaseSeconds(phase, settings));
    }
  }, [settings, state, phase]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advancePhase = useCallback(() => {
    clearTimer();
    let nextPhase: TimerPhase;
    let newCompleted = sessionsCompleted;

    if (phase === 'work') {
      newCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newCompleted);
      setStreak(s => s + 1);
      // Show celebration
      setCelebration(true);
      setTimeout(() => setCelebration(false), 1500);

      if (newCompleted % settings.longBreakInterval === 0) {
        nextPhase = 'longBreak';
      } else {
        nextPhase = 'shortBreak';
      }
    } else {
      nextPhase = 'work';
    }

    setPhase(nextPhase);
    setRemaining(phaseSeconds(nextPhase, settings));
    setState('idle');
  }, [phase, sessionsCompleted, settings, clearTimer]);

  const tick = useCallback(() => {
    setRemaining(prev => {
      if (prev <= 1) {
        advancePhase();
        return 0;
      }
      return prev - 1;
    });
  }, [advancePhase]);

  const start = useCallback(() => {
    if (state === 'running') return;
    setState('running');
    clearTimer();
    intervalRef.current = setInterval(tick, 1000);
  }, [state, tick, clearTimer]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    setState('paused');
    clearTimer();
  }, [state, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setState('idle');
    setRemaining(phaseSeconds(phase, settings));
  }, [phase, settings, clearTimer]);

  const skip = useCallback(() => {
    if (state === 'idle') return;
    advancePhase();
  }, [state, advancePhase]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const value: TimerContextValue & { celebration: boolean } = {
    remaining,
    total,
    phase,
    state,
    sessionsCompleted,
    streak,
    start,
    pause,
    reset,
    skip,
    celebration,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer(): TimerContextValue & { celebration: boolean } {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within TimerProvider');
  return ctx as TimerContextValue & { celebration: boolean };
}
