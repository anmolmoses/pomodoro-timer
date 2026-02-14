import { PomodoroSettings, DEFAULT_SETTINGS, TimerPhase, PHASE_LABELS } from '../types';

const STORAGE_KEY = 'pomodoro-settings';

// ---- Time Formatting ----

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

// ---- Settings Persistence ----

export function loadSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: PomodoroSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// ---- Duration Lookup ----

export function getPhaseDuration(phase: TimerPhase, settings: PomodoroSettings): number {
  switch (phase) {
    case TimerPhase.Focus: return minutesToSeconds(settings.focusDuration);
    case TimerPhase.ShortBreak: return minutesToSeconds(settings.shortBreakDuration);
    case TimerPhase.LongBreak: return minutesToSeconds(settings.longBreakDuration);
    default: return 0;
  }
}

// ---- Next Phase Logic ----

export function getNextPhase(currentPhase: TimerPhase, completedSessions: number, longBreakInterval: number): TimerPhase {
  if (currentPhase === TimerPhase.Focus) {
    return (completedSessions + 1) % longBreakInterval === 0
      ? TimerPhase.LongBreak
      : TimerPhase.ShortBreak;
  }
  return TimerPhase.Focus;
}

// ---- Notifications ----

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotification(phase: TimerPhase): void {
  if (Notification.permission !== 'granted') return;
  const label = PHASE_LABELS[phase];
  new Notification('Pomodoro Timer', {
    body: `${label} session complete!`,
    icon: '/favicon.ico',
  });
}

// ---- Audio ----

let audioCtx: AudioContext | null = null;

export function playChime(): void {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  } catch {
    // Silent fail — audio not critical
  }
}
