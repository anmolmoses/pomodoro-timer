/**
 * TimerRing — circular SVG progress ring with phase-colored stroke.
 * Uses shared TimerRingProps. Accessible via role="progressbar".
 */
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerRingProps, PHASE_COLORS, TimerStatus } from '../types';

const SIZE = 280;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TimerRing({ progress, phase, displayTime, phaseLabel, status }: TimerRingProps) {
  const colors = PHASE_COLORS[phase];
  const offset = CIRCUMFERENCE * (1 - progress);
  const ariaRef = useRef<HTMLDivElement>(null);
  const lastAnnouncedRef = useRef(displayTime);

  // Announce time every 15 seconds for screen readers (not every tick)
  useEffect(() => {
    const seconds = parseInt(displayTime.split(':')[1], 10);
    if (seconds % 15 === 0 && displayTime !== lastAnnouncedRef.current) {
      lastAnnouncedRef.current = displayTime;
      if (ariaRef.current) {
        ariaRef.current.textContent = `${phaseLabel}: ${displayTime} remaining`;
      }
    }
  }, [displayTime, phaseLabel]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect */}
      <div
        className="absolute rounded-full transition-all duration-1000"
        style={{
          width: SIZE + 40,
          height: SIZE + 40,
          background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: status === TimerStatus.Running ? 0.6 : 0.2,
        }}
      />

      {/* SVG ring */}
      <svg
        width={SIZE}
        height={SIZE}
        className="-rotate-90"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${phaseLabel} timer: ${displayTime} remaining`}
      >
        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.ring}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={phaseLabel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium uppercase tracking-wider text-white/60 mb-1"
          >
            {phaseLabel}
          </motion.span>
        </AnimatePresence>
        <span className="font-mono text-5xl md:text-6xl font-bold text-white tabular-nums">
          {displayTime}
        </span>
      </div>

      {/* Screen reader live region — updates every 15s */}
      <div ref={ariaRef} aria-live="polite" className="sr-only" />
    </div>
  );
}
