import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { BlockedUserItem as BlockedUserItemModel } from '../_model/blockedUser.model';

interface BlockedUserItemProps {
  item: BlockedUserItemModel;
  onUnblock: (blockedId: string) => void;
  isUnblocking?: boolean;
}

export function BlockedUserItem({
  item,
  onUnblock,
  isUnblocking = false,
}: BlockedUserItemProps) {
  let formattedDate = '';
  try {
    formattedDate = item.created_at
      ? format(new Date(item.created_at), 'yyyy.MM.dd')
      : '';
  } catch {
    formattedDate = '';
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoColumn}>
        <View style={styles.titleRow}>
          <Text style={styles.userLabel} numberOfLines={1}>
            차단된 사용자
          </Text>
          {formattedDate ? (
            <Text style={styles.dateText}>{formattedDate}</Text>
          ) : null}
        </View>
        {item.post_title ? (
          <Text style={styles.postTitleText} numberOfLines={1}>
            차단 사연: {item.post_title}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => onUnblock(item.blocked_id)}
        disabled={isUnblocking}
        activeOpacity={0.7}
      >
        <Text style={styles.unblockButtonText}>차단 해제</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoColumn: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  postTitleText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  unblockButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  unblockButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
});
