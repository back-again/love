'use client';

import React, { useRef, useEffect, useCallback, ReactNode } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  snapPoints?: (string | number)[];
  children: ReactNode;
  useScrollView?: boolean;
  enableDynamicSizing?: boolean;
  footerComponent?: React.FC<any>;
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent';
  enableContentPanningGesture?: boolean;
}

export function BottomSheetModal({
  visible,
  onClose,
  snapPoints = ['85%'],
  children,
  useScrollView = true,
  enableDynamicSizing = true,
  footerComponent,
  keyboardBehavior,
  enableContentPanningGesture = true,
}: BottomSheetModalProps) {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        bottomSheetModalRef.current?.present();
      });
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <GorhomBottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={enableDynamicSizing ? undefined : (snapPoints ?? ['85%'])}
      topInset={insets.top}
      enableDynamicSizing={enableDynamicSizing}
      enablePanDownToClose={true}
      keyboardBehavior={
        keyboardBehavior ?? (Platform.OS === 'ios' ? 'interactive' : 'extend')
      }
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      footerComponent={footerComponent}
      enableContentPanningGesture={enableContentPanningGesture}
      onDismiss={handleDismiss}
      containerStyle={styles.containerStyle}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      {useScrollView ? (
        <BottomSheetScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView style={styles.nonScrollContent}>
          {children}
        </BottomSheetView>
      )}
    </GorhomBottomSheetModal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    zIndex: 30000,
    elevation: 30000,
  },
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#EBEBEB',
    width: 36,
    height: 4,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 12,
  },
  nonScrollContent: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
});
