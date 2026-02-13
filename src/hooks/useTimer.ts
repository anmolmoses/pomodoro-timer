import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  TimerState,
  TimerSettings,
  SessionType,
  WorkerInMessage,
  WorkerOutMessage,
} from '../types/timer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SETTINGS_KEY = 'pomodoro-settings';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

function loadSettings(): TimerSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore corrupt data */ }
  return DEFAULT_SETTINGS;
}

function persistSettings(s: TimerSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch { /* quota errors etc */ }
}

function minutesToSeconds(m: number): number {
  return m * 60;
}

/** Generate a simple unique id (good enough for session tracking). */
function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Notification helper
// ---------------------------------------------------------------------------

let notificationPermissionRequested = false;

function requestNotificationPermission() {
  if (notificationPermissionRequested) return;
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
  notificationPermissionRequested = true;
}

function fireNotification(title: string, body: string) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseTimerReturn {
  remaining: number;        // seconds left
  totalDuration: number;    // seconds for current phase
  state: TimerState;
  sessionType: SessionType;
  completedSessions: number;
  settings: TimerSettings;
  updateSettings: (patch: Partial<TimerSettings>) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
}

export function useTimer(): UseTimerReturn {
  // ---- state ----
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);
  const [state, setState] = useState<TimerState>('idle');
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [completedSessions, setCompletedSessions] = useState(0);

  // refs for values needed inside callbacks without stale closures
  const stateRef = useRef(state);
  const settingsRef = useRef(settings);
  const sessionTypeRef = useRef(sessionType);
  const completedRef = useRef(completedSessions);
  const workerRef = useRef<Worker | null>(null);

  // keep refs in sync
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { sessionTypeRef.current = sessionType; }, [sessionType]);
  useEffect(() => { completedRef.current = completedSessions; }, [completedSessions]);

  // ---- worker lifecycle ----
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data;

      switch (msg.type) {
        case 'TICK':
          setRemaining(msg.remaining);
          break;

        case 'COMPLETE':
          handlePhaseComplete();
          break;

        case 'RESET_ACK':
          // Worker confirmed reset — state already handled in reset()
          break;
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- helpers ----
  const post = useCallback((msg: WorkerInMessage) => {
    workerRef.current?.postMessage(msg);
  }, []);

  /**
   * Determine what comes next after the current phase completes.
   * Mutates state, fires notifications, and kicks off the next countdown.
   */
  const handlePhaseComplete = useCallback(() => {
    const currentType = sessionTypeRef.current;
    const s = settingsRef.current;

    if (currentType === 'work') {
      // Increment completed work sessions
      const newCount = completedRef.current + 1;
      setCompletedSessions(newCount);
      completedRef.current = newCount;

      fireNotification('🎉 Session Complete!', 'Time for a break.');

      // Decide break type
      const isLong = newCount % s.longBreakInterval === 0;
      const nextType: SessionType = isLong ? 'longBreak' : 'shortBreak';
      const breakMins = isLong ? s.longBreak : s.shortBreak;

      setSessionType(nextType);
      sessionTypeRef.current = nextType;
      setState('completed');
      stateRef.current = 'completed';

      // Auto-transition to break after a brief "completed" flash (1.5 s matches celebration overlay)
      setTimeout(() => {
        const dur = minutesToSeconds(breakMins);
        setTotalDuration(dur);
        setRemaining(dur);
        setState('break');
        stateRef.current = 'break';
        post({ type: 'START', duration: dur });
      }, 1500);
    } else {
      // Break finished → ready for next work session
      fireNotification('⏰ Break Over', 'Ready to focus again?');

      setSessionType('work');
      sessionTypeRef.current = 'work';
      setState('idle');
      stateRef.current = 'idle';

      const dur = minutesToSeconds(s.workDuration);
      setTotalDuration(dur);
      setRemaining(dur);
    }
  }, [post]);

  // ---- public actions ----

  const start = useCallback(() => {
    if (stateRef.current !== 'idle') return;

    requestNotificationPermission();

    const s = settingsRef.current;
    const dur = minutesToSeconds(s.workDuration);

    setSessionType('work');
    sessionTypeRef.current = 'work';
    setTotalDuration(dur);
    setRemaining(dur);
    setState('running');
    stateRef.current = 'running';

    post({ type: 'START', duration: dur });
  }, [post]);

  const pause = useCallback(() => {
    if (stateRef.current !== 'running' && stateRef.current !== 'break') return;
    setState('paused');
    stateRef.current = 'paused';
    post({ type: 'PAUSE' });
  }, [post]);

  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') return;
    // Restore the visual state to whatever was active before pause
    const prevType = sessionTypeRef.current;
    setState(prevType === 'work' ? 'running' : 'break');
    stateRef.current = prevType === 'work' ? 'running' : 'break';
    post({ type: 'RESUME' });
  }, [post]);

  const reset = useCallback(() => {
    post({ type: 'RESET' });
    setState('idle');
    stateRef.current = 'idle';
    setSessionType('work');
    sessionTypeRef.current = 'work';
    setCompletedSessions(0);
    completedRef.current = 0;

    const dur = minutesToSeconds(settingsRef.current.workDuration);
    setTotalDuration(dur);
    setRemaining(dur);
  }, [post]);

  const skip = useCallback(() => {
    const cur = stateRef.current;
    // Can skip during running, paused, break, or completed
    if (cur === 'idle') return;

    post({ type: 'RESET' }); // stop current worker countdown
    handlePhaseComplete();    // trigger the phase transition
  }, [post, handlePhaseComplete]);

  const updateSettings = useCallback((patch: Partial<TimerSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSettings(next);
      settingsRef.current = next;

      // If idle, update the displayed remaining to reflect new work duration
      if (stateRef.current === 'idle') {
        const dur = minutesToSeconds(next.workDuration);
        setTotalDuration(dur);
        setRemaining(dur);
      }

      return next;
    });
  }, []);

  // ---- initialise display on mount ----
  useEffect(() => {
    const dur = minutesToSeconds(settingsRef.current.workDuration);
    setTotalDuration(dur);
    setRemaining(dur);
  }, []);

  return {
    remaining,
    totalDuration,
    state,
    sessionType,
    completedSessions,
    settings,
    updateSettings,
    start,
    pause,
    resume,
    reset,
    skip,
  };
}
