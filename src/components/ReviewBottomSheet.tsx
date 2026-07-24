import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ReviewBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  reviewText?: string;
}

export default function ReviewBottomSheet({
  visible,
  onClose,
  reviewText = '"결국 솔직하게 서운했던 부분 대화 나누고 서로 이해했어요! 다들 O 투표로 제 편을 들어주셔서 용기 얻고 대화할 수 있었습니다. 감사합니다!"',
}: ReviewBottomSheetProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(0);
  }, [visible]);

  const handleCloseWithAnim = () => {
    Animated.timing(translateY, {
      toValue: 400,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        } else {
          translateY.setValue(gestureState.dy * 0.25);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 70 || gestureState.vy > 0.5) {
          handleCloseWithAnim();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            stiffness: 350,
            damping: 25,
            mass: 0.7,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleCloseWithAnim}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={handleCloseWithAnim} />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheetContainer,
            { transform: [{ translateY }] },
          ]}
        >
          {/* Top Drag Handle Zone */}
          <View style={styles.dragHandleZone} {...panResponder.panHandlers}>
            <View style={styles.handlePill} />
          </View>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>사연 후기</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handleCloseWithAnim} activeOpacity={0.7}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#9C9C9C"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Review Card Box (오직 후기 본문만 깔끔하게 노출) */}
          <View style={styles.reviewCardBox}>
            <Text style={styles.reviewCardBodyText}>{reviewText}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    height: 240,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandleZone: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'ns-resize' } as any) : {}),
  },
  handlePill: {
    width: 38,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#EBEBEB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 4,
  },
  reviewCardBox: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    padding: 18,
  },
  reviewCardBodyText: {
    fontSize: 14.5,
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
});
