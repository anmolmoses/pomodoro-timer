import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../contexts/TimerContext';
import { useSettings } from '../contexts/SettingsContext';

export default function StatsPanel({ expanded }: { expanded: boolean }) {
  const { sessionsCompleted } = useTimer();
  const { settings } = useSettings();
  const totalMinutes = sessionsCompleted * settings.workDuration;

  const stats = [
    { label: 'Sessions', value: sessionsCompleted },
    { label: 'Minutes', value: totalMinutes },
    { label: 'Streak', value: `${sessionsCompleted}🔥` },
  ];

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden w-full max-w-md mt-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl dark:bg-[#252540] bg-gray-50 p-4 text-center">
                <div className="font-mono text-2xl font-bold dark:text-[#E8E8F0] text-[#1A1A2E] tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs dark:text-[#6B6B80] text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
