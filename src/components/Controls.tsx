import { motion, AnimatePresence } from 'framer-motion';
import { ControlsProps, TimerStatus } from '../types/index';

/* Inline SVG icons — no icon library needed */

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const SkipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5.14v13.72a1 1 0 001.5.86l9.04-6.86a1 1 0 000-1.72L6.5 4.28A1 1 0 005 5.14z" />
    <rect x="17" y="4" width="3" height="16" rx="1" />
  </svg>
);

const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 109-9" />
    <polyline points="3 3 3 9 9 9" />
  </svg>
);

/* Animation variants for button groups */
const containerVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.25, staggerChildren: 0.05 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
};

const buttonVariants = {
  enter: { opacity: 0, scale: 0.9 },
  center: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.12 } },
};

/**
 * Controls — interactive control buttons that change layout based on timer status.
 * Uses glass-button class from glass.css and Framer Motion for micro-interactions.
 */
export default function Controls({ status, onStart, onPause, onResume, onReset, onSkip }: ControlsProps) {
  return (
    <div className="flex items-center justify-center min-h-[56px]">
      <AnimatePresence mode="wait">
        {/* --- IDLE: single prominent Start button --- */}
        {status === TimerStatus.Idle && (
          <motion.div
            key="idle"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex gap-3"
          >
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="glass-button px-8 py-3 text-white/80 text-sm font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <PlayIcon />
              <span>Start Focus</span>
            </motion.button>
          </motion.div>
        )}

        {/* --- RUNNING: Pause + Skip --- */}
        {status === TimerStatus.Running && (
          <motion.div
            key="running"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex gap-3"
          >
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="glass-button px-5 py-2.5 text-white/80 text-sm font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <PauseIcon />
              <span>Pause</span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              className="glass-button px-5 py-2.5 text-white/80 text-sm font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <SkipIcon />
              <span>Skip</span>
            </motion.button>
          </motion.div>
        )}

        {/* --- PAUSED: Resume + Reset + Skip --- */}
        {status === TimerStatus.Paused && (
          <motion.div
            key="paused"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex gap-3"
          >
            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="glass-button px-5 py-2.5 text-white/80 text-sm font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <PlayIcon />
              <span>Resume</span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="glass-button px-5 py-2.5 text-white/80 text-sm font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <ResetIcon />
              <span>Reset</span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              className="glass-button px-5 py-2.5 text-white/80 text-sm font-medium flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <SkipIcon />
              <span>Skip</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
