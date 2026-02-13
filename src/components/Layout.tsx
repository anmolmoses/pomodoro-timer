import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useKeyboard } from '../hooks/useKeyboard';
import TimerRing from './TimerRing';
import TimerControls from './TimerControls';
import StatsPanel from './StatsPanel';
import SettingsPanel from './SettingsPanel';
import Celebration from './Celebration';
import Toast from './Toast';
import Onboarding from './Onboarding';
import MobileTabBar, { type Tab } from './MobileTabBar';

export default function Layout() {
  const { dark, toggle } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<Tab>('timer');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  useKeyboard(showToast);

  const handleMobileTab = (tab: Tab) => {
    setMobileTab(tab);
    if (tab === 'settings') setSettingsOpen(true);
    else setSettingsOpen(false);
    setStatsExpanded(tab === 'stats');
  };

  return (
    <div className="min-h-screen dark:bg-[#0F0F1A] bg-[#F5F5FA] transition-colors">
      {/* Header */}
      <header className="w-full max-w-[480px] mx-auto px-6 pt-6 flex items-center justify-between">
        <h1 className="text-xl font-bold dark:text-[#E8E8F0] text-[#1A1A2E]">
          FocusFlow
        </h1>
        <div className="flex items-center gap-2">
          {/* Stats toggle — desktop only */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatsExpanded(p => !p)}
            className="hidden md:flex w-10 h-10 rounded-lg items-center justify-center
              dark:text-[#6B6B80] text-gray-500 hover:dark:text-[#E8E8F0] hover:text-[#1A1A2E]"
            aria-label="Toggle stats"
          >
            📊
          </motion.button>
          {/* Settings — desktop only */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSettingsOpen(true)}
            className="hidden md:flex w-10 h-10 rounded-lg items-center justify-center
              dark:text-[#6B6B80] text-gray-500 hover:dark:text-[#E8E8F0] hover:text-[#1A1A2E]"
            aria-label="Settings"
          >
            ⚙️
          </motion.button>
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            className="w-10 h-10 rounded-lg flex items-center justify-center
              dark:text-[#6B6B80] text-gray-500 hover:dark:text-[#E8E8F0] hover:text-[#1A1A2E]"
            aria-label="Toggle theme"
          >
            {dark ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-[480px] mx-auto px-6 flex flex-col items-center pt-16 pb-32">
        <TimerRing />
        <TimerControls />
        <Onboarding />
        <StatsPanel expanded={statsExpanded} />
      </main>

      {/* Overlays */}
      <SettingsPanel open={settingsOpen} onClose={() => { setSettingsOpen(false); setMobileTab('timer'); }} />
      <Celebration />
      <Toast message={toast ?? ''} visible={!!toast} />
      <MobileTabBar active={mobileTab} onChange={handleMobileTab} />
    </div>
  );
}
