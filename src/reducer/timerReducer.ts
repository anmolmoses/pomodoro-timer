/**
 * Timer state reducer — single source of truth for timer transitions.
 * Consumes shared TimerState and TimerAction types.
 */
import {
  TimerState,
  TimerAction,
  TimerPhase,
  TimerStatus,
  INITIAL_TIMER_STATE,
} from '../types';

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START': {
      const { phase, durationSeconds } = action.payload;
      return {
        ...state,
        phase,
        status: TimerStatus.Running,
        totalSeconds: durationSeconds,
        remainingSeconds: durationSeconds,
        lastTickTimestamp: Date.now(),
      };
    }

    case 'PAUSE':
      return {
        ...state,
        status: TimerStatus.Paused,
        lastTickTimestamp: null,
      };

    case 'RESUME':
      return {
        ...state,
        status: TimerStatus.Running,
        lastTickTimestamp: Date.now(),
      };

    case 'RESET':
      return { ...INITIAL_TIMER_STATE };

    case 'SKIP':
      // Handled by the provider (determines next phase)
      return state;

    case 'TICK': {
      if (state.status !== TimerStatus.Running || !state.lastTickTimestamp) return state;

      const now = action.payload.now;
      const elapsed = Math.floor((now - state.lastTickTimestamp) / 1000);
      if (elapsed < 1) return state;

      const remaining = Math.max(0, state.remainingSeconds - elapsed);
      return {
        ...state,
        remainingSeconds: remaining,
        lastTickTimestamp: now,
      };
    }

    case 'PHASE_COMPLETE': {
      const isFocus = state.phase === TimerPhase.Focus;
      return {
        ...state,
        status: TimerStatus.Idle,
        remainingSeconds: 0,
        lastTickTimestamp: null,
        completedSessions: isFocus ? state.completedSessions + 1 : state.completedSessions,
        totalCompletedSessions: isFocus ? state.totalCompletedSessions + 1 : state.totalCompletedSessions,
      };
    }

    case 'SET_REMAINING':
      return {
        ...state,
        remainingSeconds: action.payload.remaining,
      };

    default:
      return state;
  }
}
