import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useTimer } from '../context/TimerContext';

interface StatsPanelProps {
  expanded: boolean;
}

export default function StatsPanel({ expanded }: StatsPanelProps) {
  const { sessionsCompleted, streak } = useTimer();
  const totalMinutes = sessionsCompleted * 25; // approximate

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-4 p-4">
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-mono text-stat text-primary">{sessionsCompleted}</p>
              <p className="text-xs text-text-muted mt-1">Sessions</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-mono text-stat text-secondary">{totalMinutes}</p>
              <p className="text-xs text-text-muted mt-1">Minutes</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center relative">
              <div className="flex items-center justify-center gap-1">
                <p className="font-mono text-stat text-streak">{streak}</p>
                {streak > 0 && (
                  <Flame size={20} className="text-streak animate-flame" />
                )}
              </div>
              <p className="text-xs text-text-muted mt-1">Streak</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
