import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'focusflow-onboarded';

/** First-visit onboarding hint — no context dependencies */
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
          className="mt-4 px-4 py-3 rounded-2xl
            bg-white/8 backdrop-blur-lg border border-white/15
            text-[#F1E8FF] text-sm cursor-pointer
            max-w-xs text-center"
        >
          Press <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-xs">Space</kbd> or tap ▶ to begin
        </motion.div>
      )}
    </AnimatePresence>
  );
}
