'use client';

import React from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlockedUsersLib } from '../../_lib/getBlockedUsers.lib';
import { unblockUserLib } from '../../_lib/unblockUser.lib';
import { BlockedUserItem } from '../../_component/BlockedUserItem';
import { useToastStore } from '@/_state/useToastStore';

export function BlockedUsersListAction() {
  const queryClient = useQueryClient();
  const showToast = useToastStore(state => state.showToast);

  const { data: blockedUsers, isLoading } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: getBlockedUsersLib,
  });

  const unblockMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      await unblockUserLib(targetUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      showToast('차단이 해제되었습니다.');
    },
    onError: (error: any) => {
      console.error('unblockUser error:', error);
      showToast('차단 해제 중 오류가 발생했습니다.');
    },
  });

  const handleUnblock = (targetUserId: string) => {
    Alert.alert(
      '차단 해제',
      '해당 사용자의 차단을 해제하시겠습니까?\n차단 해제 시 해당 사용자의 게시글이 다시 피드에 표시됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '해제',
          style: 'default',
          onPress: () => unblockMutation.mutate(targetUserId),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#F9758D" />
      </View>
    );
  }

  if (!blockedUsers || blockedUsers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>차단한 사용자가 없습니다.</Text>
        <Text style={styles.emptySubtitle}>
          피드에서 차단한 사용자의 목록이 이곳에 표시됩니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {blockedUsers.map(item => (
        <BlockedUserItem
          key={item.blocked_id}
          item={item}
          onUnblock={handleUnblock}
          isUnblocking={unblockMutation.isPending}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    paddingTop: 8,
  },
  loadingBox: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
