import React from 'react';
import { motion } from 'framer-motion';
import { TimerPhase, PHASE_COLORS } from '../types';

interface BackgroundProps {
  phase: TimerPhase;
}

/** Floating orb configuration */
const orbs = [
  { size: 450, x: [-40, 60, -20], y: [-30, 50, -10], duration: 22, left: '10%', top: '15%' },
  { size: 350, x: [30, -50, 40], y: [40, -30, 20], duration: 26, left: '60%', top: '55%' },
  { size: 300, x: [-20, 40, -30], y: [-40, 20, -50], duration: 30, left: '35%', top: '75%' },
];

export default function Background({ phase }: BackgroundProps) {
  const colors = PHASE_COLORS[phase];

  return (
    <>
      {/* Base mesh gradient */}
      <div className="bg-mesh" />

      {/* Floating orbs that change color with phase */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            zIndex: -1,
          }}
          animate={{
            x: orb.x,
            y: orb.y,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="w-full h-full rounded-full blur-3xl"
            animate={{
              backgroundColor: colors.glow,
            }}
            transition={{ duration: 2 }}
            style={{ opacity: 0.18 }}
          />
        </motion.div>
      ))}
    </>
  );
}
