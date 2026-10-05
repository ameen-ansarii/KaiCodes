import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@/components/ui/AppIcon';
import { LogoLockup } from '@/components/ui/Mascot';
import { theme } from '@/constants/theme';

export function HeaderStats({
  onProfile,
  xp = 0,
  streak = 1,
  isUpdating = false,
}: {
  onProfile: () => void;
  xp?: number;
  streak?: number;
  isUpdating?: boolean;
}) {
  return (
    <View style={styles.headerStats}>
      <LogoLockup compact showTitle />
      <View style={{ flex: 1 }} />
      {isUpdating ? (
        <View style={styles.updatingHeaderPill}>
          <Text style={styles.updatingHeaderPillText}>SYNCING...</Text>
        </View>
      ) : null}
      <View style={styles.statPill}>
        <Feather name="star" size={15} color={theme.yellowDark} fill={theme.yellowDark} />
        <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
      </View>
      <View style={styles.statPill}>
        <Image
          source={require('@/assets/images/streak_emoji.png')}
          style={{ width: 17, height: 17 }}
          resizeMode="contain"
        />
        <Text style={styles.statValue}>{streak}</Text>
      </View>
      <Pressable onPress={onProfile} style={styles.bellButton}>
        <Feather name="bell" size={17} color={theme.ink} strokeWidth={2.5} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  statPill: { height: 34, borderRadius: 12, paddingHorizontal: 10, backgroundColor: theme.card, borderWidth: 1.5, borderBottomWidth: 3, borderBottomColor: '#CBD5E1', borderColor: theme.line, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statValue: { color: theme.ink, fontFamily: 'Nunito_800ExtraBold', fontSize: 13 },
  bellButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: theme.card, borderWidth: 1.5, borderBottomWidth: 3, borderBottomColor: '#CBD5E1', borderColor: theme.line, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', top: 7, right: 7, width: 5, height: 5, backgroundColor: theme.coral, borderRadius: 3 },
  updatingHeaderPill: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FDE047', marginRight: 6 },
  updatingHeaderPillText: { color: '#854D0E', fontFamily: 'Nunito_800ExtraBold', fontSize: 10 },
});
