import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ControlsProps, TimerStatus, TimerPhase, PHASE_COLORS } from '../types/index';
import '../styles/glass.css';

/* ---- Inline SVG Icons ---- */

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
  </svg>
);

const SkipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 4l10 8-10 8V4zm12 0v16h-2V4h2z" />
  </svg>
);

const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 1 3 6.9" />
    <path d="M3 7v5h5" />
  </svg>
);

/* ---- Animation Variants ---- */

const containerVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const buttonVariants = {
  initial: { opacity: 0, y: 8, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.12 } },
};

/* ---- Glass Button ---- */

interface GlassButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  phase: TimerPhase;
  large?: boolean;
}

function GlassButton({ onClick, icon, label, phase, large }: GlassButtonProps) {
  const colors = PHASE_COLORS[phase];

  return (
    <motion.button
      variants={buttonVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={
        `glass-button flex items-center justify-center gap-2 text-white/80 text-sm font-medium ` +
        `focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ` +
        (large ? 'px-8 py-4 text-base' : 'px-5 py-3')
      }
      style={{
        boxShadow: `0 0 20px ${colors.glow}`,
        borderColor: `${colors.ring}33`,
      }}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

/* ---- Controls Component ---- */

export default function Controls({ status, phase, onStart, onPause, onResume, onReset, onSkip }: ControlsProps) {
  // Resolve the effective phase for styling — use Focus as default when idle
  const activePhase = phase === TimerPhase.Idle ? TimerPhase.Focus : phase;

  return (
    <div className="flex justify-center mt-6" role="group" aria-label="Timer controls">
      <AnimatePresence mode="wait">
        {/* ---- Idle: Start button ---- */}
        {status === TimerStatus.Idle && (
          <motion.div
            key="idle"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-3"
          >
            <GlassButton
              onClick={onStart}
              icon={<PlayIcon />}
              label="Start Focus"
              phase={activePhase}
              large
            />
          </motion.div>
        )}

        {/* ---- Running: Pause + Skip ---- */}
        {status === TimerStatus.Running && (
          <motion.div
            key="running"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-3"
          >
            <GlassButton onClick={onPause} icon={<PauseIcon />} label="Pause" phase={activePhase} />
            <GlassButton onClick={onSkip} icon={<SkipIcon />} label="Skip" phase={activePhase} />
          </motion.div>
        )}

        {/* ---- Paused: Resume + Reset + Skip ---- */}
        {status === TimerStatus.Paused && (
          <motion.div
            key="paused"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-3"
          >
            <GlassButton onClick={onResume} icon={<PlayIcon />} label="Resume" phase={activePhase} />
            <GlassButton onClick={onReset} icon={<ResetIcon />} label="Reset" phase={activePhase} />
            <GlassButton onClick={onSkip} icon={<SkipIcon />} label="Skip" phase={activePhase} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
