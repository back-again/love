'use client';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { CenterModal } from '@/components/modal';

interface VoteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  choiceText?: string;
}

export function VoteConfirmModal({
  visible,
  onClose,
  onConfirm,
  choiceText,
}: VoteConfirmModalProps) {
  if (!visible) return null;

  return (
    <CenterModal
      visible={visible}
      onClose={onClose}
      maxWidth={340}
      dismissOnBackdropPress={true}
    >
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>투표는 변경할 수 없어요</Text>

        <Text style={styles.modalSub}>
          작성자의 고민 해결에 큰 힘이 되는 투표에요.
          {'\n'}투표 후에는 선택을 바꿀 수 없으니 신중히 결정해 주세요!
        </Text>

        {choiceText ? (
          <View style={styles.choicePreviewPill}>
            <Text style={styles.choicePreviewLabel}>선택한 항목:</Text>
            <Text style={styles.choicePreviewValue} numberOfLines={1}>
              "{choiceText}"
            </Text>
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>다시 고르기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              onClose();
              onConfirm();
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>확인했어요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CenterModal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    fontWeight: '400',
    color: '#727272',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  choicePreviewPill: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF8F8',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  choicePreviewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F8F8F',
  },
  choicePreviewValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5D7B',
    maxWidth: 180,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#727272',
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
