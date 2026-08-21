'use client';

import React from 'react';
import { useCreateForm } from '../_state/useCreateForm';
import { CreateSubmitAction } from '../_action/CreateSubmit.action';
import { EditSubmitAction } from '../_action/EditSubmit.action';

export function CreateSubmitHandler() {
  const isEditMode = useCreateForm(state => state.isEditMode);

  if (isEditMode) {
    return <EditSubmitAction />;
  }

  return <CreateSubmitAction />;
}
