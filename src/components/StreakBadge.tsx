/**
 * StreakBadge — Flame emoji + streak count.
 * Pulses when streak is active (≥1), static when broken (0).
 * Displayed prominently near the timer.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface StreakBadgeProps {
  current: number;
  best: number;
  className?: string;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ current, best, className = '' }) => {
  const isActive = current > 0;

  return (
    <div
      className={`streak-badge ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'center',
      }}
    >
      {/* Current streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <motion.span
          className={isActive ? 'flame-active' : 'flame-static'}
          animate={
            isActive
              ? {
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.8, 1],
                }
              : {}
          }
          transition={
            isActive
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {}
          }
          style={{ fontSize: '24px', display: 'inline-block' }}
        >
          🔥
        </motion.span>
        <motion.span
          key={current}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '20px',
            fontWeight: 700,
            color: isActive ? '#FF9F43' : '#6B6B80',
          }}
        >
          {current} {current === 1 ? 'day' : 'days'}
        </motion.span>
      </div>

      {/* Best streak — subtle */}
      {best > 0 && (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#6B6B80',
          }}
        >
          🏆 Best: {best}
        </span>
      )}
    </div>
  );
};

export default StreakBadge;
