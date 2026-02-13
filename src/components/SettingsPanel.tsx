import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

function Stepper({ label, value, min = 1, max = 120, onChange }: StepperProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm dark:text-[#E8E8F0] text-[#1A1A2E]">{label}</span>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-11 h-11 rounded-lg dark:bg-[#1A1A2E] bg-gray-200 flex items-center justify-center
            dark:text-[#E8E8F0] text-[#1A1A2E] text-lg font-bold"
        >
          −
        </motion.button>
        <span className="w-12 text-center font-mono text-lg dark:text-[#E8E8F0] text-[#1A1A2E] tabular-nums">
          {value}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-11 h-11 rounded-lg dark:bg-[#1A1A2E] bg-gray-200 flex items-center justify-center
            dark:text-[#E8E8F0] text-[#1A1A2E] text-lg font-bold"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

export default function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useSettings();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50
              dark:bg-[#1A1A2E] bg-white
              shadow-2xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-[#E8E8F0] text-[#1A1A2E]">Settings</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-lg dark:text-[#6B6B80] text-gray-500 flex items-center justify-center text-xl"
              >
                ✕
              </motion.button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider dark:text-[#6B6B80] text-gray-500 mb-2">Durations (minutes)</h3>
              <Stepper label="Work" value={settings.workDuration} onChange={v => updateSettings({ workDuration: v })} />
              <Stepper label="Short Break" value={settings.shortBreakDuration} onChange={v => updateSettings({ shortBreakDuration: v })} />
              <Stepper label="Long Break" value={settings.longBreakDuration} onChange={v => updateSettings({ longBreakDuration: v })} />
              <Stepper label="Long Break Interval" value={settings.longBreakInterval} min={2} max={10} onChange={v => updateSettings({ longBreakInterval: v })} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
