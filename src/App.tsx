import { SettingsProvider } from './contexts/SettingsContext';
import { TimerProvider } from './contexts/TimerContext';
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
