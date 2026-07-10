import { useState, useEffect } from 'react';

/**
 * A hook that syncs state with localStorage.
 *
 * - Lazy-initialises from localStorage on mount
 * - Persists on every change via useEffect
 * - Catches JSON.parse failures gracefully, falling back to defaultValue
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved) as T;
      }
    } catch {
      // JSON parse failure — use default
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
