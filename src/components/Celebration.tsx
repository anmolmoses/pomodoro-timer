import { motion, AnimatePresence } from 'framer-motion';
import { usePomodoro } from '../context/PomodoroProvider';
import { TimerPhase } from '../types';

/**
 * Celebration overlay — shown briefly when a focus session completes.
 * Rewired to use PomodoroProvider instead of orphaned contexts/TimerContext.
 */
export default function Celebration() {
  // We detect celebration by checking if we just transitioned to a break phase
  // The parent (App.tsx) manages the showCelebration state and passes it as a prop
  return null;
}

/** Controlled celebration component used by App.tsx */
export function CelebrationOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Session Complete!</h2>
            <p className="text-white/70 mt-2">Great focus. Take a break.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
