'use client';

import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

export function MarketingNotificationToggleAction() {
  const [marketingNoti, setMarketingNoti] = useState(false);

  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingRowTitle}>마케팅 혜택 알림 수신</Text>
      <Switch
        value={marketingNoti}
        onValueChange={setMarketingNoti}
        trackColor={{ false: '#E2E8F0', true: '#FF8E7A' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    width: '100%',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
});
