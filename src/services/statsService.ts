/**
 * statsService — LocalStorage-based persistence for FocusFlow session data.
 *
 * Storage key: `focusflow_sessions`
 * Max sessions: 1000 (oldest pruned on overflow)
 */

import type { TimerSession, StatsOverview, DailyBreakdown } from '../types/timer';

const STORAGE_KEY = 'focusflow_sessions';
const MAX_SESSIONS = 1000;

// ── Helpers ──────────────────────────────────────────────────

/** Get today's local date string YYYY-MM-DD */
function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse an ISO timestamp into a local YYYY-MM-DD string */
function toLocalDate(iso: string): string {
  return getLocalDateString(new Date(iso));
}

function readSessions(): TimerSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: TimerSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ── Public API ───────────────────────────────────────────────

/**
 * Append a completed session. Prunes oldest when exceeding MAX_SESSIONS.
 */
export function saveSession(session: TimerSession): void {
  const sessions = readSessions();
  sessions.push(session);

  // Prune oldest if over limit
  if (sessions.length > MAX_SESSIONS) {
    sessions.splice(0, sessions.length - MAX_SESSIONS);
  }

  writeSessions(sessions);

  // Dispatch custom event so hooks can react without polling
  window.dispatchEvent(new CustomEvent('focusflow-session-saved'));
}

/**
 * Return all sessions, optionally filtered to the last N days (local time).
 */
export function getSessions(days?: number): TimerSession[] {
  const sessions = readSessions();
  if (days === undefined) return sessions;

  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - days + 1);

  return sessions.filter((s) => new Date(s.completedAt) >= cutoff);
}

/**
 * Aggregate stats overview.
 */
export function getStats(): StatsOverview {
  const sessions = readSessions();
  const today = getLocalDateString();

  const todaySessions = sessions.filter((s) => toLocalDate(s.completedAt) === today);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.elapsed / 60, 0);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.elapsed / 60, 0);

  // Average per day: total minutes / number of unique days with sessions (min 1)
  const uniqueDays = new Set(sessions.map((s) => toLocalDate(s.completedAt)));
  const dayCount = Math.max(uniqueDays.size, 1);

  return {
    totalSessions: sessions.length,
    totalMinutes: Math.round(totalMinutes),
    todaySessions: todaySessions.length,
    todayMinutes: Math.round(todayMinutes),
    averagePerDay: Math.round(totalMinutes / dayCount),
  };
}

/**
 * Daily breakdown aggregated by local date for charting.
 */
export function getDailyBreakdown(days: number): DailyBreakdown[] {
  const sessions = getSessions(days);

  // Build a map of date → {sessions, minutes}
  const map = new Map<string, { sessions: number; minutes: number }>();

  // Pre-fill all days so the chart always has continuous data
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getLocalDateString(d);
    map.set(key, { sessions: 0, minutes: 0 });
  }

  for (const s of sessions) {
    const key = toLocalDate(s.completedAt);
    const entry = map.get(key);
    if (entry) {
      entry.sessions += 1;
      entry.minutes += Math.round(s.elapsed / 60);
    }
  }

  return Array.from(map.entries()).map(([date, data]) => ({
    date,
    sessions: data.sessions,
    minutes: data.minutes,
  }));
}

/**
 * Consecutive days (from today backwards) with ≥1 completed work session.
 * Uses local dates.
 */
export function getCurrentStreak(): number {
  const sessions = readSessions().filter((s) => s.type === 'work' && s.completed);
  if (sessions.length === 0) return 0;

  const daysWithSessions = new Set(sessions.map((s) => toLocalDate(s.completedAt)));

  let streak = 0;
  const d = new Date();

  while (true) {
    const key = getLocalDateString(d);
    if (daysWithSessions.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Longest streak ever recorded.
 */
export function getBestStreak(): number {
  const sessions = readSessions().filter((s) => s.type === 'work' && s.completed);
  if (sessions.length === 0) return 0;

  // Get sorted unique local dates
  const dates = [...new Set(sessions.map((s) => toLocalDate(s.completedAt)))].sort();

  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}

/**
 * Wipe all session data.
 */
export function clearAll(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('focusflow-session-saved'));
}

const statsService = {
  saveSession,
  getSessions,
  getStats,
  getDailyBreakdown,
  getCurrentStreak,
  getBestStreak,
  clearAll,
};

export default statsService;
