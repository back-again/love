'use client';

import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCreateForm } from './useCreateForm';

export function useCreateLoad() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset form on tab focus if we're not in edit mode
      if (!useCreateForm.getState().isEditMode) {
        useCreateForm.getState().reset();
      }
    });

    return unsubscribe;
  }, [navigation]);
}
