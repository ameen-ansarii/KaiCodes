import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather, type IconName } from './AppIcon';
import { theme } from '@/constants/theme';

function tapFeedback() {
  if (Platform.OS !== 'web') {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }
}

export function StrongButton({
  label,
  onPress,
  color = theme.purple,
  textColor = '#FFFFFF',
  icon,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      testID={`button-${label.toLowerCase().replace(/\s/g, '-')}`}
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.applePillButton,
        {
          backgroundColor: secondary ? '#F8FAFC' : color,
          borderWidth: secondary ? 1.5 : 0,
          borderColor: secondary ? '#E2E8F0' : 'transparent',
          shadowColor: secondary ? '#64748B' : color,
          shadowOpacity: secondary ? 0.08 : 0.28,
        },
        pressed && styles.buttonPressed,
        disabled && styles.disabledButton,
      ]}
    >
      {icon ? (
        <Feather
          name={icon}
          size={22}
          color={secondary ? color : textColor}
          strokeWidth={2.4}
        />
      ) : null}
      <Text
        style={[
          styles.buttonLabel,
          { color: secondary ? color : textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  backgroundColor = '#FFFFFF',
  color = theme.ink,
}: {
  icon: IconName;
  onPress?: () => void;
  backgroundColor?: string;
  color?: string;
}) {
  return (
    <Pressable
      testID={`icon-${icon}`}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor },
        pressed && styles.buttonPressed,
      ]}
    >
      <Feather name={icon} size={20} color={color} strokeWidth={2.4} />
    </Pressable>
  );
}

export function ProgressBar({
  value,
  color = theme.sky,
  height = 10,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <Pressable style={[styles.progressTrack, { height }]}>
      <Pressable
        style={[
          styles.progressFill,
          {
            width: `${Math.max(0, Math.min(1, value)) * 100}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </Pressable>
  );
}

export { tapFeedback };

const styles = StyleSheet.create({
  applePillButton: {
    height: 58,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 26,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontFamily: 'Nunito_900Black',
    fontSize: 18.5,
    letterSpacing: -0.2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTrack: {
    borderRadius: 99,
    backgroundColor: theme.line,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 99,
  },
});
