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
