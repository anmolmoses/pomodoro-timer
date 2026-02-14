import React from 'react';
import { motion } from 'framer-motion';
import { SessionTrackerProps, TimerPhase } from '../types';

export default function SessionTracker({
  completedSessions,
  totalRequired,
  currentPhase,
}: SessionTrackerProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalRequired }, (_, i) => {
        const isCompleted = i < completedSessions;
        const isCurrent = i === completedSessions && currentPhase === TimerPhase.Focus;

        return (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full border transition-colors duration-300 ${
              isCompleted
                ? 'bg-rose-500 border-rose-400'
                : isCurrent
                ? 'bg-white/30 border-white/50 animate-pulse'
                : 'bg-white/10 border-white/20'
            }`}
            initial={false}
            animate={isCompleted ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        );
      })}
      <span className="ml-2 text-xs text-white/50 font-mono">
        {completedSessions}/{totalRequired}
      </span>
    </div>
  );
}
