'use client';

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRelationshipQuizModalStore } from '../_state/useRelationshipQuizModalStore';
import { RetrySvg } from '../_svg';

export function RetryQuizButtonAction() {
  const openQuizModal = useRelationshipQuizModalStore(
    state => state.openQuizModal,
  );

  return (
    <TouchableOpacity
      style={styles.cardRetryTopBtn}
      onPress={openQuizModal}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <RetrySvg />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardRetryTopBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
