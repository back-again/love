import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { PrivacyContentArea } from './_area/PrivacyContent.area';

interface PrivacyScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyScreen({
  visible,
  onClose,
}: PrivacyScreenProps) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} snapPoints={['85%']}>
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>오답연애 개인정보 처리방침</Text>
      </View>
      <PrivacyContentArea />
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
