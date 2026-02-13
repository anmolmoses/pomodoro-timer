import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50
            px-4 py-2 rounded-full glass-card
            text-sm text-text-primary font-medium
            shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
