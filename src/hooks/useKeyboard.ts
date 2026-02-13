import { useEffect, useRef } from 'react';
import { useTimer } from '../contexts/TimerContext';

export function useKeyboard(onToast: (msg: string) => void) {
  const { state, start, pause, reset, skip } = useTimer();
  const shownRef = useRef(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!shownRef.current) {
          onToast('Press Space to pause');
          shownRef.current = true;
        }
        if (state === 'running') pause();
        else start();
      } else if (e.code === 'KeyR') {
        reset();
      } else if (e.code === 'KeyS') {
        if (state !== 'idle') skip();
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state, start, pause, reset, skip, onToast]);
}
