import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart2, Settings } from 'lucide-react';
import type { MobileTab } from '../types';

interface MobileTabBarProps {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
}

const tabs: { id: MobileTab; icon: typeof Clock; label: string }[] = [
  { id: 'timer', icon: Clock, label: 'Timer' },
  { id: 'stats', icon: BarChart2, label: 'Stats' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function MobileTabBar({ activeTab, onChange }: MobileTabBarProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40
      bg-surface dark:bg-surface bg-light-surface
      border-t border-border dark:border-border border-gray-200
      flex items-center justify-around h-16 safe-area-pb">
      {tabs.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(id)}
          className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-4 py-2
            ${activeTab === id ? 'text-primary' : 'text-text-muted'}
          `}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
