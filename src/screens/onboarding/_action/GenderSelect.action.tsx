'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useOnboardingForm } from '../_state/useOnboardingForm';

export function GenderSelectAction() {
  const { gender, setGender } = useOnboardingForm(
    useShallow((state) => ({
      gender: state.gender,
      setGender: state.setGender,
    }))
  );

  return (
    <View style={styles.genderRow}>
      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === 'male' && styles.genderButtonSelected,
        ]}
        onPress={() => setGender('male')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.genderButtonText,
            gender === 'male' && styles.genderButtonTextSelected,
          ]}
        >
          남
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === 'female' && styles.genderButtonSelected,
        ]}
        onPress={() => setGender('female')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.genderButtonText,
            gender === 'female' && styles.genderButtonTextSelected,
          ]}
        >
          여
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  genderButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#FFF8F8',
    borderColor: '#FFD1DC',
    borderWidth: 1,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  genderButtonTextSelected: {
    color: '#FF5D7B',
    fontWeight: '700',
  },
});
