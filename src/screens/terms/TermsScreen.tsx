import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { TermsContentTemplate } from './_template/TermsContent.template';

interface TermsScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsScreen({ visible, onClose }: TermsScreenProps) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} snapPoints={['85%']}>
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>오답연애 서비스 이용약관</Text>
      </View>
      <TermsContentTemplate />
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
