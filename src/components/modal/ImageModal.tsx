import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ImageModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80';

export function ImageModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: ImageModalProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  if (!visible || images.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.flexOne}>
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <View
            style={[
              styles.safeHeader,
              { paddingTop: Math.max(insets.top, 12) },
            ]}
          >
            {/* Top Story Progress Bars */}
            <View style={styles.progressContainer}>
              {images.map((_, index) => (
                <View key={index} style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressBar,
                      index === currentIndex && styles.progressActive,
                      index < currentIndex && styles.progressCompleted,
                    ]}
                  />
                </View>
              ))}
            </View>

            {/* Header Bar */}
            <View style={styles.header}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {images.length}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* Story Main Image */}
          <View
            style={[
              styles.imageContainer,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <Image
              source={{
                uri:
                  failedImages[currentIndex] || !images[currentIndex]
                    ? DEFAULT_FALLBACK_IMAGE
                    : images[currentIndex],
              }}
              style={styles.image}
              resizeMode="contain"
              onError={() =>
                setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))
              }
            />

            {/* Touch Navigation Overlay */}
            <TouchableOpacity
              style={styles.touchLeft}
              onPress={handlePrev}
              activeOpacity={1}
            />
            <TouchableOpacity
              style={styles.touchRight}
              onPress={handleNext}
              activeOpacity={1}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeHeader: {
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '0%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressActive: {
    width: '100%',
  },
  progressCompleted: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  touchLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '35%',
  },
  touchRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '65%',
  },
});
