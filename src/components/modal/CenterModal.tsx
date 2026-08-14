import React, { useEffect, useRef, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  KeyboardAvoidingView,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from 'react-native';

export interface CenterModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  dismissOnBackdropPress?: boolean;
  width?: DimensionValue;
  maxWidth?: number;
  animationType?: 'spring' | 'fade' | 'none';
  cardStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function CenterModal({
  visible,
  onClose,
  children,
  dismissOnBackdropPress = true,
  width = '88%',
  maxWidth = 400,
  animationType = 'spring',
  cardStyle,
  containerStyle,
}: CenterModalProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (animationType === 'none') {
        animValue.setValue(1);
      } else if (animationType === 'fade') {
        Animated.timing(animValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(animValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 9,
        }).start();
      }
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animationType, animValue]);

  if (!visible) return null;

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const cardScale =
    animationType === 'spring'
      ? animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1],
        })
      : 1;

  const cardOpacity = animValue.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.8, 1],
  });

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlayContainer, containerStyle]}
      >
        {/* Animated Dim Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Center Modal Card */}
        <Animated.View
          style={[
            styles.modalCard,
            {
              width,
              maxWidth,
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
            cardStyle,
          ]}
        >
          <TouchableWithoutFeedback>
            <View style={styles.cardContentWrap}>{children}</View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 10000,
  },
  cardContentWrap: {
    width: '100%',
  },
});
