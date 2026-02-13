import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'focusflow-onboarded';

export default function Onboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={dismiss}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-30
            px-4 py-2 rounded-xl glass-card
            text-sm text-text-primary font-medium whitespace-nowrap
            cursor-pointer shadow-lg"
        >
          Press <kbd className="font-mono bg-surface-elevated px-1.5 py-0.5 rounded text-primary mx-1">Space</kbd> or tap ▶ to begin
        </motion.div>
      )}
    </AnimatePresence>
  );
}
