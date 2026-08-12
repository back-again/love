import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LogoutAction } from '../_action/Logout.action';
import { AccountInfoAction } from '../_action/AccountInfo.action';
import { PushNotificationToggleAction } from '../_action/PushNotificationToggle.action';
import { MarketingNotificationToggleAction } from '../_action/MarketingNotificationToggle.action';
import { WithdrawAction } from '../_action/Withdraw.action';
import { useSettingStore } from '../_state/useSettingStore';

export function SettingAccountArea() {
  const resetSetting = useSettingStore(state => state.reset);

  return (
    <View style={styles.contentSection}>
      <AccountInfoAction />

      <PushNotificationToggleAction />
      <MarketingNotificationToggleAction />

      <View style={styles.dangerZoneGroup}>
        <LogoutAction
          style={styles.logoutBtn}
          textStyle={styles.logoutBtnText}
          onLogoutSuccess={() => {
            resetSetting();
          }}
        />
        <WithdrawAction />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentSection: {
    width: '100%',
  },
  dangerZoneGroup: {
    marginTop: 24,
    gap: 12,
  },
  logoutBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#727272',
  },
});
