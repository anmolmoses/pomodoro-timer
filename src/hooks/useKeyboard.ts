/**
 * useKeyboard — keyboard shortcuts for the timer.
 * Space: toggle play/pause, R: reset, S: skip.
 * Consumes PomodoroContext — NOT a separate context.
 */
import { useEffect } from 'react';
import { usePomodoroContext } from '../context/PomodoroContext';
import { TimerStatus, TimerPhase } from '../types';

export function useKeyboard() {
  const { state, start, pause, resume, reset, skip } = usePomodoroContext();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space': {
          e.preventDefault();
          if (state.status === TimerStatus.Running) pause();
          else if (state.status === TimerStatus.Paused) resume();
          else if (state.phase === TimerPhase.Idle) start();
          break;
        }
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey) reset();
          break;
        case 'KeyS':
          if (!e.metaKey && !e.ctrlKey && state.phase !== TimerPhase.Idle) skip();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.status, state.phase, start, pause, resume, reset, skip]);
}
