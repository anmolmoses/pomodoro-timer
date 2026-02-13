import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import type { TimerSettings } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Stepper({ label, value, min = 1, max = 120, step = 1, unit = 'min', onChange }: StepperProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm font-medium text-text-primary dark:text-text-primary text-light-text">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-elevated dark:bg-surface-elevated bg-gray-100 text-text-muted hover:text-text-primary min-w-[44px] min-h-[44px]"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={16} />
        </motion.button>
        <span className="font-mono text-lg font-bold w-16 text-center text-text-primary dark:text-text-primary text-light-text">
          {value}<span className="text-xs text-text-muted ml-0.5">{unit}</span>
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-elevated dark:bg-surface-elevated bg-gray-100 text-text-muted hover:text-text-primary min-w-[44px] min-h-[44px]"
          aria-label={`Increase ${label}`}
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();

  const items: { key: keyof TimerSettings; label: string; unit?: string; max?: number }[] = [
    { key: 'workDuration', label: 'Work Duration' },
    { key: 'shortBreakDuration', label: 'Short Break' },
    { key: 'longBreakDuration', label: 'Long Break' },
    { key: 'longBreakInterval', label: 'Long Break After', unit: 'sessions', max: 12 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35, duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50
              bg-background dark:bg-background bg-light-bg
              shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-text-primary dark:text-text-primary text-light-text">
                  Settings
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-elevated dark:bg-surface-elevated bg-gray-100 text-text-muted hover:text-text-primary min-w-[44px] min-h-[44px]"
                  aria-label="Close settings"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="divide-y divide-border dark:divide-border divide-gray-200">
                {items.map(({ key, label, unit, max }) => (
                  <Stepper
                    key={key}
                    label={label}
                    value={settings[key]}
                    unit={unit}
                    max={max}
                    onChange={(v) => updateSettings({ [key]: v })}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
