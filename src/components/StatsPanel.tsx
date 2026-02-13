/**
 * StatsPanel — Collapsible statistics dashboard.
 *
 * Shows stat cards, a bar chart of daily focus minutes (Recharts),
 * and a scrollable list of recent sessions.
 *
 * Design: dark glassmorphism, Inter + JetBrains Mono, no card borders.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import useStats from '../hooks/useStats';

// ── Design tokens ───────────────────────────────────────────
const colors = {
  primary: '#6C5CE7',
  secondary: '#00D2D3',
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceElevated: '#252540',
  text: '#E8E8F0',
  textMuted: '#6B6B80',
  accent: '#FF6B6B',
  streak: '#FF9F43',
  success: '#2ED573',
  border: '#2A2A45',
};

const fonts = {
  heading: 'Inter, sans-serif',
  mono: 'JetBrains Mono, monospace',
};

// ── Stat Card ───────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  icon: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, color = colors.primary }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: colors.surfaceElevated,
      borderRadius: '16px',
      padding: '20px',
      flex: '1 1 0',
      minWidth: '140px',
    }}
  >
    <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
    <motion.div
      key={value}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{
        fontFamily: fonts.mono,
        fontSize: '32px',
        fontWeight: 700,
        color,
        lineHeight: 1.1,
      }}
    >
      {value}
      {unit && (
        <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textMuted, marginLeft: '4px' }}>
          {unit}
        </span>
      )}
    </motion.div>
    <div
      style={{
        fontFamily: fonts.heading,
        fontSize: '12px',
        fontWeight: 400,
        color: colors.textMuted,
        marginTop: '4px',
      }}
    >
      {label}
    </div>
  </motion.div>
);

// ── Custom Tooltip ──────────────────────────────────────────

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: colors.surfaceElevated,
        padding: '10px 14px',
        borderRadius: '10px',
        fontFamily: fonts.heading,
        fontSize: '13px',
        color: colors.text,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</div>
      <div>{payload[0].value} min</div>
    </div>
  );
};

// ── Main Panel ──────────────────────────────────────────────

interface StatsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ isOpen, onToggle }) => {
  const {
    stats,
    currentStreak,
    bestStreak,
    dailyBreakdown,
    chartDays,
    setChartDays,
    recentSessions,
  } = useStats();

  // Format chart labels: "Mon", "Tue" for 7-day, "Jan 5" for 30-day
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (chartDays <= 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = dailyBreakdown.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div
            style={{
              background: colors.surface,
              borderRadius: '20px',
              padding: '28px',
              marginTop: '24px',
              fontFamily: fonts.heading,
              color: colors.text,
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Stats</h2>
              <button
                onClick={onToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px',
                }}
                aria-label="Close stats"
              >
                ✕
              </button>
            </div>

            {/* ── Stat Cards ── */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '28px',
                flexWrap: 'wrap',
              }}
            >
              <StatCard icon="📋" label="Today's Sessions" value={stats.todaySessions} color={colors.primary} />
              <StatCard
                icon="⏱"
                label="Today's Focus"
                value={stats.todayMinutes}
                unit="min"
                color={colors.secondary}
              />
              <StatCard icon="🔥" label="Current Streak" value={currentStreak} unit="days" color={colors.streak} />
              <StatCard icon="🏆" label="Best Streak" value={bestStreak} unit="days" color={colors.accent} />
            </div>

            {/* ── Chart ── */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Daily Focus</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[7, 30].map((d) => (
                    <motion.button
                      key={d}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setChartDays(d)}
                      style={{
                        background: chartDays === d ? colors.primary : colors.surfaceElevated,
                        color: chartDays === d ? '#fff' : colors.textMuted,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: fonts.heading,
                      }}
                    >
                      {d}d
                    </motion.button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: colors.textMuted, fontSize: 11, fontFamily: fonts.heading }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: colors.textMuted, fontSize: 11, fontFamily: fonts.mono }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                    unit="m"
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(108, 92, 231, 0.08)' }} />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]} fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── Recent Sessions ── */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0' }}>Recent Sessions</h3>

              {recentSessions.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: colors.textMuted,
                    fontSize: '13px',
                    padding: '24px 0',
                  }}
                >
                  No sessions yet. Start your first focus session!
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: '240px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {recentSessions.map((s) => {
                    const time = new Date(s.completedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const date = new Date(s.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    const mins = Math.round(s.elapsed / 60);
                    const typeLabel = s.type === 'work' ? '💻' : s.type === 'break' ? '☕' : '🌴';
                    const statusColor = s.completed ? colors.success : colors.textMuted;

                    return (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: colors.surfaceElevated,
                          borderRadius: '10px',
                          padding: '12px 16px',
                          fontSize: '13px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{typeLabel}</span>
                          <span style={{ color: colors.text, fontWeight: 500 }}>
                            {date} {time}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              fontFamily: fonts.mono,
                              fontSize: '13px',
                              color: colors.text,
                            }}
                          >
                            {mins}m
                          </span>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: statusColor,
                              display: 'inline-block',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsPanel;
