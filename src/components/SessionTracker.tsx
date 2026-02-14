import React from 'react';
import { motion } from 'framer-motion';
import { SessionTrackerProps, TimerPhase, PHASE_COLORS } from '../types/index';

export default function SessionTracker({ completedSessions, totalRequired, currentPhase }: SessionTrackerProps) {
  const colors = PHASE_COLORS[currentPhase] || PHASE_COLORS[TimerPhase.Idle];

  return (
    <div
      className="flex justify-center items-center mt-4"
      role="group"
      aria-label={`Session progress: ${completedSessions} of ${totalRequired} completed`}
      style={{ gap: '8px' }}
    >
      {Array.from({ length: totalRequired }, (_, i) => {
        const isFilled = i < completedSessions;
        const isNext = i === completedSessions && currentPhase === TimerPhase.Focus;

        return (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${isNext ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: isFilled ? colors.ring : 'rgba(255,255,255,0.2)',
              boxShadow: isFilled ? `0 0 8px ${colors.glow}` : 'none',
            }}
            /* Use tween with explicit keyframes for the fill "pop" animation */
            animate={
              isFilled
                ? { scale: [1, 1.4, 1], transition: { duration: 0.4, ease: 'easeOut', times: [0, 0.5, 1] } }
                : { scale: 1 }
            }
            aria-label={`Session ${i + 1}: ${isFilled ? 'completed' : isNext ? 'in progress' : 'pending'}`}
          />
        );
      })}
    </div>
  );
}
