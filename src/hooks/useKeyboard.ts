import { useEffect, useRef, useState } from 'react';
import { useTimer } from '../context/TimerContext';

export function useKeyboard() {
  const { state, start, pause, reset, skip } = useTimer();
  const [toast, setToast] = useState<string | null>(null);
  const shownHints = useRef<Set<string>>(new Set());
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, key: string) => {
    if (shownHints.current.has(key)) return;
    shownHints.current.add(key);
    setToast(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (state === 'running') {
            pause();
            showToast('Paused — press Space to resume', 'space-pause');
          } else {
            start();
            showToast('Press Space to pause', 'space-start');
          }
          break;
        case 'KeyR':
          e.preventDefault();
          reset();
          showToast('Timer reset', 'reset');
          break;
        case 'KeyS':
          e.preventDefault();
          skip();
          showToast('Skipped to next phase', 'skip');
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state, start, pause, reset, skip]);

  return { toast };
}
