import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GenderSelectAction } from '../_action/GenderSelect.action';
import { BirthYearInputAction } from '../_action/BirthYearInput.action';
import { NotificationAllowAction } from '../_action/NotificationAllow.action';
import { TermsAgreementAction } from '../_action/TermsAgreement.action';

interface FormAreaProps {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export function FormArea({ onOpenTerms, onOpenPrivacy }: FormAreaProps) {
  return (
    <View style={styles.formContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>성별</Text>
        <GenderSelectAction />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>출생년도</Text>
        <BirthYearInputAction />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.sectionTitleHasSubtitle]}>
          알림 허용
        </Text>
        <Text style={styles.sectionSubtitle}>
          고민에 대한 투표나 댓글이 등록될 시 즉시 알려드릴게요.
        </Text>
        <NotificationAllowAction />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>동의 항목</Text>
        <TermsAgreementAction
          onOpenTerms={onOpenTerms}
          onOpenPrivacy={onOpenPrivacy}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 30,
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionTitleHasSubtitle: {
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#9C9C9C',
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
});
