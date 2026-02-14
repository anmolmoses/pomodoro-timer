import React, { useState } from 'react';
import { PomodoroProvider } from './context/PomodoroContext';
import TimerRing from './components/TimerRing';
import Controls from './components/Controls';
import SessionTracker from './components/SessionTracker';
import SettingsModal from './components/SettingsModal';
import { usePomodoroContext } from './context/PomodoroContext';
import { PHASE_COLORS, TimerPhase } from './types';
import './styles/glass.css';

/**
 * Inner app content that consumes PomodoroContext.
 */
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

  const colors = PHASE_COLORS[state.phase];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Animated mesh background */}
      <div className="bg-mesh" />

      {/* Main timer card */}
      <div className="glass p-8 sm:p-12 flex flex-col items-center gap-6 w-full max-w-md relative z-10">
        {/* Phase label */}
        <h1
          className="text-lg font-medium uppercase tracking-wider"
          style={{ color: colors.ring }}
        >
          {phaseLabel}
        </h1>

        {/* Timer ring */}
        <TimerRing
          progress={progress}
          phase={state.phase}
          displayTime={displayTime}
          phaseLabel={phaseLabel}
          status={state.status}
        />

        {/* Controls */}
        <Controls
          status={state.status}
          phase={state.phase}
          onStart={start}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          onSkip={skip}
        />

        {/* Session tracker */}
        <SessionTracker
          completedSessions={state.completedSessions}
          totalRequired={settings.longBreakInterval}
          currentPhase={state.phase}
        />

        {/* Settings button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="glass-button px-4 py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
          aria-label="Open settings"
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Settings modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />
    </div>
  );
}

/**
 * Root App component — wraps everything in the Pomodoro provider.
 */
export default function App() {
  return (
    <PomodoroProvider>
      <AppContent />
    </PomodoroProvider>
  );
}
