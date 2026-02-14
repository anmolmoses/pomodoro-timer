/**
 * SettingsModal — glassmorphic modal for configuring timer settings.
 * Slide-up sheet on mobile, fade-scale on desktop.
 * Uses shared SettingsModalProps.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsModalProps, PomodoroSettings } from '../types';

export default function SettingsModal({ isOpen, onClose, settings, onUpdate }: SettingsModalProps) {
  const [local, setLocal] = useState<PomodoroSettings>(settings);

  // Sync when modal opens
  useEffect(() => {
    if (isOpen) setLocal(settings);
  }, [isOpen, settings]);

  const handleSave = () => {
    onUpdate(local);
    onClose();
  };

  const set = <K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[440px] glass p-6"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <h2 className="text-lg font-semibold text-white mb-5">Settings</h2>

            <div className="space-y-4">
              {/* Duration inputs */}
              <NumberField label="Focus (min)" value={local.focusDuration} onChange={(v) => set('focusDuration', v)} min={1} max={120} />
              <NumberField label="Short Break (min)" value={local.shortBreakDuration} onChange={(v) => set('shortBreakDuration', v)} min={1} max={30} />
              <NumberField label="Long Break (min)" value={local.longBreakDuration} onChange={(v) => set('longBreakDuration', v)} min={1} max={60} />
              <NumberField label="Sessions before long break" value={local.longBreakInterval} onChange={(v) => set('longBreakInterval', v)} min={2} max={10} />

              {/* Toggles */}
              <Toggle label="Auto-start breaks" checked={local.autoStartBreaks} onChange={(v) => set('autoStartBreaks', v)} />
              <Toggle label="Auto-start focus" checked={local.autoStartFocus} onChange={(v) => set('autoStartFocus', v)} />
              <Toggle label="Notifications" checked={local.notificationsEnabled} onChange={(v) => set('notificationsEnabled', v)} />
              <Toggle label="Sound" checked={local.soundEnabled} onChange={(v) => set('soundEnabled', v)} />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="glass-button flex-1 py-2.5 text-white/70 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="glass-button flex-1 py-2.5 bg-purple-500/30 border-purple-400/30 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Sub-components ---

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-white/70">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
        min={min}
        max={max}
        className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent ${
          checked ? 'bg-purple-500' : 'bg-white/20'
        }`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
