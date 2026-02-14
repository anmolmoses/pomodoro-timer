import {
  TimerState,
  TimerAction,
  TimerPhase,
  TimerStatus,
  INITIAL_TIMER_STATE,
} from '../types';

/**
 * Pure reducer for Pomodoro timer state.
 * TICK uses drift-corrected countdown via Date.now() delta.
 */
export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START': {
      return {
        ...state,
        phase: action.payload.phase,
        status: TimerStatus.Running,
        totalSeconds: action.payload.durationSeconds,
        remainingSeconds: action.payload.durationSeconds,
        lastTickTimestamp: Date.now(),
      };
    }

    case 'PAUSE': {
      return {
        ...state,
        status: TimerStatus.Paused,
        lastTickTimestamp: null,
      };
    }

    case 'RESUME': {
      return {
        ...state,
        status: TimerStatus.Running,
        lastTickTimestamp: Date.now(),
      };
    }

    case 'RESET': {
      return { ...INITIAL_TIMER_STATE };
    }

    case 'SKIP': {
      // Mark phase as complete — the hook handles transition
      return {
        ...state,
        remainingSeconds: 0,
        status: TimerStatus.Idle,
        lastTickTimestamp: null,
      };
    }

    case 'TICK': {
      if (state.status !== TimerStatus.Running || state.lastTickTimestamp === null) {
        return state;
      }

      // Drift-corrected: compute elapsed from real wall-clock delta
      const elapsed = Math.floor((action.payload.now - state.lastTickTimestamp) / 1000);
      if (elapsed <= 0) return state;

      const newRemaining = Math.max(0, state.remainingSeconds - elapsed);

      return {
        ...state,
        remainingSeconds: newRemaining,
        lastTickTimestamp: action.payload.now,
      };
    }

    case 'PHASE_COMPLETE': {
      const wasFocus = state.phase === TimerPhase.Focus;
      const newCompleted = wasFocus ? state.completedSessions + 1 : state.completedSessions;
      const newTotal = wasFocus ? state.totalCompletedSessions + 1 : state.totalCompletedSessions;

      // Reset cycle counter after long break
      const resetCycle = state.phase === TimerPhase.LongBreak;

      return {
        ...state,
        status: TimerStatus.Idle,
        remainingSeconds: 0,
        lastTickTimestamp: null,
        completedSessions: resetCycle ? 0 : newCompleted,
        totalCompletedSessions: newTotal,
      };
    }

    case 'SET_REMAINING': {
      return {
        ...state,
        remainingSeconds: Math.max(0, action.payload.remaining),
      };
    }

    default:
      return state;
  }
}
