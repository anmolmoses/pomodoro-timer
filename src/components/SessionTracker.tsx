import React from 'react';
import { motion } from 'framer-motion';
import { SessionTrackerProps, TimerPhase, PHASE_COLORS } from '../types/index';

const SessionTracker: React.FC<SessionTrackerProps> = ({
  completedSessions,
  totalRequired,
  currentPhase,
}) => {
  const accentColor = PHASE_COLORS[currentPhase].ring;

  return (
    <div
      className="flex items-center justify-center gap-2"
      role="group"
      aria-label={`Session progress: ${completedSessions} of ${totalRequired} completed`}
    >
      {Array.from({ length: totalRequired }, (_, i) => {
        const isFilled = i < completedSessions;
        const isNext =
          i === completedSessions && currentPhase === TimerPhase.Focus;

        return (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              isNext ? 'animate-pulse' : ''
            }`}
            style={{
              backgroundColor: isFilled ? accentColor : 'rgba(255,255,255,0.2)',
            }}
            initial={false}
            animate={
              isFilled
                ? { scale: [1, 1.4, 1], backgroundColor: accentColor }
                : { scale: 1 }
            }
            transition={
              isFilled
                ? { type: 'spring', stiffness: 400, damping: 15 }
                : { duration: 0.2 }
            }
            aria-label={`Session ${i + 1}: ${
              isFilled ? 'completed' : isNext ? 'in progress' : 'pending'
            }`}
          />
        );
      })}
    </div>
  );
};

export default SessionTracker;
