import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';

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

        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>
            Q. 내가 쓴 오답노트는 익명으로 보이나요?
          </Text>
          <Text style={styles.faqA}>
            네! 작성자 정보는 전혀 노출되지 않으며 익명 유저 닉네임으로
            작성됩니다.
          </Text>
        </View>

        <View style={styles.faqCard}>
          <Text style={styles.faqQ}>Q. 투표는 작성 후 수정이 가능한가요?</Text>
          <Text style={styles.faqA}>
            투표 참여 및 옵션 변경은 언제든 피드 카드에서 즉시 다시 클릭할 수
            있습니다.
          </Text>
        </View>

        <View style={styles.inquiryContactBox}>
          <Text style={styles.inquiryContactTitle}>1:1 이메일 문의</Text>
          <Text style={styles.inquiryContactEmail}>support@odaplove.com</Text>
          <Text style={styles.inquiryContactSub}>
            평일 10:00 ~ 18:00 (주말/공휴일 제외)
          </Text>
        </View>
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
  faqCard: {
    backgroundColor: '#F8FAF9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqQ: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  faqA: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  inquiryContactBox: {
    backgroundColor: '#FFF7F5',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFC8B3',
    alignItems: 'center',
  },
  inquiryContactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF8E7A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  inquiryContactEmail: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  inquiryContactSub: {
    fontSize: 12.5,
    color: '#9C9C9C',
    letterSpacing: -0.3,
  },
});
