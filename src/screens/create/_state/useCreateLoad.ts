'use client';

import { useEffect } from 'react';
import { useCreateForm } from './useCreateForm';

export function useCreateLoad() {
  useEffect(() => {
    return () => {
      useCreateForm.getState().reset();
    };
  }, []);
}
