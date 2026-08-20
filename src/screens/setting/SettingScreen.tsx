import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { SettingBackAction } from './_action/SettingHeader/SettingBack.action';
import { SettingTitleAction } from './_action/SettingHeader/SettingTitle.action';
import { SettingViewHandler } from './_handler/SettingView.handler';
import { useSettingLoad } from './_state/useSettingLoad';

interface SettingScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingScreen({
  visible,
  onClose,
}: SettingScreenProps) {
  const { handleClose } = useSettingLoad(onClose);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      snapPoints={['70%']}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeftRow}>
          <SettingBackAction />
          <SettingTitleAction />
        </View>
      </View>

      <SettingViewHandler />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 16,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
