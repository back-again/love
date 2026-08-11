'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function CommentHeaderArea() {
  /*
  const handleSharePost = async () => {
    const titleText = targetPost?.title || '사연';
    const postId = targetPost?.id || '';

    const shareUrl = postId
      ? `https://oxlove.app/post/${postId}`
      : `https://oxlove.app/post/${encodeURIComponent(titleText)}`;

    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        Alert.alert(
          '사연 주소 복사',
          `클립보드에 사연 주소가 복사되었습니다!\n\n${shareUrl}`,
        );
      } else {
        Alert.alert('사연 주소', shareUrl);
      }
    } else {
      try {
        await Share.share({
          title: titleText,
          message: `[OXLOVE] "${titleText}" 사연 주소:\n${shareUrl}`,
          url: shareUrl,
        });
      } catch (e) {
        Alert.alert('사연 주소 복사', shareUrl);
      }
    }
  };
  */

  return (
    <View style={styles.modalHeaderRow}>
      <View style={styles.headerSpacer} />
      <Text style={styles.modalHeaderTitle}>댓글</Text>
      {/*
      <TouchableOpacity
        style={styles.headerIconButton}
        onPress={handleSharePost}
      >
        <ShareSvg />
      </TouchableOpacity>
      */}
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 4,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerIconButton: {
    padding: 6,
  },
  headerSpacer: {
    width: 32,
  },
});
