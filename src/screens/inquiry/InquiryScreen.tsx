import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { FaqListArea } from './_area/FaqList.area';
import { InquiryContactArea } from './_area/InquiryContact.area';

interface InquiryScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function InquiryScreen({
  visible,
  onClose,
}: InquiryScreenProps) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose} snapPoints={['75%']}>
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>문의 사항</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionDesc}>
          자주 묻는 질문 및 1:1 고객 문의 센터입니다.
        </Text>

        <FaqListArea />
        <InquiryContactArea />
      </View>
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
  contentSection: {
    marginBottom: 24,
  },
  sectionDesc: {
    fontSize: 14.5,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
});
