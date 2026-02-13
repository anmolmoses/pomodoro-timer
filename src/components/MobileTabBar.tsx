import { motion } from 'framer-motion';

export type Tab = 'timer' | 'stats' | 'settings';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'timer', label: 'Timer', icon: '⏱' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function MobileTabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-30
      dark:bg-[#1A1A2E] bg-white border-t dark:border-[#2A2A45] border-gray-200">
      <div className="flex justify-around py-2">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center min-w-[44px] min-h-[44px] justify-center px-3 py-1 rounded-lg ${
              active === tab.id
                ? 'dark:text-[#6C5CE7] text-[#6C5CE7]'
                : 'dark:text-[#6B6B80] text-gray-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
