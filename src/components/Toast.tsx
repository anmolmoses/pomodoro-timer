import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast notification — kept functional as it has no orphaned dependencies
 * and could be reused. Currently only referenced by Layout.tsx (deprecated).
 */
export default function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
            bg-white/10 backdrop-blur-xl border border-white/20 text-[#F1E8FF]
            px-4 py-2 rounded-full text-sm shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
