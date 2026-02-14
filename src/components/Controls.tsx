import React from 'react';
import { motion } from 'framer-motion';
import { ControlsProps, TimerStatus, TimerPhase } from '../types';

export default function Controls({
  status,
  phase,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: ControlsProps) {
  const isIdle = status === TimerStatus.Idle;
  const isRunning = status === TimerStatus.Running;
  const isPaused = status === TimerStatus.Paused;

  return (
    <div className="flex items-center gap-4">
      {/* Reset */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onReset}
        disabled={isIdle}
        className="glass-button w-12 h-12 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Reset timer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 1 3.5-7.1" />
          <path d="M3 4v5h5" />
        </svg>
      </motion.button>

      {/* Main action button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={isRunning ? onPause : isPaused ? onResume : onStart}
        className="w-16 h-16 rounded-full flex items-center justify-center bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/30 transition-colors"
        aria-label={isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
      >
        {isRunning ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7,4 21,12 7,20" />
          </svg>
        )}
      </motion.button>

      {/* Skip */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onSkip}
        disabled={isIdle}
        className="glass-button w-12 h-12 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Skip to next phase"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,4 15,12 5,20" />
          <rect x="17" y="4" width="3" height="16" rx="1" />
        </svg>
      </motion.button>
    </div>
  );
}
