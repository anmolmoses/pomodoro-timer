import { useState, useEffect } from 'react';
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
          className="mt-6 px-4 py-3 rounded-xl dark:bg-[#252540] bg-gray-100
            dark:text-[#E8E8F0] text-[#1A1A2E] text-sm cursor-pointer
            max-w-xs text-center"
        >
          Press <kbd className="font-mono dark:bg-[#1A1A2E] bg-gray-200 px-1.5 py-0.5 rounded text-xs">Space</kbd> or tap ▶ to begin
        </motion.div>
      )}
    </AnimatePresence>
  );
}
