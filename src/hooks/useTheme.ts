import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'focusflow-theme';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? stored === 'dark' : true; // default dark
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = useCallback(() => setDark(prev => !prev), []);

  return { dark, toggle };
}
