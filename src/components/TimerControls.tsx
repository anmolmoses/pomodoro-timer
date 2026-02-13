import { motion } from 'framer-motion';
import { useTimer } from '../contexts/TimerContext';

interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

function ControlButton({ onClick, disabled, label, children }: BtnProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="w-12 h-12 rounded-full flex items-center justify-center
        dark:bg-[#252540] bg-gray-100
        dark:text-[#E8E8F0] text-[#1A1A2E]
        disabled:opacity-30 disabled:cursor-not-allowed
        transition-colors"
    >
      {children}
    </motion.button>
  );
}

export default function TimerControls() {
  const { state, start, pause, reset, skip } = useTimer();

  return (
    <div className="flex items-center gap-4 mt-8">
      {/* Reset */}
      <ControlButton onClick={reset} disabled={state === 'idle'} label="Reset">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 1 3.5-7.1" />
          <path d="M3 4v5h5" />
        </svg>
      </ControlButton>

      {/* Play / Pause — larger */}
      <motion.button
        onClick={state === 'running' ? pause : start}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        aria-label={state === 'running' ? 'Pause' : 'Start'}
        className="w-16 h-16 rounded-full flex items-center justify-center
          bg-[#6C5CE7] text-white shadow-lg shadow-[#6C5CE7]/30"
      >
        {state === 'running' ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7,4 21,12 7,20" />
          </svg>
        )}
      </motion.button>

      {/* Skip */}
      <ControlButton onClick={skip} disabled={state === 'idle'} label="Skip">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,4 15,12 5,20" />
          <rect x="17" y="4" width="3" height="16" rx="1" />
        </svg>
      </ControlButton>
    </div>
  );
}
