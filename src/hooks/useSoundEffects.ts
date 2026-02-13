import { useEffect, useRef } from 'react';
import { soundManager } from '../services/soundManager';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed' | 'break';

interface UseSoundEffectsOptions {
  status: TimerStatus;
  tickEnabled?: boolean;
}

/**
 * Hook that plays sounds in response to timer state changes.
 * Import and use in the main App or Timer component:
 *
 *   useSoundEffects({ status: timerState.status, tickEnabled: settings.tickSound });
 */
export function useSoundEffects({ status, tickEnabled = false }: UseSoundEffectsOptions) {
  const prevStatus = useRef<TimerStatus>(status);

  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;

    // Don't play on initial mount
    if (prev === status) return;

    switch (status) {
      case 'running':
        if (prev === 'idle' || prev === 'break') {
          soundManager.play('sessionStart');
        }
        break;
      case 'completed':
        soundManager.play('sessionComplete');
        break;
      case 'break':
        soundManager.play('breakStart');
        break;
    }
  }, [status]);

  // Tick sound handler — call this from the timer tick callback
  const playTick = () => {
    if (tickEnabled) {
      soundManager.play('tick');
    }
  };

  return { playTick };
}
