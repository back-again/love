import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function InquiryContactArea() {
  return (
    <View style={styles.inquiryContactBox}>
      <Text style={styles.inquiryContactTitle}>1:1 이메일 문의</Text>
      <Text style={styles.inquiryContactEmail}>support@odaplove.com</Text>
      <Text style={styles.inquiryContactSub}>
        평일 10:00 ~ 18:00 (주말/공휴일 제외)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inquiryContactBox: {
    backgroundColor: '#FFF3F4',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  inquiryContactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9758D',
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
    color: '#8F8F8F',
    letterSpacing: -0.3,
  },
});
