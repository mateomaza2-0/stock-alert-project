import { useMemo } from 'react';

const MEMORY_CACHE = new Map<string, number>();
const STORAGE_PREFIX = 'mockInv:';

function djb2(key: string) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) + h) + key.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickDeterministic(values: number[], key: string, bias = 0) {
  const h = djb2(key);
  const p = (h % 10000) / 10000;
  const pBiased = Math.pow(p, 1 + Math.max(0, bias));
  const idx = Math.floor(pBiased * values.length) % values.length;
  return values[idx];
}

export function useMockInventory(
  variantKey: string | number | undefined,
  stockValues: number[],
  opts?: { persist?: boolean; bias?: number }
) {
  const persist = opts?.persist ?? false;
  const bias = opts?.bias ?? 0;

  return useMemo(() => {
    const key = String(variantKey ?? 'mock-fallback');

    const cached = MEMORY_CACHE.get(key);
    if (typeof cached === 'number') return cached;

    if (persist && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
        if (raw != null) {
          const parsed = Number(raw);
          if (!Number.isNaN(parsed) && stockValues.includes(parsed)) {
            MEMORY_CACHE.set(key, parsed);
            return parsed;
          } else {
            console.warn(`[useMockInventory] invalid saved mockInv for ${key}:`, raw, '→ will re-pick');
            window.localStorage.removeItem(STORAGE_PREFIX + key);
          }
        }
      } catch (e) {
      }
    }

    const picked = pickDeterministic(stockValues, key, bias);

    MEMORY_CACHE.set(key, picked);
    if (persist && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_PREFIX + key, String(picked));
      } catch {
      }
    }

    return picked;
  }, [variantKey, persist, bias, stockValues]);
}

export default useMockInventory;
