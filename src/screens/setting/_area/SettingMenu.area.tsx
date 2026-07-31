import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SettingMenuAction } from '../_action/SettingMenu.action';

export function SettingMenuArea() {
  return (
    <View style={styles.container}>
      <SettingMenuAction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});
