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

  const selectSinglePostForDiagnosis = useChatDetailStore(
    state => state.selectSinglePostForDiagnosis
  );

  if (writtenPosts.length === 0) {
    return null;
  }

  return (
    <View style={styles.inlinePostSelectorCard}>
      <Text style={styles.inlineSelectorHeader}>상담할 고민글 선택</Text>
      <View style={styles.radioListWrap}>
        {writtenPosts.map(post => {
          return (
            <TouchableOpacity
              key={post.id}
              style={styles.radioCardItem}
              onPress={() => selectSinglePostForDiagnosis(post.id, writtenPosts)}
              activeOpacity={0.8}
            >
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioPostTitle} numberOfLines={1}>
                  {post.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
    alignSelf: 'flex-end',
    width: '86%',
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
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radioTextWrap: {
    flex: 1,
  },
  radioPostTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});
