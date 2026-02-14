/**
 * App.tsx — root component.
 * Mounts PomodoroProvider as the SINGLE context provider.
 * No Layout.tsx, no separate SettingsProvider or TimerProvider.
 * All components consume PomodoroContext directly.
 */
import React, { useState } from 'react';
import { PomodoroProvider, usePomodoroContext } from './context/PomodoroContext';
import TimerRing from './components/TimerRing';
import Controls from './components/Controls';
import SessionTracker from './components/SessionTracker';
import SettingsModal from './components/SettingsModal';
import { useKeyboard } from './hooks/useKeyboard';
import './styles/glass.css';

/** Inner app that consumes the Pomodoro context */
function AppContent() {
  const {
    state,
    settings,
    progress,
    displayTime,
    phaseLabel,
    start,
    pause,
    resume,
    reset,
    skip,
    updateSettings,
  } = usePomodoroContext();

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboard();

  return (
    <div className="bg-mesh">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Main timer card */}
        <div className="glass p-8 md:p-12 flex flex-col items-center max-w-md w-full">
          <TimerRing
            progress={progress}
            phase={state.phase}
            displayTime={displayTime}
            phaseLabel={phaseLabel}
            status={state.status}
          />

          <Controls
            status={state.status}
            phase={state.phase}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
            onSkip={skip}
          />

          <SessionTracker
            completedSessions={state.completedSessions}
            totalRequired={settings.longBreakInterval}
            currentPhase={state.phase}
          />
        </div>

        {/* Settings button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="mt-6 glass-button px-4 py-2 text-white/50 text-sm hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Open settings"
        >
          <SettingsIcon /> Settings
        </button>

        {/* Settings modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onUpdate={updateSettings}
        />
      </div>
    </div>
  );
}

/** Root — wraps everything in PomodoroProvider */
export default function App() {
  return (
    <PomodoroProvider>
      <AppContent />
    </PomodoroProvider>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1.5">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z" />
    </svg>
  );
}
