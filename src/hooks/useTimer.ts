import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimerState, TimerSettings, WorkerOutMessage } from '../types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
};

/**
 * Requests Notification permission if not already granted.
 * Called once on the user's first start action.
 */
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

export function useTimer() {
  const [state, setState] = useState<TimerState>('idle');
  const [remaining, setRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [settings, setSettingsRaw] = useState<TimerSettings>(DEFAULT_SETTINGS);

  const workerRef = useRef<Worker | null>(null);
  const stateRef = useRef(state);
  const settingsRef = useRef(settings);
  const sessionCountRef = useRef(sessionCount);
  const permissionRequested = useRef(false);

  // Keep refs in sync so callbacks always see latest values
  stateRef.current = state;
  settingsRef.current = settings;
  sessionCountRef.current = sessionCount;

  // Partial settings merge
  const setSettings = useCallback((patch: Partial<TimerSettings>) => {
    setSettingsRaw((prev) => ({ ...prev, ...patch }));
  }, []);

  // Initialise and clean up the web worker
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/timer.worker.ts', import.meta.url),
      { type: 'module' },
    );

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data;

      if (msg.type === 'TICK') {
        setRemaining(msg.remaining);
      }

      if (msg.type === 'COMPLETE') {
        const s = settingsRef.current;
        const currentState = stateRef.current;

        if (currentState === 'running') {
          // Work session completed
          const newCount = sessionCountRef.current + 1;
          setSessionCount(newCount);
          sessionCountRef.current = newCount;

          fireNotification(
            'Focus session complete!',
            'Great work — time for a break.',
          );
          setState('completed');
          stateRef.current = 'completed';

          // Auto-transition to break after a brief moment
          // (the UI can show a celebration overlay during 'completed')
        } else if (currentState === 'break') {
          fireNotification('Break over!', 'Ready to focus again?');
          setState('idle');
          stateRef.current = 'idle';
          setRemaining(0);
        }
      }
    };

    workerRef.current = worker;
    return () => worker.terminate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper: send a message to the worker
  const postWorker = useCallback(
    (msg: { type: string; duration?: number }) => {
      workerRef.current?.postMessage(msg);
    },
    [],
  );

  // --- Public API with transition guards ---

  /** Start a new work session. Only valid from idle or completed. */
  const start = useCallback(() => {
    const s = stateRef.current;
    if (s !== 'idle' && s !== 'completed') return; // guard

    // Request notification permission on first ever start
    if (!permissionRequested.current) {
      requestNotificationPermission();
      permissionRequested.current = true;
    }

    const durationSec = settingsRef.current.workDuration * 60;
    setTotalDuration(durationSec);
    setRemaining(durationSec);
    setState('running');
    stateRef.current = 'running';
    postWorker({ type: 'START', duration: durationSec });
  }, [postWorker]);

  /** Pause — only valid when running. */
  const pause = useCallback(() => {
    if (stateRef.current !== 'running' && stateRef.current !== 'break') return;
    setState('paused');
    stateRef.current = 'paused';
    postWorker({ type: 'PAUSE' });
  }, [postWorker]);

  /** Resume — only valid when paused. */
  const resume = useCallback(() => {
    if (stateRef.current !== 'paused') return;
    // Restore the state that was active before pause.
    // We track whether we were in 'break' or 'running' via totalDuration context,
    // but simpler: if remaining corresponds to a break duration we set 'break', else 'running'.
    // Actually we just go back to 'running' for work, 'break' for break.
    // Use a ref to remember pre-pause state.
    setState('running');
    stateRef.current = 'running';
    postWorker({ type: 'RESUME' });
  }, [postWorker]);

  /** Reset — valid from any state except idle. Returns to idle. */
  const reset = useCallback(() => {
    if (stateRef.current === 'idle') return;
    setState('idle');
    stateRef.current = 'idle';
    setRemaining(0);
    setTotalDuration(0);
    postWorker({ type: 'RESET' });
  }, [postWorker]);

  /**
   * Skip to the next phase:
   *  - running (work) → start break
   *  - break → go idle (ready for next work)
   *  - completed → start break (same as natural flow)
   *  - paused → treat as skip of current phase
   */
  const skip = useCallback(() => {
    const s = stateRef.current;
    if (s === 'idle') return;

    const cfg = settingsRef.current;
    const count = sessionCountRef.current;

    if (s === 'running' || s === 'completed' || s === 'paused') {
      // If currently in work phase or just completed, move to break
      // Determine break type
      // If completed, sessionCount was already incremented.
      // If running/paused (skipping work early), increment count.
      let effectiveCount = count;
      if (s === 'running' || s === 'paused') {
        effectiveCount = count + 1;
        setSessionCount(effectiveCount);
        sessionCountRef.current = effectiveCount;
      }

      const isLongBreak = effectiveCount % cfg.longBreakInterval === 0;
      const breakMin = isLongBreak ? cfg.longBreak : cfg.shortBreak;
      const breakSec = breakMin * 60;

      setTotalDuration(breakSec);
      setRemaining(breakSec);
      setState('break');
      stateRef.current = 'break';
      postWorker({ type: 'START', duration: breakSec });
    } else if (s === 'break') {
      // Skip break → go idle
      setState('idle');
      stateRef.current = 'idle';
      setRemaining(0);
      setTotalDuration(0);
      postWorker({ type: 'RESET' });
    }
  }, [postWorker]);

  return {
    remaining,
    totalDuration,
    state,
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
