import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsModalProps, PomodoroSettings } from '../types';

/** Toggle switch component */
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <span className="text-sm text-white/80 group-hover:text-white transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ${
          checked
            ? 'bg-rose-500/60 border-rose-400/40'
            : 'bg-white/10 border-white/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

/** Range slider component */
function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/80">{label}</span>
        <span className="text-sm font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded-md">
          {value}{unit && ` ${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose, settings, onUpdate }: SettingsModalProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const update = <K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) => {
    onUpdate({ [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card */}
          <motion.div
            className="glass relative w-full max-w-md max-h-[85vh] overflow-y-auto p-6 z-10"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            {/* Duration sliders */}
            <div className="space-y-1 mb-6">
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-3">Durations</h3>
              <Slider
                label="Focus Duration"
                value={settings.focusDuration}
                min={1}
                max={60}
                unit="min"
                onChange={(v) => update('focusDuration', v)}
              />
              <Slider
                label="Short Break"
                value={settings.shortBreakDuration}
                min={1}
                max={30}
                unit="min"
                onChange={(v) => update('shortBreakDuration', v)}
              />
              <Slider
                label="Long Break"
                value={settings.longBreakDuration}
                min={1}
                max={60}
                unit="min"
                onChange={(v) => update('longBreakDuration', v)}
              />
              <Slider
                label="Sessions before long break"
                value={settings.longBreakInterval}
                min={1}
                max={10}
                onChange={(v) => update('longBreakInterval', v)}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-1">
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/50 mb-3">Preferences</h3>
              <Toggle
                label="Auto-start breaks"
                checked={settings.autoStartBreaks}
                onChange={(v) => update('autoStartBreaks', v)}
              />
              <Toggle
                label="Auto-start focus"
                checked={settings.autoStartFocus}
                onChange={(v) => update('autoStartFocus', v)}
              />
              <Toggle
                label="Notifications"
                checked={settings.notificationsEnabled}
                onChange={(v) => update('notificationsEnabled', v)}
              />
              <Toggle
                label="Sound"
                checked={settings.soundEnabled}
                onChange={(v) => update('soundEnabled', v)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
