'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  PanResponder,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RightSlideModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | `${number}%`;
  hideBackdrop?: boolean;
  backdropOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  enablePanGesture?: boolean;
  applySafeAreaPadding?: boolean;
}

export function RightSlideModal({
  visible,
  onClose,
  children,
  width = '85%',
  hideBackdrop = false,
  backdropOpacity = 0.45,
  containerStyle,
  contentStyle,
  enablePanGesture = true,
  applySafeAreaPadding = false,
}: RightSlideModalProps) {
  const insets = useSafeAreaInsets();
  const [isRendered, setIsRendered] = useState(visible);

  // Compute numeric modal width
  const modalWidth =
    typeof width === 'number'
      ? width
      : (SCREEN_WIDTH * parseFloat(width)) / 100;

  const translateXAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRendered(false);
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      translateXAnim.setValue(SCREEN_WIDTH);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.spring(translateXAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isRendered) {
      handleClose();
    }
  }, [visible]);

  // Pan Responder for swipe-to-close right gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!enablePanGesture) return false;
        // Only capture horizontal swipes to the right
        return gestureState.dx > 12 && Math.abs(gestureState.dy) < 15;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateXAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > modalWidth * 0.3 || gestureState.vx > 0.5) {
          // Dismiss modal if swiped far or fast enough
          handleClose();
        } else {
          // Snap back to open position
          Animated.spring(translateXAnim, {
            toValue: 0,
            damping: 20,
            stiffness: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!isRendered) return null;

  return (
    <Modal
      transparent
      visible={isRendered}
      onRequestClose={handleClose}
      statusBarTranslucent
      animationType="none"
    >
      <View style={[styles.rootContainer, containerStyle]}>
        {/* Animated Dark Backdrop */}
        {!hideBackdrop && (
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View
              style={[
                styles.backdrop,
                {
                  opacity: backdropAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, backdropOpacity],
                  }),
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Sliding Content Drawer */}
        <Animated.View
          {...(enablePanGesture ? panResponder.panHandlers : {})}
          style={[
            styles.slideDrawer,
            {
              width: modalWidth,
              borderTopLeftRadius: width === '100%' ? 0 : 24,
              borderBottomLeftRadius: width === '100%' ? 0 : 24,
              paddingTop: applySafeAreaPadding ? insets.top : 0,
              paddingBottom: applySafeAreaPadding ? insets.bottom : 0,
              transform: [{ translateX: translateXAnim }],
            },
            contentStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  slideDrawer: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
});
