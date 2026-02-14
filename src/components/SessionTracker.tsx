/**
 * SessionTracker — shows completed focus sessions as dots.
 * Uses shared SessionTrackerProps. Dot fill uses clipPath wipe animation.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { SessionTrackerProps, TimerPhase } from '../types';

export default function SessionTracker({ completedSessions, totalRequired, currentPhase }: SessionTrackerProps) {
  return (
    <div className="flex items-center gap-2 mt-6">
      {Array.from({ length: totalRequired }, (_, i) => {
        const filled = i < completedSessions;
        const active = i === completedSessions && currentPhase === TimerPhase.Focus;

        return (
          <motion.div
            key={i}
            className="relative w-3 h-3 rounded-full border border-white/30"
            animate={{
              scale: active ? [1, 1.2, 1] : 1,
            }}
            transition={{
              repeat: active ? Infinity : 0,
              duration: 2,
            }}
          >
            {/* Fill layer with clip wipe */}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-400"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{
                clipPath: filled ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </motion.div>
        );
      })}
      <span className="text-xs text-white/40 ml-2 font-medium">
        {completedSessions}/{totalRequired}
      </span>
    </div>
  );
}
