import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionCompleteProps {
  sessionCount: number;
  visible: boolean;
  onDismiss: () => void;
}

const CONFETTI_COLORS = [
  '#6C5CE7', '#00D2D3', '#FF6B6B', '#F9CA24',
  '#FF9F43', '#2ED573', '#A29BFE', '#FD79A8',
];

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 120 + Math.random() * 180;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 6 + Math.random() * 10,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
    };
  });
}

export default function SessionComplete({ sessionCount, visible, onDismiss }: SessionCompleteProps) {
  const [particles] = useState(() => generateParticles(20));

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  const handleClick = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="session-complete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            background: 'rgba(15, 15, 26, 0.7)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
          }}
        >
          {/* Confetti particles */}
          <div style={{ position: 'absolute', width: 0, height: 0 }}>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [0, 1.2, 1, 0.5],
                  opacity: [1, 1, 0.8, 0],
                  rotate: p.rotation,
                }}
                transition={{
                  duration: 1.5,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', damping: 15 }}
            style={{
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: '48px', marginBottom: '16px' }}
            >
              🎉
            </motion.div>

            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#E8E8F0',
                margin: '0 0 8px 0',
              }}
            >
              Session Complete!
            </h2>

            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '32px',
                fontWeight: 700,
                color: '#6C5CE7',
                margin: '0 0 4px 0',
              }}
            >
              #{sessionCount}
            </p>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#6B6B80',
                margin: 0,
              }}
            >
              Tap anywhere to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
