/**
 * Controls — play/pause/reset/skip buttons.
 * Uses shared ControlsProps type.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ControlsProps, TimerStatus, TimerPhase } from '../types';

const btnBase =
  'glass-button px-5 py-3 text-white font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent';

const tap = { scale: 0.95 };
const hover = { scale: 1.05 };

export default function Controls({ status, phase, onStart, onPause, onResume, onReset, onSkip }: ControlsProps) {
  const isIdle = status === TimerStatus.Idle;
  const isRunning = status === TimerStatus.Running;
  const isPaused = status === TimerStatus.Paused;
  const hasStarted = phase !== TimerPhase.Idle;

  return (
    <div className="flex items-center gap-3 mt-8">
      {/* Primary action */}
      {isIdle && !hasStarted && (
        <motion.button
          whileTap={tap}
          whileHover={hover}
          onClick={onStart}
          className={`${btnBase} bg-purple-500/30 border-purple-400/30`}
        >
          <PlayIcon /> Start Focus
        </motion.button>
      )}

      {isIdle && hasStarted && (
        <motion.button
          whileTap={tap}
          whileHover={hover}
          onClick={onStart}
          className={`${btnBase} bg-purple-500/30 border-purple-400/30`}
        >
          <PlayIcon /> Start
        </motion.button>
      )}

      {isRunning && (
        <motion.button
          whileTap={tap}
          whileHover={hover}
          onClick={onPause}
          className={btnBase}
        >
          <PauseIcon /> Pause
        </motion.button>
      )}

      {isPaused && (
        <motion.button
          whileTap={tap}
          whileHover={hover}
          onClick={onResume}
          className={`${btnBase} bg-purple-500/30 border-purple-400/30`}
        >
          <PlayIcon /> Resume
        </motion.button>
      )}

      {/* Secondary actions */}
      {hasStarted && (
        <>
          <motion.button
            whileTap={tap}
            whileHover={hover}
            onClick={onSkip}
            className={`${btnBase} text-white/70`}
            aria-label="Skip to next phase"
          >
            <SkipIcon />
          </motion.button>

          <motion.button
            whileTap={tap}
            whileHover={hover}
            onClick={onReset}
            className={`${btnBase} text-white/70`}
            aria-label="Reset timer"
          >
            <ResetIcon />
          </motion.button>
        </>
      )}
    </div>
  );
}

// Inline SVG icons (small, no deps needed)
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}
