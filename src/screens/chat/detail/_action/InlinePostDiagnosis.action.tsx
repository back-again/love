'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/_state/useUserStore';
import { getWrittenPosts } from '@/screens/my/_lib/getWrittenPosts.lib';
import { useChatDetailStore } from '../_state/useChatDetailStore';

export function InlinePostDiagnosisAction() {
  const userId = useUserStore(state => state.user?.id);
  const { data: writtenPosts = [] } = useQuery({
    queryKey: ['writtenPosts', userId],
    queryFn: () => getWrittenPosts({ userId }),
  });

  const {
    selectedPostIdsForDiagnosis,
    togglePostSelectionForDiagnosis,
    confirmPostSelectionInChat,
  } = useChatDetailStore(
    useShallow(state => ({
      selectedPostIdsForDiagnosis: state.selectedPostIdsForDiagnosis,
      togglePostSelectionForDiagnosis: state.togglePostSelectionForDiagnosis,
      confirmPostSelectionInChat: state.confirmPostSelectionInChat,
    })),
  );

  if (writtenPosts.length === 0) {
    return null;
  }

  return (
    <View style={styles.inlinePostSelectorCard}>
      <Text style={styles.inlineSelectorHeader}>관련 고민 사연 선택</Text>
      <View style={styles.radioListWrap}>
        {writtenPosts.map(post => {
          const isChecked = selectedPostIdsForDiagnosis.includes(post.id);
          return (
            <TouchableOpacity
              key={post.id}
              style={[
                styles.radioCardItem,
                isChecked && styles.radioCardItemChecked,
              ]}
              onPress={() => togglePostSelectionForDiagnosis(post.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioButton,
                  isChecked && styles.radioButtonChecked,
                ]}
              >
                {isChecked && <View style={styles.radioButtonInner} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text
                  style={[
                    styles.radioPostTitle,
                    isChecked && styles.radioPostTitleChecked,
                  ]}
                  numberOfLines={1}
                >
                  {post.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        style={styles.confirmSelectionBtn}
        onPress={() => confirmPostSelectionInChat(writtenPosts)}
        activeOpacity={0.85}
      >
        <Text style={styles.confirmSelectionBtnText}>
          이 사연들로 종합 진단받기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inlinePostSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
    marginLeft: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inlineSelectorHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  radioListWrap: {
    gap: 8,
    marginBottom: 14,
  },
  radioCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radioCardItemChecked: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonChecked: {
    borderColor: '#FF5D7B',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5D7B',
  },
  radioTextWrap: {
    flex: 1,
  },
  radioPostTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  radioPostTitleChecked: {
    color: '#E11D48',
  },
  confirmSelectionBtn: {
    backgroundColor: '#FF5D7B',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmSelectionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
