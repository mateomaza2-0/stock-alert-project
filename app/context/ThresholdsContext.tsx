import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Thresholds = {
  low: number;
  critical: number;
};

type Value = {
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  resetToDefaults: () => void;
};

const DEFAULTS: Thresholds = { low: 10, critical: 5 };
const STORAGE_KEY = 'store:stockThresholds';

const ThresholdsContext = createContext<Value | undefined>(undefined);

export function ThresholdsProvider({ children, initial }: { children: React.ReactNode; initial?: Thresholds }) {

  const [thresholds, setThresholdsState] = useState<Thresholds>(() => initial ?? DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Thresholds;
        if (
          parsed &&
          typeof parsed.low === 'number' &&
          typeof parsed.critical === 'number' &&
          parsed.low >= 0 &&
          parsed.critical >= 0
        ) {
          setThresholdsState(parsed);
        }
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
    } catch {
    }
  }, [thresholds, hydrated]);

  const setThresholds = (t: Thresholds) => {
    const low = Math.max(0, Math.round(t.low));
    const critical = Math.max(0, Math.round(Math.min(t.critical, low)));
    setThresholdsState({ low, critical });
  };

  const resetToDefaults = () => setThresholdsState(DEFAULTS);

  const value = useMemo(() => ({ thresholds, setThresholds, resetToDefaults }), [thresholds]);

  return <ThresholdsContext.Provider value={value}>{children}</ThresholdsContext.Provider>;
}

export function useThresholds() {
  const ctx = useContext(ThresholdsContext);
  if (!ctx) throw new Error('useThresholds must be used within ThresholdsProvider');
  return ctx;
}
