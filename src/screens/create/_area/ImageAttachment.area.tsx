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
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  createSectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
});
