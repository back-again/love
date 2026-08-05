import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function FaqListArea() {
  return (
    <View style={styles.container}>
      <View style={styles.faqCard}>
        <Text style={styles.faqQ}>
          Q. 내가 쓴 오답노트는 익명으로 보이나요?
        </Text>
        <Text style={styles.faqA}>
          네! 작성자 정보는 전혀 노출되지 않으며 익명 유저 닉네임으로 작성됩니다.
        </Text>
      </View>

      <View style={styles.faqCard}>
        <Text style={styles.faqQ}>Q. 투표는 작성 후 수정이 가능한가요?</Text>
        <Text style={styles.faqA}>
          투표 참여 및 옵션 변경은 언제든 피드 카드에서 즉시 다시 클릭할 수
          있습니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
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
});
