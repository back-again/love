import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  Platform,
  TextInputProps,
} from 'react-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface AnimatedTextInputFieldProps extends TextInputProps {
  charCounter?: { current: number; max: number };
  height?: number;
}

export function AnimatedTextInputField({
  charCounter,
  height = 56,
  style,
  onFocus,
  onBlur,
  ...props
}: AnimatedTextInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onBlur) onBlur(e);
  };

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#EBEBEB', '#FFB5C5'],
  });

  return (
    <View style={styles.inputWrapper}>
      <AnimatedTextInput
        style={[
          styles.textInput,
          {
            height,
            borderColor: animatedBorderColor,
            borderWidth: 1,
            paddingRight: charCounter ? 60 : 16,
          },
          Platform.OS === 'web' && isFocused
            ? ({
                boxShadow: '0 0 0 3px rgba(255, 181, 197, 0.25)',
              } as any)
            : {},
          style,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {charCounter && (
        <Text style={styles.charCounter}>
          ({charCounter.current}/{charCounter.max})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  textInput: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#727272',
    backgroundColor: '#FFFFFF',
    letterSpacing: -0.3,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          transitionProperty: 'border-color, box-shadow',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease',
        } as any)
      : {}),
  },
  charCounter: {
    position: 'absolute',
    right: 16,
    top: 18,
    fontSize: 13,
    color: '#8F8F8F',
    fontWeight: '400',
  },
});
