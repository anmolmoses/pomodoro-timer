// DEPRECATED: Orphaned context — Layout.tsx tree used this
// Active equivalent: settings state lives in PomodoroProvider
// Kept as empty stub to avoid broken transitive imports

import React, { createContext, useContext } from 'react';

const SettingsContext = createContext<Record<string, never>>({});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  return <SettingsContext.Provider value={{}}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsProvider;
