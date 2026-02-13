import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Settings, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTimer } from '../context/TimerContext';
import TimerRing from './TimerRing';
import TimerControls from './TimerControls';
import SettingsPanel from './SettingsPanel';
import StatsPanel from './StatsPanel';
import Celebration from './Celebration';
import Toast from './Toast';
import Onboarding from './Onboarding';
import MobileTabBar from './MobileTabBar';
import type { MobileTab } from '../types';

export default function Layout() {
  const { isDark, toggle } = useTheme();
  const { toast } = useKeyboard();
  const timer = useTimer();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('timer');

  const handleMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'settings') setSettingsOpen(true);
    else setSettingsOpen(false);
    if (tab === 'stats') setStatsExpanded(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center
      bg-background dark:bg-background bg-light-bg
      transition-colors duration-300">

      {/* Header */}
      <header className="w-full max-w-app flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-text-primary dark:text-text-primary text-light-text tracking-tight">
          FocusFlow
        </h1>
        <div className="flex items-center gap-2">
          {/* Stats toggle — desktop */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full
              bg-surface-elevated dark:bg-surface-elevated bg-gray-100
              text-text-muted hover:text-text-primary"
            aria-label="Toggle stats"
          >
            <BarChart2 size={18} />
          </motion.button>
          {/* Settings — desktop */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSettingsOpen(true)}
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full
              bg-surface-elevated dark:bg-surface-elevated bg-gray-100
              text-text-muted hover:text-text-primary"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </motion.button>
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center rounded-full
              bg-surface-elevated dark:bg-surface-elevated bg-gray-100
              text-text-muted hover:text-text-primary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-app flex flex-col items-center justify-center px-6 pb-20 sm:pb-6">
        {/* Timer section */}
        {(mobileTab === 'timer' || window.innerWidth >= 640) && (
          <div className="relative flex flex-col items-center">
            <TimerRing
              remaining={timer.remaining}
              total={timer.total}
              phase={timer.phase}
              state={timer.state}
            />
            <TimerControls
              state={timer.state}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
              onSkip={timer.skip}
            />
            {timer.state === 'idle' && <Onboarding />}
          </div>
        )}

        {/* Stats — desktop collapsible / mobile tab */}
        {(mobileTab === 'stats' || window.innerWidth >= 640) && (
          <div className="w-full mt-8">
            {/* Desktop: collapsible toggle */}
            <button
              onClick={() => setStatsExpanded(!statsExpanded)}
              className="hidden sm:flex items-center gap-2 text-text-muted text-sm mx-auto mb-2 hover:text-text-primary"
            >
              {statsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {statsExpanded ? 'Hide Stats' : 'Show Stats'}
            </button>
            {/* Mobile: always show on stats tab */}
            <div className="sm:hidden">
              <StatsPanel expanded={true} />
            </div>
            <div className="hidden sm:block">
              <StatsPanel expanded={statsExpanded} />
            </div>
          </div>
        )}
      </main>

      {/* Mobile tab bar */}
      <MobileTabBar activeTab={mobileTab} onChange={handleMobileTab} />

      {/* Settings slide-out */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => { setSettingsOpen(false); setMobileTab('timer'); }} />

      {/* Celebration overlay */}
      <Celebration visible={timer.celebration} sessionsCompleted={timer.sessionsCompleted} />

      {/* Keyboard toast */}
      <Toast message={toast} />
    </div>
  );
}
