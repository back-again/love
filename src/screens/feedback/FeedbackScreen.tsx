import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { FeedbackInputAction } from './_action/FeedbackInput.action';
import { FeedbackSubmitAction } from './_action/FeedbackSubmit.action';
import { useFeedbackForm } from './_state/useFeedbackForm';

interface FeedbackScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function FeedbackScreen({
  visible,
  onClose,
}: FeedbackScreenProps) {
  const reset = useFeedbackForm(state => state.reset);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      snapPoints={['75%']}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>피드백 보내기</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionDesc}>
          연애오답을 이용하시면서 느끼신 개선점이나 아이디어가 있다면 편하게
          남겨주세요. 개발팀이 하나하나 소중히 검토합니다!
        </Text>
        <FeedbackInputAction />
      </View>

      <FeedbackSubmitAction onClose={onClose} />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
});
