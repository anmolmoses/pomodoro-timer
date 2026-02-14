import { motion } from 'framer-motion';
import { SessionTrackerProps, TimerPhase, PHASE_COLORS } from '../types/index';

export default function SessionTracker({ completedSessions, totalRequired, currentPhase }: SessionTrackerProps) {
  const accentColor = PHASE_COLORS[currentPhase].ring;

  return (
    <div className="flex items-center justify-center gap-2" role="group" aria-label={`Session progress: ${completedSessions} of ${totalRequired} completed`}>
      {Array.from({ length: totalRequired }, (_, i) => {
        const filled = i < completedSessions;
        const isNext = !filled && i === completedSessions && currentPhase === TimerPhase.Focus;

        return (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${isNext ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: filled ? accentColor : 'rgba(255,255,255,0.2)',
            }}
            initial={false}
            animate={
              filled
                ? { scale: [1, 1.4, 1], backgroundColor: accentColor }
                : { scale: 1, backgroundColor: 'rgba(255,255,255,0.2)' }
            }
            transition={
              filled
                ? { type: 'spring', stiffness: 500, damping: 15 }
                : { duration: 0.2 }
            }
            aria-label={filled ? `Session ${i + 1}: complete` : `Session ${i + 1}: pending`}
          />
        );
      })}
    </div>
  );
}
