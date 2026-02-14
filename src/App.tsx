import React, { useState } from 'react';
import { PomodoroProvider, usePomodoro } from './context/PomodoroProvider';
import Background from './components/Background';
import TimerRing from './components/TimerRing';
import Controls from './components/Controls';
import SessionTracker from './components/SessionTracker';
import SettingsModal from './components/SettingsModal';
import Celebration from './components/Celebration';
import Toast from './components/Toast';

/** Gear icon SVG */
function GearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Inner app content that consumes the Pomodoro context */
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
  } = usePomodoro();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  /** Show a toast notification for a short duration */
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  return (
    <>
      <Background phase={state.phase} />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Settings gear button — top right */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="fixed top-4 right-4 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-200 text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Open settings"
        >
          <GearIcon />
        </button>

        {/* Main card */}
        <div className="glass w-full max-w-md p-6 sm:p-8 flex flex-col items-center gap-6">
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
      </div>

      {/* Celebration overlay on session complete */}
      <Celebration
        phase={state.phase}
        status={state.status}
        totalCompletedSessions={state.totalCompletedSessions}
        soundEnabled={settings.soundEnabled}
      />

      {/* Toast notifications */}
      <Toast message={toast.message} visible={toast.visible} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />
    </>
  );
}

export default function App() {
  return (
    <PomodoroProvider>
      <AppContent />
    </PomodoroProvider>
  );
}
