import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export type MascotPose =
  | 'primary'
  | 'coach'
  | 'celebrate'
  | 'thinking'
  | 'accepted'
  | 'coding'
  | 'eureka'
  | 'frustrated'
  | 'facepalm'
  | 'mindblown'
  | 'speedrun'
  | 'sleepy'
  | 'crying'
  | 'stop'
  | 'point_right'
  | 'whisper';

const mascotImages: Record<MascotPose, any> = {
  primary: require('@/assets/images/kai_accepted.png'),
  accepted: require('@/assets/images/kai_accepted.png'),
  coach: require('@/assets/images/kai_whisper.png'),
  celebrate: require('@/assets/images/kai_accepted.png'),
  thinking: require('@/assets/images/kai_thinking.png'),
  coding: require('@/assets/images/kai_coding.png'),
  eureka: require('@/assets/images/kai_eureka.png'),
  frustrated: require('@/assets/images/kai_frustrated.png'),
  facepalm: require('@/assets/images/kai_facepalm.png'),
  mindblown: require('@/assets/images/kai_mindblown.png'),
  speedrun: require('@/assets/images/kai_speedrun.png'),
  sleepy: require('@/assets/images/kai_sleepy.png'),
  crying: require('@/assets/images/kai_crying.png'),
  stop: require('@/assets/images/kai_stop.png'),
  point_right: require('@/assets/images/kai_point_right.png'),
  whisper: require('@/assets/images/kai_whisper.png'),
};

export function Mascot({
  pose = 'primary',
  size,
  small = false,
  style,
  withPedestal = false,
  stars = 0,
}: {
  pose?: MascotPose;
  size?: number;
  small?: boolean;
  style?: any;
  withPedestal?: boolean;
  stars?: number;
}) {
  const actualSize = size ?? (small ? 48 : 140);
  const imgElement = (
    <Image
      source={mascotImages[pose]}
      style={[{ width: actualSize, height: actualSize }, style]}
      resizeMode="contain"
    />
  );

  if (withPedestal) {
    return (
      <View style={styles.pedestalWrapper}>
        <View style={styles.pedestalBase}>
          {imgElement}
          <View style={[styles.pedestalDisc, { width: Math.round(actualSize * 0.85) }]} />
        </View>
        <View style={styles.pedestalStars}>
          {[...Array(3)].map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name="star"
              size={13}
              color={i < stars ? '#EAB308' : '#CBD5E1'}
            />
          ))}
        </View>
      </View>
    );
  }

  return imgElement;
}

export function LogoLockup({ compact = false, showTitle = true, title }: { compact?: boolean; showTitle?: boolean; title?: string }) {
  return (
    <View style={[styles.logoLockup, compact && styles.logoLockupCompact]}>
      <Mascot pose="accepted" size={compact ? 38 : 50} />
      {showTitle ? (
        <Text style={compact ? styles.logoTextCompact : styles.logoText}>
          {title || (
            <>
              kai<Text style={{ color: theme.sky }}>code</Text>
            </>
          )}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pedestalWrapper: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  pedestalBase: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  pedestalDisc: { position: 'absolute', bottom: -3, height: 18, borderRadius: 9, backgroundColor: '#F1F5F9', borderWidth: 2, borderColor: '#CBD5E1', zIndex: -1 },
  pedestalStars: { flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  logoLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoLockupCompact: { gap: 7 },
  logoText: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 24, letterSpacing: -0.5 },
  logoTextCompact: { color: theme.ink, fontFamily: 'Nunito_900Black', fontSize: 18, letterSpacing: -0.5 },
});
