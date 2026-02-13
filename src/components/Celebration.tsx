import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationProps {
  visible: boolean;
  sessionsCompleted: number;
}

export default function Celebration({ visible, sessionsCompleted }: CelebrationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-center p-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 1 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-text-muted text-lg">
              {sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''} done — keep it up!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
