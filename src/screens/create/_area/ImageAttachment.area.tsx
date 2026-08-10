import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ImageAttachmentPickerAction } from '../_action/ImageAttachmentPicker.action';

export function ImageAttachmentArea() {
  return (
    <View style={styles.createSection}>
      <Text style={styles.createSectionTitle}>파일 첨부</Text>
      <Text style={styles.createSectionSub}>
        참고할만한 이미지가 있다면 업로드해주세요
      </Text>
      <ImageAttachmentPickerAction />
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
  },
  createSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#727272',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  createSectionSub: {
    fontSize: 14,
    color: '#8F8F8F',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
});
