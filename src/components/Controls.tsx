import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ControlsProps, TimerStatus, TimerPhase } from '../types/index';
import '../styles/glass.css';

// ---- Inline SVG Icons ----

const PlayIcon: React.FC = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.5 3.5l10 6.5-10 6.5V3.5z" />
  </svg>
);

const PauseIcon: React.FC = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <rect x="5" y="3" width="3.5" height="14" rx="1" />
    <rect x="11.5" y="3" width="3.5" height="14" rx="1" />
  </svg>
);

const SkipIcon: React.FC = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 3.5l8 6.5-8 6.5V3.5z" />
    <rect x="14" y="3.5" width="3" height="13" rx="1" />
  </svg>
);

const ResetIcon: React.FC = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 10a6 6 0 1 1 1.76 4.24" />
    <path d="M4 14V10h4" />
  </svg>
);

// ---- Glass Button ----

interface GlassButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  large?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({ onClick, children, label, large }) => (
  <motion.button
    className={`glass-button flex items-center justify-center gap-2 px-5 py-3 text-white/80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ${
      large ? 'px-8 py-4 text-base' : ''
    }`}
    onClick={onClick}
    aria-label={label}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

// ---- Animation Variants ----

const groupVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05, duration: 0.25 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const itemVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// ---- Controls Component ----

const Controls: React.FC<ControlsProps> = ({
  status,
  phase,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[56px]">
      <AnimatePresence mode="wait">
        {/* Idle state */}
        {status === TimerStatus.Idle && (
          <motion.div
            key="idle"
            variants={groupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-3"
          >
            <motion.div variants={itemVariants}>
              <GlassButton onClick={onStart} label="Start Focus" large>
                <PlayIcon />
                <span>Start Focus</span>
              </GlassButton>
            </motion.div>
          </motion.div>
        )}

        {/* Running state */}
        {status === TimerStatus.Running && (
          <motion.div
            key="running"
            variants={groupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-3"
          >
            <motion.div variants={itemVariants}>
              <GlassButton onClick={onPause} label="Pause">
                <PauseIcon />
                <span>Pause</span>
              </GlassButton>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassButton onClick={onSkip} label="Skip">
                <SkipIcon />
                <span>Skip</span>
              </GlassButton>
            </motion.div>
          </motion.div>
        )}

        {/* Paused state */}
        {status === TimerStatus.Paused && (
          <motion.div
            key="paused"
            variants={groupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-3"
          >
            <motion.div variants={itemVariants}>
              <GlassButton onClick={onResume} label="Resume">
                <PlayIcon />
                <span>Resume</span>
              </GlassButton>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassButton onClick={onReset} label="Reset">
                <ResetIcon />
                <span>Reset</span>
              </GlassButton>
            </motion.div>
            <motion.div variants={itemVariants}>
              <GlassButton onClick={onSkip} label="Skip">
                <SkipIcon />
                <span>Skip</span>
              </GlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Controls;
