import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  TimerState,
  TimerSettings,
  SessionType,
  WorkerOutMessage,
} from '../types/timer';
import { DEFAULT_SETTINGS } from '../types/timer';

/**
 * Load settings from localStorage, falling back to defaults.
 */
function loadSettings(): TimerSettings {
  try {
    const raw = localStorage.getItem('pomodoroSettings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(s: TimerSettings) {
  try {
    localStorage.setItem('pomodoroSettings', JSON.stringify(s));
  } catch {
    // ignore
  }
}

/** Request notification permission (idempotent). */
function requestNotificationPermission() {
  if (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'default'
  ) {
    Notification.requestPermission();
  }
}

function fireNotification(title: string, body: string) {
  if (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'granted'
  ) {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

export function useTimer() {
  const [settings, setSettingsState] = useState<TimerSettings>(loadSettings);
  const [state, setState] = useState<TimerState>('idle');
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const sessionTypeRef = useRef(sessionType);
  sessionTypeRef.current = sessionType;

  const sessionCountRef = useRef(sessionCount);
  sessionCountRef.current = sessionCount;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Initialise worker
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data;

      if (msg.type === 'TICK') {
        setRemaining(msg.remaining);
      } else if (msg.type === 'COMPLETE') {
        handleComplete();
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Determine the next session type and duration after completion. */
  const handleComplete = useCallback(() => {
    const currentType = sessionTypeRef.current;
    const s = settingsRef.current;

    if (currentType === 'work') {
      const newCount = sessionCountRef.current + 1;
      setSessionCount(newCount);
      sessionCountRef.current = newCount;

      fireNotification(
        'Focus session complete!',
        'Great work. Time for a break.'
      );

      // Determine break type
      const isLong = newCount % s.longBreakInterval === 0;
      const nextType: SessionType = isLong ? 'longBreak' : 'shortBreak';
      const breakMin = isLong ? s.longBreak : s.shortBreak;

      setSessionType(nextType);
      sessionTypeRef.current = nextType;
      setState('completed');

      // Auto-transition to break after a brief moment
      setTimeout(() => {
        startPhase(nextType, breakMin);
      }, 1500);
    } else {
      // Break finished
      fireNotification('Break over!', 'Ready for another focus session?');
      setSessionType('work');
      sessionTypeRef.current = 'work';
      setState('completed');

      setTimeout(() => {
        setState('idle');
        setRemaining(s.workDuration * 60);
        setTotalDuration(s.workDuration * 60);
      }, 1500);
    }
  }, []);

  /** Start a specific phase via the worker. */
  const startPhase = useCallback(
    (type: SessionType, durationMin: number) => {
      const dur = durationMin * 60;
      setSessionType(type);
      sessionTypeRef.current = type;
      setTotalDuration(dur);
      setRemaining(dur);
      setState(type === 'work' ? 'running' : 'break');
      stateRef.current = type === 'work' ? 'running' : 'break';

      workerRef.current?.postMessage({ type: 'START', duration: dur });
    },
    []
  );

  // --- Public API ---

  const start = useCallback(() => {
    if (stateRef.current !== 'idle') return;
    requestNotificationPermission();
    startPhase('work', settingsRef.current.workDuration);
  }, [startPhase]);

  const pause = useCallback(() => {
    if (stateRef.current !== 'running' && stateRef.current !== 'break') return;
    workerRef.current?.postMessage({ type: 'PAUSE' });
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') return;
    workerRef.current?.postMessage({ type: 'RESUME' });
    // Restore previous running state
    const wasBreak =
      sessionTypeRef.current === 'shortBreak' ||
      sessionTypeRef.current === 'longBreak';
    setState(wasBreak ? 'break' : 'running');
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: 'RESET' });
    setState('idle');
    setSessionType('work');
    sessionTypeRef.current = 'work';
    setRemaining(settingsRef.current.workDuration * 60);
    setTotalDuration(settingsRef.current.workDuration * 60);
  }, []);

  const skip = useCallback(() => {
    const s = settingsRef.current;
    workerRef.current?.postMessage({ type: 'RESET' });

    if (
      sessionTypeRef.current === 'shortBreak' ||
      sessionTypeRef.current === 'longBreak'
    ) {
      // Skip break → go to work idle
      setSessionType('work');
      sessionTypeRef.current = 'work';
      setState('idle');
      setRemaining(s.workDuration * 60);
      setTotalDuration(s.workDuration * 60);
    } else {
      // Skip work → trigger completion logic
      handleComplete();
    }
  }, [handleComplete]);

  const setSettings = useCallback((patch: Partial<TimerSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      settingsRef.current = next;
      saveSettings(next);

      // If idle, update the displayed remaining time
      if (stateRef.current === 'idle') {
        const dur = next.workDuration * 60;
        setRemaining(dur);
        setTotalDuration(dur);
      }

      return next;
    });
  }, []);

  // Set initial remaining on mount
  useEffect(() => {
    const dur = settings.workDuration * 60;
    setRemaining(dur);
    setTotalDuration(dur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    remaining,
    totalDuration,
    state,
    sessionType,
    sessionCount,
    settings,
    setSettings,
    start,
    pause,
    resume,
    reset,
    skip,
  };
}
