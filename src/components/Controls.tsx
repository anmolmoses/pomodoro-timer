import { motion, AnimatePresence } from 'framer-motion';
import { ControlsProps, TimerStatus, TimerPhase, PHASE_COLORS } from '../types/index';
import '../styles/glass.css';

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.5 3.5v13l10-6.5z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <rect x="5" y="3" width="3.5" height="14" rx="1" />
    <rect x="11.5" y="3" width="3.5" height="14" rx="1" />
  </svg>
);

const SkipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 3.5v13l8-6.5z" />
    <rect x="13" y="3.5" width="3" height="13" rx="1" />
  </svg>
);

const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 10a6 6 0 1 1 1.5 4" strokeLinecap="round" />
    <path d="M4 14V10h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const buttonVariants = {
  initial: { opacity: 0, y: 10, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.9 },
};

const transition = { duration: 0.2, ease: 'easeOut' };

interface GlassButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  large?: boolean;
  phase?: TimerPhase;
}

function GlassButton({ onClick, icon, label, large, phase }: GlassButtonProps) {
  const glowColor = phase ? PHASE_COLORS[phase].glow : 'rgba(139,92,246,0.3)';
  const ringColor = phase ? PHASE_COLORS[phase].ring : '#8B5CF6';

  return (
    <motion.button
      className={`glass-button flex items-center justify-center gap-2 text-white/80 text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
        ${large ? 'px-8 py-4 text-base' : 'px-5 py-3'}`}
      style={{
        boxShadow: `0 0 20px ${glowColor}`,
        // @ts-expect-error CSS custom property
        '--tw-ring-color': ringColor,
      } as React.CSSProperties}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

export default function Controls({ status, phase, onStart, onPause, onResume, onReset, onSkip }: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 min-h-[56px]">
      <AnimatePresence mode="wait">
        {status === TimerStatus.Idle && (
          <motion.div key="idle" className="flex gap-3" layout>
            <GlassButton
              onClick={onStart}
              icon={<PlayIcon />}
              label="Start Focus"
              large
              phase={TimerPhase.Focus}
            />
          </motion.div>
        )}

        {status === TimerStatus.Running && (
          <motion.div key="running" className="flex gap-3" layout>
            <GlassButton onClick={onPause} icon={<PauseIcon />} label="Pause" phase={phase} />
            <GlassButton onClick={onSkip} icon={<SkipIcon />} label="Skip" phase={phase} />
          </motion.div>
        )}

        {status === TimerStatus.Paused && (
          <motion.div key="paused" className="flex gap-3" layout>
            <GlassButton onClick={onResume} icon={<PlayIcon />} label="Resume" phase={phase} />
            <GlassButton onClick={onReset} icon={<ResetIcon />} label="Reset" phase={phase} />
            <GlassButton onClick={onSkip} icon={<SkipIcon />} label="Skip" phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
