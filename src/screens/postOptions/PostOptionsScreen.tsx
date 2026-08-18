'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { usePostOptionsStore } from './_state/usePostOptionsStore';
import { EditOptionAction } from './_action/EditOption.action';
import { DeleteOptionAction } from './_action/DeleteOption.action';
import { BlockOptionAction } from './_action/BlockOption.action';
import { ReportOptionAction } from './_action/ReportOption.action';

export function PostOptionsScreen() {
  const { visible, targetPost, closePostOptions } = usePostOptionsStore(
    useShallow(state => ({
      visible: state.visible,
      targetPost: state.targetPost,
      closePostOptions: state.closePostOptions,
    })),
  );

  const isMyPost = Boolean(targetPost?.isMyPost);

  if (!visible) return null;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closePostOptions}
      enableDynamicSizing={true}
      useScrollView={false}
    >
      <View style={styles.container}>
        <Text style={styles.sheetTitle}>더보기</Text>

        {isMyPost ? (
          <>
            <EditOptionAction />
            <View style={styles.divider} />
            <DeleteOptionAction />
          </>
        ) : (
          <>
            <BlockOptionAction />
            <View style={styles.divider} />
            <ReportOptionAction />
          </>
        )}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F5F5F5',
  },
});
