import { useEffect, useRef } from 'react';
import { TimerStatus, TimerPhase } from '../types';

interface UseKeyboardOptions {
  status: TimerStatus;
  phase: TimerPhase;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  onToast?: (msg: string) => void;
}

/**
 * Keyboard shortcuts for timer control.
 * Rewired to accept explicit params instead of depending on orphaned contexts.
 * Space = play/pause, R = reset, S = skip
 */
export function useKeyboard({ status, phase, start, pause, resume, reset, skip, onToast }: UseKeyboardOptions) {
  const shownRef = useRef(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!shownRef.current && onToast) {
          onToast('Space: play/pause · R: reset · S: skip');
          shownRef.current = true;
        }
        if (status === TimerStatus.Running) pause();
        else if (status === TimerStatus.Paused) resume();
        else start();
      } else if (e.code === 'KeyR') {
        reset();
      } else if (e.code === 'KeyS') {
        if (status !== TimerStatus.Idle) skip();
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [status, phase, start, pause, resume, reset, skip, onToast]);
}
