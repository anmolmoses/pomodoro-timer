import { useState, useRef, useCallback, useEffect } from 'react';
import type { TimerState, TimerSettings, SessionType } from '../types/timer';
import { DEFAULT_SETTINGS } from '../types/timer';

const SETTINGS_KEY = 'pomodoro-settings';

function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(s: TimerSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function requestNotificationPermission() {
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function fireNotification(title: string, body: string) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

function getDurationForType(settings: TimerSettings, sessionType: SessionType): number {
  switch (sessionType) {
    case 'work':
      return settings.workDuration * 60;
    case 'shortBreak':
      return settings.shortBreak * 60;
    case 'longBreak':
      return settings.longBreak * 60;
  }
}

export function useTimer() {
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);
  const [state, setState] = useState<TimerState>('idle');
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [remaining, setRemaining] = useState(settings.workDuration * 60);
  const [totalDuration, setTotalDuration] = useState(settings.workDuration * 60);

  const workerRef = useRef<Worker | null>(null);
  const settingsRef = useRef(settings);
  const stateRef = useRef(state);
  const sessionTypeRef = useRef(sessionType);
  const sessionCountRef = useRef(sessionCount);

  // Keep refs in sync
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { sessionTypeRef.current = sessionType; }, [sessionType]);
  useEffect(() => { sessionCountRef.current = sessionCount; }, [sessionCount]);

  // Persist settings
  useEffect(() => { saveSettings(settings); }, [settings]);

  // Initialize worker
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent) => {
      const { type, remaining: r } = e.data;

      if (type === 'TICK') {
        setRemaining(r);
      } else if (type === 'COMPLETE') {
        setRemaining(0);
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

  const handleComplete = useCallback(() => {
    const currentSessionType = sessionTypeRef.current;
    const currentSettings = settingsRef.current;
    let currentSessionCount = sessionCountRef.current;

    if (currentSessionType === 'work') {
      // Work session completed
      currentSessionCount += 1;
      setSessionCount(currentSessionCount);
      fireNotification('Focus session complete!', 'Time for a break.');

      // Determine next break type
      const isLongBreak = currentSessionCount % currentSettings.longBreakInterval === 0;
      const nextType: SessionType = isLongBreak ? 'longBreak' : 'shortBreak';
      const nextDuration = getDurationForType(currentSettings, nextType);

      setSessionType(nextType);
      setRemaining(nextDuration);
      setTotalDuration(nextDuration);
      setState('completed');
    } else {
      // Break completed
      const nextDuration = currentSettings.workDuration * 60;
      fireNotification('Break over!', 'Ready to focus again.');

      setSessionType('work');
      setRemaining(nextDuration);
      setTotalDuration(nextDuration);
      setState('completed');
    }
  }, []);

  const postMessage = useCallback((msg: Record<string, unknown>) => {
    workerRef.current?.postMessage(msg);
  }, []);

  const start = useCallback(() => {
    const s = stateRef.current;
    if (s === 'running') return;

    requestNotificationPermission();

    if (s === 'idle' || s === 'completed') {
      // Start fresh with current session type
      const currentType = sessionTypeRef.current;
      const currentSettings = settingsRef.current;

      // If completed, the type/duration were already set by handleComplete
      // If idle, use current session type
      const duration = (s === 'completed')
        ? getDurationForType(currentSettings, currentType)
        : getDurationForType(currentSettings, currentType);

      setRemaining(duration);
      setTotalDuration(duration);
      setState(currentType === 'work' ? 'running' : 'break');
      postMessage({ type: 'START', duration });
    }
  }, [postMessage]);

  const pause = useCallback(() => {
    const s = stateRef.current;
    if (s !== 'running' && s !== 'break') return;

    setState('paused');
    postMessage({ type: 'PAUSE' });
  }, [postMessage]);

  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') return;

    const currentType = sessionTypeRef.current;
    setState(currentType === 'work' ? 'running' : 'break');
    postMessage({ type: 'RESUME' });
  }, [postMessage]);

  const reset = useCallback(() => {
    postMessage({ type: 'RESET' });

    const currentSettings = settingsRef.current;
    const duration = currentSettings.workDuration * 60;

    setState('idle');
    setSessionType('work');
    setRemaining(duration);
    setTotalDuration(duration);
    setSessionCount(0);
  }, [postMessage]);

  const skip = useCallback(() => {
    postMessage({ type: 'RESET' });

    const currentType = sessionTypeRef.current;
    const currentSettings = settingsRef.current;
    let currentSessionCount = sessionCountRef.current;

    if (currentType === 'work') {
      // Skip work → go to break (count as completed)
      currentSessionCount += 1;
      setSessionCount(currentSessionCount);

      const isLongBreak = currentSessionCount % currentSettings.longBreakInterval === 0;
      const nextType: SessionType = isLongBreak ? 'longBreak' : 'shortBreak';
      const nextDuration = getDurationForType(currentSettings, nextType);

      setSessionType(nextType);
      setRemaining(nextDuration);
      setTotalDuration(nextDuration);
      setState('completed');
    } else {
      // Skip break → go to work
      const nextDuration = currentSettings.workDuration * 60;

      setSessionType('work');
      setRemaining(nextDuration);
      setTotalDuration(nextDuration);
      setState('completed');
    }
  }, [postMessage]);

  const updateSettings = useCallback((partial: Partial<TimerSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };

      // If idle, update remaining to reflect new duration
      if (stateRef.current === 'idle') {
        const dur = getDurationForType(next, sessionTypeRef.current);
        setRemaining(dur);
        setTotalDuration(dur);
      }

      return next;
    });
  }, []);

  return {
    remaining,
    totalDuration,
    state,
    sessionType,
    sessionCount,
    settings,
    updateSettings,
    start,
    pause,
    resume,
    reset,
    skip,
  };
}
