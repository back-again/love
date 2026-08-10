import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { ReviewInputAction } from './_action/ReviewInput.action';
import { ReviewSubmitAction } from './_action/ReviewSubmit.action';
import { useReviewForm } from './_state/useReviewForm';

export type ReviewMode = 'view' | 'write';

interface ReviewScreenProps {
  visible: boolean;
  onClose: () => void;
  mode?: ReviewMode;
  reviewText?: string;
  postId?: string;
}

export default function ReviewScreen({
  visible,
  onClose,
  mode = 'view',
  reviewText = '"결국 솔직하게 서운했던 부분 대화 나누고 서로 이해했어요! 다들 O 투표로 제 편을 들어주셔서 용기 얻고 대화할 수 있었습니다. 감사합니다!"',
  postId,
}: ReviewScreenProps) {
  const isWriteMode = mode === 'write';
  const reset = useReviewForm(state => state.reset);

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      snapPoints={isWriteMode ? ['65%'] : ['40%']}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>
          {isWriteMode ? '후기 남기기' : '사연 후기'}
        </Text>
      </View>

      {isWriteMode ? (
        <View style={styles.container}>
          <Text style={styles.sectionDesc}>
            O/X 투표 이후 상대방과의 상황이 어떻게 진행되었나요? 후기를 공유하면 다른 유저들의 연애 고민 해결에 큰 도움이 됩니다!
          </Text>

          <ReviewInputAction />
          <ReviewSubmitAction onClose={onClose} postId={postId} />
        </View>
      ) : (
        <View style={styles.reviewCardBox}>
          <Text style={styles.reviewCardBodyText}>{reviewText}</Text>
        </View>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  reviewCardBox: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewCardBodyText: {
    fontSize: 14.5,
    color: '#727272',
    lineHeight: 21,
    letterSpacing: -0.3,
  },
});
