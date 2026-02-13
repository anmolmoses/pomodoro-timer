import { motion } from 'framer-motion';
import { useTimer } from '../contexts/TimerContext';
import { PHASE_LABELS } from '../types/timer';

const SIZE = 280;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const PHASE_COLORS = {
  work: '#6C5CE7',
  shortBreak: '#00D2D3',
  longBreak: '#F9CA24',
};

const GLOW_SHADOWS = {
  work: '0 0 40px rgba(108, 92, 231, 0.3)',
  shortBreak: '0 0 40px rgba(0, 210, 211, 0.3)',
  longBreak: '0 0 40px rgba(249, 202, 36, 0.3)',
};

export default function TimerRing() {
  const { remaining, total, phase, state } = useTimer();
  const progress = total > 0 ? remaining / total : 1;
  const offset = CIRCUMFERENCE * (1 - progress);
  const color = state === 'paused' ? '#FF9F43' : PHASE_COLORS[phase];
  const glowColor = state === 'paused'
    ? '0 0 40px rgba(255, 159, 67, 0.3)'
    : GLOW_SHADOWS[phase];

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: glowColor, transition: 'box-shadow 0.6s ease' }}
      />

      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          className="text-border dark:text-[#2A2A45] text-gray-200"
          strokeWidth={STROKE}
        />
        {/* Progress ring */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-text dark:text-[#E8E8F0] text-[#1A1A2E] tabular-nums"
          style={{ fontSize: '72px', lineHeight: '80px', fontWeight: 700 }}
        >
          {formatTime(remaining)}
        </span>
        <span className="text-textMuted dark:text-[#6B6B80] text-gray-500 text-sm font-semibold mt-1 uppercase tracking-wider">
          {PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  );
}
