import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  TimerRingProps,
  TimerStatus,
  PHASE_COLORS,
  PHASE_LABELS,
} from '../types';

const RADIUS = 120;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEW_SIZE = (RADIUS + STROKE_WIDTH) * 2;
const CENTER = VIEW_SIZE / 2;

export default function TimerRing({
  progress,
  phase,
  displayTime,
  phaseLabel,
  status,
}: TimerRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const colors = PHASE_COLORS[phase];
  const offset = CIRCUMFERENCE * (1 - progress);
  const lastAnnouncedRef = useRef(displayTime);

  // Only update aria-live text every ~15s to avoid screen reader noise
  const minutes = displayTime.split(':')[0];
  const seconds = parseInt(displayTime.split(':')[1], 10);
  if (seconds % 15 === 0 || displayTime !== lastAnnouncedRef.current) {
    if (seconds % 15 === 0) {
      lastAnnouncedRef.current = displayTime;
    }
  }
  const announceTime = lastAnnouncedRef.current;

  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: 'easeInOut' as const };

  const colorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: 'easeInOut' as const };

  return (
    <motion.div
      className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80"
      animate={{ scale: status === TimerStatus.Running ? 1 : 0.95 }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse-slow'}`}
        style={{ filter: 'blur(40px)' }}
        animate={{ backgroundColor: colors.glow }}
        transition={colorTransition}
      />

      {/* SVG Ring */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${PHASE_LABELS[phase]} timer: ${displayTime} remaining`}
      >
        {/* Background ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={STROKE_WIDTH}
        />

        {/* Progress ring */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{
            strokeDashoffset: offset,
            stroke: colors.ring,
          }}
          transition={{
            strokeDashoffset: springTransition,
            stroke: colorTransition,
          }}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </svg>

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div
          aria-live="polite"
          aria-atomic
          className="font-mono text-5xl md:text-6xl font-bold text-white"
        >
          {announceTime}
        </div>
        <motion.div
          className="text-white/60 text-sm uppercase tracking-widest mt-2"
          animate={{ opacity: 1 }}
          key={phaseLabel}
          initial={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
          {phaseLabel}
        </motion.div>
      </div>
    </motion.div>
  );
}
