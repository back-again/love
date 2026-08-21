import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabType } from '../Layout';
import { NavItem } from '../_component/NavItem';
import { useCreateForm } from '@/screens/create/_state/useCreateForm';

const tabIndexMap: Record<MainTabType, number> = {
  feed: 0,
  create: 1,
  chat: 2,
  my: 3,
};

interface BottomNavAreaProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export function BottomNavArea({ activeTab, onTabChange }: BottomNavAreaProps) {
  const insets = useSafeAreaInsets();
  const isEditMode = useCreateForm(state => state.isEditMode);
  const [containerWidth, setContainerWidth] = useState(0);

  const leftEdgeAnim = useRef(
    new Animated.Value(tabIndexMap[activeTab]),
  ).current;
  const rightEdgeAnim = useRef(
    new Animated.Value(tabIndexMap[activeTab] + 1),
  ).current;
  const prevTabRef = useRef<MainTabType>(activeTab);

  useEffect(() => {
    const prevIndex = tabIndexMap[prevTabRef.current];
    const targetIndex = tabIndexMap[activeTab];
    prevTabRef.current = activeTab;

    if (prevIndex === targetIndex) return;

    const isMovingRight = targetIndex > prevIndex;

    if (isMovingRight) {
      Animated.parallel([
        Animated.spring(rightEdgeAnim, {
          toValue: targetIndex + 1,
          tension: 190,
          friction: 14,
          useNativeDriver: true,
        }),
        Animated.spring(leftEdgeAnim, {
          toValue: targetIndex,
          tension: 100,
          friction: 13,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(leftEdgeAnim, {
          toValue: targetIndex,
          tension: 190,
          friction: 14,
          useNativeDriver: true,
        }),
        Animated.spring(rightEdgeAnim, {
          toValue: targetIndex + 1,
          tension: 100,
          friction: 13,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeTab]);

  const centerAnim = Animated.multiply(
    Animated.add(Animated.add(leftEdgeAnim, rightEdgeAnim), -1),
    0.5,
  );
  const scaleXAnim = Animated.subtract(rightEdgeAnim, leftEdgeAnim);

  return (
    <View
      style={[
        styles.bottomNavOuterWrapper,
        { bottom: insets.bottom > 0 ? insets.bottom : 16 },
      ]}
    >
      <View style={styles.bottomNavInnerCapsule}>
        <BlurView
          intensity={80}
          tint="light"
          style={styles.glassBlurBackground}
        />
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.92)',
            'rgba(255, 255, 255, 0.85)',
            'rgba(255, 255, 255, 0.78)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Sliding Pill Background behind NavItems */}
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.activePillBackground,
              {
                width: (containerWidth - 16) / 4,
                transform: [
                  {
                    translateX: centerAnim.interpolate({
                      inputRange: [0, 1, 2, 3],
                      outputRange: [
                        0,
                        (containerWidth - 16) / 4,
                        ((containerWidth - 16) / 4) * 2,
                        ((containerWidth - 16) / 4) * 3,
                      ],
                    }),
                  },
                  { scaleX: scaleXAnim },
                ],
              },
            ]}
          />
        )}

        <View
          style={styles.bottomNavContainer}
          onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {[
            { type: 'feed' as const, label: '커뮤니티' },
            {
              type: 'create' as const,
              label: isEditMode ? '수정' : '작성',
              isEditing: isEditMode,
            },
            { type: 'chat' as const, label: '상담' },
            { type: 'my' as const, label: '마이' },
          ].map(tab => (
            <NavItem
              key={tab.type}
              type={tab.type}
              label={tab.label}
              isActive={activeTab === tab.type}
              isEditing={tab.isEditing}
              onPress={() => onTabChange(tab.type)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavOuterWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    height: 63,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 9999,
    zIndex: 9999,
    backgroundColor: 'transparent',
  },
  bottomNavInnerCapsule: {
    width: '100%',
    height: '100%',
    borderRadius: 31.5,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor:
      Platform.OS === 'web'
        ? 'rgba(255, 255, 255, 0.82)'
        : 'rgba(255, 255, 255, 0.85)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(30px) saturate(210%)',
          WebkitBackdropFilter: 'blur(30px) saturate(210%)',
          boxShadow:
            'inset 1px 1px 2px 0px rgba(255, 255, 255, 0.9), inset -1px -1px 2px 0px rgba(0, 0, 0, 0.03), 0 12px 20px 0px rgba(0, 0, 0, 0.12)',
        }
      : {}),
  },
  glassBlurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomNavContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  activePillBackground: {
    position: 'absolute',
    left: 8,
    top: '50%',
    height: 52,
    marginTop: -26,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
});
