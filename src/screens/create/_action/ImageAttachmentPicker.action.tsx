'use client';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';

export function ImageAttachmentPickerAction() {
  const { images, addImage, removeImage } = useCreateForm(
    useShallow(state => ({
      images: state.images,
      addImage: state.addImage,
      removeImage: state.removeImage,
    })),
  );

  const handleAddImage = async () => {
    if (images.length >= 3) {
      if (Platform.OS === 'web') {
        alert('이미지는 최대 3개까지 첨부할 수 있습니다.');
      } else {
        Alert.alert('안내', '이미지는 최대 3개까지 첨부할 수 있습니다.');
      }
      return;
    }

    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        if (Platform.OS === 'web') {
          alert('사진첩 접근 권한이 필요합니다.');
        } else {
          Alert.alert('권한 필요', '사진첩 접근 권한이 필요합니다.');
        }
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });

      if (pickerResult.canceled || !pickerResult.assets?.[0]?.uri) {
        return;
      }

      const selectedAsset = pickerResult.assets[0];

      addImage(selectedAsset.uri);
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.imageScrollRow}
    >
      {images.length < 3 && (
        <TouchableOpacity
          style={styles.uploadSlotBtn}
          onPress={handleAddImage}
          activeOpacity={0.7}
        >
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5v14M5 12h14"
              stroke="#9C9C9C"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      )}

      {images.map((imgUrl, idx) => (
        <View key={`${imgUrl}_${idx}`} style={styles.imageSlot}>
          <Image
            source={{ uri: imgUrl }}
            style={styles.uploadedImg}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeImgBtn}
            onPress={() => removeImage(idx)}
            activeOpacity={0.8}
          >
            <Text style={styles.removeImgText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageScrollRow: {
    flexDirection: 'row',
  },
  uploadSlotBtn: {
    width: 104,
    height: 104,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  imageSlot: {
    width: 104,
    height: 104,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#F8F8F8',
  },
  uploadedImg: {
    width: 104,
    height: 104,
  },
  removeImgBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  removeImgText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
