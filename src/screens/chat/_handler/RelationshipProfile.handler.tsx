'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/_state/useUserStore';
import { getRelationshipProfileLib } from '../_lib/relationshipProfile.lib';
import { ProfileAnalysisCardArea } from '../_area/ProfileAnalysisCard.area';
import { ProfileQuizPromptArea } from '../_area/ProfileQuizPrompt.area';

export function RelationshipProfileHandler() {
  const userId = useUserStore(state => state.user?.id);

  const { data: profile } = useQuery({
    queryKey: ['relationshipProfile', userId],
    queryFn: getRelationshipProfileLib,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (!profile) {
    return <ProfileQuizPromptArea />;
  }

  return <ProfileAnalysisCardArea profile={profile} />;
}
