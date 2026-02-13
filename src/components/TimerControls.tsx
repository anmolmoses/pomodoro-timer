import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import type { TimerState } from '../types';

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  label: string;
}

function ControlButton({ onClick, disabled, children, variant = 'secondary', label }: BtnProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        flex items-center justify-center rounded-full transition-colors
        min-w-[44px] min-h-[44px]
        ${variant === 'primary'
          ? 'w-16 h-16 bg-primary text-white shadow-lg shadow-primary/30'
          : 'w-12 h-12 bg-surface-elevated dark:bg-surface-elevated bg-gray-100 text-text-muted hover:text-text-primary'
        }
        disabled:opacity-30 disabled:cursor-not-allowed
      `}
    >
      {children}
    </motion.button>
  );
}

export default function TimerControls({ state, onStart, onPause, onReset, onSkip }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-10">
      <ControlButton
        onClick={onReset}
        disabled={state === 'idle'}
        label="Reset"
      >
        <RotateCcw size={20} />
      </ControlButton>

      {state === 'running' ? (
        <ControlButton onClick={onPause} variant="primary" label="Pause">
          <Pause size={28} />
        </ControlButton>
      ) : (
        <ControlButton onClick={onStart} variant="primary" label="Start">
          <Play size={28} className="ml-1" />
        </ControlButton>
      )}

      <ControlButton
        onClick={onSkip}
        disabled={state === 'idle'}
        label="Skip"
      >
        <SkipForward size={20} />
      </ControlButton>
    </div>
  );
}
