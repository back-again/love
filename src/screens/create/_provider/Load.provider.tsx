'use client';

import React, { useEffect } from 'react';
import { useCreateForm } from '../_state/useCreateForm';

export function LoadProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return () => {
      useCreateForm.getState().reset();
    };
  }, []);

  return <>{children}</>;
}
