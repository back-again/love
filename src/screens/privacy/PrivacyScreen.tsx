import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { PrivacyContentTemplate } from './_template/PrivacyContent.template';

interface PrivacyScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyScreen({ visible, onClose }: PrivacyScreenProps) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} snapPoints={['85%']}>
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>연OX 개인정보 처리방침</Text>
      </View>
      <PrivacyContentTemplate />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
});
