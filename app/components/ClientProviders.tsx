'use client';
import React from 'react';

import { ThresholdsProvider } from '~/context/ThresholdsContext';
import AdminToggle from '~/components/AdminToggle';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThresholdsProvider>
      {children}
      <AdminToggle />
    </ThresholdsProvider>
  );
}
