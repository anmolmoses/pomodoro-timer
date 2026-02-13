import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import type { TimerPhase, TimerState, TimerContextValue } from '../types/timer';

const TimerContext = createContext<TimerContextValue | null>(null);

function phaseDuration(phase: TimerPhase, settings: { workDuration: number; shortBreakDuration: number; longBreakDuration: number }): number {
  switch (phase) {
    case 'work': return settings.workDuration * 60;
    case 'shortBreak': return settings.shortBreakDuration * 60;
    case 'longBreak': return settings.longBreakDuration * 60;
  }
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [state, setState] = useState<TimerState>('idle');
  const [sessionsCompleted, setSessions] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const total = phaseDuration(phase, settings);
  const [remaining, setRemaining] = useState(total);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync remaining when settings change and timer is idle
  useEffect(() => {
    if (state === 'idle') {
      setRemaining(phaseDuration(phase, settings));
    }
  }, [settings, phase, state]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advancePhase = useCallback(() => {
    clearTimer();
    let nextPhase: TimerPhase;
    let newSessions = sessionsCompleted;

    if (phase === 'work') {
      newSessions = sessionsCompleted + 1;
      setSessions(newSessions);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);

      if (newSessions % settings.longBreakInterval === 0) {
        nextPhase = 'longBreak';
      } else {
        nextPhase = 'shortBreak';
      }
    } else {
      nextPhase = 'work';
    }

    setPhase(nextPhase);
    const dur = phaseDuration(nextPhase, settings);
    setRemaining(dur);
    setState('idle');
  }, [phase, sessionsCompleted, settings, clearTimer]);

  // Tick logic
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            advancePhase();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state, advancePhase, clearTimer]);

  const start = useCallback(() => setState('running'), []);
  const pause = useCallback(() => setState('paused'), []);
  const reset = useCallback(() => {
    clearTimer();
    setState('idle');
    setRemaining(phaseDuration(phase, settings));
  }, [phase, settings, clearTimer]);
  const skip = useCallback(() => {
    if (state !== 'idle') advancePhase();
  }, [state, advancePhase]);

  return (
    <TimerContext.Provider value={{ remaining, total, phase, state, sessionsCompleted, start, pause, reset, skip, showCelebration } as TimerContextValue & { showCelebration: boolean }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer(): TimerContextValue & { showCelebration: boolean } {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within TimerProvider');
  return ctx as TimerContextValue & { showCelebration: boolean };
}
