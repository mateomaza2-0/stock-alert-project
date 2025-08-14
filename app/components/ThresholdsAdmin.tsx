import React, { useState } from 'react';

import { useThresholds } from '~/context/ThresholdsContext';

export default function ThresholdsAdmin({ className }: { className?: string }) {
  const { thresholds, setThresholds, resetToDefaults } = useThresholds();
  const [form, setForm] = useState({ low: thresholds.low, critical: thresholds.critical });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const low = Number(form.low);
    const critical = Number(form.critical);
    if (Number.isNaN(low) || Number.isNaN(critical)) {
      setError('Please enter valid numbers.');
      return;
    }
    if (low < 0 || critical < 0) {
      setError('Thresholds must be >= 0.');
      return;
    }
    if (critical > low) {
      setError('Critical must be <= Low.');
      return;
    }
    setThresholds({ low: Math.round(low), critical: Math.round(critical) });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <form onSubmit={onSubmit} className={`p-4 rounded border bg-white shadow-sm w-72 ${className ?? ''}`}>
      <h3 className="text-sm font-semibold mb-2">Stock thresholds (admin)</h3>

      <label className="block text-xs mb-1">Low threshold</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-3"
        value={String(form.low)}
        onChange={(e) => setForm((s) => ({ ...s, low: Number(e.target.value) }))}
      />

      <label className="block text-xs mb-1">Critical threshold</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-3"
        value={String(form.critical)}
        onChange={(e) => setForm((s) => ({ ...s, critical: Number(e.target.value) }))}
      />

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <div className="flex gap-2">
        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded text-sm">
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            resetToDefaults();
            setForm({ low: 10, critical: 5 });
          }}
          className="px-3 py-2 border rounded text-sm"
        >
          Reset
        </button>
        {saved && <span className="text-green-600 text-sm self-center">Saved</span>}
      </div>
    </form>
  );
}
