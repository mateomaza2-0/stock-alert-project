'use client';
import React, {useState, useEffect} from 'react';

import ThresholdsAdmin from '~/components/ThresholdsAdmin';

export default function AdminToggle() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || String(import.meta.env.VITE_NODE_ENV) !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full bg-gray-800 text-white shadow"
        aria-expanded={open}
        title="Admin toggles"
      >
        ⚙️
      </button>

      {open && (
        <div className="mt-2">
          <ThresholdsAdmin />
        </div>
      )}
    </div>
  );
}
