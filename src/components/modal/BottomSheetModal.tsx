'use client';

import React, { useRef, useEffect, useCallback, ReactNode } from 'react';
import { StyleSheet, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [mounted, setMounted] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(0);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleCloseAnimation = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
        onPress={handleCloseAnimation}
      />
    ),
    [handleCloseAnimation],
  );

  if (!visible && !mounted) return null;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={handleCloseAnimation}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.flexOne}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          topInset={insets.top}
          enableDynamicSizing={enableDynamicSizing}
          enablePanDownToClose={true}
          keyboardBehavior={
            keyboardBehavior ??
            (Platform.OS === 'ios' ? 'interactive' : 'extend')
          }
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          backdropComponent={renderBackdrop}
          footerComponent={footerComponent}
          enableContentPanningGesture={enableContentPanningGesture}
          onChange={(index: number) => {
            if (index === -1) {
              setMounted(false);
              onClose();
            }
          }}
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
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  containerStyle: {
    zIndex: 9999,
    elevation: 9999,
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
    flex: 1,
    paddingTop: 12,
  },
});
