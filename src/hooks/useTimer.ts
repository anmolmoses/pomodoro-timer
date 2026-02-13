import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  TimerState,
  TimerSettings,
  SessionType,
  WorkerOutMessage,
} from '../types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function fireNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

export function useTimer(initialSettings?: Partial<TimerSettings>) {
  const [settings, setSettings] = useState<TimerSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [state, setState] = useState<TimerState>('idle');
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const workerRef = useRef<Worker | null>(null);

  // Create worker once
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data;
      if (msg.type === 'TICK') {
        setRemaining(msg.remaining);
      } else if (msg.type === 'COMPLETE') {
        setRemaining(0);
        setState('completed');
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // Handle completed state → transition to break or back to work
  useEffect(() => {
    if (state !== 'completed') return;

    if (sessionType === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      fireNotification('Focus session complete!', 'Time for a break.');

      // Auto-transition to break after a brief moment
      const isLong = newCount % settings.longBreakInterval === 0;
      const breakMins = isLong ? settings.longBreak : settings.shortBreak;
      const breakSecs = breakMins * 60;

      setSessionType('break');
      setTotalDuration(breakSecs);
      setRemaining(breakSecs);
      setState('break');
    } else {
      fireNotification('Break over!', 'Ready to focus again.');
      // Reset to work idle
      setSessionType('work');
      const workSecs = settings.workDuration * 60;
      setTotalDuration(workSecs);
      setRemaining(workSecs);
      setState('idle');
    }
  }, [state]); // intentionally only depend on state

  const post = useCallback(
    (msg: any) => workerRef.current?.postMessage(msg),
    []
  );

  const start = useCallback(() => {
    if (state !== 'idle' && state !== 'break') return;
    requestNotificationPermission();

    const durationMins =
      sessionType === 'work' ? settings.workDuration : remaining / 60;
    const secs =
      state === 'break' ? remaining : settings.workDuration * 60;

    // For break state, auto-start the break countdown
    const actualSecs = state === 'break' ? remaining : secs;
    setTotalDuration(actualSecs);
    setRemaining(actualSecs);
    setState('running');
    post({ type: 'START', duration: actualSecs });
  }, [state, sessionType, settings, remaining, post]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    setState('paused');
    post({ type: 'PAUSE' });
  }, [state, post]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    setState('running');
    post({ type: 'RESUME' });
  }, [state, post]);

  const reset = useCallback(() => {
    post({ type: 'RESET' });
    setState('idle');
    setSessionType('work');
    const secs = settings.workDuration * 60;
    setTotalDuration(secs);
    setRemaining(secs);
  }, [settings, post]);

  const skip = useCallback(() => {
    post({ type: 'RESET' });
    // Force the completed transition
    setState('completed');
  }, [post]);

  const updateSettings = useCallback((patch: Partial<TimerSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      return next;
    });
  }, []);

  // Initialise remaining on mount & when settings change in idle
  useEffect(() => {
    if (state === 'idle' && sessionType === 'work') {
      const secs = settings.workDuration * 60;
      setTotalDuration(secs);
      setRemaining(secs);
    }
  }, [settings.workDuration, state, sessionType]);

  // Auto-start break countdown when entering break state
  useEffect(() => {
    if (state === 'break' && remaining > 0) {
      setState('running');
      post({ type: 'START', duration: remaining });
    }
  }, [state]); // intentionally minimal deps

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
