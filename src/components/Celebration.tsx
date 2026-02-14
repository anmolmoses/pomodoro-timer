import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerPhase, TimerStatus, PHASE_LABELS } from '../types';
import type { PomodoroContextValue } from '../types';
import { playChime } from '../utils';

/**
 * Celebration overlay that triggers when a timer phase completes.
 * Consumes pomodoro state via props (lifted from PomodoroContext)
 * to avoid tight coupling to a specific context provider.
 *
 * Previously imported from a non-existent TimerContext — refactored
 * to accept props from the PomodoroContext consumer (App or parent).
 */

interface CelebrationProps {
  /** Current timer phase */
  phase: TimerPhase;
  /** Current timer status */
  status: TimerStatus;
  /** Total completed focus sessions (all cycles) */
  totalCompletedSessions: number;
  /** Whether sound is enabled */
  soundEnabled: boolean;
}

// Confetti particle colors matching the design system
const CONFETTI_COLORS = [
  '#8B5CF6', // primary purple
  '#EC4899', // secondary pink
  '#06B6D4', // accent cyan
  '#10B981', // green
  '#F59E0B', // amber
  '#F1E8FF', // light text
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,       // vw percentage
    y: -(Math.random() * 20 + 10), // start above viewport
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.8,
    delay: Math.random() * 0.6,
  }));
}

export default function Celebration({
  phase,
  status,
  totalCompletedSessions,
  soundEnabled,
}: CelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [particles] = useState(() => generateParticles(24));
  const [lastCelebratedSession, setLastCelebratedSession] = useState(0);

  // Detect phase completion: status goes to Idle after having been Running,
  // and totalCompletedSessions incremented
  useEffect(() => {
    if (
      totalCompletedSessions > lastCelebratedSession &&
      totalCompletedSessions > 0
    ) {
      setShowCelebration(true);
      setLastCelebratedSession(totalCompletedSessions);

      if (soundEnabled) {
        playChime();
      }

      // Auto-dismiss after 2.5 seconds
      const timer = setTimeout(() => setShowCelebration(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [totalCompletedSessions, lastCelebratedSession, soundEnabled]);

  // Determine celebration message based on sessions completed
  const getMessage = useCallback((): string => {
    if (totalCompletedSessions % 4 === 0 && totalCompletedSessions > 0) {
      return `🎉 ${totalCompletedSessions} sessions done! Time for a long break.`;
    }
    if (totalCompletedSessions === 1) {
      return '✨ First session complete! Keep it up.';
    }
    return `🔥 ${totalCompletedSessions} sessions completed!`;
  }, [totalCompletedSessions]);

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="status"
          aria-live="polite"
          aria-label="Celebration: session complete"
        >
          {/* Confetti particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-2 h-3 rounded-sm"
              style={{
                left: `${p.x}%`,
                backgroundColor: p.color,
              }}
              initial={{
                y: p.y,
                rotate: 0,
                scale: p.scale,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: p.rotation + 720,
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: 2.2,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}

          {/* Central message */}
          <motion.div
            className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl px-8 py-5 text-center"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            <p
              className="text-lg font-semibold"
              style={{ color: '#F1E8FF' }}
            >
              {getMessage()}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
