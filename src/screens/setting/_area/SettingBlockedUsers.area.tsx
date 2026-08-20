import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlockedUsersListAction } from '../_action/SettingBlockedUsers/BlockedUsersList.action';

export function SettingBlockedUsersArea() {
  return (
    <View style={styles.container}>
      <BlockedUsersListAction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
