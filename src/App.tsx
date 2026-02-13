import React from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { TimerProvider } from './context/TimerContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <SettingsProvider>
      <TimerProvider>
        <Layout />
      </TimerProvider>
    </SettingsProvider>
  );
}
