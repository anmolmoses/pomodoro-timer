import { motion } from 'framer-motion';
import { SessionTrackerProps, TimerPhase, PHASE_COLORS } from '../types/index';

/**
 * SessionTracker — horizontal row of dots showing Pomodoro session progress.
 * Filled dots use the current phase accent color; unfilled are translucent white.
 * The next unfilled dot pulses during Focus phase.
 */
export default function SessionTracker({
  completedSessions,
  totalRequired,
  currentPhase,
}: SessionTrackerProps) {
  // Resolve the accent color for filled dots from the shared PHASE_COLORS map
  const phaseColors = PHASE_COLORS[currentPhase] ?? PHASE_COLORS[TimerPhase.Focus];
  const accentColor = phaseColors.ring;

  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: '8px' }}
      role="group"
      aria-label={`Session progress: ${completedSessions} of ${totalRequired} completed`}
    >
      {Array.from({ length: totalRequired }, (_, i) => {
        const isFilled = i < completedSessions;
        const isNext = i === completedSessions;
        const shouldPulse = isNext && currentPhase === TimerPhase.Focus;

        return (
          <motion.div
            key={i}
            /* Spring scale-up when a dot becomes filled */
            initial={false}
            animate={{
              scale: isFilled ? [1, 1.4, 1] : 1,
              backgroundColor: isFilled ? accentColor : 'rgba(255, 255, 255, 0.2)',
            }}
            transition={
              isFilled
                ? { type: 'spring', stiffness: 500, damping: 15, duration: 0.4 }
                : { duration: 0.3 }
            }
            className={`w-2.5 h-2.5 rounded-full${
              shouldPulse ? ' animate-pulse' : ''
            }`}
            style={{
              backgroundColor: isFilled ? accentColor : 'rgba(255, 255, 255, 0.2)',
              /* Subtle glow on filled dots */
              boxShadow: isFilled ? `0 0 6px ${accentColor}80` : 'none',
            }}
            aria-label={`Session ${i + 1}: ${isFilled ? 'completed' : isNext ? 'current' : 'upcoming'}`}
          />
        );
      })}
    </div>
  );
}
