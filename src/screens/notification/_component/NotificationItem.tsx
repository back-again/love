'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NotificationItem as NotificationItemType } from '../_model/notification.model';

interface NotificationItemProps {
  item: NotificationItemType;
  onPress: (item: NotificationItemType) => void;
}

export function NotificationItem({ item, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.notificationCardUnread,
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {item.postTitle}
          </Text>
          {!item.isRead && <View style={styles.dotUnread} />}
        </View>
        <Text style={styles.messageText} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 12,
  },
  notificationCardUnread: {
    backgroundColor: '#FFF8F9',
    borderColor: '#FFD1DC',
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  dotUnread: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5D7B',
  },
  messageText: {
    fontSize: 13.5,
    color: '#727272',
    lineHeight: 19,
  },
  timestampText: {
    fontSize: 11,
    color: '#C0C0C0',
    marginTop: 2,
  },
});
