import React from 'react';
import { motion } from 'framer-motion';
import type { TimerPhase, TimerState } from '../types';

interface TimerRingProps {
  remaining: number;
  total: number;
  phase: TimerPhase;
  state: TimerState;
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  work: '#6C5CE7',
  shortBreak: '#00D2D3',
  longBreak: '#F9CA24',
};

const PHASE_LABELS: Record<TimerPhase, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const STATE_COLORS: Record<TimerState, string | null> = {
  idle: null,
  running: null,
  paused: '#FF9F43',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TimerRing({ remaining, total, phase, state }: TimerRingProps) {
  const size = 280;
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? remaining / total : 1;
  const offset = circumference * (1 - progress);
  const color = STATE_COLORS[state] ?? PHASE_COLORS[phase];
  const glowColor = `${color}66`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full ring-glow"
        style={{ '--glow-color': glowColor } as React.CSSProperties}
      />

      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-border dark:text-border text-gray-200"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-timer text-text-primary dark:text-text-primary">
          {formatTime(remaining)}
        </span>
        <span
          className="text-sm font-semibold uppercase tracking-widest mt-1"
          style={{ color }}
        >
          {state === 'paused' ? 'Paused' : PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  );
}
