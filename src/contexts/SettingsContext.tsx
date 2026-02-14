/**
 * @deprecated DEAD CODE — Orphaned context provider. Settings are managed
 * by PomodoroProvider (src/context/PomodoroProvider.tsx).
 * Stubbed to empty shells to prevent broken imports. Safe to delete.
 */
import { createContext, useContext, type ReactNode } from 'react';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface SettingsContextValue {
  settings: TimerSettings;
  updateSettings: (patch: Partial<TimerSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // No-op provider — deprecated
  return <>{children}</>;
}

export function useSettings(): SettingsContextValue {
  return {
    settings: { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, longBreakInterval: 4 },
    updateSettings: () => {},
  };
}
